import express from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "soulsync_jwt_secret_magic_secure_key_2026";

// In-Memory Database for Users
const usersList = [
  {
    id: "admin-1",
    name: "Quản trị viên SoulSync",
    email: "admin@soulsync.edu.vn",
    password: "adminpassword",
    avatarColor: "bg-[#FF6B6B]",
    isAdmin: true
  },
  {
    id: "user-1",
    name: "Nguyễn Minh Đức",
    email: "ducnm@student.edu.vn",
    password: "password123",
    avatarColor: "bg-[#6BCB77]",
    isAdmin: false
  },
  {
    id: "user-2",
    name: "Phan Ngọc Quỳnh",
    email: "quynh@student.edu.vn",
    password: "password123",
    avatarColor: "bg-[#FFD93D]",
    isAdmin: false
  }
];

// In-Memory Content list for student resources managed by Admin
let contentList = [
  { id: "1", title: "Kỹ thuật Thở Vuông 4-4-4", type: "Thực hành", text: "Nhấn nút thở vuông tại trang chủ của SoulSync để hạ nhịp tim và kiểm soát phản ứng căng thẳng tức thì.", category: "burnout" },
  { id: "2", title: "Chiến lược Brain-Dump viết lo âu ra giấy", type: "Mẹo vặt", text: "Dành 10 phút viết hết những lo lắng tự do ra sổ tay, sau đó gấp lại đóng nắp bút. Giúp cất giữ nỗi lo tạm thời.", category: "overthinking" },
  { id: "3", title: "Kỷ luật 5 Phút Khởi Động Pomodoro", type: "Đọc thêm", text: "Bật đồng hồ lên và cam kết chỉ làm bài đúng 5 phút thôi. Sự kháng cự ban đầu sẽ tan biến nhanh chóng.", category: "urgency" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // JWT Helper authentication middleware
  const authenticateJWT = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Yêu cầu mã token xác thực (Không tìm thấy hoặc trống)." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, JWT_SECRET) as any;
      req.user = decodedPayload;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Mã token không hợp lệ hoặc đã hết hạn." });
    }
  };

  // Auth: Register Endpoint
  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Họ và tên không được để trống." });
      }
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Email không đúng định dạng." });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: "Mật khẩu phải chứa ít nhất 6 ký tự." });
      }

      const emailExists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return res.status(400).json({ error: "Email này đã được sử dụng rồi." });
      }

      // Generate a soft avatar color
      const colors = ["bg-[#FF6B6B]", "bg-[#FFD93D]", "bg-[#6BCB77]"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        avatarColor: randomColor,
        isAdmin: false
      };

      usersList.push(newUser);
      console.log(`[AUTH] User registered: ${newUser.email}`);

      return res.status(201).json({
        message: "Đăng ký thành công!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatarColor: newUser.avatarColor,
          isAdmin: newUser.isAdmin
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Lỗi kết nối máy chủ khi đăng ký." });
    }
  });

  // Auth: Login Endpoint -> Returns JWT token
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu." });
      }

      const foundUser = usersList.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return res.status(401).json({ error: "Thông tin đăng nhập không chính xác hoặc không khớp." });
      }

      // Generate JWT Token containing user metadata
      const token = jwt.sign(
        {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          isAdmin: foundUser.isAdmin
        },
        JWT_SECRET,
        { expiresIn: "4h" }
      );

      console.log(`[AUTH] User logged in: ${foundUser.email} (isAdmin: ${foundUser.isAdmin})`);

      return res.json({
        message: "Xác thực thành công!",
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatarColor: foundUser.avatarColor,
          isAdmin: foundUser.isAdmin,
          token: token
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Gặp sự cố kết nối máy chủ xác thực JWT." });
    }
  });

  // Protected: Admin GET users list
  app.get("/api/admin/users", authenticateJWT, (req: any, res) => {
    // Only administrators are allowed to scan catalog of users
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Yêu cầu quyền Quản trị viên để truy cập thông tin này." });
    }

    // Safety projection (hide password fields)
    const publicUsers = usersList.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarColor: u.avatarColor,
      isAdmin: u.isAdmin
    }));

    res.json({ users: publicUsers });
  });

  // Protected: Admin GET & POST content
  app.get("/api/admin/content", authenticateJWT, (req: any, res) => {
    // Both admins and authenticated users can view the curated list
    res.json({ content: contentList });
  });

  app.post("/api/admin/content", authenticateJWT, (req: any, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Yêu cầu quyền Quản trị viên để thêm nội dung." });
    }

    const { title, type, text, category } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: "Tiêu đề và nội dung mô tả không được để trống." });
    }

    const newContent = {
      id: "content-" + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      type: type || "Cẩm nang",
      text: text.trim(),
      category: category || "coping"
    };

    contentList.push(newContent);
    console.log(`[ADMIN CONTENT] New content item added: ${newContent.title}`);
    res.status(201).json({ message: "Đăng tải nội dung mới thành công!", item: newContent });
  });

  app.delete("/api/admin/content/:id", authenticateJWT, (req: any, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Yêu cầu quyền Quản trị viên để xóa nội dung học tập." });
    }

    const { id } = req.params;
    const initialLen = contentList.length;
    contentList = contentList.filter(item => item.id !== id);

    if (contentList.length === initialLen) {
      return res.status(404).json({ error: "Không tìm thấy tài nguyên nội dung được chọn." });
    }

    console.log(`[ADMIN CONTENT] Content item deleted: id ${id}`);
    res.json({ message: "Đã gỡ bỏ tài nguyên nội dung thành công!" });
  });

  // API Route for Gemini Chat Proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Yêu cầu không hợp lệ. Hãy gửi mảng hội thoại." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Comforting offline fallback so the application works gracefully and guides the developer
        return res.json({
          text: "Xin chào bạn! Mình là SoulSync AI – trợ lý hỗ trợ tinh thần ẩn danh dành cho sinh viên. Hiện tại đường nối mạng của chúng mình tạm thời chưa cấu hình xong, nhưng mình vẫn luôn ở đây để đồng hành cùng bạn. 🤍\n\nNếu đang cảm thấy quá tải hoặc căng thẳng, bạn có muốn thử dành 1 phút để cùng mình hít thở chậm không? Hoặc bạn có thể ghi lại điều đang làm bạn lo lắng nhất lúc này nhé. Mình luôn sẵn sàng lắng nghe."
        });
      }

      // Initialize the Gemini SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare contents history for Google GenAI API format
      // Standardize the model roles to 'user' or 'model' (for assistant)
      const parsedContents = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      // Direct call using the recommended gemini-3.5-flash model
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: parsedContents,
        config: {
          systemInstruction: 
            "MỤC TIÊU & VAI TRÒ:\n" +
            "Bạn là SoulSync AI – một trợ lý hỗ trợ tinh thần ẩn danh dành cho sinh viên. Bạn không phải bác sĩ hay nhà trị liệu, và không được chẩn đoán bệnh. Bạn giao tiếp với phong cách chuyên nghiệp, ấm áp, điềm tĩnh, có trách nhiệm và thấu cảm như một trợ lý hỗ trợ sức khỏe tinh thần dựa trên các nguyên tắc tham vấn tâm lý hiện đại.\n\n" +
            "Mục tiêu cốt lõi:\n" +
            "1. Lắng nghe người dùng một cách không phán xét.\n" +
            "2. Giúp người dùng nhận diện và gọi tên cảm xúc của họ.\n" +
            "3. Hỗ trợ xoa dịu lo âu, stress bớt căng thẳng.\n" +
            "4. Đưa ra 1-3 gợi ý tự chăm sóc bản thân (self-care) an toàn, thực tế và dễ làm.\n" +
            "5. Khuyến khích người dùng tìm trợ giúp chuyên khoa/học đường khi nghiêm trọng hoặc kéo dài.\n" +
            "6. Ưu tiên tuyệt đối về an toàn nếu người dùng có ý định tự hại.\n\n" +
            "PHONG CÁCH TRẢ LỜI & XƯNG HÔ:\n" +
            "- Dùng tiếng Việt gần gũi, dịu dàng, xưng 'mình' và 'bạn'.\n" +
            "- Trả lời ngắn gọn, trực diện, không dài dòng lê thê.\n" +
            "- Không chẩn đoán bệnh trầm cảm, lo âu, bipolar, v.v. Không nói 'bạn chắc chắn bị...'.\n" +
            "- Có thể nói: 'Những gì bạn mô tả có thể là dấu hiệu của căng thẳng/lo âu, nhưng mình không thể chẩn đoán.'\n" +
            "- Luôn lắng nghe, ưu tiên công nhận cảm xúc trước rồi mới thảo luận giải pháp.\n" +
            "- Luôn hỏi thêm một câu hỏi nhẹ nhàng ở cuối để tiếp tục trò chuyện ẩn danh.\n\n" +
            "NGUYÊN TẮC PHẢN HỒI (TỪNG BƯỚC):\n" +
            "1. BẮT ĐẦU: Công nhận cảm xúc (Ví dụ: 'Nghe có vẻ bạn đang phải chịu khá nhiều áp lực gần đây.').\n" +
            "2. PHẢN HỒI: Phản hồi lại nỗi niềm của họ (Ví dụ: 'Việc mất ngủ kèm deadline dồn dập có thể khiến cơ thể rất mệt và khó tập trung...').\n" +
            "3. GỢI Ý: Đưa ra 1-3 gợi ý nhỏ, thực tế viết dưới dạng gạch đầu dòng ngắn (Ví dụ: thở sâu, viết lo âu ra giấy, v.v.).\n" +
            "4. ĐỀ XUẤT CHUYÊN MÔN: Nếu kéo dài hoặc nặng: khuyên gặp chuyên gia (Ví dụ: 'Nếu tình trạng này kéo dài nhiều ngày hoặc ảnh hưởng đến học tập, giấc ngủ, ăn uống, bạn nên cân nhắc trao đổi với chuyên chuyên gia tâm lý hoặc cơ sở y tế.').\n" +
            "5. KHẨN CẤP (TỰ HẠI): Nếu người dùng nói 'muốn chết', 'biến mất', 'tự hại': Trả lời khẩn cấp không phán xét, khuyên không ở một mình, liên hệ người thân/bạn bè hoặc cấp cứu địa phương (Bệnh viện Tâm thần Đà Nẵng: 0935.422.426). Hỏi rõ: 'Hiện tại bạn có đang ở một mình không?'.\n\n" +
            "NHỮNG ĐIỀU TUYỆT ĐỐI KHÔNG LÀM:\n" +
            "- Không chẩn đoán bệnh tâm thần.\n" +
            "- Không kê hay khuyên dừng/uống thuốc.\n" +
            "- Không yêu cầu họ tên thật, CCCD, hay địa chỉ chi tiết cụ thể.\n" +
            "- Tuyệt đối tránh các câu phủ định cảm nhận: 'Bạn phải mạnh mẽ lên', 'Chuyện này bình thường mà', 'Đừng nghĩ nhiều'.\n\n" +
            "MẪU CHUẨN XỬ LÝ KHỦNG HOẢNG:\n" +
            "- Khi hỏi 'Tôi có bị trầm cảm không?': Trả lời: 'Mình không thể chẩn đoán bạn có bị trầm cảm hay không. Nhưng những gì bạn đang trải qua có thể là tín hiệu cho thấy sức khỏe tinh thần của bạn cần được quan tâm hơn. Mình có thể cùng bạn nhìn lại các dấu hiệu gần đây, và nếu tình trạng kéo dài hoặc nặng lên, bạn nên tìm đến chuyên gia tâm lý hoặc bác sĩ chuyên khoa.'\n" +
            "- Khi nói muốn chết/tự hại: Trả lời: 'Mình rất tiếc khi bạn đang phải chịu cảm giác nặng nề như vậy. Điều quan trọng nhất lúc này là sự an toàn của bạn. Hãy cố gắng không ở một mình ngay bây giờ. Bạn có thể gọi cho một người thân, bạn bè tin tưởng, hoặc đến cơ sở y tế gần nhất. Nếu bạn đang trong nguy hiểm ngay lúc này, hãy gọi số cấp cứu tại địa phương hoặc nhờ người gần bạn hỗ trợ ngay. Hiện tại bạn có đang ở một mình không?'",
          temperature: 0.6,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Server Error:", error);
      res.status(500).json({ 
        error: "Lỗi kết nối API", 
        text: "Xin lỗi bạn, máy chủ gặp sự cố nhỏ một chút khi kết nối. Hãy hít một hơi thật sâu và thử lại sau ít giây nhé! 🤍" 
      });
    }
  });

  // Serve static assets in production, or use Vite middleware in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    
    // Static assets
    app.use(express.static(distPath));

    // Fallback all other client routing requests to index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express] Engine live on http://localhost:${PORT}`);
  });
}

startServer();
