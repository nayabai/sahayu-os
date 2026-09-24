import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PUNE_LOCALITIES } from '../data/puneData';
import {
  MapPin,
  Globe,
  ShieldCheck,
  PlusCircle,
  Bell,
  User,
  Wrench,
  Search,
  Briefcase,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { UserRole, Language } from '../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentLocality,
    setCurrentLocality,
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    setIsPostJobModalOpen,
    setIsWorkerOnboardingOpen,
    setIsSafetyModalOpen,
    notifications,
    currentUser,
    setSelectedCategoryFilter
  } = useApp();

  const [isLocalityOpen, setIsLocalityOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro bar for Pune City & Trust message */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Pune & PCMC
          </span>
          <span className="hidden sm:inline text-slate-300">
            {t('puneAreaCoverage')} • 100% Direct Local Marketplace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSafetyModalOpen(true)}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('safetyGuidelines')}</span>
          </button>

          <span className="text-slate-600">|</span>

          {/* Role quick switcher */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-md p-0.5 text-[11px]">
            <span className="text-slate-400 px-1 font-medium">{t('switchRole')}:</span>
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('customer-dashboard');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'customer'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('customer')}
            </button>
            <button
              onClick={() => {
                setCurrentRole('worker');
                setActiveTab('worker-dashboard');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'worker'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('worker')}
            </button>
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('admin-dashboard');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                currentRole === 'admin'
                  ? 'bg-purple-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('admin')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">Sahayu</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Pune
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-tight font-medium">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* Locality Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocalityOpen(!isLocalityOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 leading-none">Location</div>
                <div className="font-semibold text-slate-900 leading-tight">{currentLocality}, Pune</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isLocalityOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Pune Locality
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {PUNE_LOCALITIES.map(loc => (
                    <button
                      key={loc.name}
                      onClick={() => {
                        setCurrentLocality(loc.name);
                        setIsLocalityOpen(false);
                      }}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        currentLocality === loc.name
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{loc.name}</span>
                      <span className="text-[10px] text-slate-400">{loc.zone}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategoryFilter('all');
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('find-workers')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'find-workers' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('findWorker')}
            </button>

            <button
              onClick={() => setActiveTab('find-jobs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'find-jobs' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('findJobs')}
            </button>

            {currentRole === 'customer' && (
              <button
                onClick={() => setActiveTab('customer-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'customer-dashboard' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Requests
              </button>
            )}

            {currentRole === 'worker' && (
              <button
                onClick={() => setActiveTab('worker-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'worker-dashboard' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Worker Studio
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'admin-dashboard' ? 'text-purple-600 bg-purple-50 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('adminPanel')}
              </button>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      language === 'en' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      language === 'hi' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('mr');
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      language === 'mr' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              )}
            </div>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-1 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-semibold text-xs text-slate-900">Notifications ({notifications.length})</span>
                    <span className="text-[11px] text-blue-600 font-medium cursor-pointer">Mark all as read</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No notifications yet</div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs transition-colors ${
                            n.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 border border-blue-100 text-slate-800'
                          }`}
                        >
                          <div className="font-semibold text-slate-900 flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                          </div>
                          <p className="mt-0.5 text-slate-600 line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Job Primary CTA */}
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postJob')}</span>
            </button>

            {/* Worker Onboarding CTA for non-workers */}
            {currentRole !== 'worker' && (
              <button
                onClick={() => setIsWorkerOnboardingOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Join as Worker</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
