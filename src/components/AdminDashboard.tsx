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
import { adminUrl } from '../lib/adminRoute.js';
import { PROGRAM } from '../lib/programInfo.js';
import { signIn, signOut, getStaffIdentity } from '../lib/adminAuth.js';
import { fetchRegistrations, fetchAdminStats, updateRegistrationStatus, deleteRegistrationRecord, mergeRegistrations, fetchAllRegistrations } from '../lib/clientData.js';
import { findDuplicates, REASON_LABEL, STRENGTH_LABEL, type DuplicateGroup } from '../lib/duplicates.js';
import { downloadRoster } from '../lib/rosterWorkbook.js';

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
  // Authentication is a live Supabase session, not a local flag. Nothing the
  // browser can be told to remember grants access; every read and write is
  // re-authorised by the database against public.staff.
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [staffEmail, setStaffEmail] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
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
  const [actionError, setActionError] = React.useState<string | null>(null);

  // Duplicate review
  const [duplicates, setDuplicates] = React.useState<DuplicateGroup[]>([]);
  const [showDuplicates, setShowDuplicates] = React.useState(false);
  const [merging, setMerging] = React.useState<string | null>(null);

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
      setActionError(null);

      try {
        setDuplicates(findDuplicates(await fetchAllRegistrations()));
      } catch {
        // A duplicate scan failing must not blank the dashboard.
        setDuplicates([]);
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'تعذر تحميل بيانات المسجلين'
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && (isOpen || isStandalone)) {
      fetchData();
    }
  }, [isAuthenticated, isOpen, isStandalone, searchQuery, statusFilter, housingFilter]);

  // Restore an existing supervisor session on mount.
  React.useEffect(() => {
    let cancelled = false;
    getStaffIdentity()
      .then((identity) => {
        if (cancelled) return;
        setIsAuthenticated(Boolean(identity));
        setStaffEmail(identity?.email ?? null);
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const identity = await signIn(email, password);
      setStaffEmail(identity.email);
      setIsAuthenticated(true);
      setPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = adminUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStaffEmail(null);
    setPassword('');
    setRegistrations([]);
    setStats(null);
    void signOut();
  };

  const handleOpenEdit = (reg: Registration) => {
    setEditingRegistration(reg);
    setNewStatus(reg.status);
    setSupervisorNotes(reg.supervisorNotes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingRegistration) return;
    setSavingStatus(true);
    setActionError(null);
    try {
      const ok = await updateRegistrationStatus(editingRegistration.id, newStatus, supervisorNotes);
      if (ok) {
        setEditingRegistration(null);
        fetchData();
      } else {
        // Zero rows changed: the database refused the write.
        setActionError('لم يتم حفظ التعديل. الحساب الحالي غير مُصرَّح له بتعديل السجلات.');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'تعذر حفظ التعديل');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف استمارة المسجل: ${name}؟`)) return;
    setActionError(null);
    try {
      const ok = await deleteRegistrationRecord(id);
      if (ok) {
        fetchData();
      } else {
        setActionError('لم يتم الحذف. الحساب الحالي غير مُصرَّح له بحذف السجلات.');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'تعذر حذف السجل');
    }
  };

  const handleMerge = async (group: DuplicateGroup, keepId: string, dropId: string) => {
    const keep = group.members.find((m) => m.id === keepId);
    const drop = group.members.find((m) => m.id === dropId);
    if (!keep || !drop) return;

    const ok = window.confirm(
      `دمج السجلين:

يُبقى على: ${keep.serialNumber} — ${keep.fullName}
ويُحذف: ${drop.serialNumber} — ${drop.fullName}

` +
        'ستُنقل البيانات الناقصة من المحذوف إلى المُبقى، وتُسجَّل بياناته في ملاحظات المشرف. لا يمكن التراجع عن هذا الإجراء.'
    );
    if (!ok) return;

    setMerging(group.key);
    setActionError(null);
    try {
      await mergeRegistrations(keepId, dropId);
      await fetchData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'تعذر دمج السجلين');
    } finally {
      setMerging(null);
    }
  };

  const [exporting, setExporting] = React.useState(false);

  // Formatted workbook rather than raw CSV: CSV carries no borders, colours,
  // column widths or direction, so an Arabic roster opened from one arrives
  // unreadable and left-to-right.
  const handleExportExcel = async () => {
    if (registrations.length === 0) return;
    setExporting(true);
    setActionError(null);
    try {
      await downloadRoster(registrations);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'تعذر تصدير الكشف');
    } finally {
      setExporting(false);
    }
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

              {/* Export the formatted workbook */}
              <button
                id="admin-export-excel-btn"
                onClick={handleExportExcel}
                disabled={registrations.length === 0 || exporting}
                className="px-3.5 py-2 bg-gradient-to-r from-[#C89B48] to-[#DFB76C] hover:brightness-110 text-[#08192E] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm border border-amber-300 disabled:opacity-50"
                title="تصدير كشف الطلبة بصيغة Excel منسّقة"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#08192E]" />
                <span className="hidden sm:inline">
                  {exporting ? 'جارٍ التجهيز...' : 'تصدير كشف الطلبة (Excel)'}
                </span>
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
      {checkingSession ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#08192E]/5">
          <div className="flex items-center gap-3 text-slate-600 text-sm font-tajawal">
            <span className="w-5 h-5 border-2 border-[#08192E] border-t-transparent rounded-full animate-spin"></span>
            <span>جارٍ التحقق من الجلسة...</span>
          </div>
        </div>
      ) : !isAuthenticated ? (
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
                حساب المشرف الرسمي الصادر من إدارة الشؤون الثقافية والدعوية
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-right">
              <div>
                <label htmlFor="admin-email-input" className="block text-xs font-bold text-slate-700 mb-1 font-cairo">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  id="admin-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  dir="ltr"
                  placeholder="supervisor@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] text-sm bg-slate-50 text-slate-900 text-left"
                />
              </div>

              <div>
                <label htmlFor="admin-password-input" className="block text-xs font-bold text-slate-700 mb-1 font-cairo">
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  id="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] text-sm bg-slate-50 text-slate-900 text-left"
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
                disabled={loginLoading || !email || !password}
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

          {/* Signed-in supervisor + any failed operation */}
          <div className="flex flex-wrap items-center justify-between gap-2 no-print">
            {staffEmail && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">مسجل الدخول:</span>
                <span dir="ltr" className="font-mono text-slate-800">{staffEmail}</span>
              </div>
            )}
          </div>

          {actionError && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Duplicate review. Hidden entirely when there is nothing to review,
              so it never becomes a permanent empty panel. */}
          {duplicates.length > 0 && (
            <div className="bg-white border-2 border-amber-400 rounded-3xl overflow-hidden no-print">
              <button
                id="admin-duplicates-toggle"
                onClick={() => setShowDuplicates((v) => !v)}
                className="w-full px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-amber-50 hover:bg-amber-100 transition text-right"
              >
                <span className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="font-cairo font-bold text-sm text-amber-950">
                    تسجيلات مكررة تحتاج مراجعة
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[11px] font-black">
                    {duplicates.length}
                  </span>
                </span>
                <span className="text-xs font-bold text-amber-800">
                  {showDuplicates ? 'إخفاء' : 'عرض ومعالجة'}
                </span>
              </button>

              {showDuplicates && (
                <div className="p-4 space-y-4">
                  <p className="text-[11px] text-slate-600 font-tajawal leading-relaxed">
                    الفحص يشمل جميع السجلات، لا المعروضة بالفلتر فقط. تشابه الاسم وحده لا يعني
                    التكرار — قد يكونان شخصين مختلفين، فراجع الرقم الوطني قبل الدمج.
                  </p>

                  {duplicates.map((group) => (
                    <div key={group.key} className="border border-slate-300 rounded-2xl overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-100 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-black border ${
                            group.strength === 'certain'
                              ? 'bg-rose-100 text-rose-900 border-rose-400'
                              : group.strength === 'likely'
                                ? 'bg-amber-100 text-amber-900 border-amber-400'
                                : 'bg-slate-200 text-slate-800 border-slate-400'
                          }`}
                        >
                          {STRENGTH_LABEL[group.strength]}
                        </span>
                        <span className="font-bold text-slate-700">
                          تطابق في: {group.reasons.map((r) => REASON_LABEL[r]).join(' + ')}
                        </span>
                        <span className="font-mono text-slate-600">({group.value})</span>
                      </div>

                      <div className="divide-y divide-slate-200">
                        {group.members.map((m) => (
                          <div key={m.id} className="p-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold bg-[#08192E] text-[#DFB76C] px-2 py-0.5 rounded">
                                  {m.serialNumber}
                                </span>
                                <span className="font-bold text-slate-900 text-sm">{m.fullName}</span>
                                {getStatusBadge(m.status)}
                              </div>
                              <div className="text-[11px] text-slate-600 flex flex-wrap gap-3 mt-1 font-tajawal">
                                <span>الوطني: <strong className="font-mono">{m.nationalId}</strong></span>
                                <span>الهاتف: <strong className="font-mono">{m.phone}</strong></span>
                                <span>المدينة: {m.city}</span>
                                <span>سُجل: {formatArabicDateTime(m.createdAt)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => onViewRegistrationCard(m)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>عرض</span>
                              </button>

                              {group.members
                                .filter((other) => other.id !== m.id)
                                .map((other) => (
                                  <button
                                    key={other.id}
                                    disabled={merging === group.key}
                                    onClick={() => handleMerge(group, m.id, other.id)}
                                    className="px-2.5 py-1.5 rounded-xl bg-[#1a4d2e] hover:bg-[#153e25] text-white text-[11px] font-bold disabled:opacity-60"
                                    title={`الإبقاء على ${m.serialNumber} ودمج ${other.serialNumber} فيه`}
                                  >
                                    {merging === group.key
                                      ? 'جارٍ الدمج...'
                                      : `أبقِ هذا وادمج ${other.serialNumber}`}
                                  </button>
                                ))}

                              <button
                                onClick={() => handleDelete(m.id, m.fullName)}
                                className="px-2.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                <div className="text-xs text-slate-700 font-semibold mb-1">المستفيدون من السكن</div>
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
                    className="w-full pl-3 pr-9 py-2 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-[#1a4d2e] text-xs font-medium text-slate-900 bg-[#f4f1ea]/30"
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
                  <option value="yes">يستفيد من السكن</option>
                  <option value="no">لا يستفيد من السكن</option>
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
                  <span>طباعة كشف الطلبة</span>
                </button>
              </div>
            </div>

            {/* Print Only Header for Roster */}
            <div className="print-only text-center pb-3 mb-3 border-b-2 border-stone-900">
              <h2 className="font-amiri text-xl font-bold">الهيئة العامة للأوقاف والشؤون الإسلامية — إدارة الشؤون الثقافية والدعوية</h2>
              <h3 className="text-base font-bold">كشف الطلبة — برنامج (إعداد) لتأهيل الخطباء، {PROGRAM.edition} {PROGRAM.year}</h3>
              <p className="text-[11px]">
                المقابلة الشخصية: {PROGRAM.interview.date} | انطلاق البرنامج: {PROGRAM.course.from} | المكان: {PROGRAM.course.venue}
              </p>
              <p className="text-[11px] font-bold">
                عدد الطلبة في هذا الكشف: {registrations.length} | تاريخ الطباعة: {new Date().toLocaleDateString('ar-LY')}
              </p>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden print:rounded-none print:border-0 print:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs font-tajawal border-collapse">
                  <thead className="bg-slate-100 text-[#08192E] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-center">الرقم المتسلسل</th>
                      <th className="py-3 px-4">اسم المتقدم</th>
                      <th className="py-3 px-4 font-mono">الرقم الوطني / الهاتف</th>
                      <th className="py-3 px-4">المدينة / السكن</th>
                      <th className="py-3 px-4 print:hidden">المؤهل / حفظ القرآن</th>
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

                          {/* Education & Quran — reference detail, dropped from
                              the printed sheet so it fits A4 portrait. */}
                          <td className="py-3 px-4 print:hidden">
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
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-sm font-medium text-slate-900 bg-slate-50"
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
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-slate-50"
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
