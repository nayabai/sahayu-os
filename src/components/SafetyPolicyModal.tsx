import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Lock, EyeOff, Scale, HelpCircle } from 'lucide-react';

export const SafetyPolicyModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen, t } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold font-display">{t('safetyGuidelines')}</h2>
              <p className="text-xs text-slate-300">Community standards, trust protocols & privacy guarantee</p>
            </div>
          </div>

          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-700">
          {/* Section 1: Privacy Protection */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-blue-600" />
              <span>1. Strict Privacy & Contact Masking</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Sahayu safeguards the personal data of both customers and service partners across Pune & PCMC:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Worker Home Addresses</strong> are NEVER published or shared publicly. Only operating localities (e.g. Kharadi, Kothrud) are visible.</li>
              <li><strong>Customer Full Addresses</strong> are strictly shielded until a formal quotation is accepted and the job is confirmed.</li>
              <li><strong>Masked Calling Bridge:</strong> Phone calls are connected through a secure virtual number, preventing unsolicited cold calls.</li>
            </ul>
          </div>

          {/* Section 2: Verification */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>2. Multi-Tier Verification Badges</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Workers earn badges based on verifiable documents validated by Sahayu's admin verification desk:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <strong className="text-emerald-900 block">Identity Badge</strong>
                <span className="text-slate-600 text-xs">Aadhaar / Voter ID verified via UIDAI/Govt databases.</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <strong className="text-blue-900 block">Trade Skill Badge</strong>
                <span className="text-slate-600 text-xs">Vetted experience & prior customer reference check.</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <strong className="text-purple-900 block">Police Clearance</strong>
                <span className="text-slate-600 text-xs">Clean record verification for doorstep peace of mind.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing and Disputes */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>3. Transparent Pricing & Dispute Resolution</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Itemized Quotations:</strong> Workers are encouraged to break down quotes into Labour, Material, and Travel expenses before starting.</li>
              <li><strong>Prompt Dispute Mediation:</strong> If work does not meet professional standards or a price discrepancy occurs, click "Report Dispute" in the Job details. Sahayu mediators review chat logs and photos within 2 hours.</li>
              <li><strong>Direct Settle Guarantee:</strong> Workers keep 90% of earnings; customers pay transparently without hidden booking surcharges.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
