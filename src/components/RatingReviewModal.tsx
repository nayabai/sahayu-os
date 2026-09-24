import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import { submitReview } from '../services/api';

export const RatingReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedJobForReview,
    currentUser,
    refreshData,
    showToast
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [punctuality, setPunctuality] = useState(5);
  const [quality, setQuality] = useState(5);
  const [behaviour, setBehaviour] = useState(5);
  const [pricingFair, setPricingFair] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReviewModalOpen || !selectedJobForReview) return null;

  const job = selectedJobForReview;
  const workerName = job.assignedWorkerName || 'Technician';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReview({
        jobId: job.id,
        reviewerId: currentUser.id,
        reviewerName: currentUser.name,
        targetId: job.assignedWorkerId || 'w-1',
        targetRole: 'worker',
        rating,
        comment: comment.trim() || 'Work done cleanly and on time. Highly recommended!',
        qualityRating: quality,
        punctualityRating: punctuality,
        behaviourRating: behaviour
      });

      showToast('⭐ Thank you for rating! Your review helps keep Pune tradespeople accountable.');
      await refreshData();
      setIsReviewModalOpen(false);
    } catch (e) {
      showToast('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-white text-white" />
            <div>
              <h2 className="text-base font-bold font-display">Rate {workerName}</h2>
              <p className="text-xs text-amber-100 line-clamp-1">{job.title}</p>
            </div>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Main Star Selector */}
          <div className="text-center py-2 space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Service Experience</div>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-700">
              {rating === 5 ? 'Exceptional Service' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Needs Improvement'}
            </span>
          </div>

          {/* Sub Criteria */}
          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Punctuality (Arrived on time):</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPunctuality(v)}
                    className={`w-5 h-5 rounded text-[10px] font-bold ${
                      punctuality >= v ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Workmanship & Cleanliness:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setQuality(v)}
                    className={`w-5 h-5 rounded text-[10px] font-bold ${
                      quality >= v ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Behaviour & Professionalism:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBehaviour(v)}
                    className={`w-5 h-5 rounded text-[10px] font-bold ${
                      behaviour >= v ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Feedback for Pune Neighbors
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Santosh arrived in 25 mins, quickly diagnosed the concealed valve leak, and fixed it cleanly without extra mess. Highly recommended!"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Skip
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
