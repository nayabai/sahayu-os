import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
  Smartphone,
  Banknote,
  Building,
  Zap,
  QrCode,
  ArrowRight,
  ExternalLink,
  Receipt,
  Download,
  Copy,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { processPayment, fetchPublicConfig } from '../services/api';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedJobForPayment,
    currentUser,
    showToast,
    refreshData,
    setIsReviewModalOpen,
    setSelectedJobForReview
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'netbanking'>('upi');
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'intent' | 'vpa'>('qr');
  const [customUpiId, setCustomUpiId] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);

  const sahayuVpa = 'sahayu.services@okhdfcbank';

  if (!isPaymentModalOpen || !selectedJobForPayment) return null;

  const job = selectedJobForPayment;
  const baseAmount = job.finalPrice || (job.quotations[0]?.total) || 650;
  const platformFee = Math.round(baseAmount * 0.1);
  const workerTakes = baseAmount - platformFee;
  const upiIntentUri = `upi://pay?pa=${sahayuVpa}&pn=Sahayu+Pune&am=${baseAmount}&cu=INR&tn=${encodeURIComponent(`Job ${job.id} ${job.title.slice(0, 20)}`)}`;

  // Generate dynamic UPI QR Code
  useEffect(() => {
    QRCode.toDataURL(upiIntentUri, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.warn('QR generation error:', err));
  }, [upiIntentUri, baseAmount]);

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(sahayuVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const txnId = `TXN-PUN-${Date.now().toString().slice(-6)}`;
      const res = await processPayment(job.id, baseAmount, paymentMethod);

      const receipt = {
        txnId,
        jobId: job.id,
        jobTitle: job.title,
        amount: baseAmount,
        platformFee,
        workerTakes,
        workerName: job.assignedWorkerName || 'Assigned Technician',
        paymentMethod: paymentMethod.toUpperCase(),
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setReceiptData(receipt);
      setPaymentSuccess(true);
      await refreshData();
      showToast(`Payment of ₹${baseAmount} successfully verified!`);
    } catch (err: any) {
      showToast(err?.message || 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndReview = () => {
    setIsPaymentModalOpen(false);
    setPaymentSuccess(false);
    setReceiptData(null);
    setTimeout(() => {
      setSelectedJobForReview(job);
      setIsReviewModalOpen(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">

        {/* Modal Header */}
        <div className="p-5 bg-linear-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
              Secure Escrow Settlement
            </span>
            <h3 className="font-extrabold text-lg flex items-center gap-1.5">
              <span>Job Settlement & Invoice</span>
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </h3>
          </div>
          <button
            onClick={() => {
              setIsPaymentModalOpen(false);
              setPaymentSuccess(false);
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Success State / Digital Invoice */}
          {paymentSuccess && receiptData ? (
            <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">Payment Completed!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Settlement verified for job <strong className="text-slate-800">{job.title}</strong>
                </p>
              </div>

              {/* Digital Tax Invoice Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    Official Payment Receipt
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{receiptData.txnId}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Service:</span>
                    <strong className="text-slate-900">{receiptData.jobTitle}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Technician:</span>
                    <strong className="text-slate-900">{receiptData.workerName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                      {receiptData.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Date & Time:</span>
                    <span>{receiptData.date}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Technician Payout (90%):</span>
                    <span>₹{receiptData.workerTakes}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Platform & Insurance Fee (10%):</span>
                    <span>₹{receiptData.platformFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Amount Paid:</span>
                    <span className="text-emerald-700">₹{receiptData.amount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleFinishAndReview}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Leave Rating & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Job Summary Banner */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Payable</span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{job.title}</h4>
                  <p className="text-xs text-slate-500">Technician: {job.assignedWorkerName || 'Santosh Shinde'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700 flex items-center justify-end">
                    <IndianRupee className="w-5 h-5" />
                    {baseAmount}
                  </span>
                  <span className="text-[10px] text-slate-400">All taxes included</span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">Choose Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold">Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-bold">NetBank</span>
                  </button>
                </div>
              </div>

              {/* UPI Tab Content: Native Dynamic QR + UPI Intent */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Scan & Pay via Any UPI App</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      Zero Fees
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    {qrDataUrl ? (
                      <div className="relative">
                        <img src={qrDataUrl} alt="UPI Payment QR" className="w-44 h-44 rounded-lg object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-white shadow-md p-1 flex items-center justify-center border border-slate-200">
                            <span className="text-[10px] font-black text-emerald-700">₹</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-44 h-44 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        Generating QR...
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">
                      Google Pay • PhonePe • Paytm • BHIM • Cred
                    </p>
                  </div>

                  {/* VPA Copy Bar */}
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Sahayu Merchant UPI ID</span>
                      <code className="text-slate-800 font-mono font-bold text-xs">{sahayuVpa}</code>
                    </div>
                    <button
                      onClick={handleCopyVpa}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Mobile Direct Pay Button */}
                  <div className="block sm:hidden">
                    <a
                      href={upiIntentUri}
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open UPI App on Phone</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Cash On Hand */}
              {paymentMethod === 'cash' && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Banknote className="w-4 h-4 text-amber-700" />
                    <span>Cash on Hand Handover</span>
                  </div>
                  <p className="text-amber-800/90 leading-relaxed">
                    Pay <strong>₹{baseAmount}</strong> directly to technician{' '}
                    <strong>{job.assignedWorkerName || 'the assigned worker'}</strong> upon inspection of completed work.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Once handed over, click "Confirm & Generate Receipt" to mark the job settled in the system.
                  </p>
                </div>
              )}

              {/* Card Simulator */}
              {paymentMethod === 'card' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Debit / Credit Card (RuPay, Visa, MasterCard)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Instant</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4532 •••• •••• 9821)"
                      defaultValue="4532 8920 1200 9821"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="882"
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Simulator */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                  <span className="font-bold text-slate-800 block">Select Your Indian Bank</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Bank of Maharashtra'].map((b, i) => (
                      <div
                        key={b}
                        className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                          i === 0 ? 'bg-purple-50 border-purple-400 text-purple-900' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badge */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sahayu 100% Escrow Guarantee</span>
                </span>
                <span>Immediate Digital Invoice</span>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/25 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <span>Confirm ₹{baseAmount} Payment & Generate Receipt</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
