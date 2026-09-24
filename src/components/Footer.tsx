import React from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, MapPin, ShieldCheck, Heart, Sparkles, Globe, PhoneCall } from 'lucide-react';
import { PUNE_LOCALITIES } from '../data/puneData';

export const Footer: React.FC = () => {
  const {
    setCurrentLocality,
    setSelectedCategoryFilter,
    setActiveTab,
    setIsSafetyModalOpen,
    setIsWorkerOnboardingOpen,
    setIsPostJobModalOpen,
    t
  } = useApp();

  const handleLocalityClick = (locName: string) => {
    setCurrentLocality(locName);
    setActiveTab('find-workers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('find-workers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-display">Sahayu</span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              {t('brandTagline')} — Pune's dedicated local skilled-worker marketplace connecting customers with verified plumbers, electricians, carpenters, cleaners, and technicians.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe • Direct • Privacy-First</span>
            </div>
          </div>

          {/* Popular Services in Pune */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Services in Pune
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {['Plumbing', 'Electrical', 'House Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Laptop Repair', 'Mason'].map(service => (
                <li key={service}>
                  <button
                    onClick={() => handleCategoryClick(service)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {service} Services in Pune
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pune Localities */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Pune & PCMC Localities
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-400">
              {PUNE_LOCALITIES.slice(0, 10).map(loc => (
                <button
                  key={loc.name}
                  onClick={() => handleLocalityClick(loc.name)}
                  className="hover:text-blue-400 transition-colors text-left truncate"
                >
                  Workers in {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links & Worker Onboarding */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              For Pune Workers & Citizens
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setIsWorkerOnboardingOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Join as a Skilled Worker (Register)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="hover:text-white"
                >
                  Post a Job (Free Quotes)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-white"
                >
                  Safety Guidelines & Fair Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-white"
                >
                  Terms of Service & Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Sahayu Technologies (Pune, Maharashtra, India). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Direct Hiring Marketplace</span>
            <span>•</span>
            <span>Zero Exploitative Middlemen</span>
            <span>•</span>
            <span>Empowering Pune's Skilled Force</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
