import React from 'react';
import { Target, CheckCircle2, BookMarked, Sparkles, MapPin, Calendar, Building, GraduationCap, Mic, HeartHandshake } from 'lucide-react';

export const AboutAndGoals: React.FC = () => {
  const goals = [
    {
      id: 'goal-1',
      title: 'رفع الكفاءة العلمية والمهارية',
      desc: 'الارتقاء بمستوى الخطباء في العلوم الشرعية وفنون الخطابة والإلقاء وحسن البيان والتمكن من نبرات الصوت ولغة الجسد المنبرية.',
      icon: Mic,
      tag: 'مهارات إلقاء وبيان'
    },
    {
      id: 'goal-2',
      title: 'ترسيخ المنهج الشرعي الوسطي',
      desc: 'ترسيخ المنهج الشرعي القائم على الوسطية والاعتدال وسماحة الإسلام بعيداً عن الغلو والتفريط ووفق الكتاب والسنة.',
      icon: BookMarked,
      tag: 'وسطية واعتدال'
    },
    {
      id: 'goal-3',
      title: 'سد حاجة المساجد والجوامع',
      desc: 'إعداد وتأهيل كوادر شابة مؤهلة علمياً ودعوياً لسد العجز والحاجة المتزايدة للخطباء في مختلف المناطق والجوامع.',
      icon: Building,
      tag: 'إمداد المنابر'
    },
    {
      id: 'goal-4',
      title: 'رعاية طلاب العلم وحفظة القرآن',
      desc: 'تشجيع الحفاظ وطلبة العلم على مواصلة طلب العلم وتوظيف طاقاتهم في خدمة الدين والمجتمع امتثالاً لقوله تعالى: ﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ﴾.',
      icon: GraduationCap,
      tag: 'رعاية الحفاظ'
    },
    {
      id: 'goal-5',
      title: 'معالجة قضايا المجتمع المعاصرة',
      desc: 'تأهيل الخطيب لملامسة واقع الناس وتقديم الحلول الإيمانية والتربوية لقضايا المجتمع بروح الحكمة والموعظة الحسنة.',
      icon: HeartHandshake,
      tag: 'وعي مجتمعي'
    }
  ];

  return (
    <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Bento Grid Header Tile */}
      <div className="grid grid-cols-12 gap-4 lg:gap-5 mb-5">
        
        {/* Intro Bento Card (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a4d2e]/5 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e4d9] text-[#1a4d2e] text-xs font-bold mb-3 border border-[#d4af37]/30">
              <Target className="w-4 h-4 text-[#1a4d2e]" />
              <span>الرسالة والأهداف الاستراتيجية</span>
            </div>

            <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#1a4d2e] leading-snug mb-3">
              رسالة سامية في البلاغ عن الله وتأهيل فرسان المنابر
            </h2>

            <p className="text-[#2d3436]/90 text-sm sm:text-base leading-relaxed font-tajawal">
              انطلاقًا من عِظَم شأن خطبة الجمعة وأثرها في إصلاح المجتمع ومكانة الخطيب في البلاغ عن الله تعالى، تُقام <strong className="text-[#1a4d2e] font-bold">دورة إعداد وتأهيل الخطباء – النسخة الخامسة لعام 1448هـ الموافق 2026م</strong> بتنظيم <strong className="text-[#1a4d2e] font-bold">إدارة الشؤون الثقافية والدعوية</strong> لإعداد خطباء مؤهلين علميًا ودعويًا ومهاريًا قادرين على حسن البيان والدعوة إلى الله بالحكمة والموعظة الحسنة ومعالجة قضايا المجتمع وفق الكتاب والسنة.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-[#1a4d2e]">
            <span className="font-amiri text-base font-bold text-[#1a4d2e]">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </span>
          </div>
        </div>

        {/* Quran Calligraphy Bento Card (Span 4) */}
        <div id="quran-quote-card" className="col-span-12 lg:col-span-4 bg-[#1a4d2e] text-white rounded-3xl p-6 sm:p-8 border-4 border-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#d4af37] flex items-center justify-center mb-4 border border-white/20">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="font-amiri text-2xl font-bold text-[#d4af37] mb-2 leading-relaxed">
              ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾
            </div>

            <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-tajawal">
              تكامل علمي ودعوي بين إدارة الشؤون الثقافية والدعوية وطلاب العلم لخدمة منابر بيوت الله تعالى وتقديم النموذج الأرقى.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-[#d4af37] font-mono mt-4 pt-3 border-t border-white/10">
            سورة المائدة - الآية 2
          </div>
        </div>
      </div>

      {/* Core Goals Bento 5-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-5">
        {goals.map((goal, idx) => {
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              id={`goal-card-${idx}`}
              className="bg-white rounded-3xl p-6 border border-[#d4af37]/30 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4f1ea] text-[#1a4d2e] flex items-center justify-center group-hover:bg-[#1a4d2e] group-hover:text-[#d4af37] transition-colors border border-[#d4af37]/30 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8e4d9] text-[#1a4d2e] border border-[#d4af37]/20">
                    {goal.tag}
                  </span>
                </div>

                <h3 className="font-cairo text-base font-bold text-[#1a4d2e] mb-2 border-r-4 border-[#d4af37] pr-2.5">
                  {goal.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-tajawal">
                  {goal.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-[#1a4d2e]">
                <CheckCircle2 className="w-4 h-4 ml-1.5 text-[#1a4d2e]" />
                <span>محور تدريبي أساسي</span>
              </div>
            </div>
          );
        })}

        {/* Location & Logistics Bento Tile (Span 1 on lg) */}
        <div id="details-section" className="bg-[#e8e4d9] rounded-3xl p-6 border border-[#d4af37]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-block text-[10px] font-bold text-[#1a4d2e] bg-white px-2.5 py-1 rounded-full mb-3 border border-[#d4af37]/30">
              المقر والمواعيد
            </div>

            <h3 className="font-cairo text-base font-bold text-[#1a4d2e] mb-3">
              مسجد حي دمشق – 24 أغسطس 2026م
            </h3>

            <div className="space-y-2.5 text-xs text-[#2d3436]">
              <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-stone-200/60">
                <Calendar className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <div>
                  <strong>التاريخ:</strong> 11 ربيع الأول 1448هـ
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-stone-200/60">
                <MapPin className="w-4 h-4 text-[#1a4d2e] shrink-0" />
                <div>
                  <strong>المكان:</strong> مسجد حي دمشق - منطقة حي دمشق
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#1a4d2e]/80 mt-3 pt-2 border-t border-[#d4af37]/20 font-tajawal">
            * يبدأ الاستقبال في تمام الساعة الثامنة صباحاً.
          </p>
        </div>
      </div>
    </section>
  );
};

