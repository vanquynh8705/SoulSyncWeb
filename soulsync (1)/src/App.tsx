import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ChevronRight, 
  Quote, 
  Play, 
  Pause, 
  LogOut, 
  User as UserIcon, 
  Moon, 
  Sun, 
  Compass, 
  Clock, 
  Award, 
  Leaf, 
  ArrowDown,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "./types";
import AuthModal from "./components/AuthModal";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import AssessmentModal from "./components/AssessmentModal";
import ChatWidget from "./components/ChatWidget";
import AdminDashboard from "./components/AdminDashboard";
import { Support } from "./pages/Support";
import Explore from "./pages/Explore";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "support" | "explore">("home");
  
  // Modals Visibility state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check existing session & Firebase Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const saved = localStorage.getItem("soulsync_user");
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
          } catch (e) {
            const token = await firebaseUser.getIdToken();
            const userObj: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              avatarColor: "bg-[#6BCB77]",
              isAdmin: firebaseUser.email === "admin@soulsync.edu.vn",
              token: token
            };
            localStorage.setItem("soulsync_user", JSON.stringify(userObj));
            setCurrentUser(userObj);
          }
        } else {
          const token = await firebaseUser.getIdToken();
          const userObj: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email || "",
            avatarColor: "bg-[#6BCB77]",
            isAdmin: firebaseUser.email === "admin@soulsync.edu.vn",
            token: token
          };
          localStorage.setItem("soulsync_user", JSON.stringify(userObj));
          setCurrentUser(userObj);
        }
      } else {
        localStorage.removeItem("soulsync_user");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Lỗi khi đăng xuất Firebase Auth:", e);
    }
    localStorage.removeItem("soulsync_user");
    setCurrentUser(null);
  };

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const currentYear = new Date().getFullYear();

  // Scroll helper to anchor smoothly
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans antialiased selection:bg-brand-lavender/40 selection:text-neutral-900 pb-16 md:pb-0">
      
      {/* Dynamic Sticky Header & Top Nav bar */}
      <header className="sticky top-0 z-40 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-neutral-100/50">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
          
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-brand-charcoal hover:text-brand-blue transition-colors focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
<button
  onClick={() => {
    setActiveTab("home");
    setIsChatOpen(false);
    setTimeout(() => scrollToSection("hero"), 50);
  }}
  className="flex items-center cursor-pointer"
  aria-label="Về trang chủ SoulSync"
>
  <img
    src="/logoNew.png"
    alt="SoulSync logo"
    className="h-30 w-auto object-contain"
  />
</button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-display">
            <button 
              onClick={() => {
                setActiveTab("home");
                setIsChatOpen(false);
                setTimeout(() => scrollToSection("hero"), 50);
              }}
              className={`text-base font-bold transition-all cursor-pointer ${
                activeTab === "home" && !isChatOpen
                  ? "text-brand-blue border-b-2 border-brand-blue pb-1 font-black" 
                  : "text-brand-charcoal/85 hover:text-brand-blue font-bold"
              }`}
            >
              Trang chủ
            </button>
            <button 
              onClick={() => setIsQuizOpen(true)}
              className="text-base font-bold text-brand-charcoal/85 hover:text-brand-blue transition-all cursor-pointer"
            >
              Đánh giá
            </button>
            <button 
              onClick={() => {
                setActiveTab("explore");
                setIsChatOpen(false);
              }}
              className={`text-base font-bold transition-all cursor-pointer ${
                activeTab === "explore" && !isChatOpen
                  ? "text-brand-blue border-b-2 border-brand-blue pb-1 font-black" 
                  : "text-brand-charcoal/85 hover:text-brand-blue font-bold"
              }`}
            >
              Khám phá
            </button>
            <button 
              onClick={() => {
                setActiveTab("support");
                setIsChatOpen(false);
              }}
              className={`text-base font-bold transition-all cursor-pointer ${
                activeTab === "support" && !isChatOpen
                  ? "text-brand-blue border-b-2 border-brand-blue pb-1 font-black" 
                  : "text-brand-charcoal/85 hover:text-brand-blue font-bold"
              }`}
            >
              Nguồn hỗ trợ
            </button>
          </nav>

          {/* Login Session Actions */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.isAdmin && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white px-3.5 py-1.5 rounded-full font-display text-2xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-brand-blue/20 mr-1 shadow-sm"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                    </span>
                    Bảng Quản Trị 🔒
                  </button>
                )}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-neutral-100 shadow-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-brand-sage flex items-center justify-center text-[#0f1f12] text-xs font-bold font-display">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-neutral-700">
                    {currentUser.isAdmin ? "Quản trị viên" : `Chào ${currentUser.name}!`}
                  </span>
                  <button 
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="hidden sm:inline-block text-base font-display font-black p-2.5 text-neutral-600 hover:text-brand-blue cursor-pointer"
                >
                  Lưu tiến trình
                </button>
                <button
                  onClick={() => handleOpenAuth("register")}
                  className="bg-[#1A1A1A] hover:bg-brand-blue text-white font-display text-base font-black px-6 py-2.5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(26,26,26,0.1)] cursor-pointer"
                >
                  Tạo tài khoản tùy chọn
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F9F7F2] border-b border-neutral-100/50 shadow-xs overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3 font-display">
              <button 
                onClick={() => {
                  setActiveTab("home");
                  setIsChatOpen(false);
                  setIsMobileMenuOpen(false);
                  setTimeout(() => scrollToSection("hero"), 50);
                }}
                className={`text-left text-sm py-2.5 px-3 rounded-xl transition-all ${
                  activeTab === "home" && !isChatOpen
                    ? "text-brand-blue bg-brand-blue/5 font-black" 
                    : "text-brand-charcoal/85 font-semibold hover:bg-neutral-50/50"
                }`}
              >
                Trang chủ
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsQuizOpen(true);
                }}
                className="text-left text-sm py-2.5 px-3 rounded-xl text-brand-charcoal/85 hover:text-brand-blue hover:bg-neutral-50/50 transition-all font-semibold"
              >
                Đánh giá
              </button>
              <button 
                onClick={() => {
                  setActiveTab("explore");
                  setIsChatOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2.5 px-3 rounded-xl transition-all ${
                  activeTab === "explore" && !isChatOpen
                    ? "text-brand-blue bg-brand-blue/5 font-black" 
                    : "text-brand-charcoal/85 font-semibold hover:bg-neutral-50/50"
                }`}
              >
                Khám phá
              </button>
              <button 
                onClick={() => {
                  setActiveTab("support");
                  setIsChatOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2.5 px-3 rounded-xl transition-all ${
                  activeTab === "support" && !isChatOpen
                    ? "text-brand-blue bg-brand-blue/5 font-black" 
                    : "text-brand-charcoal/85 font-semibold hover:bg-neutral-50/50"
                }`}
              >
                Nguồn hỗ trợ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      {activeTab === "home" ? (
        <main id="hero" className="max-w-[1100px] mx-auto px-4 md:px-8">
        
        {/* HERO SECTION */}
        <section className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 border-b border-brand-blue/10">
          
          {/* Left Text layout Column */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sage/20 text-[#2c4e32] rounded-full text-xs font-black"
            >
              <Leaf className="h-3.5 w-3.5" />
              Không gian an toàn cho sinh viên đại học
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display font-black text-brand-charcoal tracking-tighter"
              style={{ fontSize: "55px", lineHeight: "73px" }}
            >
              Bạn không cần đối mặt mọi thứ một mình.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-neutral-600/90 leading-normal max-w-xl"
              style={{ fontStyle: "normal", fontWeight: "normal", fontSize: "18px", lineHeight: "1.75" }}
            >
              SoulSync đồng hành cùng bạn để lắng nghe và thấu hiểu những cảm xúc chưa gọi được tên. Đây là nơi giúp bạn nhìn lại bản thân, nhận diện những dấu hiệu mệt mỏi và tìm thấy điểm tựa để vững vàng hơn trước những áp lực trong cuộc sống.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-3 pt-2"
            >
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-[#1A1A1A] text-white px-9 py-4 rounded-[24px] font-display text-sm font-black shadow-[0_15px_30px_rgba(26,26,26,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Bắt đầu Đánh giá
                </button>
                <button
                  onClick={() => {
                    setActiveTab("explore");
                    setTimeout(() => scrollToSection("breathing-zone"), 100);
                  }}
                  className="border-2 border-brand-charcoal text-brand-charcoal bg-white/50 px-9 py-4 rounded-[24px] font-display text-sm font-black hover:bg-white active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Trải nghiệm xoa dịu
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 font-semibold flex items-center gap-1.5 pl-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                Bạn có thể bắt đầu mà không cần đăng nhập.
              </p>
            </motion.div>
          </div>

          {/* Right Media graphics Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 relative"
          >
            {/* Main Visual Image Box */}
            <div className="w-full aspect-square rounded-[48px] overflow-hidden vibrant-bg flex items-center justify-center p-3.5 shadow-2xl border-[16px] border-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9nM0X-FXmVrlJegr_H8woR6fGFUJ24BleYWUcY8LOBUlCm82KnvcCombzsDFdRl-F_C5PyyOknbwNO8i_yj8Ohza9rGah2TAtcAzwbXdQA-PtH3n4JP5FpLUujvdKwSPKYjC6D--e4IawZew3ReiG8uWEKryt6qEyWoCNFWZinCUpds31MEalX2ZQdIfpBfM5KLX1NjzLUwN22hnlqB9UPa7IcZt0mIngKYpZ4dah5nTdfE37bRYvyvYANC4fQvFEmtvpc4nNZHop"
                alt="Minh họa bình yên SoulSync"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[32px]"
              />
            </div>

            {/* Floating Glassmorphic calm badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-2 md:-left-6 glass-accent px-5 py-4 rounded-3xl shadow-lg flex items-center gap-3 max-w-[270px]"
            >
              <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-brand-blue shrink-0 shadow-md">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-display font-black text-white">
                  Tâm thế mỗi ngày
                </p>
                <p className="text-[10px] text-white/90 font-bold font-sans mt-0.5 leading-tight">
                  Tập trung vào hiện tại hôm nay, rũ bỏ âu lo.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>



        {/* STUDENT STRUGGLES SECTION */}
        <section id="struggles" className="py-16 md:py-24 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-black text-brand-charcoal tracking-tight" style={{ fontSize: "40px" }}>
              Chúng tôi thấu hiểu những áp lực bạn đang gánh vác.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Struggle item 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[32px] border-2 border-brand-blue/15 shadow-sm transition-all flex flex-col justify-between hover:border-brand-blue hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center shadow-sm">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                  Phát hiện sớm vấn đề tâm lý
                </h3>
                <p className="text-neutral-600 font-sans font-medium leading-relaxed" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                  Nhận biết dấu hiệu stress, lo âu và burnout trước khi chúng trở nên nghiêm trọng.
                </p>
              </div>
              <span className="text-xs md:text-sm uppercase font-black text-brand-blue mt-6 tracking-wider">
                Early Detection
              </span>
            </motion.div>

            {/* Struggle item 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[32px] border-2 border-brand-lavender/30 shadow-sm transition-all flex flex-col justify-between hover:border-brand-lavender hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 bg-brand-lavender/20 text-[#bf9b04] rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                  Hiểu rõ bản thân hơn
                </h3>
                <p className="text-neutral-600 font-sans font-medium leading-relaxed" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                  Không chỉ biết có hay không, bạn còn hiểu mức độ và nguyên nhân ảnh hưởng đến tinh thần.
                </p>
              </div>
              <span className="text-xs md:text-sm uppercase font-black text-[#af8b04] mt-6 tracking-wider">
                Self-Understanding
              </span>
            </motion.div>

            {/* Struggle item 3 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[32px] border-2 border-brand-sage/20 shadow-sm transition-all flex flex-col justify-between hover:border-brand-sage hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 bg-brand-sage/15 text-[#214b24] rounded-2xl flex items-center justify-center shadow-sm">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px", lineHeight: "30px" }}>
                  Luôn kề cạnh lúc bạn cần
                </h3>
                <p className="text-neutral-600 font-sans font-medium leading-relaxed" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                  Nhận lời khuyên và tài nguyên phù hợp giúp bạn cải thiện tình trạng của mình.
                </p>
              </div>
              <span className="text-xs md:text-sm uppercase font-black text-brand-sage mt-6 tracking-wider">
                24/7 Companion
              </span>
            </motion.div>
          </div>
        </section>

        {/* FOUR-STEP METHOD SECTION */}
        <section id="method" className="py-16 md:py-24 border-t border-b border-neutral-200/50">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="font-display font-black text-brand-charcoal" style={{ fontSize: "40px" }}>
              Bốn bước khoanh vùng tâm lý
            </h2>
            <p className="font-bold text-neutral-600 font-sans leading-relaxed" style={{ fontSize: "18px", lineHeight: "1.75" }}>
              Mô hình kết hợp phân tích tâm lý tối giản và sự đồng hành của công nghệ thấu cảm AI giúp tái tạo năng lượng cho sinh viên.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 relative justify-between items-stretch">
            
            {/* STEP 1 */}
            <div className="flex-1 relative group p-6 bg-white border-2 border-brand-beige-dark/20 hover:border-brand-blue/20 rounded-[28px] flex flex-col items-center text-center space-y-4 transition-all shadow-sm">
              <div className="h-11 w-11 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-display font-black text-sm relative z-10 shadow-md">
                1
              </div>
              <h4 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                Làm bài kiểm tra
              </h4>
              <p className="text-neutral-600 font-sans leading-relaxed max-w-[260px]" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                Một bài kiểm tra sức khỏe tinh thần nhẹ nhàng để xem bạn đang ở đâu.
              </p>
              <button 
                onClick={() => setIsQuizOpen(true)}
                className="font-display font-black text-brand-blue hover:underline bg-transparent border-none cursor-pointer"
                style={{ fontSize: "16px" }}
              >
                Nhấp làm thử 👋
              </button>
            </div>

            {/* STEP 2 */}
            <div className="flex-1 relative group p-6 bg-white border-2 border-brand-beige-dark/20 hover:border-brand-blue/20 rounded-[28px] flex flex-col items-center text-center space-y-4 transition-all shadow-sm">
              <div className="h-11 w-11 bg-brand-lavender text-brand-charcoal rounded-2xl flex items-center justify-center font-display font-black text-sm relative z-10 shadow-md">
                2
              </div>
              <h4 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                Phân tích
              </h4>
              <p className="text-neutral-600 font-sans leading-relaxed max-w-[260px]" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                Chúng tôi xử lý nhu cầu của bạn với sự thấu cảm, khoa học và chiều sâu.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="flex-1 relative group p-6 bg-white border-2 border-brand-beige-dark/20 hover:border-brand-sage/20 rounded-[28px] flex flex-col items-center text-center space-y-4 transition-all shadow-sm">
              <div className="h-11 w-11 bg-brand-sage text-white rounded-2xl flex items-center justify-center font-display font-black text-sm relative z-10 shadow-md">
                3
              </div>
              <h4 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                Lời khuyên
              </h4>
              <p className="text-neutral-600 font-sans leading-relaxed max-w-[260px]" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                Nhận lộ trình cá nhân hóa để giải tỏa căng thẳng học tập lập tức.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="flex-1 relative group p-6 bg-white border-2 border-brand-beige-dark/20 hover:border-brand-blue/20 rounded-[28px] flex flex-col items-center text-center space-y-4 transition-all shadow-sm">
              <div className="h-11 w-11 bg-brand-charcoal text-white rounded-2xl flex items-center justify-center font-display font-black text-sm relative z-10 shadow-md">
                4
              </div>
              <h4 className="font-display font-black text-brand-charcoal" style={{ fontSize: "18px" }}>
                Tài nguyên sinh viên
              </h4>
              <p className="text-neutral-600 font-sans leading-relaxed max-w-[260px]" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                Truy cập kho công cụ sức khỏe tinh thần độc quyền dành riêng cho giới trẻ đại học.
              </p>
            </div>
            
          </div>
        </section>



        {/* THE SAFE SPACE (TRUST BANNER Layout in bold black and brilliant highlights) */}
        <section className="my-16 md:my-24">
          <div className="bg-[#E6E4F1] text-brand-charcoal border-[12px] border-white soft-shadow rounded-[48px] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            
            {/* Safe space content */}
            <div className="flex-1 space-y-6 relative z-10 text-brand-charcoal md:pr-6">
              <h2 className="font-display font-black tracking-tight" style={{ fontSize: "55px", lineHeight: "73px" }}>
                Một nơi để bạn được lắng nghe.
              </h2>
              <p className="leading-relaxed text-brand-charcoal/80 font-sans" style={{ fontSize: "18px", fontWeight: "normal", lineHeight: "1.75" }}>
                Đôi khi chúng ta chỉ cần một ai đó để nói ra những suy nghĩ trong lòng. Chatbot của SoulSync được tạo ra để đồng hành cùng bạn qua những ngày áp lực, mệt mỏi hay mất phương hướng.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-brand-sage text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-base md:text-lg font-black text-brand-charcoal/90">
                    Trò chuyện bất cứ lúc nào
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-brand-sage text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-base md:text-lg font-black text-brand-charcoal/90">
                    Không phán xét cảm xúc của bạn
                  </span>
                </div>
              </div>
            </div>

            {/* Graphic right component */}
            <div className="shrink-0 relative z-10 w-full md:w-auto flex items-center justify-center">
              <div className="h-52 w-52 bg-white/40 backdrop-blur-md rounded-full border border-white/60 flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-2 vibrant-bg rounded-full opacity-35 animate-pulse" />
                <Leaf className="h-24 w-24 text-brand-charcoal hover:scale-110 transition-transform relative z-10" />
              </div>
            </div>

            {/* Blur deco spots */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-lavender rounded-full filter blur-[100px] opacity-25" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-brand-sage rounded-full filter blur-[100px] opacity-20" />
          </div>
        </section>



        {/* PRIVACY ASSURANCE SECTION (MOVED TO REPLACE BOTTOM FINAL CTA) */}
        <section className="py-12 bg-white border-2 border-[#33628b]/10 rounded-[40px] p-6 md:p-12 shadow-sm mb-16 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#fbf9f4] flex items-center justify-center text-[#33628b] shadow-xs">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-black text-brand-charcoal tracking-tight">
                Quyền riêng tư tuyệt đối của bạn tại SoulSync
              </h3>
            </div>
            
            <p className="text-base text-neutral-600 leading-relaxed font-sans">
              Chúng tôi luôn xem sự an tâm và bảo mật dữ liệu là điểm tựa then chốt cho một hành trình tương tác tích cực và bền bỉ. Tại SoulSync, bạn hoàn toàn làm chủ thông tin cá nhân của mình bằng triết lý thiết kế bảo mật tối đa:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#fbf9f4]/60 border border-neutral-100/70 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-display text-sm sm:text-base font-black text-[#33628b] flex items-center gap-2">
                  🛡️ Không bắt buộc đăng nhập
                </h4>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 leading-relaxed font-sans">
                  Người dùng có thể làm bài đánh giá tâm lý, xem kết quả, chat ẩn danh và tra cứu tài nguyên mà không cần đăng nhập hay đăng ký.
                </p>
              </div>

              <div className="bg-[#fbf9f4]/60 border border-neutral-100/70 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-display text-sm sm:text-base font-black text-[#33628b] flex items-center gap-2">
                  🌸 Không hỏi thông tin danh tính thật
                </h4>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 leading-relaxed font-sans">
                  Chúng tôi không bao giờ thu thập họ tên thật, số điện thoại, địa chỉ hay thông tin hành chính nhạy cảm nào từ bạn.
                </p>
              </div>

              <div className="bg-[#fbf9f4]/60 border border-neutral-100/70 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-display text-sm sm:text-base font-black text-[#33628b] flex items-center gap-2">
                  💬 Chat ẩn danh không lưu mặc định
                </h4>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 leading-relaxed font-sans">
                  Nội dung cuộc hội thoại của bạn với trợ lý AI được xử lý ẩn danh trên RAM và không lưu trữ vĩnh viễn vào bất kỳ cơ sở dữ liệu nào.
                </p>
              </div>

              <div className="bg-[#fbf9f4]/60 border border-neutral-100/70 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-display text-sm sm:text-base font-black text-[#33628b] flex items-center gap-2">
                  🧹 Toàn quyền xóa lịch sử cuộc trò chuyện
                </h4>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 leading-relaxed font-sans">
                  Bạn có thể dùng nút xóa lịch sử hoặc làm mới trong khung chat để loại bỏ sạch các mẩu tin nhắn cục bộ bất kỳ khi nào bạn muốn.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/40 rounded-2xl p-4 text-xs sm:text-sm text-amber-950/90 leading-relaxed flex items-start gap-2.5">
              <span className="text-amber-600 font-extrabold text-sm shrink-0 mt-0.5">📋</span>
              <p className="font-sans">
                <strong className="font-bold text-amber-950">Lưu ý chuyên môn quan trọng:</strong> Kết quả kiểm tra trắc nghiệm và tư vấn từ trợ lý AI chỉ mang tính tham khảo ban đầu hỗ trợ nhận thức tinh thần hành vi, tuyệt đối không thay thế cho việc chẩn đoán hoặc can thiệp từ chuyên gia y tế, bác sĩ chuyên khoa hoặc chuyên viên tâm lý.
              </p>
            </div>
          </div>
        </section>

      </main>
      ) : activeTab === "explore" ? (
        <Explore 
          onStartAssessment={() => setIsQuizOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onGoToBreathing={() => {
            scrollToSection("breathing-zone");
          }}
        />
      ) : (
        <Support onBackToHome={() => setActiveTab("home")} />
      )}


      {/* MODALS RENDERING REGION */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={(user) => setCurrentUser(user)}
            initialTab={authTab}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isQuizOpen && (
          <AssessmentModal
            isOpen={isQuizOpen}
            onClose={() => setIsQuizOpen(false)}
            onOpenChat={() => {
              setIsQuizOpen(false);
              setIsChatOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>

      {/* AI CHAT EMPOWERED BY SERVER-SIDE GEMINI API */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />

    </div>
  );
}
