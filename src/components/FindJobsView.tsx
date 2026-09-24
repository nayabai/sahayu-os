import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Send,
  FileText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import { calculatePuneDistance } from '../data/puneData';
import { Job } from '../types';

export const FindJobsView: React.FC = () => {
  const {
    jobs,
    currentLocality,
    categories,
    setSelectedJobForDetails,
    setSelectedJobForApply,
    setIsApplyModalOpen,
    setSelectedJobForQuote,
    setIsQuoteModalOpen,
    currentUser,
    t
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(15);

  const availableJobs = useMemo(() => {
    return jobs
      .filter(j => ['POSTED', 'RESPONSES_RECEIVED'].includes(j.status))
      .map(j => {
        const distance = calculatePuneDistance(currentLocality, j.locationArea);
        return {
          ...j,
          calculatedDistance: distance
        };
      })
      .filter(j => {
        if (selectedCategory !== 'all' && j.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (selectedUrgency !== 'all' && j.urgency !== selectedUrgency) {
          return false;
        }
        if (j.calculatedDistance > maxDistance) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            j.title.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.locationArea.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  }, [jobs, currentLocality, selectedCategory, selectedUrgency, maxDistance, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-1 border border-amber-200">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Worker Studio • Job Board</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('availableJobsNearYou')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Jobs posted by verified customers within radius of <strong className="text-slate-800">{currentLocality}, Pune</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {availableJobs.length} Jobs Ready for Quote
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search jobs by keyword (e.g. tap, leakage, fan, Kharadi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/60 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white cursor-pointer"
            >
              <option value="all">Any Urgency</option>
              <option value="emergency">🚨 Emergency</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this_week">This Week</option>
            </select>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400">Distance:</span>
              <span className="font-semibold text-slate-800">{maxDistance} km</span>
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-20 accent-amber-600 cursor-pointer ml-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs Stream */}
      {availableJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Jobs Found Matching Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('noNearbyJobs')} You can expand the distance slider to check broader Pune localities.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedUrgency('all');
              setMaxDistance(25);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {availableJobs.map((job) => {
            const hasWorkerApplied = job.applications.some(a => a.workerId === currentUser.id);
            const hasWorkerQuoted = job.quotations.some(q => q.workerId === currentUser.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3.5">
                  {/* Category & Urgency badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      {job.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {job.urgency === 'emergency' ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-extrabold flex items-center gap-1 animate-pulse">
                          <Flame className="w-3 h-3 text-rose-600" />
                          <span>Emergency</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="capitalize">{job.urgency.replace('_', ' ')}</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{job.postedAt}</span>
                    </div>
                  </div>

                  {/* Title & Customer info */}
                  <div>
                    <h3
                      onClick={() => setSelectedJobForDetails(job)}
                      className="font-bold text-base text-slate-900 hover:text-amber-700 cursor-pointer transition-colors leading-snug"
                    >
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Posted by <strong className="text-slate-700">{job.customerName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        {job.customerRating || 4.8}
                      </span>
                    </div>
                  </div>

                  {/* Distance & Budget Banner */}
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-bold text-slate-900">{job.locationArea}</span>
                      <span className="text-slate-500">({job.calculatedDistance} km away)</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block leading-none">Est. Budget</span>
                      <span className="font-extrabold text-slate-900 text-sm text-emerald-700">
                        {job.budgetMin && job.budgetMax
                          ? `₹${job.budgetMin} - ₹${job.budgetMax}`
                          : job.budgetMin
                          ? `₹${job.budgetMin}+`
                          : 'Quotation required'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Preferred Time & Materials requirement */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      Preferred: <strong>{job.preferredDate} ({job.preferredTime})</strong>
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                      Material: <strong>{job.materialRequired.replace('_', ' ')}</strong>
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedJobForDetails(job)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View Details ({job.applications.length} applied)
                  </button>

                  <div className="flex items-center gap-2">
                    {hasWorkerApplied || hasWorkerQuoted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied / Quoted</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedJobForApply(job);
                            setIsApplyModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl border border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedJobForQuote(job);
                            setIsQuoteModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Send Quote</span>
                        </button>
                      </>
                    )}
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
