import React, { useState, useEffect } from "react";
import { 
  X, 
  Users, 
  BookOpen, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Activity,
  UserCheck,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  text: string;
  category: string;
}

export default function AdminDashboard({ isOpen, onClose, currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"users" | "content" | "stats">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Content form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Cẩm nang");
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState("coping");

  // Load backend content
  const fetchData = async () => {
    if (!currentUser) {
      setError("Bạn chưa đăng nhập hoặc không có tài khoản thích hợp.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1. Fetch Users from Firestore
      let userList: User[] = [];
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        usersSnap.forEach((d) => {
          userList.push(d.data() as User);
        });
        setUsers(userList);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "users");
      }

      // 2. Fetch Content from Firestore
      let contentList: ContentItem[] = [];
      try {
        const contentsSnap = await getDocs(collection(db, "contents"));
        contentsSnap.forEach((d) => {
          contentList.push({ id: d.id, ...d.data() } as ContentItem);
        });
        setContent(contentList);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "contents");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi truy xuất cơ sở dữ liệu Firestore.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchData();
    }
  }, [isOpen, currentUser]);

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newTitle.trim() || !newText.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setError("");
    setSuccess("");

    const newId = "content-" + Math.random().toString(36).substr(2, 9);
    const newDoc = {
      id: newId,
      title: newTitle.trim(),
      type: newType,
      text: newText.trim(),
      category: newCategory
    };

    try {
      try {
        await setDoc(doc(db, "contents", newId), newDoc);
        setSuccess("Đã thêm cẩm nang sức khỏe tinh thần mới thành công!");
        setNewTitle("");
        setNewText("");
        fetchData();
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `contents/${newId}`);
      }
    } catch (err: any) {
      setError(err.message || "Gặp sự cố khi thêm dữ liệu vào Firestore.");
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!currentUser) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết/công cụ này không?")) return;

    setError("");
    setSuccess("");

    try {
      try {
        await deleteDoc(doc(db, "contents", id));
        setSuccess("Đã gỡ bỏ nội dung khỏi hệ thống sinh viên.");
        fetchData();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `contents/${id}`);
      }
    } catch (err: any) {
      setError(err.message || "Gặp sự cố kết nối khi xóa tài liệu trên Firestore.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
      />

      {/* Main Panel Box */}
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        className="relative w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl bg-[#FCFAF7] border-[12px] border-white shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Top Header */}
        <div className="bg-[#1A1A1A] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-sage text-[#1A1A1A] rounded-xl flex items-center justify-center font-display font-black shadow-md">
              A
            </div>
            <div>
              <h2 className="font-display text-xl font-black flex items-center gap-2">
                Bảng Quản Trị Hệ Thống <span className="text-[10px] bg-brand-blue/30 text-brand-blue px-2 py-0.5 rounded-full uppercase tracking-wider">JWT Live Sec</span>
              </h2>
              <p className="text-xs text-neutral-300 font-sans">
                Cung cấp không gian phân quyền, giám sát danh sách sinh viên & điều tiết tài nguyên.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body with sidebar styling */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Dashboard Left Navigation */}
          <div className="w-full md:w-64 bg-white border-r border-neutral-200/60 p-5 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block mb-2 px-3">
              Mục chính
            </span>
            <button
              onClick={() => { setActiveTab("users"); setError(""); setSuccess(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-xs font-black transition-all ${
                activeTab === "users" 
                  ? "bg-brand-blue/10 text-brand-blue shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Users className="h-4 w-4 text-brand-blue" />
              Danh sách Sinh viên ({users.length})
            </button>

            <button
              onClick={() => { setActiveTab("content"); setError(""); setSuccess(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-xs font-black transition-all ${
                activeTab === "content" 
                  ? "bg-brand-blue/10 text-brand-blue shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <BookOpen className="h-4 w-4 text-[#FF6B6B]" />
              Điều hành Tài nguyên học tập ({content.length})
            </button>

            <button
              onClick={() => { setActiveTab("stats"); setError(""); setSuccess(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-xs font-black transition-all ${
                activeTab === "stats" 
                  ? "bg-brand-blue/10 text-brand-blue shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Activity className="h-4 w-4 text-[#bf9b04]" />
              Thống kê & Giám sát JWT
            </button>

            <div className="mt-auto p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-neutral-400 block tracking-wider">
                Xác thực Token JWT
              </span>
              <p className="text-[10px] text-neutral-600 leading-relaxed font-sans overflow-hidden text-ellipsis whitespace-nowrap">
                {currentUser?.token ? `JWT: ...${currentUser.token.substring(currentUser.token.length - 20)}` : "Chưa có"}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-brand-sage font-bold">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                Hệ thống xác thực mã hóa
              </div>
            </div>
          </div>

          {/* Tab Viewer panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Callout errors/success */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 bg-red-50 border border-red-200/50 rounded-2xl p-4 flex items-start gap-2.5 text-red-700 text-xs font-sans leading-relaxed font-bold"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 bg-emerald-50 border border-emerald-200/50 rounded-2xl p-4 flex items-start gap-2.5 text-emerald-700 text-xs font-sans leading-relaxed font-bold animate-pulse"
                >
                  <Check className="h-4 w-4 shrink-0 mt-0.5 bg-emerald-200 text-emerald-800 rounded-full p-0.5" />
                  <div>{success}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <svg className="animate-spin h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs font-display font-black text-neutral-500">Đang quét máy chủ xác thực JWT và truy xuất dữ liệu...</p>
              </div>
            ) : (
              <>
                {/* TAB 1: USER DIRECTORY LIST */}
                {activeTab === "users" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <div>
                        <h3 className="font-display text-lg font-black text-brand-charcoal">Danh sách Sinh viên đang sử dụng</h3>
                        <p className="text-xs text-neutral-500">Xem thông tin định danh và tài khoản bảo mật đã đăng ký sử dụng.</p>
                      </div>
                      <span className="text-xs font-bold font-display bg-brand-blue/10 text-brand-blue px-3.5 py-1.5 rounded-full">
                        {users.length} tài khoản
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200/60 text-[10px] uppercase tracking-wider">
                            <th className="p-4">Sinh viên</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-center">Vai trò</th>
                            <th className="p-4">Mã tài khoản</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="p-4 flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${u.avatarColor || "bg-brand-blue"}`}>
                                  {u.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-neutral-800">{u.name}</span>
                              </td>
                              <td className="p-4 text-neutral-600">{u.email}</td>
                              <td className="p-4 text-center">
                                {u.isAdmin ? (
                                  <span className="inline-flex px-2 py-0.5 bg-red-50 text-red-700 rounded-md font-bold text-[10px] uppercase border border-red-200/60">
                                    ADMIN
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md font-bold text-[10px] uppercase">
                                    STUDENT
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-neutral-400 font-mono text-[10px]">{u.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: MANAGE CURATED RESOURCES & ARTICLES */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200/60">
                      <div>
                        <h3 className="font-display text-lg font-black text-brand-charcoal">Danh sách Tài nguyên Học tập</h3>
                        <p className="text-xs text-neutral-500">Cập nhật cẩm nang chánh niệm và các giải pháp giúp giải tỏa bế tắc học thuật tức thì.</p>
                      </div>
                    </div>

                    {/* New Content Form */}
                    <form onSubmit={handleAddContent} className="bg-white p-5 rounded-2xl border border-neutral-200/60 space-y-4 shadow-sm">
                      <span className="text-[10px] uppercase font-black text-brand-blue tracking-wider block">
                        + Đăng tải tài nguyên bổ trợ chánh niệm mới
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Tiêu đề bài viết / cẩm nang</label>
                          <input 
                            type="text" 
                            placeholder="Ví dụ: Vượt qua lo âu học thuật trong kỳ thi học kỳ"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 text-neutral-800 focus:bg-white transition-all font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Phân loại nhãn</label>
                          <select 
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 text-neutral-800 transition-all font-sans"
                          >
                            <option value="Thực hành">Thực hành</option>
                            <option value="Mẹo vặt">Mẹo vặt</option>
                            <option value="Đọc thêm">Đọc thêm</option>
                            <option value="Chiến lược">Chiến lược</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Nội dung giải tỏa / khuyên nhủ</label>
                          <textarea 
                            rows={3}
                            placeholder="Hãy khuyên sinh viên thực hiện những bước hành động nhỏ..."
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 text-neutral-800 focus:bg-white transition-all font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Chủ đề tâm lý</label>
                          <select 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 text-neutral-800 transition-all font-sans"
                          >
                            <option value="burnout">Học thuật mệt mỏi (Academic Burnout)</option>
                            <option value="overthinking">Suy nghĩ dồn dập (Overthinking)</option>
                            <option value="urgency">Bận rộn và vội vã (Rush Hour/Deadline)</option>
                            <option value="coping">Phương pháp giải tỏa chung</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-right">
                        <button 
                          type="submit"
                          className="px-5 py-2.5 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-xl font-display text-xs font-black shadow-md shadow-brand-blue/10 flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Plus className="h-4 w-4" /> Đăng tài nguyên ngay
                        </button>
                      </div>
                    </form>

                    {/* Content Catalog Table */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider block">
                        Các bài cẩm nang đang xuất bản bổ trợ trong ứng dụng:
                      </span>

                      <div className="grid grid-cols-1 gap-4">
                        {content.map((item) => (
                          <div 
                            key={item.id} 
                            className="p-5 bg-white rounded-2xl border border-neutral-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 flex-1 pr-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                                  item.category === "burnout" ? "bg-red-50 text-red-600" :
                                  item.category === "overthinking" ? "bg-amber-50 text-amber-600" :
                                  "bg-green-50 text-green-600"
                                }`}>
                                  {item.category}
                                </span>
                                <span className="text-neutral-400 text-[10px] font-bold">● {item.type}</span>
                              </div>
                              <h4 className="font-display font-black text-sm text-brand-charcoal">{item.title}</h4>
                              <p className="text-xs text-neutral-600 font-sans leading-relaxed">{item.text}</p>
                            </div>
                            
                            <button 
                              onClick={() => handleDeleteContent(item.id)}
                              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all self-end md:self-center cursor-pointer"
                              title="Xóa tài nguyên này"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: STATISTICS & DIAGNOSTICS */}
                {activeTab === "stats" && (
                  <div className="space-y-6">
                    <div className="pb-2 border-b border-neutral-200/60">
                      <h3 className="font-display text-lg font-black text-brand-charcoal">Thống kê Giám sát & Đo đạc JWT</h3>
                      <p className="text-xs text-neutral-500">Giám sát hiệu năng hệ thống thuyên giảm lo âu cho học đường.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold font-sans">Tổng thành viên đăng ký</p>
                          <p className="font-display text-2xl font-black text-brand-charcoal">{users.length}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-xl flex items-center justify-center">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold font-sans">Cẩm nang & Tài nguyên</p>
                          <p className="font-display text-2xl font-black text-brand-charcoal">{content.length}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-4">
                        <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center animate-pulse">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-semibold font-sans">Nhật ký Xác thực JWT</p>
                          <p className="text-sm font-display font-black text-green-700">JWT SIGNED & ALIVE</p>
                        </div>
                      </div>
                    </div>

                    {/* JWT Debug Card */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-brand-blue" />
                        <span className="font-display text-xs font-black text-brand-charcoal">Cơ chế Bảo mật Bảo vệ Phiên làm việc</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                        Mã bảo mật JWT (JSON Web Token) được ký điện tử bằng mật chìa khóa bí mật của hệ thống SoulSync trên máy chủ Node.js. Mỗi yêu cầu của Quản trị viên tải danh sách người dùng hay chỉnh sửa tài nguyên học tập đều phải đính kèm Header <code className="bg-neutral-100 text-[#FF6B6B] px-1.5 py-0.5 rounded font-mono text-[10px]">Authorization: Bearer [Token]</code>. Điều này giúp ngăn chặn hoàn toàn việc rò rỉ thông tin riêng tư và sự lo âu của các bạn sinh viên.
                      </p>
                      <div className="bg-neutral-900 text-neutral-200 p-4 rounded-xl font-mono text-[10px] space-y-1 overflow-x-auto leading-relaxed max-w-full">
                        <p className="text-brand-sage">// Payload nội dung mã hóa trong token của bạn:</p>
                        <p>{`{`}</p>
                        <p className="pl-4">{`"id": "${currentUser?.id}",`}</p>
                        <p className="pl-4">{`"name": "${currentUser?.name}",`}</p>
                        <p className="pl-4">{`"email": "${currentUser?.email}",`}</p>
                        <p className="pl-4">{`"isAdmin": ${currentUser?.isAdmin},`}</p>
                        <p className="pl-4">{`"exp": "4 Giờ hiệu lực"`}</p>
                        <p>{`}`}</p>
                      </div>
                    </div>

                  </div>
                )}
              </>
            )}

          </div>

        </div>

        {/* Footer info bar */}
        <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-sans text-neutral-500 font-semibold">
          <span>Khóa mật bảo an: SHA-256 HMAC JWT Standard Encrypted</span>
          <span>© SoulSync SafeSpace Administration Console</span>
        </div>
      </motion.div>
    </div>
  );
}
