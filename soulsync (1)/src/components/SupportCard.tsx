import React from "react";
import { Phone, MapPin, AlertTriangle, ArrowUpRight, CheckCircle } from "lucide-react";

export interface SupportItem {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  serviceType: string;
  tags: string[];
  suitableLevel: string;
  description: string;
  verifiedSource: boolean;
  lastUpdated: string;
  emergencySupport: boolean;
  note?: string;
}

interface SupportCardProps {
  item: SupportItem;
}

export const SupportCard: React.FC<SupportCardProps> = ({ item }) => {
  return (
    <div 
      className="relative flex flex-col justify-between bg-white border border-[#33628B]/10 rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#33628B]/25"
      id={`support-card-${item.id}`}
    >
      {/* Card Content Upper Section */}
      <div className="space-y-4">
        {/* Category & Crisis/Emergency Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 text-[#33628B] bg-[#33628B]/10 rounded-full font-sans uppercase tracking-wider">
            {item.category}
          </span>
          {item.emergencySupport && (
            <span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-1 text-red-600 bg-red-50 rounded-full font-sans border border-red-100 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
              Khẩn cấp 24/7
            </span>
          )}
          {item.verifiedSource && (
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 text-emerald-600 bg-emerald-50 rounded font-sans border border-emerald-100">
              <CheckCircle className="w-3 h-3" />
              Xác thực
            </span>
          )}
        </div>

        {/* Tên cơ sở */}
        <h3 className="font-display font-black text-lg md:text-xl text-neutral-800 tracking-tight leading-snug">
          {item.name}
        </h3>

        {/* Minimal details list */}
        <div className="space-y-2.5 pt-3 text-[13px] text-neutral-600 font-sans border-t border-neutral-100">
          {/* Địa chỉ */}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#33628B]/70 shrink-0 mt-0.5" />
            <span className="leading-relaxed text-neutral-600 font-medium">{item.address}</span>
          </div>

          {/* Điện thoại */}
          {item.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#33628B]/70 shrink-0" />
              <a 
                href={`tel:${item.phone}`} 
                className="font-mono font-bold text-neutral-700 hover:text-[#33628B] hover:underline transition-all"
              >
                {item.phone}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="pt-4 mt-5 border-t border-neutral-100">
        {/* Tags chuyên môn */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 4).map((tag, idx) => (
            <span 
              key={idx}
              className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 text-center">
          {item.phone ? (
            <a 
              href={`tel:${item.phone}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#33628B] hover:bg-[#284f72] text-white font-sans font-black text-xs rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Gọi ngay
            </a>
          ) : (
            <div className="bg-neutral-100 text-neutral-400 font-sans font-black text-xs px-3 py-2.5 rounded-xl cursor-not-allowed">
              Không có SĐT
            </div>
          )}
          
          {item.website ? (
            <a 
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-white text-neutral-700 hover:text-[#33628B] hover:bg-[#33628B]/5 border border-neutral-200 hover:border-[#33628B]/30 font-sans font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Xem website
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          ) : (
            <div className="bg-neutral-50 text-neutral-400 font-sans font-black text-xs px-2.5 py-2.5 border border-dashed border-neutral-200 rounded-xl cursor-not-allowed">
              Không có Web
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
