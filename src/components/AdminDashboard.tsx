import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Check,
  FileText,
  DollarSign,
  MapPin,
  Star,
  Settings
} from 'lucide-react';
import { fetchAdminStats, updateAdminVerification, fetchDisputes, resolveDispute, fetchCommissionConfig, updateCommissionConfig } from '../services/api';
import { AdminStats, Dispute, CommissionConfig } from '../types';

export const AdminDashboard: React.FC = () => {
  const { workers, jobs, setSelectedJobForDetails, showToast, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'workers' | 'jobs' | 'disputes' | 'commission'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [disputesList, setDisputesList] = useState<Dispute[]>([]);
  const [commission, setCommission] = useState<CommissionConfig | null>(null);
  const [workerSearch, setWorkerSearch] = useState('');
  const [editingCommPercent, setEditingCommPercent] = useState<number>(10);

  const loadAdminData = async () => {
    try {
      const [s, d, c] = await Promise.all([
        fetchAdminStats(),
        fetchDisputes(),
        fetchCommissionConfig()
      ]);
      setStats(s);
      setDisputesList(d);
      setCommission(c);
      if (c) setEditingCommPercent(c.defaultPercentage);
    } catch (e) {
      console.warn('Failed to load admin data', e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyBadge = async (workerId: string, badgeType: 'identityVerified' | 'skillVerified' | 'backgroundVerified', currentVal: boolean) => {
    try {
      await updateAdminVerification(workerId, { [badgeType]: !currentVal });
      showToast(`Worker badge ${badgeType} updated successfully!`);
      await refreshData();
      await loadAdminData();
    } catch (e) {
      showToast('Error updating badge');
    }
  };

  const handleResolveDispute = async (id: string) => {
    try {
      await resolveDispute(id, 'resolved', 'Resolved by Sahayu Admin after verifying service log and user statements.');
      showToast('Dispute marked resolved.');
      await loadAdminData();
    } catch (e) {
      showToast('Error resolving dispute');
    }
  };

  const handleSaveCommission = async () => {
    try {
      await updateCommissionConfig({ defaultPercentage: Number(editingCommPercent) });
      showToast(`Default platform commission updated to ${editingCommPercent}%`);
      await loadAdminData();
    } catch (e) {
      showToast('Error updating commission');
    }
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.primaryCategory.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.baseLocality.toLowerCase().includes(workerSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Title */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Master Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Sahayu Administration (Pune Hub)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time verification oversight, jobs tracking, dispute resolution, and commission controls.
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'workers' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Workers ({workers.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'jobs' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'disputes' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Disputes ({disputesList.filter(d => d.status === 'investigating').length})
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'commission' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Commission
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
            <span className="text-[10px] text-emerald-600">Active in Pune</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Workers</span>
            <div className="text-2xl font-bold text-slate-900">{stats.totalWorkers}</div>
            <span className="text-[10px] text-blue-600">{stats.verifiedWorkers} verified</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <div className="text-2xl font-bold text-amber-600">{stats.activeJobs}</div>
            <span className="text-[10px] text-slate-400">In progress</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gross Value</span>
            <div className="text-2xl font-bold text-slate-900">₹{(stats.totalRevenue).toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-emerald-600">Total job bookings</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Platform Commission</span>
            <div className="text-2xl font-bold text-emerald-700">₹{(stats.platformCommission).toLocaleString('en-IN')}</div>
            <span className="text-[10px] text-slate-400">10% avg margin</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Open Disputes</span>
            <div className="text-2xl font-bold text-rose-600">{stats.openDisputes}</div>
            <span className="text-[10px] text-slate-400">Requires review</span>
          </div>
        </div>
      )}

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand by Category */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Pune Category Demand Share</h3>
            <div className="space-y-3">
              {[
                { name: 'Plumbing (Tap / Pipe / Leakage)', share: '34%', jobs: 142, color: 'bg-blue-600' },
                { name: 'Electrical (Wiring / Fan / MCB)', share: '26%', jobs: 110, color: 'bg-amber-500' },
                { name: 'Household Help & Deep Cleaning', share: '18%', jobs: 76, color: 'bg-emerald-500' },
                { name: 'Appliance Repair (AC / Fridge)', share: '12%', jobs: 52, color: 'bg-sky-500' },
                { name: 'Carpentry & Furniture', share: '10%', jobs: 44, color: 'bg-orange-500' }
              ].map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-slate-600">{cat.share} ({cat.jobs} jobs)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pune Localities */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Top Localities by Job Volume</h3>
            <div className="space-y-3">
              {[
                { name: 'Kharadi (East Pune)', volume: '94 jobs', workers: '18 workers', rating: '4.88' },
                { name: 'Wakad & Hinjewadi (West Pune)', volume: '88 jobs', workers: '22 workers', rating: '4.84' },
                { name: 'Hadapsar & Magarpatta', volume: '72 jobs', workers: '14 workers', rating: '4.85' },
                { name: 'Kothrud & Karve Nagar', volume: '64 jobs', workers: '12 workers', rating: '4.91' },
                { name: 'Baner & Aundh', volume: '58 jobs', workers: '16 workers', rating: '4.80' }
              ].map(loc => (
                <div key={loc.name} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{loc.name}</div>
                    <div className="text-slate-500">{loc.workers} active</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-700">{loc.volume}</div>
                    <div className="text-amber-600 font-semibold">{loc.rating}★ avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Worker Verification Management */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Worker Profiles & Trust Badges</h3>
              <p className="text-xs text-slate-500">Inspect credentials and toggle real database verification statuses.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search worker by name, skill..."
                value={workerSearch}
                onChange={(e) => setWorkerSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Worker</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Locality</th>
                  <th className="py-2.5 px-3">Govt ID Badge</th>
                  <th className="py-2.5 px-3">Skill Badge</th>
                  <th className="py-2.5 px-3">Police Check</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkers.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 flex items-center gap-2.5">
                      <img
                        src={w.profilePhoto}
                        alt={w.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{w.name}</div>
                        <div className="text-[11px] text-slate-400">{w.mobile}</div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">{w.primaryCategory}</td>
                    <td className="py-3 px-3 text-slate-600">{w.baseLocality}</td>

                    {/* ID Badge toggle */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleVerifyBadge(w.id, 'identityVerified', w.verification.identityVerified)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
                          w.verification.identityVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {w.verification.identityVerified ? <Check className="w-3 h-3 text-emerald-700" /> : <XCircle className="w-3 h-3" />}
                        <span>{w.verification.identityVerified ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>

                    {/* Skill Badge toggle */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleVerifyBadge(w.id, 'skillVerified', w.verification.skillVerified)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
                          w.verification.skillVerified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {w.verification.skillVerified ? <Check className="w-3 h-3 text-blue-700" /> : <XCircle className="w-3 h-3" />}
                        <span>{w.verification.skillVerified ? 'Skill Verified' : 'Pending Test'}</span>
                      </button>
                    </td>

                    {/* Background Badge toggle */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleVerifyBadge(w.id, 'backgroundVerified', w.verification.backgroundVerified)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 ${
                          w.verification.backgroundVerified
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {w.verification.backgroundVerified ? <Check className="w-3 h-3 text-purple-700" /> : <XCircle className="w-3 h-3" />}
                        <span>{w.verification.backgroundVerified ? 'Cleared' : 'Pending'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-400 font-medium">{w.rating}★ ({w.completedJobs} jobs)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Jobs Management */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">All Jobs in System</h3>
            <span className="text-xs text-slate-500">Showing {jobs.length} jobs</span>
          </div>

          <div className="space-y-3">
            {jobs.map(j => (
              <div
                key={j.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{j.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">{j.status}</span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    Customer: {j.customerName} ({j.customerPhone}) • Locality: {j.locationArea} • Budget: ₹{j.budgetMin || 300}-₹{j.budgetMax || 800}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400">{j.applications.length} apps • {j.quotations.length} quotes</span>
                  <button
                    onClick={() => setSelectedJobForDetails(j)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Disputes Management */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900">Disputes & Complaints</h3>

          {disputesList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No disputes reported</div>
          ) : (
            disputesList.map(disp => (
              <div
                key={disp.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-800 text-sm">{disp.reason} - {disp.jobTitle}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    disp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {disp.status}
                  </span>
                </div>

                <p className="text-slate-700">{disp.description}</p>
                <div className="text-slate-500">Reported against: <strong>{disp.reportedUserName}</strong></div>

                {disp.status === 'investigating' && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleResolveDispute(disp.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Mark Resolved & Close Complaint
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Commission Settings */}
      {activeTab === 'commission' && commission && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-xl">
          <div>
            <h3 className="font-bold text-base text-slate-900">Platform Commission Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configurable commission per completed job in Pune. Workers retain the remaining take-home earnings.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Commission Percentage (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={editingCommPercent}
                  onChange={(e) => setEditingCommPercent(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                />
                <span className="text-xs text-slate-500">(Worker keeps {100 - editingCommPercent}%)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
              <div className="font-semibold text-slate-800">Category Specific Rates:</div>
              <div className="flex justify-between"><span>Household Help & Maids</span><strong>8%</strong></div>
              <div className="flex justify-between"><span>Plumbing & Electrical</span><strong>10%</strong></div>
              <div className="flex justify-between"><span>Technical & Laptop Repair</span><strong>12%</strong></div>
            </div>

            <button
              onClick={handleSaveCommission}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
            >
              Save Commission Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
