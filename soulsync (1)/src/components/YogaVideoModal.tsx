import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Video, 
  Music, 
  Flame, 
  HelpCircle,
  AlertTriangle,
  Play,
  Volume2
} from "lucide-react";

interface YogaVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoOption {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
}

interface CategoryOption {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  defaultVideo: VideoOption;
  subVideos?: VideoOption[];
}

export default function YogaVideoModal({ isOpen, onClose }: YogaVideoModalProps) {
  // Video Options configuration
  const yogaOption: CategoryOption = {
    id: "yoga_nhe",
    label: "Yoga nhẹ",
    description: "Một bài tập nhẹ nhàng giúp cơ thể mềm ra và tâm trí dịu lại.",
    icon: <Flame className="h-4.5 w-4.5 text-emerald-600" />,
    defaultVideo: {
      id: "yoga_1",
      title: "Yoga nhẹ để thả lỏng cơ thể",
      description: "Hỗ trợ kéo giãn nhẹ nhàng cơ vai, gáy và thắt lưng để phục hồi dòng chảy năng lượng lành mạnh.",
      embedUrl: "https://www.youtube.com/embed/hJbRpHZr_d0",
    }
  };

  const cognitiveOption: CategoryOption = {
    id: "go_roi",
    label: "Gỡ rối suy nghĩ tiêu cực",
    description: "Video giúp bạn hiểu và xử lý những suy nghĩ khó khăn theo cách khoa học hơn.",
    icon: <HelpCircle className="h-4.5 w-4.5 text-sky-600" />,
    defaultVideo: {
      id: "cognitive_1",
      title: "Gỡ rối suy nghĩ tiêu cực",
      description: "Thấu cảm bản thân, phá vỡ vòng lặp suy nghĩ quá mức (overthinking) dưới góc nhìn tâm lý học.",
      embedUrl: "https://www.youtube.com/embed/GnSHpBRLJrQ",
    }
  };

  const musicOption: CategoryOption = {
    id: "nhac_thu_gian",
    label: "Nhạc thư giãn / thiền định",
    description: "Âm thanh nhẹ nhàng giúp bạn thư giãn, nghỉ ngơi hoặc tập trung vào hơi thở.",
    icon: <Music className="h-4.5 w-4.5 text-purple-600" />,
    defaultVideo: {
      id: "music_1",
      title: "Nhạc thư giãn 1",
      description: "Tần số sóng não êm dịu giúp tái tạo sự tập trung và hạ nhiệt dồn nén của hệ thần kinh.",
      embedUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
    },
    subVideos: [
      {
        id: "music_1",
        title: "Nhạc thư giãn 1",
        description: "Tần số sóng não êm dịu giúp tái tạo sự tập trung và hạ nhiệt dồn nén của hệ thần kinh.",
        embedUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
      },
      {
        id: "music_2",
        title: "Nhạc thư giãn 2",
        description: "Nhạc nền Deep Relax nuôi dưỡng sâu sắc sự tĩnh lặng, thích hợp trước giờ đi ngủ.",
        embedUrl: "https://www.youtube.com/embed/OdIJ2x3nxzQ",
      }
    ]
  };

  const categories = [yogaOption, cognitiveOption, musicOption];

  // Selected state management
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("yoga_nhe");
  const [selectedVideo, setSelectedVideo] = useState<VideoOption>(yogaOption.defaultVideo);

  // Mặc định khi mở modal, chọn lại option "Yoga nhẹ"
  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId("yoga_nhe");
      setSelectedVideo(yogaOption.defaultVideo);
    }
  }, [isOpen]);

  const activeCategory = categories.find(c => c.id === selectedCategoryId) || yogaOption;

  const handleCategorySelect = (category: CategoryOption) => {
    setSelectedCategoryId(category.id);
    setSelectedVideo(category.defaultVideo);
  };

  const handleSubVideoSelect = (video: VideoOption) => {
    setSelectedVideo(video);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="bg-[#F9F7F2] w-full max-w-[850px] rounded-[32px] overflow-hidden relative shadow-xl border border-neutral-200/40 flex flex-col max-h-[92vh]"
          >
            {/* Top color bar decorative design */}
            <div className="h-1.5 w-full bg-[#33628B]" />

            {/* Header portion */}
            <div className="p-5 sm:p-6 border-b border-neutral-200/40 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Video className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-black text-neutral-800">
                    Bài tập hỗ trợ thể chất & tinh thần
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans tracking-wide">
                    Thả lỏng khớp cơ • Cân bằng nhịp sinh học
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer transition-colors"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable grid layout */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 select-none">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Left side options: Category Select List (Vertical column) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 font-display block">
                    Danh sách bài tập hỗ trợ:
                  </span>
                  
                  <div className="space-y-2.5">
                    {categories.map((cat) => {
                      const isActive = selectedCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                            isActive 
                              ? "bg-white border-[#33628B]/20 shadow-xs" 
                              : "bg-white/50 border-neutral-200/50 hover:bg-white hover:border-neutral-200"
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                            isActive ? "bg-[#33628B]/10" : "bg-neutral-100"
                          }`}>
                            {cat.icon}
                          </div>
                          <div className="space-y-1">
                            <h4 className={`text-xs sm:text-[13px] font-extrabold leading-tight font-display ${
                              isActive ? "text-[#33628B]" : "text-neutral-800"
                            }`}>
                              {cat.label}
                            </h4>
                            <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional sub-options menu if "nhac_thu_gian" is selected */}
                  {selectedCategoryId === "nhac_thu_gian" && musicOption.subVideos && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-2 mt-4"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-700 font-display block flex items-center gap-1">
                        <Volume2 className="h-3 w-3" /> CHỌN BẢN NHẠC:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {musicOption.subVideos.map((subVideo) => {
                          const isSubActive = selectedVideo.title === subVideo.title;
                          return (
                            <button
                              key={subVideo.id}
                              onClick={() => handleSubVideoSelect(subVideo)}
                              className={`py-2 px-3 rounded-xl text-center text-xs font-semibold cursor-pointer border transition-all ${
                                isSubActive
                                  ? "bg-purple-600 border-transparent text-white shadow-xs"
                                  : "bg-white border-purple-100 text-purple-700 hover:bg-purple-50"
                              }`}
                            >
                              {subVideo.title}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right side player: Responsive video container */}
                <div className="md:col-span-7 space-y-4">
                  {/* Selected Video Player and Description */}
                  <div className="bg-white border border-neutral-150 p-4 rounded-2xl space-y-3.5 shadow-sm">
                    <div className="space-y-1 leading-tight">
                      <div className="flex items-center gap-1.5 text-xs text-[#33628B] font-bold font-sans">
                        <Play className="h-3.5 w-3.5 fill-[#33628B]" />
                        <span>Đang hiển thị: {selectedVideo.title}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-neutral-500 font-sans mt-1">
                        {selectedVideo.description}
                      </p>
                    </div>

                    {/* YouTube iFrame embed with strictly NO autoplay, 16:9 ratio */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-neutral-200 flex items-center justify-center relative">
                      <iframe
                        className="w-full h-full border-none absolute inset-0"
                        src={selectedVideo.embedUrl}
                        title={selectedVideo.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Compact Safety Disclaimer */}
                  <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-3.5 text-[10px] text-amber-900/85 leading-relaxed font-sans flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <p>
                      <strong className="font-extrabold text-amber-950">Khuyến cáo:</strong> Hãy chọn bài tập phù hợp với thể trạng của bạn. Nếu cảm thấy đau, chóng mặt hoặc khó chịu, hãy dừng lại ngay.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom portion (Footer) */}
            <div className="p-4 bg-white border-t border-neutral-200/40 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="bg-[#33628B] text-white font-display text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-opacity-95 transition-all cursor-pointer shadow-xs"
              >
                Quay lại
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
