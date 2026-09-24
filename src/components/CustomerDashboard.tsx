import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Flame,
  Heart,
  UserCheck,
  Send
} from 'lucide-react';
import { JobStatus } from '../types';

export const CustomerDashboard: React.FC = () => {
  const {
    jobs,
    currentUser,
    currentLocality,
    workers,
    savedWorkerIds,
    setSelectedJobForDetails,
    setIsPostJobModalOpen,
    setSelectedWorkerForProfile,
    setIsPaymentModalOpen,
    setSelectedJobForPayment,
    setIsReviewModalOpen,
    setSelectedJobForReview,
    openChatWith,
    setActiveTab,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'completed' | 'saved'>('active');

  // Customer's jobs
  const myJobs = jobs.filter(j => j.customerId === currentUser.id);
  const activeJobs = myJobs.filter(j => !['COMPLETED', 'REVIEWED', 'CANCELLED'].includes(j.status));
  const completedJobs = myJobs.filter(j => ['COMPLETED', 'REVIEWED'].includes(j.status));
  const savedWorkersList = workers.filter(w => savedWorkerIds.includes(w.id));

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'POSTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Job Posted</span>;
      case 'RESPONSES_RECEIVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Quotes Received</span>;
      case 'WORKER_SELECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Worker Selected</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'WORKER_ON_THE_WAY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 animate-pulse">On The Way</span>;
      case 'ARRIVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Arrived at Location</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Work In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Work Completed</span>;
      case 'PAYMENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Payment Pending</span>;
      case 'REVIEWED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">Finished & Reviewed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Customer Portal</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Manage your service requests, compare quotes, and rebook your trusted Pune technicians.
          </p>
        </div>

        <button
          onClick={() => setIsPostJobModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeSubTab === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Active Requests ({activeJobs.length})
          </button>

          <button
            onClick={() => setActiveSubTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeSubTab === 'completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Past History ({completedJobs.length})
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeSubTab === 'saved'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Saved Workers ({savedWorkersList.length})
          </button>
        </div>

        <button
          onClick={() => setActiveTab('find-workers')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hidden sm:flex items-center gap-1"
        >
          <span>Find More Workers</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab 1: Active Jobs */}
      {activeSubTab === 'active' && (
        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Active Service Requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need any plumbing, electrical, carpentry or home cleaning work done? Post your requirement in under 2 minutes.
              </p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
              >
                Post Your Job Now
              </button>
            </div>
          ) : (
            activeJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-500">{job.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-xs text-blue-700">{job.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{job.locationArea}, Pune</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.status)}
                    <span className="text-xs text-slate-400">{job.postedAt}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <h3
                      onClick={() => setSelectedJobForDetails(job)}
                      className="text-base font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                    >
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-3">
                      <span>Preferred: <strong>{job.preferredDate} ({job.preferredTime})</strong></span>
                      {job.budgetMin && (
                        <span>Budget: <strong>₹{job.budgetMin} - ₹{job.budgetMax || job.budgetMin}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* View Details button */}
                    <button
                      onClick={() => setSelectedJobForDetails(job)}
                      className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      Inspect Status & Quotes ({job.applications.length + job.quotations.length})
                    </button>

                    {/* Quick Pay button if work is marked COMPLETED or PAYMENT */}
                    {['COMPLETED', 'PAYMENT'].includes(job.status) && (
                      <button
                        onClick={() => {
                          setSelectedJobForPayment(job);
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay ₹{job.finalPrice || 500}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Responses & Quotes received alert */}
                {(job.applications.length > 0 || job.quotations.length > 0) && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-700" />
                      <span className="text-slate-800">
                        <strong>{job.applications.length} applications</strong> and <strong>{job.quotations.length} formal quotes</strong> received for this job.
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedJobForDetails(job)}
                      className="font-bold text-amber-800 hover:text-amber-900 underline text-xs"
                    >
                      Compare & Accept →
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Past / Completed Jobs */}
      {activeSubTab === 'completed' && (
        <div className="space-y-4">
          {completedJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="font-semibold text-slate-700 text-sm">No Completed Jobs Yet</div>
              <p className="text-xs text-slate-400 mt-1">When jobs are finished, invoices and reviews will appear here.</p>
            </div>
          ) : (
            completedJobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{job.title}</span>
                    <span className="text-emerald-600 font-semibold">• Completed</span>
                  </div>
                  <span className="text-slate-400">{job.postedAt}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Technician: </span>
                    <strong className="text-slate-800">{job.assignedWorkerName || 'Skilled Partner'}</strong>
                    <span className="text-slate-400 ml-2">| Paid: ₹{job.finalPrice || 2200} via {job.paymentMethod || 'UPI'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobForReview(job);
                        setIsReviewModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>{job.status === 'REVIEWED' ? 'Edit Review' : 'Rate & Review'}</span>
                    </button>

                    <button
                      onClick={() => setIsPostJobModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                    >
                      Rebook Service
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved / Favourite Workers */}
      {activeSubTab === 'saved' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedWorkersList.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="font-semibold text-slate-700 text-sm">No Favourite Workers Saved</div>
              <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any worker card to save them for quick repeat bookings.</p>
            </div>
          ) : (
            savedWorkersList.map(worker => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={worker.profilePhoto}
                    alt={worker.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{worker.name}</div>
                    <div className="text-xs text-blue-700 font-semibold">{worker.primaryCategory}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{worker.rating}</span>
                      <span>({worker.completedJobs} jobs)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <span>From {worker.baseLocality}</span>
                  <span className="font-bold text-slate-900">Starts ₹{worker.startingPrice}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openChatWith({ id: worker.id, name: worker.name, role: 'worker' })}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex-1 flex items-center justify-center gap-1 text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => setSelectedWorkerForProfile(worker)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 text-xs"
                  >
                    Book Again
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
