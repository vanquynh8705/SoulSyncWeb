import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Moon, 
  Utensils, 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Wind,
  PenTool,
  Video,
  X,
  Trash2,
  CheckCircle2,
  Play,
  Pause,
  Leaf
} from "lucide-react";
import { exploreTips, ExploreTipGroup } from "../data/exploreTips";
import ExpressiveWritingModal from "../components/ExpressiveWritingModal";
import YogaVideoModal from "../components/YogaVideoModal";

// Placeholder for Yoga video URL (can be updated to an embed link later, e.g. "https://www.youtube.com/embed/dQw4w9WgXcQ")
const yogaVideoUrl = "";

interface ExploreProps {
  onStartAssessment?: () => void;
  onOpenChat?: () => void;
  onGoToBreathing?: () => void;
}

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Activity":
      return <Activity className={className} />;
    case "Moon":
      return <Moon className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Users":
      return <Users className={className} />;
    default:
      return <Activity className={className} />;
  }
};

export default function Explore({ onStartAssessment, onOpenChat, onGoToBreathing }: ExploreProps) {
  const [activeTab, setActiveTab] = useState<string>("exercise");
  const [expandedWhy, setExpandedWhy] = useState<boolean>(false);

  // States for Expressive Writing
  const [isWritingOpen, setIsWritingOpen] = useState<boolean>(false);

  // States for Yoga Video Modal
  const [isYogaOpen, setIsYogaOpen] = useState<boolean>(false);

  // Breathing tool state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStatus, setBreathStatus] = useState<"hít vào" | "giữ hơi" | "thở ra">("hít vào");
  const [breathCounter, setBreathCounter] = useState(4);
  const [showBreathingStation, setShowBreathingStation] = useState(false);

  // Auto-scroll when breathing station is opened
  useEffect(() => {
    if (showBreathingStation) {
      setTimeout(() => {
        const el = document.getElementById("breathing-zone");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [showBreathingStation]);

  // Breathing loop timer logic
  useEffect(() => {
    if (!isBreathing) return;

    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          // Switch states according to 4-4-4 breathing cycle
          if (breathStatus === "hít vào") {
            setBreathStatus("giữ hơi");
            return 4;
          } else if (breathStatus === "giữ hơi") {
            setBreathStatus("thở ra");
            return 4;
          } else {
            setBreathStatus("hít vào");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathing, breathStatus]);

  const handleStartBreathing = () => {
    setIsBreathing(!isBreathing);
    setBreathStatus("hít vào");
    setBreathCounter(4);
  };

  // Find the selected group details
  const currentGroup = exploreTips.find(g => g.id === activeTab) || exploreTips[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setExpandedWhy(false); // Reset accordion on tab switch to avoid overwhelming of academic details
  };

  const categories = [
    { id: "exercise", label: "Vận động", displayIcon: "🏃‍♂️" },
    { id: "sleep", label: "Giấc ngủ", displayIcon: "😴" },
    { id: "nutrition", label: "Dinh dưỡng", displayIcon: "🍏" },
    { id: "social", label: "Kết nối", displayIcon: "🤝" }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[850px] mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#33628B]/10 text-[#33628B] px-4 py-1.5 rounded-full text-xs font-bold font-display"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#33628B]/50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#33628B]"></span>
            </span>
            Thói quen nhỏ • Tâm trí an lành
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-800 tracking-tight"
          >
            Khám phá cách giảm áp lực mỗi ngày
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-base sm:text-lg text-neutral-600 font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Mỗi lựa chọn nhỏ lành mạnh kéo dài 5-10 phút đều giúp củng cố tinh thần bền bỉ của bạn. Hãy lướt chọn một chủ đề và bắt đầu từ mục tiêu đơn giản nhất.
          </motion.p>
        </div>

        {/* Custom Premium Segmented Control Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-[#33628B]/5 p-2 rounded-2xl flex md:flex-row flex-nowrap overflow-x-auto scrollbar-none gap-1 border border-[#33628B]/5 shadow-xs"
        >
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-display transition-all shrink-0 cursor-pointer flex-1 text-center min-w-[100px] ${
                  isActive 
                    ? "bg-white text-[#33628B] shadow-xs" 
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-white/40"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-xl -z-10 border border-[#33628B]/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{cat.displayIcon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Selected Habit Content Area (Clean, single card focus) */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-neutral-150 rounded-[32px] p-6 sm:p-8 md:p-10 space-y-6 shadow-xs relative overflow-hidden"
            >
              {/* Card top banner/accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#33628B]/20" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Main Action Content column (left) */}
                <div className="space-y-5 md:flex-1">
                  
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#33628B]/10 flex items-center justify-center text-[#33628B] shrink-0">
                      <IconComponent name={currentGroup.iconName} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
                        Đề xuất chăm sóc bản thân
                      </span>
                      <h2 className="font-display text-lg sm:text-xl font-black text-neutral-800">
                        {currentGroup.title}
                      </h2>
                    </div>
                  </div>

                  {/* Concise primary description */}
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans font-medium">
                    {currentGroup.shortDescription}
                  </p>

                  {/* Bullet tips with clean bullet layout */}
                  <div className="space-y-3 pt-1 border-t border-neutral-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#33628B] font-display">
                      Gợi ý thiết thực (Ưu tiên chọn một):
                    </span>
                    <ul className="space-y-2.5">
                      {currentGroup.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600 leading-relaxed font-sans">
                          <span className="flex h-4 w-4 rounded-full bg-emerald-50 text-emerald-600 font-bold items-center justify-center text-[10px] shrink-0 mt-0.5 select-none font-display">
                            ✓
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Left vertical border for desktop */}
                <div className="hidden md:block w-px self-stretch bg-neutral-100 mx-1" />

                {/* Highlight CTA: Small Action box (right) */}
                <div className="bg-[#FBF9F4] border border-[#33628B]/5 rounded-2xl p-5 md:w-[260px] shrink-0 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#33628B]">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider font-display">
                        Thử Thách Hôm Nay
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed font-semibold">
                      {currentGroup.smallAction}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-400 font-sans leading-tight">
                    Hãy làm ngay bây giờ hoặc lưu lại để thực hiện lúc thuận tiện nhất.
                  </div>
                </div>

              </div>

              {/* Accordion collapsible for "Why it helps" to make the layout extremely clean */}
              <div className="border-t border-neutral-100 pt-3">
                <button
                  onClick={() => setExpandedWhy(!expandedWhy)}
                  className="flex items-center gap-2 text-xs font-bold text-[#33628B]/80 hover:text-[#33628B] transition-all cursor-pointer font-display"
                >
                  {expandedWhy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span>{expandedWhy ? "Thu gọn thông tin bổ ích" : "Xem thêm: Tại sao thói quen này giúp ích?"}</span>
                </button>

                <AnimatePresence>
                  {expandedWhy && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#FBF9F4] border border-neutral-100 rounded-xl p-4 mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                        <span className="font-bold text-[#33628B] block mb-1">Góc tâm lý học:</span>
                        {currentGroup.whyItHelps}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Small Steps Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/40 border border-neutral-200/40 rounded-3xl p-6 sm:p-7 max-w-2xl mx-auto space-y-2.5 text-neutral-700 text-center"
        >
          <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#33628B] uppercase tracking-wide font-display">
            <span>🌱</span>
            <span>Bắt đầu từ một bước nhỏ</span>
          </div>
          <p className="text-sm text-neutral-500 leading-relaxed font-sans max-w-xl mx-auto">
            Nuôi dưỡng tinh thần là hành trình tích lũy lâu dài, không cần vội vã. Bạn không phải thay đổi mọi thứ cùng lúc — bạn chỉ cần thực hiện duy nhất <strong>một hành động nhỏ</strong> hôm nay là đủ.
          </p>
        </motion.div>

        {/* Practice Exercises Section (Core Request) */}
        <div className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-black text-neutral-800">
              Bài tập thực hành tâm lý
            </h2>
            <p className="text-xs text-neutral-500 font-sans">
              Dành 2-5 phút luyện tập chủ động để thiết lập lại sự tập trung và cân bằng cảm xúc của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Breathing 4-4-4 */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between gap-5 transition-shadow hover:shadow-2xs"
            >
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Wind className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-sm font-black text-neutral-800 leading-snug">
                  Hít thở vuông 4-4-4
                </h3>
                <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                  Giải tỏa dồn nén, phục hồi bình tĩnh tức thì bằng nhịp thở vuông 4 nhịp khóa học.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBreathingStation(true);
                }}
                className="w-full bg-[#33628B]/10 hover:bg-[#33628B] text-[#33628B] hover:text-white font-display text-[11px] font-extrabold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Bắt đầu thở
                <ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Card 2: Expressive Writing */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between gap-5 transition-shadow hover:shadow-2xs"
            >
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <PenTool className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-sm font-black text-neutral-800 leading-snug">
                  Viết ra điều đang làm bạn nặng lòng
                </h3>
                <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                  Dành vài phút viết tự do để gọi tên cảm xúc và giải tỏa suy nghĩ đang bị dồn nén.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsWritingOpen(true);
                }}
                className="w-full bg-[#33628B]/10 hover:bg-[#33628B] text-[#33628B] hover:text-white font-display text-[11px] font-extrabold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Bắt đầu viết
                <ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Card 3: Yoga video */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white border border-neutral-150 rounded-2xl p-5 flex flex-col justify-between gap-5 transition-shadow hover:shadow-2xs"
            >
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Video className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-sm font-black text-neutral-800 leading-snug">
                  Thả lỏng cơ thể với yoga nhẹ
                </h3>
                <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                  Một vài động tác chậm rãi có thể giúp cơ thể mềm ra và tâm trí dịu lại hiệu quả.
                </p>
              </div>
              <button
                onClick={() => setIsYogaOpen(true)}
                className="w-full bg-[#33628B]/10 hover:bg-[#33628B] text-[#33628B] hover:text-white font-display text-[11px] font-extrabold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                Xem bài tập
                <ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* EMBEDDED BREATHING EXERCISE TOOL */}
        <AnimatePresence>
          {showBreathingStation && (
            <motion.section 
              id="breathing-zone" 
              initial={{ opacity: 0, height: 0, y: 15 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="py-12 space-y-8 border-t border-neutral-200/50 overflow-hidden"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-display font-black uppercase tracking-widest text-[#2c4e32] bg-[#33628B]/10 text-[#33628B] px-4.5 py-1.5 rounded-full inline-block">
                  Thực Hành Chánh Niệm 4-4-4
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black text-neutral-800" style={{ lineHeight: "36px" }}>
                  Trạm Dừng Thở: 2 Phút Ngắn Lắng Đọng
                </h2>
                <p className="text-sm sm:text-base text-neutral-500 max-w-lg mx-auto leading-relaxed font-sans">
                  Khi học hành căng thẳng đỉnh điểm, hãy dành 1 phút để mắt rời màn hình và đồng bộ hơi thở cùng sóng tròn chánh niệm của SoulSync.
                </p>
              </div>

              <div className="bg-white max-w-md mx-auto p-8 rounded-[36px] border-8 border-white shadow-xs flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                
                {/* Visual breathing circle */}
                <div className="relative flex items-center justify-center h-40 w-40">
                  
                  {/* Outer pulsing layer */}
                  <AnimatePresence>
                    {isBreathing && (
                      <motion.div
                        key={breathStatus}
                        initial={{ scale: breathStatus === "hít vào" ? 1 : breathStatus === "giữ hơi" ? 1.4 : 1.4 }}
                        animate={{ 
                          scale: breathStatus === "hít vào" ? 1.4 : breathStatus === "giữ hơi" ? 1.4 : 1,
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[#33628B]/10 opacity-70 rounded-full blur-xs"
                      />
                    )}
                  </AnimatePresence>

                  {/* Core circle */}
                  <div className="bg-white h-32 w-32 rounded-full border border-neutral-200/50 flex flex-col items-center justify-center z-10 px-3 shadow-inner">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FF6B6B] mb-1">
                      {isBreathing ? breathStatus : "Sẵn sàng?"}
                    </span>
                    <span className="font-display text-xl font-black text-neutral-800">
                      {isBreathing ? `${breathCounter}s` : "4-4-4"}
                    </span>
                  </div>
                </div>

                {/* Instruction helper text */}
                <div className="space-y-1.5 z-10 font-sans">
                  <p className="font-bold text-neutral-700 text-base leading-snug">
                    {isBreathing 
                      ? breathStatus === "hít vào" 
                        ? "Hít vào từ từ bằng mũi, lấp đầy lồng ngực..." 
                        : breathStatus === "giữ hơi" 
                        ? "Nín thở dịu dàng đón nhận sự yên bình..." 
                        : "Thở ra chậm rãi qua bờ môi mềm..."
                      : "Nhấn nút Bắt đầu để đồng bộ hơi thở và giải tỏa áp lực học thuật."
                    }
                  </p>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    Kỹ thuật thở vuông giúp hạ nhịp tim và điều hòa năng lượng hệ thần kinh
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 z-10 w-full justify-center flex-wrap">
                  <button
                    onClick={handleStartBreathing}
                    className={`px-6 py-2.5 rounded-xl font-display text-xs font-black tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                      isBreathing 
                        ? "bg-neutral-850 text-white" 
                        : "bg-[#33628B] text-white hover:bg-opacity-95 hover:scale-[1.01]"
                    }`}
                  >
                    {isBreathing ? (
                      <>
                        <Pause className="h-3.5 w-3.5 fill-white" />
                        Dừng hít thở
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-white animate-pulse" />
                        Bắt đầu tập thở
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsBreathing(false);
                      setShowBreathingStation(false);
                    }}
                    className="px-6 py-2.5 rounded-xl font-display text-xs font-black tracking-wider transition-all border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 cursor-pointer"
                  >
                    Ẩn trạm thở
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Disclaimer Note (Soft, and compact) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-amber-50/40 border border-amber-200/30 rounded-2xl p-4 text-[11px] text-amber-900/85 leading-relaxed font-sans max-w-2xl mx-auto flex gap-2 items-start"
        >
          <span className="text-sm shrink-0">⚠️</span>
          <p>
            <strong className="font-extrabold text-amber-950">Lưu ý quan trọng:</strong> Các ý tưởng chăm sóc bản thân này nhằm duy trì thói quen tích cực, không thay thế cho tư vấn hoặc điều trị y tế chuyên sâu từ bác sĩ/chuyên gia tâm lý.
          </p>
        </motion.div>

        {/* Prompt to engage in active features */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="bg-[#33628B] text-white rounded-[32px] p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-md border-[6px] border-white flex flex-col md:flex-row items-center justify-between gap-6 mt-8"
        >
          <div className="space-y-3 max-w-md text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              100% Bảo mật & Ẩn danh
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Bạn muốn có cái nhìn sâu sắc cụ thể?
            </h2>
            <p className="text-xs text-neutral-200/90 leading-relaxed font-sans">
              Kiểm tra nhanh tình lượng căng thẳng của bạn qua bài trắc nghiệm nhanh khoa học, hoặc bắt đầu cuộc trò chuyện bảo mật tức thì cùng cố vấn AI SoulSync.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={onStartAssessment}
              className="bg-white text-[#33628B] hover:bg-[#F9F7F2] font-display text-xs font-bold px-5 py-3.5 rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="h-4 w-4" />
              Làm bài đánh giá
            </button>
            <button
              onClick={onOpenChat}
              className="bg-[#1A1A1A] text-white hover:bg-neutral-900 font-display text-xs font-bold px-5 py-3.5 rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Trò chuyện ẩn danh
            </button>
          </div>
        </motion.div>

      </div>

      {/* Expressive Writing Interactive Modal */}
      <ExpressiveWritingModal 
        isOpen={isWritingOpen} 
        onClose={() => setIsWritingOpen(false)} 
      />

      {/* Yoga Video Modal */}
      <YogaVideoModal 
        isOpen={isYogaOpen} 
        onClose={() => setIsYogaOpen(false)} 
      />

    </div>
  );
}
