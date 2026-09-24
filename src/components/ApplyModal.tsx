import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Clock, IndianRupee } from 'lucide-react';
import { applyToJob } from '../services/api';

export const ApplyModal: React.FC = () => {
  const {
    isApplyModalOpen,
    setIsApplyModalOpen,
    selectedJobForApply,
    currentUser,
    refreshData,
    showToast
  } = useApp();

  const [estimatedPrice, setEstimatedPrice] = useState<number | ''>(500);
  const [message, setMessage] = useState('I am nearby in your locality and have all necessary repair tools ready.');
  const [availableTime, setAvailableTime] = useState('Within 45 mins / Today');
  const [estimatedDuration, setEstimatedDuration] = useState('1 hour');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isApplyModalOpen || !selectedJobForApply) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applyToJob(selectedJobForApply.id, {
        workerId: currentUser.id,
        workerName: currentUser.name,
        estimatedPrice: Number(estimatedPrice || 0),
        message,
        availableTime,
        estimatedDuration
      });

      showToast('🚀 Application submitted to customer successfully!');
      await refreshData();
      setIsApplyModalOpen(false);
    } catch (e) {
      showToast('Failed to apply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold font-display">Apply for Job</h2>
              <p className="text-xs text-amber-100 line-clamp-1">{selectedJobForApply.title}</p>
            </div>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Estimated Labour/Visit Fee (₹) *</label>
            <input
              type="number"
              required
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">When can you arrive?</label>
            <input
              type="text"
              required
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              placeholder="e.g. Within 1 hour, or Today 4 PM"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quick Message to Customer</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              placeholder="Tell them about your experience with this kind of work..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
