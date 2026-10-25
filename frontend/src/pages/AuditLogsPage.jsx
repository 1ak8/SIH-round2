import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Search, Filter, RefreshCw, Lock } from 'lucide-react';
import { adminAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AuditTrailTimeline from '../components/common/AuditTrailTimeline';

export const AuditLogsPage = () => {
  const { showToast, refreshKey } = useApp();
  const { activeRole, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  
  // Initialize role filter based on active role
  const getDefaultRoleFilter = () => {
    switch (activeRole) {
      case 'college':
        return 'College';
      case 'ro':
        return 'RO';
      case 'evc':
        return 'EVC';
      case 'hq':
      default:
        return 'All';
    }
  };

  const [roleFilter, setRoleFilter] = useState(getDefaultRoleFilter);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setRoleFilter(getDefaultRoleFilter());
  }, [activeRole]);

  useEffect(() => {
    fetchAuditLogs();
  }, [refreshKey, roleFilter, activeRole]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter !== 'All') params.role = roleFilter;
      if (search.trim()) params.search = search;

      const res = await adminAPI.getAuditLogs(params);
      if (res.data?.success) {
        setLogs(res.data.auditLogs || []);
      }
    } catch (err) {
      showToast(err.message || 'Error fetching audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAuditLogs();
  };

  return (
    <div className="space-y-6">
      {/* Clean Boxless Header Tailored by Role */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {activeRole === 'college'
                ? 'Institutional Governance'
                : activeRole === 'ro'
                ? 'Regional Scrutiny Desk'
                : activeRole === 'evc'
                ? 'Field Inspection Audit'
                : 'National Council Secretariat'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-emerald-700 font-bold">Cryptographic Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
            <Lock className="w-7 h-7 text-emerald-600" />
            <span>
              {activeRole === 'college'
                ? 'Institutional Statutory Audit Trail'
                : activeRole === 'ro'
                ? 'Regional Scrutiny & Objection Audit Trail'
                : activeRole === 'evc'
                ? 'EVC On-Site Inspection & Geofence Verification Ledger'
                : 'National Sovereign Statutory Audit Trail'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {activeRole === 'college'
              ? `Cryptographically verified chronological log of all statutory submissions, deficiency responses, and officer clearances for ${user?.institutionName || 'Apex Institute of Technology, Bhopal'}.`
              : activeRole === 'ro'
              ? 'Immutable chronological ledger recording Regional Scrutiny verifications, clause deficiency objections, and hearing clearances under APH 2024-27.'
              : activeRole === 'evc'
              ? 'Immutable verification records of campus visits, geofence radius validations, and physical original document stamps.'
              : 'Full-scope sovereign cryptographic ledger recording macro policy adjustments, SLA auto-escalations, and Council approvals nationwide.'}
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'College', 'RO', 'EVC', 'HQ Super-Admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                roleFilter === r
                  ? 'bg-[#0c2340] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search action, actor, applicationId..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-[#0c2340] transition bg-white"
          />
        </form>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Immutable Action Records ({logs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log ordered by statutory execution timestamp.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80 font-mono">
            {activeRole === 'college'
              ? 'Institutional Scope'
              : roleFilter === 'All'
              ? 'Pan-India Scope'
              : `${roleFilter} Scope`}
          </span>
        </div>
        <AuditTrailTimeline logs={logs} />
      </div>
    </div>
  );
};

export default AuditLogsPage;
