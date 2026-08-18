import React from 'react';
import confetti from 'canvas-confetti';
import { UserCheck, AlertCircle, CheckCircle2, Calendar, Phone, IdCard, MapPin, GraduationCap, BookOpen, BedDouble, FileText, Send, Sparkles } from 'lucide-react';
import { Registration } from '../types.js';

interface RegistrationFormProps {
  onSuccess: (registration: Registration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    birthDate: '',
    city: 'حي دمشق',
    address: '',
    educationalLevel: 'بكالوريوس دراسات إسلامية / شريعة',
    quranMemorization: 'حافظ للقرآن الكريم كاملاً',
    isCurrentlyKhateeb: 'no', // 'yes' or 'no'
    hasAttendedPreviousCourses: 'no', // 'yes' or 'no'
    fluencyAndSpeechClear: false,
    agreedToBehaviorAndAppearance: false,
    attendanceCommitment: false,
    housingNeeded: false,
    housingCommitment: false,
    notes: ''
  });

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [calculatedAge, setCalculatedAge] = React.useState<number | null>(null);

  // Age calculation
  React.useEffect(() => {
    if (formData.birthDate) {
      const bDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - bDate.getFullYear();
      const m = today.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
      }
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.birthDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim() || !formData.nationalId.trim() || !formData.phone.trim() || !formData.birthDate || !formData.address.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول الأساسية المطلوبة.');
      return;
    }

    if (formData.isCurrentlyKhateeb === 'yes') {
      setErrorMsg('من شروط القبول ألا يكون المتقدم خطيباً حالياً.');
      return;
    }

    if (formData.hasAttendedPreviousCourses === 'yes') {
      setErrorMsg('من شروط القبول ألا يكون المتقدم قد شارك في دورات إعداد الخطيب السابقة.');
      return;
    }

    if (calculatedAge !== null && calculatedAge < 18) {
      setErrorMsg('يشترط ألا يقل عمر المتقدم عن 18 سنة.');
      return;
    }

    if (
      !formData.fluencyAndSpeechClear ||
      !formData.agreedToBehaviorAndAppearance ||
      !formData.attendanceCommitment
    ) {
      setErrorMsg('يجب الموافقة والتأكيد على جميع الإقرارات والشروط الشرعية والإدارية بالأسفل.');
      return;
    }

    if (formData.housingNeeded && !formData.housingCommitment) {
      setErrorMsg('يرجى الموافقة على شرط الالتزام بالمبيت للسكن الداخلي.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        city: formData.city,
        address: formData.address,
        educationalLevel: formData.educationalLevel,
        quranMemorization: formData.quranMemorization,
        isCurrentlyKhateeb: formData.isCurrentlyKhateeb === 'yes',
        hasAttendedPreviousCourses: formData.hasAttendedPreviousCourses === 'yes',
        fluencyAndSpeechClear: formData.fluencyAndSpeechClear,
        agreedToBehaviorAndAppearance: formData.agreedToBehaviorAndAppearance,
        attendanceCommitment: formData.attendanceCommitment,
        housingNeeded: formData.housingNeeded,
        housingCommitment: formData.housingCommitment,
        notes: formData.notes
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التسجيل');
      }

      // Fire confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'تعذر إرسال طلب التسجيل';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registration-form-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Bento Main Form Container */}
      <div className="bg-white rounded-3xl border border-[#d4af37]/30 shadow-sm overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-[#1a4d2e] text-white p-6 sm:p-8 relative overflow-hidden border-b-4 border-[#d4af37]">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 bg-islamic-pattern opacity-20 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d4af37] text-xs font-bold border border-white/20">
                <UserCheck className="w-4 h-4 text-[#d4af37]" />
                <span>استمارة التسجيل الرسمية 1448هـ</span>
              </div>
              <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-white">
                طلب الالتحاق بدورة إعداد وتأهيل الخطباء
              </h3>
              <p className="text-white/80 text-xs sm:text-sm font-tajawal">
                سيتم منحك رقماً متسلسلاً فورياً (بطاقة مراجعة رسمية) لاستخدامه في المقابلة والاستلام.
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl text-center shrink-0 backdrop-blur-xs">
              <div className="text-[11px] text-[#d4af37] font-semibold">تاريخ انطلاق الدورة</div>
              <div className="text-base font-bold text-white font-mono">24 / 08 / 2026م</div>
              <div className="text-[11px] text-white/80">11 ربيع الأول 1448هـ</div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Error Notification */}
          {errorMsg && (
            <div id="form-error-alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed font-cairo">
                {errorMsg}
              </div>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-[#1a4d2e] font-bold text-lg">
              <IdCard className="w-5 h-5 text-[#1a4d2e]" />
              <h4>البيانات الشخصية للمتقدم</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  الاسم الرباعي كاملاً <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="مثال: عبد الرحمن محمد عبد الله السنوسي"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
                />
              </div>

              {/* National ID */}
              <div>
                <label htmlFor="nationalId" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  الرقم الوطني / رقم الهوية <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  required
                  placeholder="أدخل الرقم الوطني المعتمد"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm font-mono bg-[#f4f1ea]/40"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  رقم الهاتف (الواتساب) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="09XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm font-mono bg-[#f4f1ea]/40"
                />
              </div>

              {/* Birth date & Age calculation */}
              <div>
                <label htmlFor="birthDate" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  تاريخ الميلاد <span className="text-rose-600">* (يشترط 18 عاماً فما فوق)</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
                />
                {calculatedAge !== null && (
                  <div className={`text-xs mt-1 font-semibold ${calculatedAge >= 18 ? 'text-[#1a4d2e]' : 'text-rose-600'}`}>
                    العمر المحسوب: {calculatedAge} سنة {calculatedAge < 18 ? '(غير مطابق لشرط السن الأدنى)' : '✓ (مستوفٍ لشرط السن)'}
                  </div>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  البريد الإلكتروني <span className="text-stone-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  المدينة / المنطقة <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="مثال: حي دمشق / طرابلس / مصراتة / الزاوية"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
                />
              </div>

              {/* Detailed Address */}
              <div>
                <label htmlFor="address" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  العنوان التفصيلي ومكان السكن <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="مثال: قرب مسجد التقوى، المحلة الأولى"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Educational & Quranic Background */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-[#1a4d2e] font-bold text-lg">
              <GraduationCap className="w-5 h-5 text-[#1a4d2e]" />
              <h4>المؤهل العلمي وحفظ القرآن الكريم</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="educationalLevel" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  المؤهل العلمي / الدراسي <span className="text-rose-600">*</span>
                </label>
                <select
                  id="educationalLevel"
                  name="educationalLevel"
                  value={formData.educationalLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-white"
                >
                  <option value="بكالوريوس دراسات إسلامية / شريعة">بكالوريوس دراسات إسلامية / شريعة</option>
                  <option value="طالب علم بمعهد العلوم الشرعية">طالب علم بمعهد العلوم الشرعية</option>
                  <option value="طالب جامعي (تخصصات أخرى)">طالب جامعي (تخصصات أخرى)</option>
                  <option value="بكالوريوس / ليسانس (تخصصات عامة)">بكالوريوس / ليسانس (تخصصات عامة)</option>
                  <option value="دراسات عليا (ماجستير / دكتوراه)">دراسات عليا (ماجستير / دكتوراه)</option>
                  <option value="ثانوية عامة / معهد متوسط">ثانوية عامة / معهد متوسط</option>
                </select>
              </div>

              <div>
                <label htmlFor="quranMemorization" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
                  مقدار حفظ القرآن الكريم <span className="text-rose-600">*</span>
                </label>
                <select
                  id="quranMemorization"
                  name="quranMemorization"
                  value={formData.quranMemorization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-white"
                >
                  <option value="حافظ للقرآن الكريم كاملاً">حافظ للقرآن الكريم كاملاً</option>
                  <option value="أكثر من 15 جزءاً">أكثر من 15 جزءاً</option>
                  <option value="أكثر من 5 أجزاء">أكثر من 5 أجزاء</option>
                  <option value="أقل من 5 أجزاء">أقل من 5 أجزاء</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Housing / Accommodation Option */}
          <div className="space-y-4 bg-[#e8e4d9]/50 border border-[#d4af37]/30 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[#1a4d2e] font-bold text-base">
              <BedDouble className="w-5 h-5 text-[#1a4d2e]" />
              <h4>خدمة السكن والإقامة الداخلية</h4>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="housingNeeded"
                  checked={formData.housingNeeded}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1a4d2e] rounded border-stone-400 focus:ring-[#1a4d2e]"
                />
                <span className="text-sm font-semibold text-[#2d3436]">
                  أرغب في الاستفادة من السكن الداخلي المخصص للمشاركين القادمين من مناطق بعيدة.
                </span>
              </label>

              {formData.housingNeeded && (
                <div className="pr-8 space-y-2 border-r-2 border-[#1a4d2e] pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[#2d3436] text-xs sm:text-sm font-semibold">
                    <input
                      type="checkbox"
                      name="housingCommitment"
                      checked={formData.housingCommitment}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#1a4d2e] rounded border-stone-400 focus:ring-[#1a4d2e]"
                    />
                    <span className="text-[#1a4d2e]">
                      ألتزم التزاماً كاملاً بالمبيت في السكن طيلة أيام الدورة والمحافظة على مرافق السكن ونظافته. <span className="text-rose-600">*</span>
                    </span>
                  </label>
                  <p className="text-xs text-stone-600 font-tajawal">
                    * ملاحظة: السكن مشروط بالالتزام التام بالمبيت اليومي وحضور صلاة الفجر والبرامج التدريبية المسائية.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Mandatory Conditions & Declarations */}
          <div className="space-y-4 bg-[#f4f1ea] border border-[#d4af37]/30 p-5 sm:p-6 rounded-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-200 text-[#1a4d2e] font-bold text-base">
              <FileText className="w-5 h-5 text-[#1a4d2e]" />
              <h4>الإقرارات وضوابط القبول الإلزامية</h4>
            </div>

            <div className="space-y-3.5 text-sm text-[#2d3436] font-tajawal">
              
              {/* Check: Not currently khateeb */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="font-semibold text-[#1a4d2e]">
                  1. هل أنت خطيب جمعة ممارس حالياً في أي مسجد؟ <span className="text-rose-600">*</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isCurrentlyKhateeb"
                      value="no"
                      checked={formData.isCurrentlyKhateeb === 'no'}
                      onChange={handleChange}
                      className="text-[#1a4d2e] focus:ring-[#1a4d2e]"
                    />
                    <span className="font-bold text-[#1a4d2e]">لا، لست خطيباً (مستوفٍ للشرط)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isCurrentlyKhateeb"
                      value="yes"
                      checked={formData.isCurrentlyKhateeb === 'yes'}
                      onChange={handleChange}
                      className="text-rose-600 focus:ring-rose-600"
                    />
                    <span className="text-rose-700 font-medium">نعم، أنا خطيب حالياً</span>
                  </label>
                </div>
                {formData.isCurrentlyKhateeb === 'yes' && (
                  <p className="text-xs text-rose-600 font-bold">
                    * تنبيه: يشترط في الدورة ألا يكون المتقدم خطيباً لإتاحة المجال للكوادر الجديدة.
                  </p>
                )}
              </div>

              {/* Check: Previous participation */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1.5 shadow-2xs">
                <div className="font-semibold text-[#1a4d2e]">
                  2. هل شاركت في أي دورة من دورات إعداد الخطيب السابقة؟ <span className="text-rose-600">*</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAttendedPreviousCourses"
                      value="no"
                      checked={formData.hasAttendedPreviousCourses === 'no'}
                      onChange={handleChange}
                      className="text-[#1a4d2e] focus:ring-[#1a4d2e]"
                    />
                    <span className="font-bold text-[#1a4d2e]">لا، لم أشارك سابقاً (مستوفٍ للشرط)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAttendedPreviousCourses"
                      value="yes"
                      checked={formData.hasAttendedPreviousCourses === 'yes'}
                      onChange={handleChange}
                      className="text-rose-600 focus:ring-rose-600"
                    />
                    <span className="text-rose-700 font-medium">نعم، شاركت سابقاً</span>
                  </label>
                </div>
                {formData.hasAttendedPreviousCourses === 'yes' && (
                  <p className="text-xs text-rose-600 font-bold">
                    * تنبيه: يُشترط عدم المشاركة المسبقة لإعطاء الأولوية للوجوه الجديدة.
                  </p>
                )}
              </div>

              {/* Affirmation Checkboxes */}
              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 cursor-pointer shadow-2xs">
                <input
                  type="checkbox"
                  name="fluencyAndSpeechClear"
                  checked={formData.fluencyAndSpeechClear}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1a4d2e] rounded border-stone-300 focus:ring-[#1a4d2e] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#1a4d2e]">3. الإقرار بسلامة النطق والفصاحة:</span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    أقر بأنني سليم النطق ومخارج الحروف وفصيح البيان وقادر على الأداء الخطابي دون عيوب كلامية مانعة.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 cursor-pointer shadow-2xs">
                <input
                  type="checkbox"
                  name="agreedToBehaviorAndAppearance"
                  checked={formData.agreedToBehaviorAndAppearance}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1a4d2e] rounded border-stone-300 focus:ring-[#1a4d2e] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#1a4d2e]">4. حسن السيرة والسلوك والمظهر اللائق:</span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    أقر بالالتزام بالأخلاق والسمت الإسلامي القويم، وحسن المظهر بما يتوافق مع الأحكام والآداب الشرعية المرعية.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 cursor-pointer shadow-2xs">
                <input
                  type="checkbox"
                  name="attendanceCommitment"
                  checked={formData.attendanceCommitment}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#1a4d2e] rounded border-stone-300 focus:ring-[#1a4d2e] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#1a4d2e]">5. الالتزام بالحضور وتعبئة الاستبيان:</span>
                  <p className="text-xs text-stone-600 mt-0.5">
                    ألتزم بحضور جميع الدروس والورش الميدانية، والالتزام بالمبيت لمن سجل بالسكن، وطباعة هذا الاستبيان وتقديم نسخة ورقية منه للجنة الاستقبال يوم 24 أغسطس 2026م.
                  </p>
                </div>
              </label>

            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-[#2d3436] mb-1">
              ملاحظات إضافية أو خبرات سابقة في طلب العلم <span className="text-stone-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="اذكر أي إجازات في القرآن الكريم أو متون علمية تم حفظها..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition text-stone-900 text-sm bg-[#f4f1ea]/40"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="submit-registration-btn"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#d4af37] hover:bg-[#c49b2c] text-[#1a4d2e] font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border-2 border-amber-300 ring-4 ring-amber-400/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-[#1a4d2e]">
                  <span className="w-5 h-5 border-2 border-[#1a4d2e] border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ معالجة وتوليد رقم المراجعة...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 text-[#1a4d2e]" />
                  <span>تأكيد التسجيل واستخراج بطاقة المراجعة المتسلسلة</span>
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-stone-500 mt-3 font-tajawal">
              بمجرد الضغط على تأكيد التسجيل، ستظهر لك بطاقة المراجعة الرسمية المحتوية على رقمك التسلسلي ورابط الطباعة الفورية.
            </p>
          </div>

        </form>

      </div>

    </section>
  );
};
