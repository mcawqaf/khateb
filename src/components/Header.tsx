import React from 'react';
import { PROGRAM } from '../lib/programInfo.js';
import { BookOpen, Calendar, MapPin, Search, ShieldCheck, UserCheck, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenLookup: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLookup,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#08192E]/95 backdrop-blur border-b border-[#C89B48]/30 shadow-lg no-print">
      {/* Top Islamic Banner Bar */}
      <div id="top-announcement-bar" className="bg-[#051120] text-[#EDF2F7] text-xs py-2 px-4 border-b border-[#C89B48]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
            <span className="text-[#DFB76C] font-semibold">الهيئة العامة للأوقاف والشؤون الإسلامية</span>
            <span className="text-white/40">|</span>
            <span className="text-slate-300">إدارة الشؤون الثقافية والدعوية</span>
          </div>
          <div className="flex items-center justify-center w-full sm:w-auto gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>فترة التسجيل: {PROGRAM.registration.short}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-sky-300 font-mono">
              <span>الدورة الخامسة (5)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 h-16 sm:h-22">
          {/* Logo & Identity */}
          <div 
            id="brand-logo-button"
            onClick={() => onScrollToSection('hero-section')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group py-1 min-w-0"
          >
            <div className="rounded-md overflow-hidden inline-flex shrink-0 shadow-2xl border-2 sm:border-3 border-[#DFB76C] ring-4 ring-[#DFB76C]/30 group-hover:scale-105 group-hover:border-[#F7E7CE] transition-all">
              <img
                src="./assets/program-logo.png"
                alt="شعار برنامج إعداد لتأهيل الخطباء"
                className="h-11 sm:h-14 w-auto block"
              />
            </div>
            {/* On a phone the banner carries the logo alone — the wordmark was
                crowding it, and the page title repeats immediately below in
                the hero anyway. */}
            <div className="hidden sm:block min-w-0">
              <div className="font-amiri text-base sm:text-3xl font-bold text-white leading-tight flex flex-wrap items-center gap-x-1.5 sm:gap-2">
                <span>برنامج</span>
                <span className="text-[#38BDF8] drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">(إعداد)</span>
                <span>لتأهيل الخطباء</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold tracking-wide flex items-center gap-1.5 sm:gap-2 mt-0.5 font-tajawal">
                <span className="bg-gradient-to-r from-[#C89B48] to-[#DFB76C] text-[#08192E] px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs">الدورة 5</span>
                <span className="text-[#DFB76C] font-bold text-[10px] sm:text-xs">1448هـ / 2026م</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 font-medium text-sm text-slate-200">
            <button
              id="nav-btn-about"
              onClick={() => onScrollToSection('about-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#38BDF8] hover:bg-white/10 transition"
            >
              عن البرنامج والأهداف
            </button>
            <button
              id="nav-btn-terms"
              onClick={() => onScrollToSection('terms-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#38BDF8] hover:bg-white/10 transition text-sky-400 font-bold"
            >
              شروط القبول
            </button>
            <button
              id="nav-btn-details"
              onClick={() => onScrollToSection('details-section')}
              className="px-3.5 py-2 rounded-xl hover:text-[#38BDF8] hover:bg-white/10 transition"
            >
              مواعيد القبول
            </button>
            <button
              id="nav-btn-register"
              onClick={() => onScrollToSection('registration-form-section')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] hover:brightness-110 text-[#08192E] rounded-xl transition shadow-lg shadow-amber-950/40 flex items-center gap-1.5 font-black border border-amber-300"
            >
              <UserCheck className="w-4 h-4 text-[#08192E]" />
              <span>استمارة التسجيل</span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="header-lookup-btn"
              onClick={onOpenLookup}
              className="px-3.5 py-2 text-sm font-semibold text-slate-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-[#C89B48]/40 flex items-center gap-1.5 shadow-sm"
              title="طباعة أو استعلام عن رقم التسجيل"
            >
              <Search className="w-4 h-4 text-[#38BDF8]" />
              <span>استعلام / طباعة استمارة</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              id="mobile-lookup-quick-btn"
              onClick={onOpenLookup}
              className="p-2 text-[#38BDF8] bg-white/10 rounded-xl"
              aria-label="استعلام"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 py-2 text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-1"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <span>إغلاق</span> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-[#C89B48]/30 bg-[#0A1C30] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-2 font-medium text-slate-200">
            <button
              id="m-nav-about"
              onClick={() => {
                onScrollToSection('about-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl hover:bg-white/10"
            >
              عن البرنامج والأهداف
            </button>
            <button
              id="m-nav-terms"
              onClick={() => {
                onScrollToSection('terms-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl bg-white/10 text-[#38BDF8] font-bold"
            >
              شروط وضوابط القبول
            </button>
            <button
              id="m-nav-details"
              onClick={() => {
                onScrollToSection('details-section');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2.5 rounded-xl hover:bg-white/10"
            >
              مواعيد القبول
            </button>
            <button
              id="m-nav-register"
              onClick={() => {
                onScrollToSection('registration-form-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-3 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] text-[#08192E] rounded-xl font-extrabold shadow-md flex items-center justify-center gap-2 border border-amber-300"
            >
              <UserCheck className="w-5 h-5 text-[#08192E]" />
              <span>تسجيل جديد بالبرنامج</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#C89B48]/20 flex flex-col gap-2">
            <button
              id="m-nav-lookup"
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-3 py-2.5 text-sm font-semibold text-white bg-white/10 rounded-xl border border-[#C89B48]/30 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#38BDF8]" />
              <span>استعلام وطباعة رقم المراجعة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
