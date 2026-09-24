import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
  Smartphone,
  Banknote,
  Building
} from 'lucide-react';
import { processPayment } from '../services/api';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedJobForPayment,
    showToast,
    refreshData,
    setIsReviewModalOpen,
    setSelectedJobForReview
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPaymentModalOpen || !selectedJobForPayment) return null;

  const job = selectedJobForPayment;
  const baseAmount = job.finalPrice || (job.quotations[0]?.total) || 650;
  const platformFee = Math.round(baseAmount * 0.1);
  const workerTakes = baseAmount - platformFee;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await processPayment(job.id, baseAmount, paymentMethod);
      showToast(`Payment of ₹${baseAmount} completed successfully via ${paymentMethod.toUpperCase()}!`);
      await refreshData();
      setIsPaymentModalOpen(false);

      // Prompt for review after payment
      setTimeout(() => {
        setSelectedJobForReview(job);
        setIsReviewModalOpen(true);
      }, 500);
    } catch (e) {
      showToast('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold font-display">Settle Service Payment</h2>
              <p className="text-xs text-emerald-100">{job.title}</p>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Bill Breakdown Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
              Invoice Summary
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Service & Labour Charges</span>
              <span>₹{baseAmount}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Technician Payout (90%)</span>
              <span>₹{workerTakes}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Sahayu Platform Fee (10%)</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Payable</span>
              <span className="text-emerald-700 text-base">₹{baseAmount}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Payment Method
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>UPI / GPay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Cash on Hand</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Debit / Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* UPI details */}
          {paymentMethod === 'upi' && (
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block">Instant UPI Apps:</span>
              <div className="grid grid-cols-4 gap-2 text-center font-bold">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <div key={app} className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 cursor-pointer shadow-2xs">
                    {app}
                  </div>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Or enter UPI ID (e.g. yourname@okhdfcbank)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Cash details */}
          {paymentMethod === 'cash' && (
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
              Hand ₹{baseAmount} directly to technician <strong>{job.assignedWorkerName}</strong> upon completion. Both parties will receive an instant digital receipt.
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-bit encrypted security • 30-day service warranty protection</span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? 'Processing Transaction...' : `Confirm & Pay ₹${baseAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};
