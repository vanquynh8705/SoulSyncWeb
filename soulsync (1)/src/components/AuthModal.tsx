import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserType } from "../types";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Mật khẩu phải có độ dài từ 6 ký tự trở lên.");
      return;
    }
    if (tab === "register" && !name) {
      setError("Vui lòng nhập một biệt danh hoặc tên hiển thị.");
      return;
    }

    setIsLoading(true);

    try {
      if (tab === "login") {
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          let userMsg = "Email hoặc mật khẩu không chính xác.";
          if (err.code === "auth/invalid-email") {
            userMsg = "Định dạng email không hợp lệ.";
          } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
            userMsg = "Email hoặc mật khẩu không đúng hoặc chưa tồn tại.";
          }
          throw new Error(userMsg);
        }

        const uid = userCredential.user.uid;
        let userData: any = null;

        try {
          const docSnap = await getDoc(doc(db, "users", uid));
          if (docSnap.exists()) {
            userData = docSnap.data();
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${uid}`);
        }

        if (!userData) {
          // Fallback if user document does not exist, recreate
          userData = {
            id: uid,
            name: userCredential.user.displayName || email.split("@")[0],
            email: email,
            avatarColor: "bg-[#6BCB77]",
            isAdmin: email === "admin@soulsync.edu.vn"
          };
          try {
            await setDoc(doc(db, "users", uid), userData);
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
          }
        }

        const token = await userCredential.user.getIdToken();
        const loggedInUser: UserType = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarColor: userData.avatarColor,
          isAdmin: userData.isAdmin,
          token: token
        };

        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          localStorage.setItem("soulsync_user", JSON.stringify(loggedInUser));
          onLoginSuccess(loggedInUser);
          setIsSuccess(false);
          onClose();
        }, 1000);

      } else {
        // Registration flow
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          let userMsg = "Không thể đăng ký tài khoản mới.";
          if (err.code === "auth/email-already-in-use") {
            userMsg = "Địa chỉ email này đã được sử dụng rồi.";
          } else if (err.code === "auth/invalid-email") {
            userMsg = "Định dạng email không hợp lệ.";
          } else if (err.code === "auth/weak-password") {
            userMsg = "Mật khẩu quá yếu (yêu cầu ít nhất 6 ký tự).";
          }
          throw new Error(userMsg);
        }

        const uid = userCredential.user.uid;
        const colors = ["bg-[#FF6B6B]", "bg-[#FFD93D]", "bg-[#6BCB77]"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const finalUser = {
          id: uid,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          avatarColor: randomColor,
          isAdmin: email.trim().toLowerCase() === "admin@soulsync.edu.vn"
        };

        try {
          await setDoc(doc(db, "users", uid), finalUser);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
        }

        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          setTab("login");
          setIsSuccess(false);
          setPassword("");
          setError("");
        }, 1500);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Gặp sự cố kết nối với hệ thống xác thực.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-100"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 p-1.5 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Banner */}
        <div className="bg-[#f0eee9] p-6 text-center border-b border-neutral-100/50">
          <h2 className="font-display text-2xl font-bold tracking-tight text-brand-blue">
            SoulSync
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Không gian an tâm tìm lại sự bình yên trong trường học
          </p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="h-16 w-16 bg-brand-sage/20 text-brand-blue flex items-center justify-center rounded-full mb-4">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-800">
                {tab === "login" ? "Đăng nhập thành công!" : "Đăng ký thành công!"}
              </h3>
              <p className="text-sm text-neutral-500 mt-2">
                Đang bảo mật kết nối không gian cá nhân của bạn...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Privacy/Anonymity reassurance */}
              <div className="bg-[#fbf9f4] border border-[#33628b]/10 rounded-xl p-3 mb-4 text-[11px] text-neutral-700 leading-relaxed shadow-xs">
                <p>
                  💡 <span className="font-extrabold text-[#33628b]">Lưu ý bảo mật:</span> Đăng nhập hoàn toàn là <strong className="font-bold text-neutral-800">tự chọn</strong>. Bạn vẫn có thể sử dụng SoulSync ẩn danh để làm bài test, chat AI, và xem nguồn hỗ trợ. Tài khoản chỉ cần thiết nếu bạn muốn lưu tiến trình cá nhân và xem lại kết quả sau này.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-neutral-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  className={`flex-1 py-2 font-display text-sm font-semibold rounded-md transition-all ${
                    tab === "login"
                      ? "bg-white text-brand-blue shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                  className={`flex-1 py-2 font-display text-sm font-semibold rounded-md transition-all ${
                    tab === "register"
                      ? "bg-white text-brand-blue shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Đăng ký mới
                </button>
              </div>

              {/* Error messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 font-sans text-xs font-semibold mb-4 leading-relaxed"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                 {tab === "register" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Biệt danh hoặc Tên hiển thị (Không cần tên thật)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Thỏ Trắng, Cỏ May May, Bạn Ẩn Danh..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm text-neutral-800 border-none outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 transition-all font-sans"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tenban@truong.edu.vn"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm text-neutral-800 border-none outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 transition-all font-sans"
                      disabled={isLoading}
                    />
                  </div>
                  {tab === "register" && (
                    <span className="text-[10px] text-[var(--color-brand-blue)] font-semibold mt-1 block">
                      * Nhận ưu đãi miễn phí trọn đời nếu đăng ký bằng email đuôi nhà trường (.edu.vn)
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-50 focus:bg-white text-sm text-neutral-800 border-none outline-none ring-1 ring-neutral-200 focus:ring-2 focus:ring-brand-blue/30 transition-all font-sans"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {tab === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-xs text-brand-blue font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Bí mật mật khẩu?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 bg-brand-blue text-white py-3 rounded-full font-display text-sm font-bold shadow-md hover:bg-brand-blue/90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang xác thực...
                    </>
                  ) : tab === "login" ? (
                    "Đăng nhập ngay"
                  ) : (
                    "Đăng ký tài khoản"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
