import React from 'react';
import { Calendar, MapPin, Sparkles, UserPlus, Search, ShieldAlert, Award, Compass, Home, Clock, CheckCircle2, BookOpen } from 'lucide-react';

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
  // Course Date: 2026-08-24
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0 });

  React.useEffect(() => {
    const target = new Date('2026-08-24T08:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Bento Grid Master Container */}
      <div className="grid grid-cols-12 gap-4 lg:gap-5">

        {/* 1. Main Headline Bento Tile (Col 12 / Lg 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#d4af37]/30 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Abstract Islamic corner arc */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#1a4d2e]/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></span>
              <p className="text-[#1a4d2e] font-bold text-xs sm:text-sm tracking-wider uppercase">
                إدارة الشؤون الثقافية والدعوية
              </p>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-amiri font-bold text-[#1a4d2e] leading-tight mb-4">
              دورة إعداد وتأهيل الخطباء
            </h1>

            <p className="text-sm sm:text-base text-[#2d3436]/90 leading-relaxed font-tajawal mb-6 max-w-2xl">
              برنامج نوعي مكثف لتأهيل فرسان المنابر وحفظة كتاب الله وطلبة العلم وفق المنهج الشرعي الوسطي، لإعداد خطباء متمكنين في حسن البيان ومعالجة قضايا المجتمع بالحكمة والموعظة الحسنة.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-[#1a4d2e] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
                النسخة الخامسة - 1448هـ / 2026م
              </span>
              <span className="text-[#1a4d2e] font-amiri font-bold text-base bg-[#f4f1ea] px-3.5 py-1 rounded-full border border-[#d4af37]/30">
                ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ ﴾
              </span>
            </div>
          </div>

          {/* Action CTAs inside Main Tile */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100">
            <button
              id="hero-register-cta"
              onClick={onRegisterClick}
              className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#c49b2c] text-[#1a4d2e] font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 border-2 border-amber-300 ring-2 ring-amber-400/20"
            >
              <UserPlus className="w-5 h-5 text-[#1a4d2e]" />
              <span>تعبئة استمارة التسجيل الآن</span>
            </button>

            <button
              id="hero-terms-cta"
              onClick={onTermsClick}
              className="px-5 py-3.5 bg-[#e8e4d9] hover:bg-[#ded8cb] text-[#1a4d2e] font-bold text-sm rounded-2xl transition border border-[#d4af37]/30 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#1a4d2e]" />
              <span>شروط وضوابط القبول</span>
            </button>

            <button
              id="hero-lookup-cta"
              onClick={onLookupClick}
              className="px-4 py-3.5 bg-white hover:bg-[#f4f1ea] text-[#2d3436] font-semibold text-xs sm:text-sm rounded-2xl border border-stone-200 transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-[#1a4d2e]" />
              <span>استعلام بالرقم المتسلسل</span>
            </button>
          </div>
        </div>

        {/* 2. Key Venue & Date Bento Tile (Col 12 / Lg 4) */}
        <div className="col-span-12 lg:col-span-4 bg-[#1a4d2e] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between border-4 border-white shadow-xl relative overflow-hidden">
          {/* Subtle Islamic pattern */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-25 pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-bold">موعد الانعقاد والمقر</span>
              <span className="p-2 bg-white/10 rounded-xl text-[#d4af37]">
                <Calendar className="w-5 h-5" />
              </span>
            </div>

            <div>
              <p className="text-xs text-white/70 mb-1">تاريخ انطلاق الدورة</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-white">24 أغسطس 2026م</p>
              <p className="text-sm text-[#d4af37] font-medium mt-1">11 ربيع الأول 1448هـ</p>
            </div>

            <div className="pt-4 border-t border-white/20">
              <p className="text-xs text-white/70 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>المقر المعتمد</span>
              </p>
              <p className="text-xl font-bold text-white">مسجد حي دمشق</p>
              <p className="text-xs text-white/80">منطقة حي دمشق</p>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-white/90">
              <Home className="w-4 h-4 text-[#d4af37]" />
              <span>إقامة وسكن للوافدين</span>
            </span>
            <span className="bg-[#d4af37] text-[#1a4d2e] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
              متاح بالتزام المبيت
            </span>
          </div>
        </div>

        {/* 3. Live Countdown Bento Tile (Col 12 / Sm 6 / Lg 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#e8e4d9] rounded-3xl p-6 border border-[#d4af37]/30 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cairo text-sm font-bold text-[#1a4d2e] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1a4d2e]" />
                <span>العد التنازلي للافتتاح</span>
              </h3>
              <span className="text-[10px] bg-white/70 text-[#1a4d2e] px-2 py-0.5 rounded-full font-bold">
                24 أغسطس
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center my-3">
              <div className="bg-white p-3 rounded-2xl border border-[#d4af37]/20 shadow-xs">
                <div className="text-2xl font-bold font-mono text-[#1a4d2e]">{timeLeft.days}</div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">يوم</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#d4af37]/20 shadow-xs">
                <div className="text-2xl font-bold font-mono text-[#1a4d2e]">{timeLeft.hours}</div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">ساعة</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#d4af37]/20 shadow-xs">
                <div className="text-2xl font-bold font-mono text-[#1a4d2e]">{timeLeft.minutes}</div>
                <div className="text-[10px] text-gray-500 font-semibold mt-0.5">دقيقة</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#2d3436]/70 leading-relaxed font-tajawal mt-2">
            يبدأ استقبال المشاركين صباح يوم الاثنين الساعة 08:00 صباحاً بمسجد حي دمشق.
          </p>
        </div>

        {/* 4. Core Features Bento Tile (Col 12 / Sm 6 / Lg 4) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-cairo text-base font-bold text-[#1a4d2e] mb-3 border-r-4 border-[#d4af37] pr-3">
              مميزات البرنامج العلمي
            </h3>
            
            <ul className="space-y-2.5 text-xs text-[#2d3436] font-tajawal">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <span>تدريب تطبيقي على الإلقاء ولغة الجسد المنبرية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <span>إشراف نخبة من كبار المشايخ والعلماء والأساتذة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <span>منهج وسطي أصيل وفق الكتاب والسنة النبوية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <span>شهادة معتمدة ورقم قيد خطابي للمجتازين</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#1a4d2e] font-semibold">
            <span>إجمالي الساعات: 48 ساعة تدريبية</span>
            <Award className="w-4 h-4 text-[#d4af37]" />
          </div>
        </div>

        {/* 5. Instant Serial Review Number Notice (Col 12 / Lg 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 border border-[#d4af37]/40 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#d4af37]/10 rounded-br-full pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-cairo text-base font-bold text-[#1a4d2e] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
                <span>بطاقة المراجعة الفورية</span>
              </h3>
              <span className="font-mono text-xs bg-[#f4f1ea] text-[#1a4d2e] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 font-bold">
                KHT-1448-XXX
              </span>
            </div>

            <p className="text-xs text-[#2d3436]/80 leading-relaxed font-tajawal mb-4">
              فور إرسال النموذج، يحصل المتقدم على بطاقة مراجعة رسمية جاهزة للطباعة فوراً ليقدمها للجنة الاستقبال والمقابلة يوم 24 أغسطس 2026م.
            </p>
          </div>

          <button
            onClick={onLookupClick}
            className="w-full py-2.5 bg-[#f4f1ea] hover:bg-[#e8e4d9] text-[#1a4d2e] font-bold text-xs rounded-xl border border-[#d4af37]/40 flex items-center justify-center gap-2 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>استعلام وطباعة استمارة سابقة</span>
          </button>
        </div>

        {/* 6. Bento Bottom Master Ribbon (Col 12) */}
        <div className="col-span-12 bg-[#1a4d2e] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between text-white text-xs gap-4 shadow-md border border-[#d4af37]/30">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-white/90">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              <strong>المدة التدريبية:</strong> 48 ساعة مكثفة
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              <strong>الهدف:</strong> تأهيل كوادر شرعية منبرية متميزة
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              <strong>الجهة:</strong> إدارة الشؤون الثقافية والدعوية
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            <span className="font-bold text-[#d4af37]">رقم مراجعة الطلب:</span>
            <span className="tracking-widest font-mono text-xs bg-white text-[#1a4d2e] px-2.5 py-0.5 rounded-lg font-bold">
              KHT-1448-XXXX
            </span>
            <button 
              onClick={onLookupClick}
              className="underline text-white/80 hover:text-white font-medium"
            >
              طباعة التذكرة
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

