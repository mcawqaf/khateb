import React from 'react';
import { BookOpen, MapPin, Calendar, ShieldCheck, Search, Award, Lock, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenLookup: () => void;
  onOpenAdmin?: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLookup,
  onScrollToSection
}) => {
  return (
    <footer id="main-footer" className="bg-[#061526] text-white border-t-4 border-[#C89B48] font-tajawal no-print mt-12">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Identity & Quran verse */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border-2 border-[#DFB76C] ring-2 ring-[#DFB76C]/30 shadow-lg shrink-0">
                <img 
                  src="./assets/program-logo.jpg" 
                  alt="شعار برنامج إعداد" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-amiri text-lg font-bold text-white">برنامج (إعداد) لتأهيل الخطباء</div>
                <div className="text-xs text-[#DFB76C] font-semibold">الدفعة الثالثة (3) - 1448هـ / 2026م</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              برنامج نوعي مكثف تنظمه إدارة الشؤون الثقافية والدعوية بالهيئة العامة للأوقاف والشؤون الإسلامية لتأهيل فرسان المنابر وحفظة كتاب الله.
            </p>

            <div className="p-3 bg-white/5 border border-white/15 rounded-2xl text-[#DFB76C] text-xs font-amiri leading-relaxed">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </div>
          </div>

          {/* Col 2: Program Quick Info */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#DFB76C] pb-1 border-b border-white/15 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#DFB76C]" />
              <span>بيانات وفترة القبول</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">فترة القبول:</strong>
                  <div>السبت 5 يوليو - السبت 12 يوليو 2026م</div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DFB76C] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">الجهة المنظمة:</strong>
                  <div>الهيئة العامة للأوقاف والشؤون الإسلامية</div>
                  <div className="text-sky-300 text-[11px]">إدارة الشؤون الثقافية والدعوية</div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">حسابات التواصل:</strong>
                  <div>@AwqafLibya | @AwqafofLibya</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#DFB76C] pb-1 border-b border-white/15">
              روابط وتصفح سريع
            </h4>

            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onScrollToSection('about-section')}
                  className="hover:text-[#38BDF8] transition"
                >
                  عن البرنامج والأهداف
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('terms-section')}
                  className="hover:text-[#38BDF8] transition font-bold text-white"
                >
                  شروط وضوابط القبول
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('registration-form-section')}
                  className="hover:text-[#38BDF8] transition font-semibold text-[#DFB76C]"
                >
                  استمارة التسجيل الإلكتروني
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-[#38BDF8] transition flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>استعلام وطباعة رقم المراجعة</span>
                </button>
              </li>
              <li>
                <a
                  href="#admin"
                  className="hover:text-[#38BDF8] transition flex items-center gap-1.5 text-slate-400 text-xs"
                  title="بوابة دخول المشرفين ولجنة القبول"
                >
                  <Lock className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>بوابة المشرفين المصرح لهم</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Notice */}
          <div className="space-y-3">
            <h4 className="font-cairo text-sm font-bold text-[#DFB76C] pb-1 border-b border-white/15 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>تنبيهات للمتقدمين</span>
            </h4>

            <div className="bg-white/5 border border-white/15 p-3.5 rounded-2xl text-xs space-y-2 text-slate-200 backdrop-blur-xs">
              <p>
                يُشترط عند المقابلة إبراز بطاقة المراجعة الإلكترونية المحتوية على الرقم المتسلسل والباركود.
              </p>
              <p className="text-[#DFB76C] font-semibold">
                فترة التسجيل محددة من 5 إلى 12 يوليو 2026م (1448هـ).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#030B14] border-t border-white/10 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            برنامج (إعداد) لتأهيل الخطباء 1448هـ / 2026م – الهيئة العامة للأوقاف والشؤون الإسلامية
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            جميع الحقوق محفوظة © 2026م - 1448هـ
          </div>
        </div>
      </div>
    </footer>
  );
};
