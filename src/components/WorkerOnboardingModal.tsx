import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  Phone,
  User,
  Wrench,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera
} from 'lucide-react';
import { PUNE_LOCALITIES } from '../data/puneData';
import { registerWorker } from '../services/api';

export const WorkerOnboardingModal: React.FC = () => {
  const {
    isWorkerOnboardingOpen,
    setIsWorkerOnboardingOpen,
    categories,
    setCurrentRole,
    setActiveTab,
    refreshData,
    showToast
  } = useApp();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');

  const [primaryCategory, setPrimaryCategory] = useState(categories[0]?.name || 'Plumbing');
  const [otherSkills, setOtherSkills] = useState<string[]>(['Pipe Fitting', 'Bathroom Repair']);
  const [skillInput, setSkillInput] = useState('');

  const [baseLocality, setBaseLocality] = useState('Kharadi');
  const [serviceAreas, setServiceAreas] = useState<string[]>(['Kharadi', 'Viman Nagar', 'Wagholi', 'Kalyani Nagar']);

  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [about, setAbout] = useState('Skilled professional with 6+ years delivering residential and commercial services across Pune.');

  const [startingPrice, setStartingPrice] = useState<number>(249);
  const [emergencyAvailable, setEmergencyAvailable] = useState<boolean>(true);

  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('XXXX-XXXX-9821');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isWorkerOnboardingOpen) return null;

  const handleSendOtp = () => {
    if (mobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsOtpSent(true);
    showToast('📲 OTP sent to your phone (Auto-filled: 1234)');
    setOtp('1234');
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !otherSkills.includes(skillInput.trim())) {
      setOtherSkills([...otherSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const toggleArea = (locName: string) => {
    if (serviceAreas.includes(locName)) {
      setServiceAreas(serviceAreas.filter(a => a !== locName));
    } else {
      setServiceAreas([...serviceAreas, locName]);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await registerWorker({
        name: name || 'Santosh Shinde',
        mobile: mobile || '9822012345',
        primaryCategory,
        otherSkills,
        baseLocality,
        serviceAreas,
        experienceYears: Number(experienceYears),
        startingPrice: Number(startingPrice),
        emergencyAvailable,
        about,
        profilePhoto,
        languages: ['Marathi', 'Hindi', 'English']
      });

      showToast('🎉 Welcome to Sahayu! Your skilled partner profile is now live.');
      await refreshData();
      setCurrentRole('worker');
      setActiveTab('worker-dashboard');
      setIsWorkerOnboardingOpen(false);
    } catch (e) {
      showToast('Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
              Step {step} of 8
            </span>
            <h2 className="text-base sm:text-lg font-bold font-display mt-1">
              Join as a Sahayu Skilled Partner
            </h2>
          </div>

          <button
            onClick={() => setIsWorkerOnboardingOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          {/* STEP 1: Phone & OTP */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enter your mobile number</h3>
                <p className="text-xs text-slate-500">We will send you a one-time passcode for secure login.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (10 Digits)</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 font-bold text-slate-600 flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98220 12345"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs shrink-0"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-32 tracking-widest text-center text-base font-bold px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/50"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Name & Photo */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Full Name & Profile Photo</h3>
                <p className="text-xs text-slate-500">Customers in Pune trust workers with clear names and real photos.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Santosh Dilip Shinde"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <img
                  src={profilePhoto}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Profile Picture Preview</span>
                  <span className="text-[11px] text-slate-400">Default professional avatar assigned. You can upload custom anytime.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Primary Skill & Subskills */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">What is your primary skill?</h3>
                <p className="text-xs text-slate-500">Choose your main trade so we can send you relevant Pune jobs.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Trade *</label>
                <select
                  value={primaryCategory}
                  onChange={(e) => setPrimaryCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Other Specific Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Geyser installation, PVC piping"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {otherSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Locality & Service Areas */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pune Service Localities</h3>
                <p className="text-xs text-slate-500">Select where you are based and which areas you can travel to.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Home Base Area *</label>
                <select
                  value={baseLocality}
                  onChange={(e) => setBaseLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-white"
                >
                  {PUNE_LOCALITIES.map(l => (
                    <option key={l.name} value={l.name}>{l.name} ({l.zone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Service Areas (Tap to toggle)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                  {PUNE_LOCALITIES.map(l => {
                    const isSelected = serviceAreas.includes(l.name);
                    return (
                      <button
                        key={l.name}
                        type="button"
                        onClick={() => toggleArea(l.name)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-colors ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {l.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Experience & Bio */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Experience & Short Bio</h3>
                <p className="text-xs text-slate-500">Highlight your craftsmanship to stand out.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Years of Practical Experience *</label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Your Work</label>
                <textarea
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Pricing & Emergency */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pricing & Emergency Availability</h3>
                <p className="text-xs text-slate-500">Set your starting consultation or basic inspection fee.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Starting Service/Visit Fee (₹) *</label>
                <div className="relative w-40">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={99}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-900 text-xs sm:text-sm block">Emergency Job Alerts</span>
                  <span className="text-[11px] text-rose-700">Receive high-urgency job alerts for pipe bursts and electrical failures in Pune.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyAvailable}
                  onChange={(e) => setEmergencyAvailable(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 7: ID Verification */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Government Identity Badge</h3>
                <p className="text-xs text-slate-500">Get the blue "ID Verified" badge on your public profile.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Identity Document Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Voter ID">Voter ID (Election Card)</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 py-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-semibold block">Document Captured & Digitally Verified</span>
                <span className="text-[10px] text-slate-400">Your privacy is protected. ID number is never shown to customers.</span>
              </div>
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {step === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Review & Launch Your Profile</h3>
                <p className="text-xs text-slate-500">Check your partner details before publishing on Sahayu.</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <strong className="text-slate-900">{name || 'Santosh Shinde'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Skill:</span>
                  <strong className="text-amber-700">{primaryCategory}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Locality:</span>
                  <strong className="text-slate-900">{baseLocality}, Pune</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Starting Price:</span>
                  <strong className="text-slate-900">₹{startingPrice}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Dispatch:</span>
                  <strong className="text-emerald-600">{emergencyAvailable ? 'Enabled' : 'Disabled'}</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fair Platform Guarantee</span>
                </span>
                <p className="text-[11px] text-emerald-800">
                  You keep 90% take-home earnings with transparent weekly direct bank transfers. Zero bidding fees.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 8 ? (
              <>
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Activating Profile...' : 'Complete & Start Earning'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
