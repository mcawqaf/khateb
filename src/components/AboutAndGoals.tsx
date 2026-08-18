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
        <div className="col-span-12 lg:col-span-8 bg-[#0B223D] text-white rounded-3xl p-6 sm:p-8 border border-[#C89B48]/40 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#38BDF8] text-xs font-bold mb-3 border border-[#C89B48]/40">
              <Target className="w-4 h-4 text-[#DFB76C]" />
              <span>الرسالة والأهداف الاستراتيجية</span>
            </div>

            <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-white leading-snug mb-3">
              رسالة سامية في البلاغ عن الله وتأهيل فرسان المنابر
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-tajawal">
              انطلاقًا من عِظَم شأن خطبة الجمعة وأثرها في إصلاح المجتمع ومكانة الخطيب في البلاغ عن الله تعالى، تُطلق <strong className="text-[#DFB76C] font-bold">الهيئة العامة للأوقاف والشؤون الإسلامية</strong> عبر <strong className="text-[#38BDF8] font-bold">إدارة الشؤون الثقافية والدعوية</strong>، <strong className="text-white font-bold">برنامج (إعداد) لتأهيل الخطباء – الدفعة الثالثة (3) لعام 1447هـ / 2025م</strong> بهدف صقل الكفاءات العلمية والدعوية ومهارات الخطابة والإلقاء بما يعزز الخطاب الديني الوسطي الرصين.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/15 flex items-center gap-2 text-xs font-bold text-[#DFB76C]">
            <span className="font-amiri text-lg font-bold text-[#DFB76C]">
              ﴿ ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ﴾
            </span>
          </div>
        </div>

        {/* Quran Calligraphy Bento Card (Span 4) */}
        <div id="quran-quote-card" className="col-span-12 lg:col-span-4 bg-gradient-to-br from-[#08192E] to-[#102A4C] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#C89B48]/50 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/10 text-[#DFB76C] flex items-center justify-center mb-4 border border-[#C89B48]/30 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#DFB76C]" />
            </div>

            <div className="font-amiri text-2xl font-bold text-[#DFB76C] mb-2 leading-relaxed">
              ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ﴾
            </div>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-tajawal">
              تكامل علمي ودعوي وثقافي بين الهيئة العامة للأوقاف والشؤون الإسلامية وطلاب العلم لرعاية منابر بيوت الله والارتقاء بالأداء الخطابي.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-[#38BDF8] font-mono mt-4 pt-3 border-t border-white/15 flex justify-between items-center">
            <span>سورة المائدة - الآية 2</span>
            <span className="text-[#DFB76C]">إدارة الشؤون الثقافية والدعوية</span>
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
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#C89B48]/60 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#08192E]/5 text-[#0B223D] flex items-center justify-center group-hover:bg-[#08192E] group-hover:text-[#DFB76C] transition-colors border border-slate-200 group-hover:border-[#C89B48]/50 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
                    {goal.tag}
                  </span>
                </div>

                <h3 className="font-cairo text-base font-bold text-[#08192E] mb-2 border-r-4 border-[#C89B48] pr-2.5">
                  {goal.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-tajawal">
                  {goal.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0B223D]">
                <CheckCircle2 className="w-4 h-4 ml-1.5 text-[#0284C7]" />
                <span>محور تدريبي أساسي</span>
              </div>
            </div>
          );
        })}

        {/* Location & Logistics Bento Tile (Span 1 on lg) */}
        <div id="details-section" className="bg-[#08192E] text-white rounded-3xl p-6 border border-[#C89B48]/40 shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-block text-[11px] font-bold text-[#08192E] bg-gradient-to-r from-[#C89B48] to-[#DFB76C] px-3 py-1 rounded-full mb-3 shadow-xs">
              مواعيد القبول المعتمدة
            </div>

            <h3 className="font-cairo text-base font-bold text-white mb-3">
              فترة التسجيل: 5 - 12 يوليو 2025م
            </h3>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                <Calendar className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <div>
                  <strong>بداية القبول:</strong> السبت 5 يوليو 2025 م
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2.5 rounded-xl border border-white/15">
                <Calendar className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <div>
                  <strong>نهاية القبول:</strong> السبت 12 يوليو 2025 م
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 mt-3 pt-2 border-t border-white/15 font-tajawal">
            * التسجيل متاح لكافة الراغبين المستوفين للشروط عبر هذا النموذج الإلكتروني.
          </p>
        </div>
      </div>
    </section>
  );
};

