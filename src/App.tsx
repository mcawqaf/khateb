import React from 'react';
import { Header } from './components/Header.js';
import { HeroSection } from './components/HeroSection.js';
import { AboutAndGoals } from './components/AboutAndGoals.js';
import { TermsAndConditions } from './components/TermsAndConditions.js';
import { RegistrationForm } from './components/RegistrationForm.js';
import { RegistrationCardModal } from './components/RegistrationCardModal.js';
import { LookupModal } from './components/LookupModal.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { Footer } from './components/Footer.js';
import { Registration } from './types.js';
import { isAdminRoute } from './lib/adminRoute.js';
import { FileText, Search, ShieldCheck } from 'lucide-react';

export default function App() {
  // Route state
  const [currentRoute, setCurrentRoute] = React.useState<string>(() =>
    isAdminRoute() ? 'admin' : 'home'
  );

  // Modal states
  const [selectedRegistration, setSelectedRegistration] = React.useState<Registration | null>(null);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);

  // Sync route on hash/history change
  React.useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(isAdminRoute() ? 'admin' : 'home');
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (newReg: Registration) => {
    setSelectedRegistration(newReg);
  };

  // ----------------------------------------------------
  // STANDALONE ADMIN ROUTE (private slug, see lib/adminRoute.ts)
  // ----------------------------------------------------
  if (currentRoute === 'admin') {
    return (
      <div className="min-h-screen bg-[#061526] text-slate-100 font-tajawal" dir="rtl">
        <AdminDashboard
          isStandalone={true}
          onBackToHome={() => {
            window.location.hash = '';
            setCurrentRoute('home');
          }}
          onViewRegistrationCard={(reg) => setSelectedRegistration(reg)}
        />

        {/* Printable Card Modal if supervisor clicks view */}
        <RegistrationCardModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // PUBLIC WEBSITE (Home View)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#061526] text-slate-100 font-tajawal selection:bg-[#0284C7] selection:text-white" dir="rtl">
      
      {/* Top Header */}
      <Header
        onOpenLookup={() => setIsLookupOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-8 lg:space-y-12 py-4">
        {/* 1. Hero Bento Grid Section */}
        <HeroSection
          onRegisterClick={() => scrollToSection('registration-form-section')}
          onTermsClick={() => scrollToSection('terms-section')}
          onLookupClick={() => setIsLookupOpen(true)}
        />

        {/* 2. About & Goals Bento Grid Section */}
        <AboutAndGoals />

        {/* 3. Clearly Written Terms & Conditions Section */}
        <TermsAndConditions
          onProceedToRegister={() => scrollToSection('registration-form-section')}
        />

        {/* 4. Registration Form Section */}
        <RegistrationForm
          onSuccess={handleRegistrationSuccess}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenLookup={() => setIsLookupOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/*
        Quick actions.

        On a phone these were two icon-only circles pinned bottom-right, and
        they landed directly on top of the hero's own "register" button. Below
        `sm` they become a full-width bar with labelled, thumb-sized targets;
        body padding in index.css keeps it clear of page content. From `sm` up
        the original floating stack is kept.
      */}
      <div
        id="floating-quick-bar"
        className="fixed z-30 no-print inset-x-0 bottom-0 flex gap-2 p-2.5 bg-[#061526]/95 backdrop-blur border-t border-[#C89B48]/40
                   sm:inset-x-auto sm:bottom-5 sm:right-5 sm:flex-col sm:gap-2.5 sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0"
      >
        <button
          id="floating-lookup-btn"
          onClick={() => setIsLookupOpen(true)}
          className="flex-1 min-h-12 px-3 bg-[#08192E] text-white rounded-2xl shadow-xl border border-[#C89B48]/50 hover:bg-[#0B2545] sm:hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs font-bold
                     sm:flex-none sm:min-h-0 sm:p-3.5"
          title="استعلام وطباعة استمارة التسجيل"
        >
          <Search className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <span className="sm:hidden">استعلام / طباعة</span>
          <span className="hidden sm:inline">استعلام / طباعة استمارة</span>
        </button>

        <button
          id="floating-register-btn"
          onClick={() => scrollToSection('registration-form-section')}
          className="flex-1 min-h-12 px-3 bg-gradient-to-r from-[#C89B48] via-[#DFB76C] to-[#C89B48] text-[#08192E] rounded-2xl shadow-2xl hover:brightness-110 sm:hover:scale-105 transition-all flex items-center justify-center gap-2 text-xs font-black border-2 border-amber-300 ring-2 ring-[#DFB76C]/30
                     sm:flex-none sm:min-h-0 sm:p-3.5"
          title="التسجيل في برنامج إعداد"
        >
          <FileText className="w-5 h-5 text-[#08192E] shrink-0" />
          <span className="sm:hidden">سجل الآن</span>
          <span className="hidden sm:inline">سجل الآن بالبرنامج</span>
        </button>
      </div>

      {/* --- Modals & Overlays --- */}

      {/* 1. Official Printable Registration Review Card Modal */}
      <RegistrationCardModal
        registration={selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
      />

      {/* 2. Lookup Modal for Applicants */}
      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSelectRegistration={(reg) => setSelectedRegistration(reg)}
      />

    </div>
  );
}
