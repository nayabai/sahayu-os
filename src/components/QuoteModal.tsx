import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, IndianRupee, CheckCircle, Calculator } from 'lucide-react';
import { submitQuotation } from '../services/api';

export const QuoteModal: React.FC = () => {
  const {
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    selectedJobForQuote,
    currentUser,
    refreshData,
    showToast
  } = useApp();

  const [laborCost, setLaborCost] = useState<number | ''>(400);
  const [materialCost, setMaterialCost] = useState<number | ''>(250);
  const [travelCost, setTravelCost] = useState<number | ''>(100);
  const [description, setDescription] = useState('Includes complete repair with genuine seal replacement and 30-day service warranty.');
  const [estimatedHours, setEstimatedHours] = useState('1.5 hours');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isQuoteModalOpen || !selectedJobForQuote) return null;

  const total = Number(laborCost || 0) + Number(materialCost || 0) + Number(travelCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0) {
      showToast('Total quotation amount must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuotation(selectedJobForQuote.id, {
        workerId: currentUser.id,
        workerName: currentUser.name,
        laborCost: Number(laborCost || 0),
        materialCost: Number(materialCost || 0),
        travelCost: Number(travelCost || 0),
        description,
        estimatedHours
      });

      showToast('📋 Itemized quotation sent to the customer successfully!');
      await refreshData();
      setIsQuoteModalOpen(false);
    } catch (e) {
      showToast('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold font-display">Send Itemized Quotation</h2>
              <p className="text-xs text-amber-100 line-clamp-1">{selectedJobForQuote.title}</p>
            </div>
          </div>

          <button
            onClick={() => setIsQuoteModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            Customers appreciate transparent itemized pricing. Break down your labor, parts, and travel.
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Labour (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Materials (₹)</label>
              <input
                type="number"
                min={0}
                value={materialCost}
                onChange={(e) => setMaterialCost(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Travel (₹)</label>
              <input
                type="number"
                min={0}
                value={travelCost}
                onChange={(e) => setTravelCost(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scope & Material Details</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              placeholder="e.g. Will bring Astral PVC pipes and brass tap connector."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Time to Complete</label>
            <input
              type="text"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
              placeholder="e.g. 1 to 2 hours"
            />
          </div>

          {/* Total Calculation Strip */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Total Quotation Value</span>
            <span className="text-xl font-extrabold text-amber-400">₹{total}</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
