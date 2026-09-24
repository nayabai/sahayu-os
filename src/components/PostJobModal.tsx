import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  Upload,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Flame,
  Wrench
} from 'lucide-react';
import { PUNE_LOCALITIES } from '../data/puneData';
import { suggestJobWithAI, createJob } from '../services/api';
import { JobUrgency, MaterialRequirement } from '../types';

export const PostJobModal: React.FC = () => {
  const {
    isPostJobModalOpen,
    setIsPostJobModalOpen,
    categories,
    currentLocality,
    currentUser,
    refreshData,
    showToast,
    t
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Plumbing');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [locationArea, setLocationArea] = useState(currentLocality);
  const [urgency, setUrgency] = useState<JobUrgency>('today');
  const [budgetMin, setBudgetMin] = useState<number | ''>(350);
  const [budgetMax, setBudgetMax] = useState<number | ''>(700);
  const [preferredDate, setPreferredDate] = useState('Today');
  const [preferredTime, setPreferredTime] = useState('Immediate / Next 2 Hours');
  const [materialRequired, setMaterialRequired] = useState<MaterialRequirement>('need_quotation');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  if (!isPostJobModalOpen) return null;

  // AI Assistant for Natural Language / Voice transcription
  const handleImproveWithAI = async () => {
    const rawInput = description.trim() || title.trim();
    if (!rawInput) {
      showToast('Please type a quick description first to improve with AI.');
      return;
    }

    setIsAiLoading(true);
    try {
      const suggestion = await suggestJobWithAI(rawInput, locationArea);
      if (suggestion.title) setTitle(suggestion.title);
      if (suggestion.category) setCategory(suggestion.category);
      if (suggestion.subcategory) setSubcategory(suggestion.subcategory);
      if (suggestion.description) setDescription(suggestion.description);
      if (suggestion.budgetMin) setBudgetMin(suggestion.budgetMin);
      if (suggestion.budgetMax) setBudgetMax(suggestion.budgetMax);
      if (suggestion.urgency) setUrgency(suggestion.urgency as JobUrgency);
      showToast('✨ Gemini AI auto-structured your job requirements!');
    } catch (e) {
      showToast('Could not optimize with AI. You can still post manually.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleVoiceSimulate = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('🎤 Listening to your voice requirement (Marathi/Hindi/English)...');
      setTimeout(() => {
        setIsRecording(false);
        setDescription('Kitchen sink pipe leak ho raha hai paani bahar aa raha hai urgent plumber chahiye Kharadi me');
        showToast('Voice captured! Auto-analyzing with Gemini AI...');
        setTimeout(() => {
          handleImproveWithAI();
        }, 300);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a job title');
      return;
    }

    setIsSubmitting(true);
    try {
      await createJob({
        title: title.trim(),
        category,
        subcategory: subcategory || undefined,
        description: description.trim() || title.trim(),
        locationArea,
        urgency,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        preferredDate,
        preferredTime,
        materialRequired,
        customerName: currentUser.name,
        customerPhone: currentUser.mobile
      });

      showToast('🎉 Job posted successfully! Nearby Pune workers have been notified.');
      await refreshData();
      setIsPostJobModalOpen(false);
    } catch (e) {
      showToast('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCatObj = categories.find(c => c.name === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">{t('postJob')}</h2>
              <p className="text-xs text-blue-100">Describe your requirement & receive direct Pune worker quotes</p>
            </div>
          </div>

          <button
            onClick={() => setIsPostJobModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick AI & Voice Bar */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Smart AI & Voice Assistant:</strong> Speak in Hindi, Marathi, or English.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleVoiceSimulate}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>

              <button
                type="button"
                onClick={handleImproveWithAI}
                disabled={isAiLoading}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'Analyzing...' : 'Auto-Fill with AI'}</span>
              </button>
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Title / Issue Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Kitchen tap continuous water leakage, Bathroom drain blockage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subcategory (Optional)
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white cursor-pointer"
              >
                <option value="">General Service</option>
                {selectedCatObj?.subcategories.map(sub => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name} (from {sub.avgPriceEstimate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pune Locality and Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pune Locality *
              </label>
              <select
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white cursor-pointer"
              >
                {PUNE_LOCALITIES.map(l => (
                  <option key={l.name} value={l.name}>{l.name} ({l.zone})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as JobUrgency)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white cursor-pointer"
              >
                <option value="emergency">🚨 Emergency (Immediate dispatch)</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="flexible">Flexible Timing</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the issue, what kind of fittings/brands, when the problem started..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Budget Min (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="300"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Budget Max (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  placeholder="800"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Materials & Spare Parts Requirement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMaterialRequired('need_quotation')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                  materialRequired === 'need_quotation'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Inspect & Discuss First
              </button>

              <button
                type="button"
                onClick={() => setMaterialRequired('worker_provides')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                  materialRequired === 'worker_provides'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Worker Should Bring Material
              </button>

              <button
                type="button"
                onClick={() => setMaterialRequired('customer_provides')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                  materialRequired === 'customer_provides'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                I Already Have Material
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Posting Job...' : 'Publish Job Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
