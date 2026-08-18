import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle, FileText, ShieldAlert, History, Calendar, Mic, Sparkles, Shirt, BedDouble, ArrowDown } from 'lucide-react';

interface TermsAndConditionsProps {
  onProceedToRegister: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onProceedToRegister }) => {
  const [checkedTerms, setCheckedTerms] = React.useState<Record<number, boolean>>({});

  const termsList = [
    {
      id: 1,
      title: 'ألا يكون المتقدم خطيباً حالياً',
      explanation: 'الدورة مخصصة لتأهيل وإعداد الكوادر الجديدة التي لم تمارس الخطابة المنبرية الرسمية بعد.',
      icon: ShieldAlert,
      badge: 'شرط أساسي',
      highlight: true
    },
    {
      id: 2,
      title: 'ألا يكون قد شارك في الدورات السابقة',
      explanation: 'حرصاً على إتاحة الفرصة لأكبر عدد من الراغبين وتجنب تكرار المقاعد لمن استفاد مسبقاً.',
      icon: History,
      badge: 'إتاحة الفرص',
      highlight: true
    },
    {
      id: 3,
      title: 'ألا يقل عمر المتقدم عن 18 عاماً',
      explanation: 'يشترط بلوغ السن القانونية والتكليفية لضمان النضج العلمي والدعوي والاستعداد المنبري.',
      icon: Calendar,
      badge: 'السن الأدنى',
      highlight: false
    },
    {
      id: 4,
      title: 'سلامة النطق والفصاحة التامة',
      explanation: 'سلامة مخارج الحروف والقدرة على النطق السليم والبيان العربي الفصيح الخالي من العيوب المانعة.',
      icon: Mic,
      badge: 'الأهلية اللسانية',
      highlight: false
    },
    {
      id: 5,
      title: 'حسن السيرة والسلوك والاستقامة',
      explanation: 'أن يكون المتقدم مشهوداً له بالاستقامة والالتزام بالأخلاق والسمت الإسلامي القويم.',
      icon: Sparkles,
      badge: 'السمت والقدوة',
      highlight: false
    },
    {
      id: 6,
      title: 'حسن المظهر وفق الآداب الشرعية',
      explanation: 'الاعتناء بالهيئة والمظهر اللائق بالخطيب وطالب العلم وفق الضوابط والآداب الشرعية المرعية.',
      icon: Shirt,
      badge: 'الهيئة والوقار',
      highlight: false
    },
    {
      id: 7,
      title: 'الالتزام الكامل بالدروس والمبيت بالسكن',
      explanation: 'المواظبة التامة على البرنامج التدريبي والورش التطبيقية، والانضباط الكامل بنظام الإقامة الداخلية لمن طلب السكن.',
      icon: BedDouble,
      badge: 'انضباط والتزام',
      highlight: true
    },
    {
      id: 8,
      title: 'تعبئة الاستمارة والالتزام بمواعيد القبول',
      explanation: 'إتمام التسجيل خلال فترة القبول المحددة (5 - 12 يوليو 2026م) وطباعة بطاقة المراجعة المحتوية على الرقم المتسلسل والباركود.',
      icon: FileText,
      badge: 'إجراء إداري',
      highlight: true
    }
  ];

  const handleToggleTerm = (id: number) => {
    setCheckedTerms((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allChecked = termsList.every((t) => checkedTerms[t.id]);
  const checkedCount = Object.values(checkedTerms).filter(Boolean).length;

  return (
    <section id="terms-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Bento Container for Terms */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#08192E]/5 rounded-br-full pointer-events-none"></div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0284C7] text-xs font-bold border border-sky-200">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>ضوابط واعتماد القبول</span>
          </div>

          <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#08192E] tracking-wide">
            شروط وضوابط القبول في برنامج (إعداد)
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-tajawal">
            يرجى قراءة الشروط والضوابط المعتمدة بعناية؛ حيث يُعد استيفاؤها شرطاً أساسياً لاعتماد طلب التسجيل ومنح رقم المراجعة الرسمي.
          </p>
        </div>

        {/* Highlighted Warning Alert */}
        <div className="max-w-4xl mx-auto mb-8 bg-[#08192E] border-2 border-[#C89B48]/50 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-[#DFB76C] flex items-center justify-center shrink-0 border border-[#C89B48]/30 shadow-xs">
            <AlertOctagon className="w-6 h-6 text-[#38BDF8]" />
          </div>
          <div className="space-y-1">
            <div className="font-cairo font-bold text-sm sm:text-base text-[#DFB76C]">
              تنبيه مهم لجميع المتقدمين لبرنامج إعداد:
            </div>
            <p className="text-xs sm:text-sm font-tajawal leading-relaxed text-slate-200">
              سيتم إجراء مقابلة واختبار مبدئي للتحقق من سلامة النطق والفصاحة ومطابقة الشروط المعتمدة. يرجى حفظ وطباعة بطاقة المراجعة المحتوية على الرقم المتسلسل لمراجعة لجنة القبول.
            </p>
          </div>
        </div>

        {/* Prominent Bento Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {termsList.map((term, index) => {
            const Icon = term.icon;
            const isChecked = !!checkedTerms[term.id];

            return (
              <div
                key={term.id}
                id={`term-item-${term.id}`}
                onClick={() => handleToggleTerm(term.id)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between select-none ${
                  isChecked
                    ? 'bg-[#08192E] text-white border-[#08192E] shadow-lg ring-2 ring-[#C89B48]/40'
                    : 'bg-slate-50 border-slate-200 hover:border-[#C89B48]/50 hover:bg-white text-slate-800'
                }`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center ${
                        isChecked ? 'bg-white/20 text-[#DFB76C]' : 'bg-slate-200 text-[#08192E]'
                      }`}>
                        {index + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isChecked ? 'bg-white/10 text-sky-300' : 'bg-white text-slate-700 border border-slate-200'
                      }`}>
                        {term.badge}
                      </span>
                    </div>

                    <div>
                      {isChecked ? (
                        <CheckCircle className="w-5 h-5 text-[#38BDF8]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-[#08192E] flex items-center justify-center"></div>
                      )}
                    </div>
                  </div>

                  {/* Term Title */}
                  <h3 className={`font-cairo text-sm sm:text-base font-bold mb-2 leading-snug flex items-center gap-2 border-r-4 ${
                    isChecked ? 'text-white border-[#DFB76C]' : 'text-[#08192E] border-[#C89B48]'
                  } pr-2`}>
                    <span>{term.title}</span>
                  </h3>

                  {/* Term Explanation */}
                  <p className={`text-xs font-tajawal leading-relaxed ${
                    isChecked ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {term.explanation}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t text-[11px] flex items-center justify-between ${
                  isChecked ? 'border-white/15 text-[#DFB76C]' : 'border-slate-200 text-slate-500'
                }`}>
                  <span>الضابط {term.id}</span>
                  <span>{isChecked ? '✓ مستوفٍ للشرط' : 'انقر للتأكيد'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Eligibility Test Box */}
        <div className="max-w-3xl mx-auto bg-[#08192E] border border-[#C89B48]/40 rounded-3xl p-6 text-center space-y-4 shadow-xl text-white">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            <h4 className="font-cairo text-base sm:text-lg font-bold text-white">
              مقياس التأكد من مطابقة شروط القبول
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-tajawal max-w-lg mx-auto">
            قمت بتأكيد ({checkedCount} من {termsList.length}) شروط. يمكنك الضغط على البطاقات أعلاه للتأكد من مطابقتك لكافة المتطلبات.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden max-w-md mx-auto border border-white/20">
            <div
              className={`h-full transition-all duration-300 ${
                allChecked ? 'bg-[#38BDF8]' : 'bg-gradient-to-r from-[#C89B48] to-[#DFB76C]'
              }`}
              style={{ width: `${(checkedCount / termsList.length) * 100}%` }}
            ></div>
          </div>

          {allChecked && (
            <div className="p-3 bg-white/10 border border-[#38BDF8]/40 rounded-2xl text-sky-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle className="w-5 h-5 text-[#38BDF8]" />
              <span>ممتاز! أنت مستوفٍ لكافة شروط القبول؛ تفضل بتعبئة الاستمارة والحصول على رقمك المتسلسل.</span>
            </div>
          )}

          <div className="pt-2">
            <button
              id="terms-proceed-to-form-btn"
              onClick={onProceedToRegister}
              className="px-7 py-3.5 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] hover:brightness-110 text-[#08192E] font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm sm:text-base border border-amber-300 ring-4 ring-amber-400/20"
            >
              <span>الانتقال إلى استمارة التسجيل الإلكترونية</span>
              <ArrowDown className="w-5 h-5 animate-bounce text-[#08192E]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

