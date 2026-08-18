import React from 'react';
import { BookOpen, MapPin, Calendar, ShieldCheck, Search, Award, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLookup,
  onOpenAdmin,
  onScrollToSection
}) => {
  return (
    <footer id="main-footer" className="bg-[#1a4d2e] text-white border-t-4 border-[#d4af37] font-tajawal no-print mt-12">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Identity & Quran verse */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#1a4d2e] flex items-center justify-center border border-[#d4af37] shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-amiri text-lg font-bold text-white">دورة إعداد وتأهيل الخطباء</div>
                <div className="text-xs text-[#d4af37] font-semibold">النسخة الخامسة 1448هـ / 2026م</div>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              برنامج نوعي مكثف تنظمه إدارة الشؤون الثقافية والدعوية لتأهيل فرسان المنابر وحفظة كتاب الله وفق المنهج الشرعي الوسطي.
            </p>

            <div className="p-3 bg-white/10 border border-white/20 rounded-2xl text-[#d4af37] text-xs font-amiri leading-relaxed">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </div>
          </div>

          {/* Col 2: Course Quick Info */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#d4af37] pb-1 border-b border-white/20 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>بيانات ومقر الانعقاد</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-white/90">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">تاريخ الدورة:</strong>
                  <div>24 أغسطس 2026م (11 ربيع الأول 1448هـ)</div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">المكان والمقر:</strong>
                  <div>مسجد حي دمشق - منطقة حي دمشق</div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">الجهة المنظمة:</strong>
                  <div>إدارة الشؤون الثقافية والدعوية</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#d4af37] pb-1 border-b border-white/20">
              روابط وتصفح سريع
            </h4>

            <ul className="space-y-2 text-xs text-white/85">
              <li>
                <button
                  onClick={() => onScrollToSection('about-section')}
                  className="hover:text-[#d4af37] transition"
                >
                  التعريف بالدورة والأهداف
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('terms-section')}
                  className="hover:text-[#d4af37] transition font-bold text-white"
                >
                  شروط وضوابط القبول
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('registration-form-section')}
                  className="hover:text-[#d4af37] transition font-semibold text-[#d4af37]"
                >
                  استمارة التسجيل الإلكتروني
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-[#d4af37] transition flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>استعلام وطباعة رقم المراجعة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#d4af37] transition flex items-center gap-1.5 text-white/80"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>لوحة تحكم المشرفين</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Notice */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#d4af37] pb-1 border-b border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>تنبيهات للمشاركين</span>
            </h4>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-xs space-y-2 text-white/90 backdrop-blur-xs">
              <p>
                يُشترط للحضور إحضار بطاقة المراجعة المطبوعة الحاملة للرقم المتسلسل مع نسخة ورقية من الاستبيان.
              </p>
              <p className="text-[#d4af37] font-semibold">
                يبدأ استقبال المشاركين صباح يوم الاثنين 24 أغسطس 2026م الساعة 08:00 صباحاً.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#133a22] border-t border-white/10 py-4 text-center text-xs text-white/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            دورة إعداد وتأهيل الخطباء 1448هـ / 2026م – تنظيم إدارة الشؤون الثقافية والدعوية
          </div>
          <div className="text-[11px] text-white/60">
            جميع الحقوق محفوظة © 2026م - 1448هـ
          </div>
        </div>
      </div>
    </footer>
  );
};
