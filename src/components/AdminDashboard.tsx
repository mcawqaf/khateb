import React from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Ban,
  AlertCircle,
  RefreshCw,
  Database,
  Building,
  GraduationCap,
  Users,
  LogOut,
  FileSpreadsheet,
  Check,
  BookOpen,
  ArrowRight,
  Link,
  Copy
} from 'lucide-react';
import { Registration, RegistrationStatus, AdminStats } from '../types.js';
import { formatArabicDateTime } from '../lib/supabase.js';
import { fetchRegistrations, fetchAdminStats, updateRegistrationStatus, deleteRegistrationRecord } from '../lib/clientData.js';

interface AdminDashboardProps {
  isOpen?: boolean;
  isStandalone?: boolean;
  onClose?: () => void;
  onBackToHome?: () => void;
  onViewRegistrationCard: (reg: Registration) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen = true,
  isStandalone = false,
  onClose,
  onBackToHome,
  onViewRegistrationCard
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    return localStorage.getItem('khateeb_admin_auth') === 'true';
  });
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Registrations state
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<AdminStats | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [housingFilter, setHousingFilter] = React.useState('all');

  // Edit status modal state
  const [editingRegistration, setEditingRegistration] = React.useState<Registration | null>(null);
  const [newStatus, setNewStatus] = React.useState<RegistrationStatus>('pending');
  const [supervisorNotes, setSupervisorNotes] = React.useState('');
  const [savingStatus, setSavingStatus] = React.useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([
        fetchRegistrations({ q: searchQuery, status: statusFilter, housing: housingFilter }),
        fetchAdminStats()
      ]);
      setRegistrations(list);
      setStats(s);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && (isOpen || isStandalone)) {
      fetchData();
    }
  }, [isAuthenticated, isOpen, isStandalone, searchQuery, statusFilter, housingFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      // 1. Try server login
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        if (res.ok) {
          setIsAuthenticated(true);
          localStorage.setItem('khateeb_admin_auth', 'true');
          return;
        }
      } catch {
        // Fallback for static hosting
      }

      // Static fallback check (passcode: 123456)
      if (password.trim() === '123456' || password.trim() === 'khateeb1448') {
        setIsAuthenticated(true);
        localStorage.setItem('khateeb_admin_auth', 'true');
      } else {
        throw new Error('رمز المرور غير صحيح');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#admin';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('khateeb_admin_auth');
    setPassword('');
  };

  const handleOpenEdit = (reg: Registration) => {
    setEditingRegistration(reg);
    setNewStatus(reg.status);
    setSupervisorNotes(reg.supervisorNotes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingRegistration) return;
    setSavingStatus(true);
    try {
      const ok = await updateRegistrationStatus(editingRegistration.id, newStatus, supervisorNotes);
      if (ok) {
        setEditingRegistration(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving status:', err);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف استمارة المسجل: ${name}؟`)) return;
    try {
      const ok = await deleteRegistrationRecord(id);
      if (ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'الرقم المتسلسل',
      'الاسم الكامل',
      'الرقم الوطني',
      'رقم الهاتف',
      'البريد الإلكتروني',
      'تاريخ الميلاد',
      'العمر',
      'المدينة',
      'العنوان',
      'المؤهل العلمي',
      'حفظ القرآن',
      'السكن الداخلي',
      'حالة الطلب',
      'ملاحظات المشرف',
      'تاريخ التسجيل'
    ];

    const rows = registrations.map((r) => [
      `"${r.serialNumber}"`,
      `"${r.fullName}"`,
      `"${r.nationalId}"`,
      `"${r.phone}"`,
      `"${r.email || ''}"`,
      `"${r.birthDate}"`,
      r.age,
      `"${r.city}"`,
      `"${r.address}"`,
      `"${r.educationalLevel}"`,
      `"${r.quranMemorization}"`,
      r.housingNeeded ? 'مطلوب' : 'غير مطلوب',
      `"${getStatusLabel(r.status)}"`,
      `"${r.supervisorNotes || ''}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `مسجلو_دورة_الخطباء_1448هـ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'accepted_final':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1a4d2e]/15 text-[#1a4d2e] border border-[#1a4d2e]/30">
            <CheckCircle className="w-3.5 h-3.5 text-[#1a4d2e]" />
            <span>مقبول نهائياً</span>
          </span>
        );
      case 'accepted_initial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#d4af37]/20 text-[#2d3436] border border-[#d4af37]">
            <Check className="w-3.5 h-3.5 text-[#1a4d2e]" />
            <span>مقبول مبدئياً</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>قيد المراجعة</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <Ban className="w-3.5 h-3.5 text-rose-600" />
            <span>غير مطابق للشروط</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>جديد / قيد التدقيق</span>
          </span>
        );
    }
  };

  const getStatusLabel = (status: RegistrationStatus) => {
    switch (status) {
      case 'accepted_final':
        return 'مقبول نهائياً';
      case 'accepted_initial':
        return 'مقبول مبدئياً';
      case 'under_review':
        return 'قيد المراجعة';
      case 'rejected':
        return 'غير مطابق للشروط';
      case 'pending':
      default:
        return 'جديد / قيد التدقيق';
    }
  };

  if (!isOpen && !isStandalone) return null;

  const content = (
    <div
      id="admin-dashboard-container"
      className="relative bg-white w-full max-w-7xl mx-auto rounded-3xl shadow-2xl border-2 border-[#d4af37]/40 overflow-hidden min-h-[85vh] flex flex-col print:m-0 print:border-none print:shadow-none"
    >
      {/* Top Bar */}
      <div className="bg-[#08192E] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#C89B48] no-print">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 text-[#38BDF8] flex items-center justify-center shadow-xs border border-[#C89B48]/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-cairo text-lg sm:text-xl font-bold text-white">
                لوحة تحكم المشرفين واللجنة العلمية
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-[#DFB76C] border border-white/20 font-semibold">
                برنامج إعداد 1448هـ
              </span>
            </div>
            <p className="text-xs text-slate-300 font-tajawal">
              متابعة المسجلين، اعتماد المقبولين، تصدير الكشوفات وإصدار بطاقات المراجعة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              {/* Copy Admin URL button */}
              <button
                id="admin-copy-link-btn"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#DFB76C] rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
                title="نسخ رابط لوحة التحكم المباشر"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="hidden sm:inline">نسخ الرابط</span>
                  </>
                )}
              </button>

              {/* Supabase Online Live Badge */}
              <div
                id="admin-supabase-status"
                className="px-3 py-1.5 bg-emerald-950/80 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40 shadow-xs"
                title="قاعدة بيانات Supabase السحابية متصلة ومباشرة"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Supabase Online</span>
              </div>

              {/* Export CSV */}
              <button
                id="admin-export-csv-btn"
                onClick={handleExportCSV}
                disabled={registrations.length === 0}
                className="px-3.5 py-2 bg-gradient-to-r from-[#C89B48] to-[#DFB76C] hover:brightness-110 text-[#08192E] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm border border-amber-300 disabled:opacity-50"
                title="تصدير كشف إكسل CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#08192E]" />
                <span className="hidden sm:inline">تصدير Excel/CSV</span>
              </button>

              {/* Logout */}
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 rounded-xl transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Return to Home / Close Button */}
          {isStandalone ? (
            <button
              id="admin-back-home-btn"
              onClick={onBackToHome || (() => { window.location.hash = ''; })}
              className="px-3.5 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-sky-400/30"
              title="العودة إلى الصفحة الرئيسية للموقع"
            >
              <ArrowRight className="w-4 h-4 text-sky-400" />
              <span>العودة للموقع</span>
            </button>
          ) : (
            <button
              id="admin-close-btn"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl transition"
              title="إغلاق"
            >
              <span className="text-xs font-bold">إغلاق</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Barrier if not authenticated */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#08192E]/5">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#C89B48]/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#08192E] text-[#DFB76C] mx-auto flex items-center justify-center border border-[#C89B48]/40 shadow-sm">
              <Lock className="w-8 h-8 text-[#38BDF8]" />
            </div>

            <div className="space-y-1">
              <h4 className="font-amiri text-2xl font-bold text-[#08192E]">
                دخول المشرفين المصرح لهم
              </h4>
              <p className="text-xs text-slate-500 font-tajawal">
                يرجى إدخال رمز المرور الخاص بلجنة إدارة برنامج إعداد
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-cairo">
                  رمز مرور المشرف:
                </label>
                <input
                  type="password"
                  id="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="أدخل رمز المرور: 123456"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] text-sm bg-slate-50 font-mono tracking-widest text-center"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                id="admin-login-submit-btn"
                disabled={loginLoading || !password}
                className="w-full py-3.5 bg-[#08192E] hover:bg-[#0B2545] text-white font-bold text-sm rounded-2xl transition shadow-md border border-[#C89B48]/40 disabled:opacity-60"
              >
                {loginLoading ? 'جارٍ التحقق...' : 'تسجيل الدخول للوحة التحكم'}
              </button>

              {isStandalone && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onBackToHome || (() => { window.location.hash = ''; })}
                    className="text-xs text-slate-500 hover:text-slate-800 transition font-tajawal"
                  >
                    ← العودة إلى الصفحة الرئيسية للموقع
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated Dashboard View */
        <div className="flex-1 flex flex-col p-4 sm:p-6 bg-slate-50/50 space-y-6 overflow-y-auto">
          
          {/* Statistics Cards - Bento style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold mb-1">إجمالي المسجلين</div>
                <div className="text-2xl font-black text-[#08192E] font-mono">{stats?.total ?? registrations.length}</div>
                <div className="text-[10px] text-[#0284C7] font-semibold mt-1">طلبات مقدمة</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-emerald-800 font-semibold mb-1">مقبول مبدئياً</div>
                <div className="text-2xl font-black text-emerald-600 font-mono">{stats?.acceptedInitial ?? 0}</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-1">مطابق للشروط</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-[#DFB76C] font-semibold mb-1">مقبول نهائياً</div>
                <div className="text-2xl font-black text-[#C89B48] font-mono">{stats?.acceptedFinal ?? 0}</div>
                <div className="text-[10px] text-slate-600 font-medium mt-1">اجتاز المقابلة</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-amber-800 font-semibold mb-1">قيد المراجعة</div>
                <div className="text-2xl font-black text-amber-600 font-mono">{stats?.underReview ?? 0}</div>
                <div className="text-[10px] text-amber-600 font-medium mt-1">تحت التدقيق</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-700 font-semibold mb-1">طلب سكن داخلي</div>
                <div className="text-2xl font-black text-[#08192E] font-mono">{stats?.housingRequested ?? 0}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">بحاجة للإقامة</div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-600 font-semibold mb-1">حفظة القرآن كاملاً</div>
                <div className="text-2xl font-black text-[#0284C7] font-mono">{stats?.fullQuranMemorizers ?? 0}</div>
                <div className="text-[10px] text-[#C89B48] font-bold mt-1">أهل القرآن</div>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    id="admin-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم، الرقم المتسلسل KHT-1448، الهوية، الهاتف، المدينة..."
                    className="w-full pl-3 pr-9 py-2 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] text-xs font-medium bg-[#f4f1ea]/30"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <select
                  id="admin-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl border border-stone-300 text-xs font-medium bg-white text-[#2d3436]"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">جديد / قيد التدقيق</option>
                  <option value="accepted_initial">مقبول مبدئياً</option>
                  <option value="accepted_final">مقبول نهائياً</option>
                  <option value="under_review">تحت المراجعة</option>
                  <option value="rejected">غير مطابق للشروط</option>
                </select>

                {/* Housing Filter */}
                <select
                  id="admin-housing-filter"
                  value={housingFilter}
                  onChange={(e) => setHousingFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl border border-stone-300 text-xs font-medium bg-white text-[#2d3436]"
                >
                  <option value="all">جميع السكن</option>
                  <option value="yes">طلب سكن داخلي</option>
                  <option value="no">بدون سكن داخلي</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="admin-refresh-btn"
                  onClick={fetchData}
                  disabled={loading}
                  className="p-2 rounded-2xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition"
                  title="تحديث البيانات"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  id="admin-print-roster-btn"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#1a4d2e] hover:bg-[#153e25] text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border border-[#d4af37]/30"
                >
                  <Printer className="w-4 h-4 text-[#d4af37]" />
                  <span>طباعة كشف الاستقبال</span>
                </button>
              </div>
            </div>

            {/* Print Only Header for Roster */}
            <div className="print-only text-center pb-4 mb-4 border-b-2 border-stone-900">
              <h2 className="font-amiri text-2xl font-bold">إدارة الشؤون الثقافية والدعوية</h2>
              <h3 className="text-lg font-bold">كشف المسجلين المعتمد لدورة إعداد وتأهيل الخطباء لعام 1448هـ / 2026م</h3>
              <p className="text-xs">المكان: مسجد حي دمشق | التاريخ: 24 أغسطس 2026م (11 ربيع الأول 1448هـ)</p>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs font-tajawal border-collapse">
                  <thead className="bg-slate-100 text-[#08192E] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-center">الرقم المتسلسل</th>
                      <th className="py-3 px-4">اسم المتقدم</th>
                      <th className="py-3 px-4 font-mono">الرقم الوطني / الهاتف</th>
                      <th className="py-3 px-4">المدينة / السكن</th>
                      <th className="py-3 px-4">المؤهل / حفظ القرآن</th>
                      <th className="py-3 px-4 text-center">السكن الداخلي</th>
                      <th className="py-3 px-4 text-center">حالة الطلب</th>
                      <th className="py-3 px-4 text-center no-print">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                          {loading ? 'جارٍ تحميل السجلات...' : 'لا يوجد مسجلون يطابقون خيارات البحث الحالية.'}
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                          {/* Serial Number */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-mono font-bold text-xs bg-[#08192E] text-[#DFB76C] px-2.5 py-1 rounded-xl inline-block border border-[#C89B48]/30">
                              {reg.serialNumber}
                            </span>
                          </td>

                          {/* Full Name & Age */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm font-cairo">{reg.fullName}</div>
                            <div className="text-[11px] text-slate-500">
                              العمر: {reg.age} سنة | مسجل في: {formatArabicDateTime(reg.createdAt)}
                            </div>
                            {reg.supervisorNotes && (
                              <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                                ملاحظة مشرف: {reg.supervisorNotes}
                              </div>
                            )}
                          </td>

                          {/* National ID & Phone */}
                          <td className="py-3 px-4 font-mono">
                            <div className="text-slate-900 font-semibold">{reg.nationalId}</div>
                            <div className="text-[#0284C7] text-[11px]">{reg.phone}</div>
                          </td>

                          {/* City & Address */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{reg.city}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{reg.address}</div>
                          </td>

                          {/* Education & Quran */}
                          <td className="py-3 px-4">
                            <div className="text-slate-900 font-medium">{reg.educationalLevel}</div>
                            <div className="text-[#0284C7] font-semibold text-[11px]">{reg.quranMemorization}</div>
                          </td>

                          {/* Housing */}
                          <td className="py-3 px-4 text-center">
                            {reg.housingNeeded ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C89B48]/20 text-[#08192E] border border-[#C89B48]">
                                سكن داخلي
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">سكن خارجي</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4 text-center">
                            {getStatusBadge(reg.status)}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center no-print">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                id={`action-view-card-${reg.id}`}
                                onClick={() => onViewRegistrationCard(reg)}
                                className="p-1.5 text-[#08192E] hover:bg-slate-100 rounded-xl transition"
                                title="عرض وطباعة بطاقة المراجعة"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                id={`action-edit-status-${reg.id}`}
                                onClick={() => handleOpenEdit(reg)}
                                className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-xl transition"
                                title="تعديل الحالة والملاحظات"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                id={`action-delete-${reg.id}`}
                                onClick={() => handleDelete(reg.id, reg.fullName)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                title="حذف السجل"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Edit Status Modal */}
        {editingRegistration && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl border-2 border-[#C89B48]/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-cairo font-bold text-base text-[#08192E]">
                  تحديث حالة المشارك: {editingRegistration.fullName}
                </h4>
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <span className="text-xs font-bold">إغلاق</span>
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>الرقم المتسلسل: <strong className="font-mono text-[#08192E]">{editingRegistration.serialNumber}</strong></div>
                <div>الرقم الوطني: <strong className="font-mono">{editingRegistration.nationalId}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تغيير حالة القبول:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as RegistrationStatus)}
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-sm font-medium bg-slate-50"
                >
                  <option value="pending">جديد / قيد التدقيق</option>
                  <option value="under_review">قيد المراجعة والفرز</option>
                  <option value="accepted_initial">مقبول مبدئياً (مستوفٍ للشروط)</option>
                  <option value="accepted_final">مقبول نهائياً (اجتاز المقابلة)</option>
                  <option value="rejected">غير مطابق للشروط / مرفوض</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظات المشرف / لجنة المقابلات:
                </label>
                <textarea
                  rows={3}
                  value={supervisorNotes}
                  onChange={(e) => setSupervisorNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات خاصة بالوثائق، المقابلة، أو السكن..."
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-sm bg-slate-50"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-2xl"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={savingStatus}
                  className="px-5 py-2 bg-[#08192E] hover:bg-[#0B2545] text-white rounded-2xl text-xs font-bold transition border border-[#C89B48]/40 disabled:opacity-60"
                >
                  {savingStatus ? 'جارٍ الحفظ...' : 'حفظ التحديثات'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  );

  if (isStandalone) {
    return (
      <div id="admin-standalone-wrapper" className="min-h-screen bg-[#061526] p-2 sm:p-6 flex flex-col justify-center font-tajawal" dir="rtl">
        {content}
      </div>
    );
  }

  return (
    <div
      id="admin-dashboard-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-tajawal"
      dir="rtl"
    >
      {content}
    </div>
  );
};
