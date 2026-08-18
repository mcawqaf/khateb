import React from 'react';
import { Calendar, MapPin, Sparkles, UserCheck, Search, ShieldAlert, Award, Compass, Home, Clock, CheckCircle2, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onTermsClick: () => void;
  onLookupClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onTermsClick,
  onLookupClick
}) => {
  return (
    <section id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Bento Grid Master Container */}
      <div className="grid grid-cols-12 gap-4 lg:gap-5">

        {/* 1. Main Headline Bento Tile (Col 12 / Lg 8) */}
        <div className="col-span-12 lg:col-span-8 bg-[#0B223D] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#C89B48]/40 shadow-xl flex flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle glowing radial background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C89B48]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-ping"></span>
              <p className="text-[#DFB76C] font-bold text-xs sm:text-sm tracking-wider uppercase">
                الهيئة العامة للأوقاف والشؤون الإسلامية | إدارة الشؤون الثقافية والدعوية
              </p>
            </div>

            {/* Prominent Circular Logo and Main Heading */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl border-3 border-[#DFB76C] ring-4 ring-[#DFB76C]/30 bg-[#08192E] flex items-center justify-center shrink-0">
                <img 
                  src="./assets/program-logo.jpg" 
                  alt="شعار برنامج إعداد لتأهيل الخطباء" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-amiri font-bold text-white leading-tight">
                  برنامج <span className="text-[#38BDF8] drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">(إعداد)</span> لتأهيل الخطباء
                </h1>
                <div className="text-xs sm:text-sm text-[#DFB76C] font-semibold mt-1 font-tajawal flex items-center gap-2">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">الدفعة الثالثة (3)</span>
                  <span>•</span>
                  <span className="font-mono">1448هـ / 2026م</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-tajawal mb-6 max-w-2xl">
              برنامج نوعي مكثف لتأهيل فرسان المنابر وحفظة كتاب الله وطلبة العلم وفق المنهج الشرعي الوسطي الأصيل، لإعداد خطباء متمكنين في حسن البيان ومعالجة قضايا المجتمع بالحكمة والموعظة الحسنة.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-gradient-to-r from-[#C89B48] to-[#DFB76C] text-[#08192E] px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                الدفعة الثالثة (3) - للعام 1448هـ / 2026م
              </span>
              <span className="text-[#DFB76C] font-amiri font-bold text-base bg-white/10 px-4 py-1 rounded-full border border-[#C89B48]/40">
                ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ ﴾
              </span>
            </div>
          </div>

          {/* Action CTAs inside Main Tile */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-5 border-t border-white/15">
            <button
              id="hero-register-cta"
              onClick={onRegisterClick}
              className="px-6 py-3.5 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] hover:brightness-110 text-[#08192E] font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border border-amber-300 ring-4 ring-amber-400/20"
            >
              <UserCheck className="w-5 h-5 text-[#08192E]" />
              <span>تعبئة استمارة التسجيل الآن</span>
            </button>

            <button
              id="hero-terms-cta"
              onClick={onTermsClick}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition border border-[#C89B48]/40 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
              <span>شروط وضوابط القبول</span>
            </button>

            <button
              id="hero-lookup-cta"
              onClick={onLookupClick}
              className="px-4 py-3.5 bg-white/5 hover:bg-white/15 text-slate-200 font-semibold text-xs sm:text-sm rounded-2xl border border-white/20 transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-[#DFB76C]" />
              <span>استعلام بالرقم المتسلسل</span>
            </button>
          </div>
        </div>

        {/* 2. Official Poster Preview Tile (Col 12 / Lg 4) */}
        <div className="col-span-12 lg:col-span-4 bg-[#08192E] rounded-3xl p-5 text-white flex flex-col justify-between border-2 border-[#C89B48]/40 shadow-xl relative overflow-hidden group">
          <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-4/3 sm:aspect-square flex items-center justify-center">
            <img 
              src="./assets/official-poster.jpg" 
              alt="الملصق الرسمي لبرنامج إعداد لتأهيل الخطباء"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08192E] via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center text-xs">
              <span className="bg-[#08192E]/90 text-[#DFB76C] px-3 py-1 rounded-lg border border-[#C89B48]/40 font-bold">
                الإعلان الرسمي المعتمد
              </span>
              <span className="text-[#38BDF8] font-bold">@AwqafLibya</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#DFB76C]" />
              <span>الدفعة الثالثة (3)</span>
            </span>
            <span className="bg-white/10 text-sky-300 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
              1448هـ / 2026م
            </span>
          </div>
        </div>

        {/* 3. Acceptance Dates Bento Tile (Col 12 / Sm 6 / Lg 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#0F2744] text-white rounded-3xl p-6 border border-[#C89B48]/30 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-cairo text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#DFB76C]" />
                <span>مواعيد وفترة القبول</span>
              </h3>
              <span className="text-[11px] bg-[#C89B48]/20 text-[#DFB76C] border border-[#C89B48]/30 px-2.5 py-0.5 rounded-full font-bold">
                محددة رسمياً
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 p-3.5 rounded-2xl border border-emerald-500/30">
                <p className="text-xs text-emerald-300 font-semibold mb-0.5">بداية القبول والتسجيل:</p>
                <p className="text-lg font-bold text-white">السبت 5 يوليو 2026 م</p>
              </div>

              <div className="bg-gradient-to-r from-rose-950/60 to-rose-900/30 p-3.5 rounded-2xl border border-rose-500/30">
                <p className="text-xs text-rose-300 font-semibold mb-0.5">نهاية القبول والتسجيل:</p>
                <p className="text-lg font-bold text-white">السبت 12 يوليو 2026 م</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-tajawal mt-3">
            يرجى تعبئة استمارة التسجيل الإلكترونية قبل انتهاء الموعد المحدد.
          </p>
        </div>

        {/* 4. Core Features Bento Tile (Col 12 / Sm 6 / Lg 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-cairo text-base font-bold text-[#08192E] mb-3 border-r-4 border-[#C89B48] pr-3 flex items-center justify-between">
              <span>مميزات البرنامج العلمي</span>
              <Sparkles className="w-4 h-4 text-[#C89B48]" />
            </h3>
            
            <ul className="space-y-2.5 text-xs text-slate-700 font-tajawal">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>تدريب تطبيقي على الإلقاء ولغة الجسد المنبرية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>إشراف نخبة من كبار المشايخ والعلماء والأساتذة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>منهج وسطي أصيل وفق الكتاب والسنة النبوية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>شهادة معتمدة ورقم قيد خطابي رسمي للمجتازين</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#08192E] font-bold">
            <span>سكن داخلي متاح للمغتربين</span>
            <Home className="w-4 h-4 text-[#C89B48]" />
          </div>
        </div>

        {/* 5. Instant Serial Review Number Notice (Col 12 / Lg 4) */}
        <div className="col-span-12 lg:col-span-4 bg-[#08192E] text-white rounded-3xl p-6 border border-[#C89B48]/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#C89B48]/10 rounded-br-full pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-cairo text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                <span>بطاقة المراجعة الإلكترونية</span>
              </h3>
              <span className="font-mono text-xs bg-[#C89B48]/20 text-[#DFB76C] px-2.5 py-0.5 rounded-full border border-[#C89B48]/40 font-bold">
                KHT-1448-XXX
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-tajawal mb-4">
              فور إرسال النموذج، يحصل المتقدم على بطاقة مراجعة رسمية بباركود مخصص جاهزة للطباعة فوراً لمراجعة إدارة الشؤون الثقافية والدعوية.
            </p>
          </div>

          <button
            onClick={onLookupClick}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-[#DFB76C] font-bold text-xs rounded-xl border border-[#C89B48]/40 flex items-center justify-center gap-2 transition"
          >
            <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>استعلام وطباعة استمارة سابقة</span>
          </button>
        </div>

        {/* 6. Bento Bottom Master Ribbon (Col 12) */}
        <div className="col-span-12 bg-gradient-to-r from-[#061526] via-[#0A1C30] to-[#061526] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between text-white text-xs gap-4 shadow-lg border border-[#C89B48]/30">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
              <strong className="text-white">الجهة المنظمة:</strong> الهيئة العامة للأوقاف والشؤون الإسلامية
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DFB76C]"></span>
              <strong className="text-white">الإدارة:</strong> إدارة الشؤون الثقافية والدعوية
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
              <strong className="text-white">التواصل:</strong> @AwqafLibya | @AwqafofLibya
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/15">
            <span className="font-bold text-[#DFB76C]">رقم المراجعة:</span>
            <span className="tracking-widest font-mono text-xs bg-white text-[#08192E] px-2.5 py-0.5 rounded-lg font-black">
              KHT-1448-XXXX
            </span>
            <button 
              onClick={onLookupClick}
              className="underline text-sky-300 hover:text-white font-semibold"
            >
              طباعة البطاقة
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

