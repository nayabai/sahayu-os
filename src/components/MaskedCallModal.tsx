import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, PhoneOff, Mic, MicOff, ShieldCheck, Volume2 } from 'lucide-react';

export const MaskedCallModal: React.FC = () => {
  const { maskedCallTarget, triggerMaskedCall } = useApp();

  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!maskedCallTarget) return;

    setCallStatus('connecting');
    setSeconds(0);

    const ringTimer = setTimeout(() => {
      setCallStatus('ringing');
    }, 1200);

    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
    };
  }, [maskedCallTarget]);

  useEffect(() => {
    let interval: any;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!maskedCallTarget) return null;

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      triggerMaskedCall(null);
    }, 800);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden text-center p-6 space-y-6">
        {/* Top security pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sahayu Masked Phone Bridge</span>
        </div>

        {/* Target Info */}
        <div className="space-y-2">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center mx-auto shadow-lg">
            <Phone className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold font-display">{maskedCallTarget.name}</h3>
          <p className="text-xs text-slate-400 capitalize">
            {maskedCallTarget.role} • Pune City
          </p>

          <div className="text-sm font-semibold text-emerald-400 pt-1">
            {callStatus === 'connecting' && 'Routing via Virtual Pune IVR (+91 20 6712 9000)...'}
            {callStatus === 'ringing' && 'Ringing...'}
            {callStatus === 'connected' && `Call in Progress • ${formatTime(seconds)}`}
            {callStatus === 'ended' && 'Call Terminated'}
          </div>
        </div>

        {/* Privacy reassurance message */}
        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 text-left space-y-1">
          <div className="font-bold text-white flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Number Protection</span>
          </div>
          <p className="text-slate-400">
            Neither party can see your personal mobile number. The call is connected securely through Sahayu's encrypted Pune bridge.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Mute"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
