import React, { useState } from "react";
import { X, Sparkles, Check, ChevronRight, MessageSquare, Award, Clock, Heart, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QuizQuestion, QuizResult } from "../types";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "Bạn cảm thấy mức độ kiệt sức khi đối phó áp lực học tập gần đây như thế nào?",
    category: "burnout",
    options: [
      { value: 1, text: "Hoàn toàn bình thường, nhiều năng lượng", subtext: "Bạn thấy hào hứng khi lên lớp học tập" },
      { value: 2, text: "Thỉnh thoảng thấy mệt mỏi thể xác", subtext: "Có thể hồi phục nhanh sau một giấc ngủ ngon" },
      { value: 3, text: "Kiệt sức học thuật kéo dài liên tục", subtext: "Nhìn sách vở hay thư viện đều cảm thấy u ám, chán chường" },
      { value: 4, text: "Hoàn toàn trống rỗng, kiệt quệ tâm lý", subtext: "Không còn động lực lết khỏi giường để làm bài tập lớn" },
    ],
  },
  {
    id: 2,
    text: "Mức độ suy nghĩ quá mức (Overthinking) ảnh hưởng giấc ngủ của bạn ra sao?",
    category: "overthinking",
    options: [
      { value: 1, text: "Hiếm khi nghĩ lung tung, đặt lưng là ngủ", subtext: "Kiểm soát được luồng suy nghĩ rất thoải mái" },
      { value: 2, text: "Thỉnh thoảng trằn trọc vì lo điểm số, tương lai", subtext: "Chỉ xảy ra trước các tuần thi cử căng thẳng" },
      { value: 3, text: "Liên tục dằn vặt liệu mình có nỗ lực vạn phần chưa", subtext: "Não bộ không chịu tắt máy dù cơ thể vô cùng mệt mỏi" },
      { value: 4, text: "Mắc kẹt hoàn toàn vào vòng xoáy lo âu và tự ti", subtext: "Cho rằng bản thân yếu kém và liên tục phủ nhận thành quả" },
    ],
  },
  {
    id: 3,
    text: "Áp lực dồn dập từ thời hạn (Deadline) ảnh hưởng bạn thế nào?",
    category: "urgency",
    options: [
      { value: 1, text: "Quản lý thời gian tốt, luôn sẵn sàng nộp sớm", subtext: "Sắp xếp thứ tự ưu tiên các môn học thông minh" },
      { value: 2, text: "Hơi dồn nén trước ngày nộp nhưng vẫn gánh tốt", subtext: "Có thể kích hoạt 'chế độ siêu tập trung' chuẩn mực" },
      { value: 3, text: "Choáng ngợp, nghẹt thở vì khối lượng công việc chéo nhau", subtext: "Các bài tập tuần, bài tập nhóm đến dồn dập làm bạn rối trí" },
      { value: 4, text: "Tê liệt hoàn toàn, thường xuyên bỏ dở hoặc nộp muộn", subtext: "Bạn trốn chạy khỏi deadline bằng cách lướt web vô thức" },
    ],
  },
  {
    id: 4,
    text: "Khi gặp u sầu hay áp lực tột độ, bạn thường chọn giải quyết bằng cách nào?",
    category: "coping",
    options: [
      { value: 1, text: "Chia sẻ tâm tình hoặc tham gia hoạt động chánh niệm", subtext: "Chủ động đi dạo, nghe nhạc thư giãn hoặc trò chuyện" },
      { value: 2, text: "Tự chịu đựng mệt mỏi cho tới khi tự hết", subtext: "Ít khi chia sẻ nhưng cố giữ tinh thần độc lập" },
      { value: 3, text: "Cách ly bản thân khỏi gia đình, bạn bè và học tập", subtext: "Rơi vào phòng đơn cô lập và ăn uống thất thường" },
      { value: 4, text: "Chọn các hành vi trốn tránh và tiêu cực kéo dài", subtext: "Mất ngủ nghiệm trọng, không muốn tiếp xúc với bất kì ai" },
    ],
  },
];

export default function AssessmentModal({ isOpen, onClose, onOpenChat }: AssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate
      calculateResults();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    const scoreBurnout = answers[1] || 2;
    const scoreOverthinking = answers[2] || 2;
    const scoreUrgency = answers[3] || 2;
    const scoreCoping = answers[4] || 2;

    const overallScore = (scoreBurnout + scoreOverthinking + scoreUrgency + scoreCoping) / 4;

    let profileName = "Tâm Hồn An Yên (Bình Chí)";
    let description = "Vui mừng chưa! Bạn đang sở hữu một hệ thần kinh và thói quen sinh hoạt vô cùng kiên định, lành mạnh. Sự mệt mỏi học đường chỉ tác động nhẹ và bạn nhanh chóng vượt qua.";
    let recommendations = [
      "Duy trì thói quen viết nhật ký biết ơn mỗi tối để tiếp tục nuôi dưỡng năng lượng.",
      "Thực hiện bài tập thở cân bằng 4-4-4 khi đối diện các dự án học tập lớn sắp tới.",
      "Hãy làm ngọn đèn dẫn đường ấm áp cho các bạn cùng phòng đang chịu áp lực bằng sự lắng nghe.",
    ];

    if (overallScore >= 1.7 && overallScore < 2.5) {
      profileName = "Cơn Gió Nhẹ Cuối Thu (Căng Thẳng Nhẹ)";
      description = "Bạn đang gánh vác áp lực học đường ở mức độ trung bình. Đôi khi sự lo lắng và những đêm học thâu đêm làm bạn mỏi mệt nhưng bạn vẫn kiểm soát tốt quỹ đạo.";
      recommendations = [
        "Thử phương pháp Pomodoro (học 25 phút, nghỉ 5 phút) để tránh kiệt sức học thuật.",
        "Nghe chuông thiền hoặc nhạc tần số 432Hz mỗi tối trước khi đi ngủ 15 phút.",
        "Giảm bớt thời gian tiếp xúc màn hình xanh điện thoại sau 11 giờ đêm.",
      ];
    } else if (overallScore >= 2.5 && overallScore < 3.3) {
      profileName = "Mây Mờ Sương Phủ (Áp Lực Cao - Overthinking)";
      description = "Tâm trí bạn đang gầm rú với hàng ngàn suy nghĩ chưa được sắp xếp. Bạn dễ rơi vào vòng lặp lo lắng thái quá về kỳ hạn bài vở hoặc bản lĩnh học tập của chính mình.";
      recommendations = [
        "Thực hiện bài tập thở xoa dịu 4-7-8 (Hít vào 4 giây, giữ nín thở 7 giây, thở ra 8 giây bằng miệng) ngay hôm nay.",
        "Sử dụng công cụ viết xả stress (Brain Dump) - ghi hết suy nghĩ ra một tờ giấy rồi vo tròn bỏ đi.",
        "Trò chuyện ẩn danh cùng trợ lý Thấu cảm SoulSync AI ngay ở thanh góc phải để xoa dịu tức thì.",
      ];
    } else if (overallScore >= 3.3) {
      profileName = "Bão Biển Đêm Khuya (Kiệt Sức Nghiêm Trọng)";
      description = "Tín hiệu cảnh báo đỏ! Bạn đang đối diện với Academic Burnout (Kiệt sức học thuật) cực độ kèm theo các dấu hiệu bất ổn về giấc ngủ và tự cô lập. Cơ thể bạn đang cầu cứu một khoảng lặng dừng lại.";
      recommendations = [
        "Dành ngay 24 giờ 'ngắt kết nối kỹ thuật số' hoàn toàn nếu có thể, để cơ thể phục hồi thể lý tự nhiên.",
        "Ưu tiên hàng đầu cho giấc ngủ sâu 7-8 tiếng, uống đủ nước và vận động ngắn nhẹ dưới ánh nắng mặt trời.",
        "Sử dụng phòng tư vấn khẩn cấp hoặc trò chuyện trực tiếp với trợ lý SoulSync AI để gỡ rối tâm lý dần dần.",
      ];
    }

    setResult({
      scoreBurnout,
      scoreOverthinking,
      scoreUrgency,
      scoreCoping,
      overallScore,
      profileName,
      description,
      recommendations,
    });
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const activeQuestion = QUESTIONS[currentStep];
  const selectedValue = answers[activeQuestion.id];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#fbf9f4] shadow-2xl border border-neutral-100 p-6 md:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-2 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-brand-blue mb-6">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="font-display font-bold text-sm uppercase tracking-wider">
            Bài đánh giá nhanh áp lực sinh viên
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="quiz-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress dots bar */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-neutral-500 font-bold">
                  Bước {currentStep + 1} trên {QUESTIONS.length}
                </span>
                <div className="flex gap-2">
                  {QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStep
                          ? "w-8 bg-brand-blue"
                          : idx < currentStep
                          ? "w-2 bg-brand-sage"
                          : "w-2 bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="font-display text-lg md:text-xl font-bold text-neutral-800 tracking-tight leading-relaxed mb-6">
                {activeQuestion.text}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3.5 mb-8">
                {activeQuestion.options.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(activeQuestion.id, opt.value)}
                      className={`w-full text-left p-4 rounded-xl border-none ring-1 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-white ring-2 ring-brand-blue shadow-md"
                          : "bg-white/60 hover:bg-white ring-neutral-200 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? "bg-brand-blue border-brand-blue text-white" : "border-neutral-300"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-neutral-800 leading-tight">
                          {opt.text}
                        </p>
                        {opt.subtext && (
                          <p className="text-xs text-neutral-500 font-sans mt-1 leading-relaxed">
                            {opt.subtext}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center border-t border-neutral-100 pt-5">
                <button
                  onClick={handlePrev}
                  className={`px-5 py-2.5 rounded-full font-display text-xs font-bold transition-all ${
                    currentStep === 0
                      ? "text-neutral-300 pointer-events-none cursor-default"
                      : "text-neutral-500 hover:bg-neutral-100 cursor-pointer"
                  }`}
                >
                  Quay lại
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedValue}
                  className="px-6 py-3 bg-brand-blue text-white rounded-full font-display text-xs font-bold shadow-md hover:bg-brand-blue/90 disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  {currentStep === QUESTIONS.length - 1 ? "Hoàn tất bài test" : "Câu tiếp theo"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Graphic Header Result */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                {/* Visual Gauge */}
                <div className="shrink-0 relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-neutral-100" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="stroke-brand-blue"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - result.overallScore / 4)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-display font-extrabold text-brand-blue">
                      {Math.round((result.overallScore / 4) * 100)}%
                    </span>
                    <span className="block text-[9px] text-neutral-400 uppercase font-sans font-bold tracking-wider">
                      Áp lực tâm trí
                    </span>
                  </div>
                </div>

                {/* Profile Text Info */}
                <div className="text-center md:text-left space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-lavender/30 text-[#484266] rounded-full text-xs font-bold tracking-tight">
                    <Award className="h-3.5 w-3.5" />
                    Hình mẫu trạng thái của bạn
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-extrabold text-neutral-800">
                    {result.profileName}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {result.description}
                  </p>
                </div>
              </div>

              {/* Stress Indexes Grid */}
              <div>
                <h4 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3">
                  4 Chỉ Số Đo Lường Sức Khỏe Tinh Thần
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* index 1 */}
                  <div className="bg-white/50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 font-semibold mb-0.5">Kiệt sức học thuật</p>
                      <p className="font-display text-sm font-extrabold text-[#1c1738]">
                        {result.scoreBurnout <= 2 ? "Lành mạnh 🌱" : result.scoreBurnout === 3 ? "Áp lực cao ⚠️" : "Báo động 🚨"}
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-end">
                      {[1, 2, 3, 4].map((stepVal) => (
                        <div
                          key={stepVal}
                          className={`h-3 w-3 rounded-full ${
                            stepVal <= result.scoreBurnout
                              ? result.scoreBurnout >= 3.3
                                ? "bg-red-500"
                                : "bg-brand-blue"
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* index 2 */}
                  <div className="bg-white/50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 font-semibold mb-0.5">Overthinking suy nghĩ</p>
                      <p className="font-display text-sm font-extrabold text-[#1c1738]">
                        {result.scoreOverthinking <= 2 ? "Kiểm soát tốt 🌱" : result.scoreOverthinking === 3 ? "Phân tán lo lắng ⚠️" : "Quá tải đầu óc 🚨"}
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-end">
                      {[1, 2, 3, 4].map((stepVal) => (
                        <div
                          key={stepVal}
                          className={`h-3 w-3 rounded-full ${
                            stepVal <= result.scoreOverthinking
                              ? result.scoreOverthinking >= 3.3
                                ? "bg-red-500"
                                : "bg-brand-blue"
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* index 3 */}
                  <div className="bg-white/50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 font-semibold mb-0.5">Thời hạn & Áp lực gấp rút</p>
                      <p className="font-display text-sm font-extrabold text-[#1c1738]">
                        {result.scoreUrgency <= 2 ? "Chủ động tốt 🌱" : result.scoreUrgency === 3 ? "Thiếu thời gian ⚠️" : "Tê liệt trì hoãn 🚨"}
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-end">
                      {[1, 2, 3, 4].map((stepVal) => (
                        <div
                          key={stepVal}
                          className={`h-3 w-3 rounded-full ${
                            stepVal <= result.scoreUrgency
                              ? result.scoreUrgency >= 3.3
                                ? "bg-red-500"
                                : "bg-brand-blue"
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* index 4 */}
                  <div className="bg-white/50 p-4 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 font-semibold mb-0.5">Thói quen giải tỏa</p>
                      <p className="font-display text-sm font-extrabold text-[#1c1738]">
                        {result.scoreCoping === 1 ? "Tích cực chủ động 🌱" : result.scoreCoping === 2 ? "Tự lực âm thầm ⚠️" : "Cô lập hành tâm 🚨"}
                      </p>
                    </div>
                    <div className="flex gap-1.5 self-end">
                      {[1, 2, 3, 4].map((stepVal) => (
                        <div
                          key={stepVal}
                          className={`h-3 w-3 rounded-full ${
                            stepVal <= result.scoreCoping
                              ? result.scoreCoping >= 3.3
                                ? "bg-red-500"
                                : "bg-brand-blue"
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations Custom Cards list */}
              <div className="bg-brand-sage/20 rounded-2xl p-5 border border-brand-sage/40">
                <h4 className="font-display text-sm font-bold text-brand-blue flex items-center gap-1.5 mb-3">
                  <Heart className="h-4 w-4 fill-brand-blue" />
                  Gợi Ý Bài Tập Giải Tỏa Riêng Cho Bạn
                </h4>
                <ul className="space-y-2.5 font-sans text-sm text-neutral-700 antialiased pl-0 list-none">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <div className="h-4.5 w-4.5 rounded-full bg-brand-sage flex items-center justify-center shrink-0 mt-0.5 text-[#0f1f12] text-[10px] font-bold">
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Footer Panel */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100">
                <button
                  onClick={onOpenChat}
                  className="flex-1 bg-brand-blue text-white py-3.5 rounded-full font-display text-xs font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 fill-white" />
                  Mở Trò Chuyện Riêng Tư Thấu Cảm Với AI
                </button>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3.5 bg-white text-brand-blue border border-brand-blue/30 rounded-full font-display text-xs font-bold hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                >
                  Thực hiện lại bài test
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
