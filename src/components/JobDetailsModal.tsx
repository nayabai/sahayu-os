import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Clock,
  MapPin,
  IndianRupee,
  Star,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Send,
  CreditCard,
  MessageSquare,
  Phone,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { updateJobStatus, selectWorkerForJob, createDispute } from '../services/api';
import { JobStatus } from '../types';

const STATUS_STEPS: { key: JobStatus; label: string }[] = [
  { key: 'POSTED', label: 'Posted' },
  { key: 'RESPONSES_RECEIVED', label: 'Quotes' },
  { key: 'WORKER_SELECTED', label: 'Selected' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'WORKER_ON_THE_WAY', label: 'On Way' },
  { key: 'ARRIVED', label: 'Arrived' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'PAYMENT', label: 'Payment' },
  { key: 'REVIEWED', label: 'Reviewed' }
];

export const JobDetailsModal: React.FC = () => {
  const {
    selectedJobForDetails,
    setSelectedJobForDetails,
    currentUser,
    currentRole,
    workers,
    openChatWith,
    triggerMaskedCall,
    setIsPaymentModalOpen,
    setSelectedJobForPayment,
    setIsReviewModalOpen,
    setSelectedJobForReview,
    showToast,
    refreshData
  } = useApp();

  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Quality issue');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!selectedJobForDetails) return null;

  const job = selectedJobForDetails;
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === job.status);

  const isCustomer = currentUser.id === job.customerId || currentRole === 'customer';
  const isAssignedWorker = currentUser.id === job.assignedWorkerId || currentRole === 'worker';

  const handleStatusTransition = async (newStatus: JobStatus) => {
    setIsUpdating(true);
    try {
      await updateJobStatus(job.id, newStatus);
      showToast(`Job status progressed to: ${newStatus.replace(/_/g, ' ')}`);
      await refreshData();
      setSelectedJobForDetails({ ...job, status: newStatus });
    } catch (e) {
      showToast('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptWorker = async (workerId: string, finalPrice?: number) => {
    setIsUpdating(true);
    try {
      const acceptedWorker = workers.find(w => w.id === workerId);
      await selectWorkerForJob(job.id, workerId, finalPrice);
      showToast(`Selected ${acceptedWorker?.name || 'Worker'}! Booking confirmed.`);
      await refreshData();
      setSelectedJobForDetails({
        ...job,
        status: 'CONFIRMED',
        assignedWorkerId: workerId,
        assignedWorkerName: acceptedWorker?.name || 'Assigned Worker'
      });
    } catch (e) {
      showToast('Error selecting worker');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDispute({
        jobId: job.id,
        jobTitle: job.title,
        reportedBy: currentUser.id,
        reporterRole: (currentRole === 'worker' ? 'worker' : 'customer'),
        reportedUserName: job.assignedWorkerName || 'Service Provider',
        reason: disputeReason,
        description: disputeDesc.trim() || 'Customer requested admin assistance regarding job delivery.'
      });
      showToast('Dispute lodged. Sahayu Pune Admin will review within 2 hours.');
      setIsDisputeOpen(false);
    } catch (e) {
      showToast('Error filing dispute');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{job.id}</span>
              <span>•</span>
              <span className="text-blue-400 font-semibold">{job.category}</span>
              <span>•</span>
              <span>{job.locationArea}, Pune</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">{job.title}</h2>
          </div>

          <button
            onClick={() => setSelectedJobForDetails(null)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Step Interactive Lifecycle Tracker */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-3.5 left-2 right-2 h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute top-3.5 left-2 h-0.5 bg-blue-600 transition-all duration-300 z-0"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%`
                }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                          : isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 whitespace-nowrap font-medium ${
                        isCurrent
                          ? 'text-blue-700 font-bold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status Quick Action Bar */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-blue-800 tracking-wider block">Current Status</span>
              <div className="text-base font-extrabold text-slate-900 capitalize">
                {job.status.replace(/_/g, ' ')}
              </div>
              {job.assignedWorkerName && (
                <div className="text-xs text-slate-600 mt-0.5">
                  Assigned Technician: <strong>{job.assignedWorkerName}</strong>
                </div>
              )}
            </div>

            {/* Role-Specific Progression Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {job.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleStatusTransition('WORKER_ON_THE_WAY')}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark "On The Way"</span>
                </button>
              )}

              {job.status === 'WORKER_ON_THE_WAY' && (
                <button
                  onClick={() => handleStatusTransition('ARRIVED')}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Mark "Arrived at Location"</span>
                </button>
              )}

              {job.status === 'ARRIVED' && (
                <button
                  onClick={() => handleStatusTransition('IN_PROGRESS')}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                >
                  Start Work (In Progress)
                </button>
              )}

              {job.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleStatusTransition('COMPLETED')}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Completed & Bill</span>
                </button>
              )}

              {['COMPLETED', 'PAYMENT'].includes(job.status) && (
                <button
                  onClick={() => {
                    setSelectedJobForPayment(job);
                    setIsPaymentModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Now (₹{job.finalPrice || 500})</span>
                </button>
              )}

              {['COMPLETED', 'PAYMENT', 'REVIEWED'].includes(job.status) && (
                <button
                  onClick={() => {
                    setSelectedJobForReview(job);
                    setIsReviewModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>{job.status === 'REVIEWED' ? 'Edit Review' : 'Rate & Review'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Job Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Location</span>
              <span className="font-bold text-slate-900">{job.locationArea}, Pune</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Urgency</span>
              <span className="font-bold text-slate-900 capitalize">{job.urgency}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Budget</span>
              <span className="font-bold text-emerald-700">
                {job.budgetMin ? `₹${job.budgetMin} - ₹${job.budgetMax || job.budgetMin}` : 'Quotation'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Preferred Time</span>
              <span className="font-bold text-slate-900">{job.preferredDate} ({job.preferredTime})</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Description</h3>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Formal Quotations Received */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Itemized Quotations Received ({job.quotations.length})
              </h3>
              <span className="text-[11px] text-slate-400">Direct breakdown from Pune technicians</span>
            </div>

            {job.quotations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No formal quotations submitted yet. Nearby workers are being notified.
              </div>
            ) : (
              <div className="space-y-3">
                {job.quotations.map(quote => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{quote.workerName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{quote.notes || quote.description}</div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Quote</span>
                        <div className="text-base font-extrabold text-slate-900">₹{quote.total ?? quote.totalAmount}</div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-slate-50 rounded-xl p-2.5 grid grid-cols-3 gap-2 text-xs text-center">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Labour</span>
                        <span className="font-bold text-slate-800">₹{quote.labourCharge ?? quote.laborCost}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Materials</span>
                        <span className="font-bold text-slate-800">₹{quote.materialCharge ?? quote.materialCost}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Travel / Visit</span>
                        <span className="font-bold text-slate-800">₹{quote.travelCharge ?? quote.travelCost}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => openChatWith({ id: quote.workerId, name: quote.workerName, role: 'worker' })}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat & Negotiate</span>
                      </button>

                      {job.status === 'POSTED' || job.status === 'RESPONSES_RECEIVED' ? (
                        <button
                          onClick={() => handleAcceptWorker(quote.workerId, quote.total ?? quote.totalAmount)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                        >
                          Accept Quotation & Confirm
                        </button>
                      ) : job.assignedWorkerId === quote.workerId ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          ✓ Accepted Partner
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications Received */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Worker Applications ({job.applications.length})
            </h3>

            {job.applications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No preliminary applications submitted yet.
              </div>
            ) : (
              <div className="space-y-2">
                {job.applications.map(app => (
                  <div
                    key={app.id}
                    className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{app.workerName}</div>
                      <div className="text-slate-500">"{app.message}" • Available: {app.availableTime}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">₹{app.estimatedPrice}</span>
                      <button
                        onClick={() => openChatWith({ id: app.workerId, name: app.workerName, role: 'worker' })}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100"
                        title="Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                      {['POSTED', 'RESPONSES_RECEIVED'].includes(job.status) && (
                        <button
                          onClick={() => handleAcceptWorker(app.workerId)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispute Reporting Form */}
          {isDisputeOpen ? (
            <form onSubmit={handleSubmitDispute} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-rose-900">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Report Dispute / Quality Complaint</span>
                </span>
                <button type="button" onClick={() => setIsDisputeOpen(false)} className="text-slate-500 hover:text-slate-800">
                  Cancel
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Complaint Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Poor Quality of Work">Poor Quality of Work</option>
                  <option value="Overcharging / Quote Deviation">Overcharging / Quote Deviation</option>
                  <option value="Worker No-Show">Worker No-Show</option>
                  <option value="Unprofessional Conduct">Unprofessional Conduct</option>
                  <option value="Property Damage">Property Damage</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Details for Sahayu Admin</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain what went wrong..."
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Submit Dispute to Pune Admin
              </button>
            </form>
          ) : (
            <div className="pt-2 text-center">
              <button
                onClick={() => setIsDisputeOpen(true)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Having an issue with this job? Lodge a Complaint / Dispute</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Customer: <strong className="text-slate-800">{job.customerName}</strong>
          </div>

          <button
            onClick={() => setSelectedJobForDetails(null)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
