import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShieldAlert 
} from "lucide-react";
import { supportData } from "../data/supportData";
import { SupportCard } from "../components/SupportCard";

interface SupportProps {
  onBackToHome: () => void;
}

const categories = [
  { id: "all", label: "Tất cả" },
  { id: "Bệnh viện Công lập", label: "Công lập" },
  { id: "Bệnh viện Tư nhân", label: "Tư nhân" },
  { id: "Bệnh viện Tư nhân Cao cấp", label: "Tư nhân cao cấp" },
  { id: "Phòng khám tư nhân / Bác sĩ chuyên khoa", label: "Phòng khám tư" }
];

export const Support: React.FC<SupportProps> = ({ onBackToHome }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSupports = useMemo(() => {
    return supportData.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term) ||
        item.serviceType.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term));
        
      const matchesCategory = 
        activeCategory === "all" || item.category === activeCategory;
        
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] py-8 md:py-16 font-sans">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 space-y-8 md:space-y-10">
        
        {/* Navigation & Gentle Student-Centric Hero Section */}
        <div className="space-y-5">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#33628B] hover:underline font-bold text-sm transition-all focus:outline-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Trang chủ
            </button>
          )}

          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#33628B]/10 text-[#33628B] rounded-full text-xs font-black">
              <Heart className="h-3.5 w-3.5 fill-[#33628B]/20" />
              Điểm tựa tâm lý học đường
            </div>
            
            <h1 className="font-display font-black text-brand-charcoal tracking-tighter" style={{ fontSize: "36px", lineHeight: "44px" }}>
              Nguồn hỗ trợ tâm lý &amp; Trị liệu
            </h1>
            
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
              Bạn không phải tự mình gánh vác mọi áp lực học tập và cuộc sống. Dưới đây là danh sách tổng hợp các cơ sở y tế và phòng trị liệu tâm lý uy tín tại Đà Nẵng, sẵn sàng đồng hành cùng bạn trên con đường tìm lại bình yên.
            </p>
          </div>
        </div>

        {/* Prominent High-Contrast Student Safety Disclaimer */}
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 md:p-5 flex items-start gap-3 text-amber-900 text-[13px] md:text-sm leading-relaxed shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-amber-950 block text-xs md:text-sm">Thông tin hỗ trợ khẩn cấp:</span>
            <p className="text-amber-900/90 text-xs md:text-sm">
              Trang này cung cấp thông tin liên hệ tham khảo và không thay thế cho các liệu pháp điều trị y tế chính quy. Trong trường hợp khủng hoảng tâm lý nghiêm trọng hoặc khẩn cấp nguy hiểm, hãy liên hệ ngay hotline cấp cứu của <strong>Bệnh viện Tâm thần Đà Nẵng (0935.422.426)</strong> hoặc di chuyển đến cơ quan y tế gần nhất.
            </p>
          </div>
        </div>

        {/* Searching & Filtering Bar */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-neutral-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
              <input 
                type="text"
                placeholder="Tìm tên cơ sở, loại hỗ trợ, địa lý hoặc chuyên trị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-[#33628B] focus:bg-white rounded-2xl text-xs md:text-sm font-medium transition-all focus:outline-none text-neutral-800"
              />
            </div>
            
            <div className="hidden lg:flex items-center gap-2 font-sans font-medium">
              <span className="text-neutral-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1 px-2 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Bộ lọc:
              </span>
              <div className="flex bg-neutral-50 p-1 rounded-xl border border-neutral-100">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                      activeCategory === cat.id 
                        ? "bg-[#33628B] text-white shadow-xs" 
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter options for tablet & mobile */}
          <div className="flex lg:hidden flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                  activeCategory === cat.id 
                    ? "bg-[#33628B] text-white shadow-xs" 
                    : "bg-neutral-50 border border-neutral-200 text-neutral-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Support Grid List */}
        <div>
          {filteredSupports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSupports.map((item) => (
                <SupportCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#33628B]/10 rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
              <SlidersHorizontal className="w-8 h-8 text-neutral-400 mx-auto opacity-70" />
              <h3 className="font-display font-black text-base text-neutral-700">Không tìm thấy địa điểm phù hợp</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Vui lòng thử điều chỉnh từ khóa hoặc chọn "Tất cả" để xem toàn bộ danh sách nguồn hỗ trợ tâm lý.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
                className="inline-flex px-4 py-2 bg-[#33628B] text-white text-xs font-bold rounded-xl shadow-xs hover:scale-102 transition-all cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
