import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Search,
  PlusCircle,
  MessageSquare,
  User,
  Briefcase,
  Layers,
  Wrench,
  ShieldCheck,
  Award
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setIsPostJobModalOpen,
    t
  } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Find Tab: Workers for Customer, Jobs for Worker */}
        {currentRole === 'customer' ? (
          <button
            onClick={() => setActiveTab('find-workers')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'find-workers' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Workers</span>
          </button>
        ) : currentRole === 'worker' ? (
          <button
            onClick={() => setActiveTab('find-jobs')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'find-jobs' ? 'text-amber-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Find Jobs</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              activeTab === 'admin-dashboard' ? 'text-purple-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Admin</span>
          </button>
        )}

        {/* Center Action Button */}
        {currentRole === 'customer' ? (
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="flex flex-col items-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-95">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] mt-0.5 font-semibold text-blue-700">Post Job</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab(currentRole === 'worker' ? 'find-jobs' : 'admin-dashboard')}
            className="flex flex-col items-center -mt-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-600 group-hover:bg-amber-700 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform active:scale-95">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="text-[10px] mt-0.5 font-semibold text-amber-700">Jobs</span>
          </button>
        )}

        {/* My Requests / My Jobs */}
        <button
          onClick={() => {
            if (currentRole === 'customer') setActiveTab('customer-dashboard');
            else if (currentRole === 'worker') setActiveTab('worker-dashboard');
            else setActiveTab('admin-dashboard');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'customer-dashboard' || activeTab === 'worker-dashboard' || activeTab === 'admin-dashboard'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">
            {currentRole === 'customer' ? 'My Requests' : currentRole === 'worker' ? 'My Work' : 'Overview'}
          </span>
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'messages' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Chat</span>
        </button>
      </div>
    </div>
  );
};
