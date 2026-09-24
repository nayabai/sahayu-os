import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Phone,
  MessageSquare,
  Sparkles,
  Heart,
  Wrench,
  Clock,
  Award,
  AlertCircle,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import { WorkerProfile } from '../types';
import { PuneMapView } from './PuneMapView';

export const FindWorkersView: React.FC = () => {
  const {
    workers,
    categories,
    currentLocality,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    setSelectedWorkerForProfile,
    setIsPostJobModalOpen,
    openChatWith,
    triggerMaskedCall,
    savedWorkerIds,
    toggleSaveWorker,
    t
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(15);

  // Subcategories for currently selected category
  const activeCategoryObj = categories.find(c => c.name.toLowerCase() === selectedCategoryFilter.toLowerCase());

  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      // Category filter
      if (selectedCategoryFilter !== 'all') {
        const matchesCat =
          w.primaryCategory.toLowerCase() === selectedCategoryFilter.toLowerCase() ||
          w.otherSkills.some(s => s.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));
        if (!matchesCat) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          w.name.toLowerCase().includes(q) ||
          w.primaryCategory.toLowerCase().includes(q) ||
          w.otherSkills.some(s => s.toLowerCase().includes(q)) ||
          w.serviceAreas.some(a => a.toLowerCase().includes(q)) ||
          w.about.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Verified only
      if (onlyVerified && (!w.verification.identityVerified || !w.verification.skillVerified)) {
        return false;
      }

      // Emergency available only
      if (onlyEmergency && (!w.emergencyAvailable || !w.isAvailable)) {
        return false;
      }

      // Rating
      if (minRating > 0 && w.rating < minRating) {
        return false;
      }

      // Language
      if (selectedLanguage !== 'all' && !w.languages.some(l => l.toLowerCase().includes(selectedLanguage.toLowerCase()))) {
        return false;
      }

      // Distance
      if (w.calculatedDistance > maxDistance) {
        return false;
      }

      return true;
    });
  }, [workers, selectedCategoryFilter, searchQuery, onlyVerified, onlyEmergency, minRating, selectedLanguage, maxDistance]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('nearbyWorkers')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing skilled professionals near <span className="font-semibold text-slate-800">{currentLocality}, Pune</span>
            </p>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            {t('postJob')} & Let Workers Apply
          </button>
        </div>

        {/* Search input and category row */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by skill, name (e.g. Santosh, Plumber, AC repair, Kharadi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setSelectedSubcategory('all');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                selectedCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategoryFilter(c.name);
                  setSelectedSubcategory('all');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                  selectedCategoryFilter.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Verified Toggle */}
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              onlyVerified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Only</span>
          </button>

          {/* Emergency Toggle */}
          <button
            onClick={() => setOnlyEmergency(!onlyEmergency)}
            className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              onlyEmergency
                ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Emergency Ready</span>
          </button>

          {/* Rating filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium cursor-pointer"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5+ ★</option>
              <option value={4.8}>4.8+ ★</option>
            </select>
          </div>

          {/* Language filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="Marathi">Marathi</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Max Distance */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Within:</span>
            <span className="font-semibold text-slate-800">{maxDistance} km</span>
            <input
              type="range"
              min={2}
              max={25}
              step={1}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-20 accent-blue-600 cursor-pointer"
            />
          </div>

          {(onlyVerified || onlyEmergency || minRating > 0 || selectedLanguage !== 'all' || selectedCategoryFilter !== 'all') && (
            <button
              onClick={() => {
                setOnlyVerified(false);
                setOnlyEmergency(false);
                setMinRating(0);
                setSelectedLanguage('all');
                setSelectedCategoryFilter('all');
                setMaxDistance(15);
                setSearchQuery('');
              }}
              className="text-rose-600 hover:text-rose-700 font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header with View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>Found <strong className="text-slate-900">{filteredWorkers.length}</strong> skilled workers</span>
          <span className="hidden sm:inline text-slate-400">• Ranked by proximity & rating</span>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl border border-slate-300/60 shadow-2xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pune Map</span>
          </button>
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' ? (
        <PuneMapView
          workers={filteredWorkers}
          currentLocality={currentLocality}
          onSelectWorker={setSelectedWorkerForProfile}
          onChatWorker={(worker) => openChatWith({ id: worker.userId, name: worker.name, role: 'worker' })}
        />
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No Workers Found Matching Filters</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t('noJobsFound')}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Post a Job Instead
            </button>
            <button
              onClick={() => {
                setOnlyVerified(false);
                setOnlyEmergency(false);
                setSelectedCategoryFilter('all');
                setMaxDistance(25);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkers.map((worker) => {
            const isSaved = savedWorkerIds.includes(worker.id);
            return (
              <div
                key={worker.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.profilePhoto}
                        alt={worker.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                            {worker.name}
                          </h3>
                          {worker.verification.identityVerified && (
                            <span title="Govt ID Verified">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-semibold text-blue-700 mt-0.5">
                          {worker.primaryCategory}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                            {worker.rating}
                          </span>
                          <span>({worker.completedJobs} jobs)</span>
                          <span>•</span>
                          <span>{worker.experienceYears}y exp</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveWorker(worker.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title={isSaved ? 'Remove from favorites' : 'Save worker'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Distance & Service Area (No Exact Home Address!) */}
                  <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-slate-900">{worker.calculatedDistance} km</span>
                      <span className="text-slate-500">from {currentLocality}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {worker.emergencyAvailable && worker.isAvailable && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Emergency
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        worker.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {worker.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {worker.otherSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {worker.otherSkills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px]">
                        +{worker.otherSkills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* AI Smart Match Explanation pill */}
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-700 space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-blue-800 text-[10px] uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{t('whyRecommended')}</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-slate-600">
                      {worker.name} has completed {worker.completedJobs} jobs in {worker.baseLocality} with a {worker.rating}★ rating. Fast response rate ({worker.responseRatePercent}%).
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Starting Price & CTAs */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block leading-tight">Starting at</span>
                    <span className="text-base font-extrabold text-slate-900">₹{worker.startingPrice}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => triggerMaskedCall({ name: worker.name, role: 'worker', phone: worker.mobile })}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Call (Masked Number)"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </button>

                    <button
                      onClick={() => openChatWith({ id: worker.id, name: worker.name, role: 'worker' })}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Direct Message"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      onClick={() => setSelectedWorkerForProfile(worker)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
