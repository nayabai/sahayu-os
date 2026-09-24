import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Award,
  Heart,
  Wrench,
  ThumbsUp,
  UserCheck,
  Calendar
} from 'lucide-react';

export const WorkerProfileModal: React.FC = () => {
  const {
    selectedWorkerForProfile,
    setSelectedWorkerForProfile,
    setIsPostJobModalOpen,
    openChatWith,
    triggerMaskedCall,
    savedWorkerIds,
    toggleSaveWorker,
    currentLocality,
    t
  } = useApp();

  if (!selectedWorkerForProfile) return null;

  const worker = selectedWorkerForProfile;
  const isSaved = savedWorkerIds.includes(worker.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 p-6 text-white relative">
          <button
            onClick={() => setSelectedWorkerForProfile(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={worker.profilePhoto}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold font-display">{worker.name}</h2>
                {worker.verification.identityVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>Aadhaar / ID Verified</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-blue-200 font-semibold">
                {worker.primaryCategory} Expert • {worker.experienceYears} Years Experience
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/90 pt-1">
                <span className="flex items-center text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300 mr-1" />
                  {worker.rating} / 5.0
                </span>
                <span>•</span>
                <span>{worker.completedJobs} Jobs Completed</span>
                <span>•</span>
                <span>{worker.responseRatePercent}% Response Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting Price</span>
              <span className="text-base font-extrabold text-slate-900">₹{worker.startingPrice}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
              <span className="text-base font-extrabold text-slate-900">{worker.calculatedDistance} km</span>
              <span className="text-[10px] text-slate-500">from {currentLocality}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Availability</span>
              <span className={`text-xs font-bold inline-block mt-0.5 px-2 py-0.5 rounded-full ${
                worker.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {worker.isAvailable ? 'Available Now' : 'Busy'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Languages</span>
              <span className="text-xs font-bold text-slate-800 block mt-0.5">{worker.languages.join(', ')}</span>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sahayu Trust & Verification Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                worker.verification.identityVerified ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Government ID</div>
                  <div className="text-[10px] text-slate-500">Aadhaar verified</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                worker.verification.skillVerified ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold">Skill Verified</div>
                  <div className="text-[10px] text-slate-500">Tested by trade expert</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                worker.verification.backgroundVerified ? 'bg-purple-50/70 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <div className="font-bold">Police Check</div>
                  <div className="text-[10px] text-slate-500">Record cleared</div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">About the Worker</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl">
              {worker.about}
            </p>
          </div>

          {/* Skills & Specialties */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills & Specializations</h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                {worker.primaryCategory}
              </span>
              {worker.otherSkills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Service Localities in Pune (Privacy Guarantee: No Home Address) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Service Localities in Pune
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Privacy Guarded: Home Address Protected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {worker.serviceAreas.map((area, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{area}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Verified Customer Reviews ({worker.reviews.length})
            </h3>

            <div className="space-y-2.5">
              {worker.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => toggleSaveWorker(worker.id)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Worker'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerMaskedCall({ name: worker.name, role: 'worker', phone: worker.mobile });
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call (Masked)</span>
            </button>

            <button
              onClick={() => {
                openChatWith({ id: worker.id, name: worker.name, role: 'worker' });
                setSelectedWorkerForProfile(null);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Direct Chat</span>
            </button>

            <button
              onClick={() => {
                setSelectedWorkerForProfile(null);
                setIsPostJobModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              Request Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
