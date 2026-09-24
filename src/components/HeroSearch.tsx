import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  ThumbsUp,
  Briefcase,
  Star,
  ChevronRight,
  Flame,
  Wrench
} from 'lucide-react';
import { PUNE_LOCALITIES } from '../data/puneData';

export const HeroSearch: React.FC = () => {
  const {
    t,
    currentLocality,
    setCurrentLocality,
    categories,
    setActiveTab,
    setSelectedCategoryFilter,
    setIsPostJobModalOpen,
    setIsWorkerOnboardingOpen,
    language
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategoryFilter(searchQuery.trim());
      setActiveTab('find-workers');
    }
  };

  const handleQuickCategory = (catName: string) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('find-workers');
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Top Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-4 mt-3 shadow-xl">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Pune’s Trusted Open Skilled-Worker Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
            Need a skilled person?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300">
              Find trusted local workers
            </span>{' '}
            near you.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Plumbers, electricians, carpenters, housemaids, cleaners, painters & tech repair in{' '}
            <span className="text-amber-300 font-semibold">{currentLocality}, Pune</span>. Direct hiring, transparent quotes, verified profiles.
          </p>

          {/* Search & Location Bar */}
          <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 text-slate-900">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2">
              {/* Locality select */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl sm:w-1/3 border border-slate-200/80">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <select
                  value={currentLocality}
                  onChange={(e) => setCurrentLocality(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  {PUNE_LOCALITIES.map(l => (
                    <option key={l.name} value={l.name}>
                      {l.name} ({l.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Input */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl flex-1 border border-slate-200/80">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Find Worker Submit */}
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>{t('findWorker')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular quick tags */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500 px-2 py-1 scrollbar-none">
              <span className="font-semibold text-slate-400 shrink-0">Popular:</span>
              {['Plumbing', 'Electrical', 'House Cleaning', 'Carpentry', 'AC Repair', 'Laptop Repair', 'Mason'].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickCategory(item)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors shrink-0"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('postJob')}</span>
              <span className="text-[11px] font-normal opacity-90">(Get Multiple Quotes)</span>
            </button>

            <button
              onClick={() => setActiveTab('find-workers')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-colors"
            >
              {t('findWorker')}
            </button>
          </div>

          {/* Emergency Service Banner Strip */}
          <div className="pt-2">
            <div
              onClick={() => {
                setSelectedCategoryFilter('all');
                setActiveTab('find-workers');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs cursor-pointer transition-all hover:scale-101"
            >
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span className="font-bold text-rose-300">{t('needImmediately')}:</span>
              <span>Pipe burst, power failure, locked door in Pune? Connect with emergency workers now →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Popular Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('popularServices')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified independent professionals ready in {currentLocality} and nearby Pune areas
            </p>
          </div>
          <button
            onClick={() => setActiveTab('find-workers')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 12).map((cat) => {
            const displayName = language === 'hi' ? cat.hindiName : language === 'mr' ? cat.marathiName : cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => handleQuickCategory(cat.name)}
                className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center text-slate-800"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors mb-3">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="font-bold text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.subcategories.length} services
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  From {cat.subcategories[0]?.avgPriceEstimate || '₹200'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: How Sahayu Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-10 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('howItWorks')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              A transparent two-sided model empowering both customers and skilled workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Customers */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> For Customers
                </span>
                <span className="text-xs text-slate-400 font-medium">Post or Search</span>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', title: 'Tell us what you need', desc: 'Describe the issue or use Voice/AI assistant to post a job in seconds.' },
                  { step: '2', title: 'Get multiple quotations', desc: 'Nearby verified workers respond with estimates, availability, and messages.' },
                  { step: '3', title: 'Compare and select', desc: 'Inspect experience, ratings, and quotes. Accept your preferred skilled worker.' },
                  { step: '4', title: 'Work done & pay directly', desc: 'Pay safely via UPI or cash, with transparent invoice and leave a review.' }
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Post Your Requirement
              </button>
            </div>

            {/* For Workers */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> For Skilled Workers
                </span>
                <span className="text-xs text-slate-400 font-medium">Earn Independently</span>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', title: 'Create simple profile', desc: 'Register with mobile OTP, choose skills and select Pune service areas.' },
                  { step: '2', title: 'Discover nearby jobs', desc: 'Receive instant notifications of jobs in your locality (Kharadi, Wakad, Kothrud, etc.).' },
                  { step: '3', title: 'Apply or send custom quote', desc: 'Set your own labour and material charge. Direct contact with customers.' },
                  { step: '4', title: 'Build your reputation', desc: 'Receive authentic reviews, keep 90% take-home earnings with zero middleman exploitation.' }
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsWorkerOnboardingOpen(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Register as Skilled Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Sahayu & Built for Everyone */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Local Verified Profiles</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every badge (Phone, ID, Skill, Background) reflects real verified credentials in our database. No fake claims.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Transparent Direct Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive itemized quotations for labour, materials, and travel. No hidden platform markup or surprise charges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Privacy-First Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Worker home addresses are never published. Customer addresses are revealed strictly after mutual booking confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Join as a Worker CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              For Pune Plumbers, Electricians, Carpenters & Technicians
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Turn Your Skill Into Opportunity.
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Get customer job leads directly on your phone without waiting at labour squares or depending on contractors.
            </p>
          </div>

          <button
            onClick={() => setIsWorkerOnboardingOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            {t('joinWorker')} →
          </button>
        </div>
      </section>
    </div>
  );
};
