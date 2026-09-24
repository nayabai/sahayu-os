import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Clock,
  IndianRupee,
  Star,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Send,
  FileText,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Flame,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { toggleWorkerAvailability } from '../services/api';
import { calculatePuneDistance } from '../data/puneData';

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    currentLocality,
    workers,
    jobs,
    setSelectedJobForDetails,
    setSelectedJobForApply,
    setIsApplyModalOpen,
    setSelectedJobForQuote,
    setIsQuoteModalOpen,
    showToast,
    refreshData,
    setActiveTab,
    t
  } = useApp();

  const workerProfile = workers.find(w => w.id === currentUser.id) || workers[0];
  const [isAvailable, setIsAvailable] = useState(workerProfile.isAvailable);
  const [emergencyAvailable, setEmergencyAvailable] = useState(workerProfile.emergencyAvailable);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await toggleWorkerAvailability(workerProfile.id, nextState, emergencyAvailable);
      showToast(nextState ? 'You are now marked Available for jobs in Pune!' : 'You are now marked Busy / Away.');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleEmergency = async () => {
    const nextState = !emergencyAvailable;
    setEmergencyAvailable(nextState);
    try {
      await toggleWorkerAvailability(workerProfile.id, isAvailable, nextState);
      showToast(nextState ? 'Emergency alert dispatch enabled!' : 'Emergency alerts paused.');
    } catch (e) {
      console.warn(e);
    }
  };

  // Nearby jobs matching worker's primary category or location
  const nearbyJobs = jobs
    .filter(j => ['POSTED', 'RESPONSES_RECEIVED'].includes(j.status))
    .map(j => ({
      ...j,
      calculatedDistance: calculatePuneDistance(workerProfile.baseLocality, j.locationArea)
    }))
    .slice(0, 4);

  // My assigned/active jobs
  const myAssignedJobs = jobs.filter(j => j.assignedWorkerId === workerProfile.id);

  // Earnings calculations
  const grossEarnings = workerProfile.totalEarnings ? Math.round(workerProfile.totalEarnings / 0.9) : 22000;
  const platformFee = Math.round(grossEarnings * 0.1);
  const netEarnings = grossEarnings - platformFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
            <span>Pune Skilled Partner Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            {t('goodMorning')}, {workerProfile.name}!
          </h1>
          <p className="text-xs sm:text-sm text-amber-100">
            {workerProfile.primaryCategory} Specialist • Base: <strong className="text-white">{workerProfile.baseLocality}, Pune</strong>
          </p>
        </div>

        {/* Live Availability Toggles */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 flex flex-wrap items-center gap-3">
          {/* Main Availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-100 font-medium">Status:</span>
            <button
              onClick={handleToggleAvailability}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAvailable
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
              <span>{isAvailable ? 'Available Now' : 'Busy / Away'}</span>
            </button>
          </div>

          {/* Emergency Alert Toggle */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <button
              onClick={handleToggleEmergency}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                emergencyAvailable
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Toggle Immediate Emergency Job Alerts"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{emergencyAvailable ? 'Emergency Ready' : 'Emergency Off'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Today's Jobs</span>
          <div className="text-2xl font-bold text-slate-900">2</div>
          <span className="text-[10px] text-emerald-600 font-medium">1 in progress</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Quotes</span>
          <div className="text-2xl font-bold text-slate-900">3</div>
          <span className="text-[10px] text-amber-600 font-medium">Under customer review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
          <div className="text-2xl font-bold text-slate-900">{workerProfile.completedJobs}</div>
          <span className="text-[10px] text-blue-600 font-medium">Pune lifetime total</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Net Take-Home</span>
          <div className="text-2xl font-bold text-emerald-700">₹{netEarnings.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 font-medium">After 10% platform fee</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Rating</span>
          <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{workerProfile.rating}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Across {workerProfile.totalReviews} reviews</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Response Rate</span>
          <div className="text-2xl font-bold text-blue-600">{workerProfile.responseRatePercent}%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Within 15 mins</span>
        </div>
      </div>

      {/* Main 2-Column Section: Available Jobs Near You + Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Available Nearby Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span>{t('availableJobsNearYou')}</span>
            </h2>

            <button
              onClick={() => setActiveTab('find-jobs')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore All Jobs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {nearbyJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {job.category}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{job.locationArea} ({job.calculatedDistance} km)</span>
                    </div>

                    <h3
                      onClick={() => setSelectedJobForDetails(job)}
                      className="font-bold text-base text-slate-900 hover:text-amber-700 cursor-pointer mt-1"
                    >
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Budget</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {job.budgetMin ? `₹${job.budgetMin} - ₹${job.budgetMax || job.budgetMin}` : 'Need Quote'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Customer: <strong className="text-slate-700">{job.customerName}</strong> ({job.customerRating || 4.9}★)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobForApply(job);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-amber-500 text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobForQuote(job);
                        setIsQuoteModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs transition-colors"
                    >
                      Send Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Earnings Dashboard Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>{t('earnings')}</span>
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Gross Job Earnings</span>
                <span className="font-bold text-slate-900">₹{grossEarnings.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Sahayu Fee (10%)</span>
                <span className="font-semibold text-rose-600">-₹{platformFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">{t('netEarnings')}</span>
                <span className="font-extrabold text-emerald-700 text-base">₹{netEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('todayEarnings')}</span>
                <span className="font-bold text-slate-900">₹1,200</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">{t('weekEarnings')}</span>
                <span className="font-bold text-slate-900">₹6,800</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">{t('monthEarnings')}</span>
                <span className="font-bold text-slate-900">₹{grossEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Next Weekly Payout on Monday</span>
              </div>
              <p className="text-emerald-700 leading-tight">
                Direct UPI transfer to linked mobile <strong className="text-emerald-900">{workerProfile.mobile}</strong>. Zero payout deduction.
              </p>
            </div>
          </div>

          {/* Active Job in progress (if any) */}
          {myAssignedJobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Currently Active Job</div>
              <div className="font-bold text-sm text-slate-900">{myAssignedJobs[0].title}</div>
              <div className="text-xs text-slate-500">Customer: {myAssignedJobs[0].customerName} • {myAssignedJobs[0].locationArea}</div>
              <button
                onClick={() => setSelectedJobForDetails(myAssignedJobs[0])}
                className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Update Job Progress →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
