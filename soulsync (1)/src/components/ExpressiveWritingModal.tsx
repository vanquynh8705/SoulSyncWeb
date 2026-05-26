import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  PenTool, 
  Timer, 
  AlertCircle,
  Play
} from "lucide-react";

interface ExpressiveWritingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpressiveWritingModal({ isOpen, onClose }: ExpressiveWritingModalProps) {
  // 4 psychological focus questions as guide items
  const guideQuestions = [
    "1. Bạn đang lo lắng điều gì nhất?",
    "2. Điều tệ nhất có thể xảy ra là gì?",
    "3. Điều đó có chắc chắn xảy ra không?",
    "4. Nếu xảy ra, bạn sẽ xử lý thế nào?",
  ];

  // Answer states: single large diary text
  const [text, setText] = useState<string>("");

  // Writing phase states
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes = 180 seconds
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Focus reference for the large textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isOpen && hasStarted && timeLeft > 0 && !isCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, hasStarted, timeLeft, isCompleted]);

  // Handle Close
  const handleClose = () => {
    onClose();
  };

  // Start the exercise
  const handleStart = () => {
    setHasStarted(true);
    // Focus textarea after starting
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Reset function
  const handleReset = () => {
    setText("");
    setHasStarted(false);
    setIsCompleted(false);
    setTimeLeft(180);
    setIsTimeUp(false);
  };

  // Complete function
  const handleComplete = () => {
    setIsCompleted(true);
  };

  // Format count down time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Safe checks if there is any input
  const charCount = text.length;
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const hasSomeInput = text.trim() !== "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="bg-[#F9F7F2] w-full max-w-[620px] rounded-[32px] overflow-hidden relative shadow-xl border border-neutral-200/40 flex flex-col max-h-[90vh]"
          >
            {/* Top decorative color bar */}
            <div className="h-1.5 w-full bg-[#33628B]" />

            {/* Header portion */}
            <div className="p-5 sm:p-6 border-b border-neutral-200/40 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <PenTool className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-black text-neutral-800">
                    Expressive Writing
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans tracking-wide">
                    Hành trình viết tự do xoa dịu xao động
                  </p>
                </div>
              </div>

              {/* Timer status */}
              {hasStarted && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-mono border transition-colors ${
                  isTimeUp 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : isCompleted 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-[#33628B]/5 text-[#33628B] border-[#33628B]/20"
                }`}>
                  <Timer className={`h-3.5 w-3.5 ${hasStarted && !isCompleted && !isTimeUp ? 'animate-pulse' : ''}`} />
                  <span>{isCompleted ? "Hoàn thành" : isTimeUp ? "Hết giờ" : formatTime(timeLeft)}</span>
                </div>
              )}

              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer transition-colors"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 select-none">
              
              {!isCompleted ? (
                <>
                  {/* Notice banner before starting */}
                  {!hasStarted ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-neutral-150 rounded-2xl p-5 space-y-4 text-center shadow-2xs"
                    >
                      <div className="text-2xl">✍️</div>
                      <div className="space-y-1">
                        <h4 className="font-display text-xs sm:text-sm font-black text-[#33628B]">
                          Bạn đã sẵn sàng cho 3 phút viết lắng đọng?
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-sans leading-relaxed max-w-md mx-auto">
                          Phương pháp viết Expressive Writing giúp bạn gọi tên nỗi lo và đặt chúng ra giấy. Khi bấm bắt đầu, đồng hồ 3 phút sẽ chạy để thúc đẩy bạn lướt nhanh qua sự phản kháng của tâm trí.
                        </p>
                      </div>

                      <div className="flex justify-center pt-1.5">
                        <button
                          onClick={handleStart}
                          className="bg-[#33628B] hover:bg-opacity-95 text-white font-display text-xs font-black px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Bắt đầu viết
                        </button>
                      </div>

                      <p className="text-[10px] text-neutral-400 italic">
                        Bạn không cần viết hay. Chỉ cần viết thật với cảm xúc của mình.
                      </p>
                    </motion.div>
                  ) : isTimeUp ? (
                    <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 text-xs text-red-700 font-semibold font-sans flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500 animate-bounce" />
                      <span>Đã hết thời gian viết (3 phút). Ô nhập đã được tự động khóa lại để bảo lưu ý nghĩ tức thời của bạn.</span>
                    </div>
                  ) : null}

                  {/* Guided questions box */}
                  <div className={`p-4 bg-[#33628B]/5 border border-[#33628B]/10 rounded-2xl space-y-2 transition-opacity ${!hasStarted ? "opacity-35 pointer-events-none" : "opacity-100"}`}>
                    <h4 className="text-xs font-black text-[#33628B] font-display uppercase tracking-wider flex items-center gap-1.5">
                      <span>💡</span> Gợi ý viết hôm nay:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 font-sans font-medium">
                      {guideQuestions.map((q, idx) => (
                        <p key={idx} className="bg-white/80 border border-[#33628B]/5 px-2.5 py-1.5 rounded-lg leading-tight">
                          {q}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* One big diary-like textarea */}
                  <div className={`space-y-2 font-sans transition-opacity ${!hasStarted ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                    <div className="bg-white border border-neutral-150 rounded-2xl p-4 shadow-sm relative">
                      <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Hãy đặt bút viết tự do tại đây để xoa dịu những nhịp rung chấn bên trong..."
                        disabled={!hasStarted || isTimeUp}
                        rows={8}
                        className="w-full bg-[#FBF9F4] border border-neutral-200/50 focus:border-[#33628B] rounded-xl p-4 text-xs sm:text-sm text-neutral-700 placeholder-neutral-400 focus:outline-hidden focus:bg-white transition-all leading-relaxed resize-none font-sans"
                      />
                    </div>

                    {/* Word and character count info */}
                    <div className="flex justify-between items-center text-[11px] text-neutral-400 font-sans px-1">
                      <span>Số từ: {wordCount} • Ký tự: {charCount}</span>
                      <span className="text-[10px] text-neutral-400 italic">
                        Ý nghĩ tự do không cần trau chuốt
                      </span>
                    </div>
                  </div>

                  {/* Private text reminders */}
                  <p className="text-[10px] text-neutral-400 italic font-sans leading-relaxed text-center px-2">
                    🔒 Nội dung này chỉ hiển thị trên thiết bị của bạn và sẽ mất khi bạn tải lại trang. SoulSync tuyệt đối tôn trọng sự riêng tư và bảo mật của bạn.
                  </p>
                </>
              ) : (
                /* Completion screen */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 px-4 space-y-6 flex flex-col items-center bg-white border border-neutral-150 rounded-[24px]"
                >
                  <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-2xs">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div className="space-y-3.5 max-w-md">
                    <h3 className="font-display text-base font-black text-neutral-800">
                      Cảm ơn bạn đã dành thời gian lắng nghe chính mình!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#33628B] font-bold font-sans bg-[#33628B]/5 border border-[#33628B]/10 rounded-2xl p-4 leading-relaxed">
                      “Việc viết ra giúp bạn chuyển suy nghĩ mơ hồ thành rõ ràng, từ đó giảm áp lực trong đầu.”
                    </p>
                    <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                      Bạn đã dành ra 3 phút rất ý nghĩa để định hình nỗi lo và làm dịu những xao động bên trong. Mỗi hành động nhỏ hôm nay là bước đệm tuyệt vời cho một tâm trí tự tại ngày mai.
                    </p>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={handleReset}
                      className="bg-[#33628B]/10 text-[#33628B] hover:bg-[#33628B] hover:text-white font-display text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Viết lại bài mới
                    </button>
                    <button
                      onClick={handleClose}
                      className="bg-[#33628B] text-white font-display text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-opacity-95 transition-all cursor-pointer"
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Actions portion (Footer) */}
            <div className="p-4 bg-white border-t border-neutral-200/40 flex items-center justify-between gap-3 shrink-0">
              {/* Reset/Clear button */}
              <button
                onClick={handleReset}
                disabled={!hasSomeInput && !hasStarted}
                className="flex items-center gap-1 px-3 py-2.5 text-[11px] font-bold text-neutral-400 hover:text-red-500 border border-transparent hover:bg-neutral-50 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-display"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa nội dung</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="bg-neutral-50 border border-neutral-200 text-neutral-600 font-display text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                
                {hasStarted && !isCompleted && (
                  <button
                    onClick={handleComplete}
                    className="bg-[#33628B] text-white font-display text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-opacity-95 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Hoàn thành</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
