import React, { useState, useEffect } from 'react';
import {
  Radar,
  FileText,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Search,
  Bell,
  RefreshCw,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { complianceAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import DocumentRadarCard from '../components/college/DocumentRadarCard';

export const DocumentsWatchdogPage = () => {
  const { showToast, openModal, refreshKey } = useApp();
  const { activeRole, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    valid: 0,
    expiringSoon: 0,
    expired: 0,
    pendingClearance: 0,
    verifiedOnsiteCount: 0,
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRadar();
  }, [refreshKey, activeRole, regionFilter]);

  const fetchRadar = async () => {
    try {
      setLoading(true);
      const params = { role: activeRole };
      if (regionFilter !== 'All') params.region = regionFilter;

      const res = await complianceAPI.getRadar(params);
      if (res.data?.success) {
        setDocuments(res.data.documents || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      showToast(err.message || 'Error loading document radar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter tabs configured per active role
  const getFilterOptions = () => {
    switch (activeRole) {
      case 'ro':
        return [
          { id: 'all', label: 'All Regional Dockets' },
          { id: 'pending', label: 'Pending RO Clearance' },
          { id: 'expiring', label: 'Expiring Soon (<60d)' },
          { id: 'expired', label: 'Expired / Defaulted' },
        ];
      case 'evc':
        return [
          { id: 'all', label: 'All Inspection Deeds' },
          { id: 'verified', label: 'Physical Verified On-Site' },
          { id: 'pending', label: 'Pending Physical Check' },
          { id: 'deficient', label: 'Deficient / Expired' },
        ];
      case 'hq':
        return [
          { id: 'all', label: 'All National Dockets' },
          { id: 'valid', label: 'Statutory Valid' },
          { id: 'expiring', label: 'Critical Horizon (<60d)' },
          { id: 'expired', label: 'Statutory Violations' },
        ];
      case 'college':
      default:
        return [
          { id: 'all', label: 'All Certificates' },
          { id: 'valid', label: 'Valid Only' },
          { id: 'expiring', label: 'Expiring Soon (<60d)' },
          { id: 'expired', label: 'Expired' },
        ];
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (regionFilter !== 'All' && doc.region !== regionFilter) return false;

    if (activeRole === 'ro') {
      if (activeFilter === 'pending' && !doc.renewalSubmitted) return false;
      if (activeFilter === 'expiring' && doc.validityStatus !== 'Expiring Soon') return false;
      if (activeFilter === 'expired' && doc.validityStatus !== 'Expired') return false;
    } else if (activeRole === 'evc') {
      if (activeFilter === 'verified' && !doc.verifiedOnsite) return false;
      if (activeFilter === 'pending' && doc.verifiedOnsite) return false;
      if (activeFilter === 'deficient' && doc.validityStatus === 'Valid') return false;
    } else {
      if (activeFilter === 'valid' && doc.validityStatus !== 'Valid') return false;
      if (activeFilter === 'expiring' && doc.validityStatus !== 'Expiring Soon') return false;
      if (activeFilter === 'expired' && doc.validityStatus !== 'Expired') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.institutionName?.toLowerCase().includes(q) ||
        doc.docType?.toLowerCase().includes(q) ||
        doc.certificateNumber?.toLowerCase().includes(q) ||
        doc.applicationId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Role-Aware Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {activeRole === 'college'
                ? 'Institutional Compliance'
                : activeRole === 'ro'
                ? 'Regional Office Scrutiny'
                : activeRole === 'evc'
                ? 'Expert Visit Committee'
                : 'National Council Secretariat'}
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-blue-600 font-bold">APH Clause 4.6</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              {activeRole === 'college'
                ? `${user?.institutionName || 'Apex Institute of Technology, Bhopal'} • Central Region`
                : activeRole === 'ro'
                ? 'Western & Central Regional Jurisdictions'
                : activeRole === 'evc'
                ? 'Assigned Inspection: Delhi Engineering & Technology Academy'
                : 'Pan-India National Oversight'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
            <Radar className="w-7 h-7 text-blue-600" />
            <span>
              {activeRole === 'college'
                ? 'Institutional Lease & Document Validity Radar'
                : activeRole === 'ro'
                ? 'Regional Compliance & Statutory Watchdog'
                : activeRole === 'evc'
                ? 'On-Site Statutory Document Verification Desk'
                : 'National Statutory Document & Compliance Radar'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {activeRole === 'college'
              ? 'Proactive tracking of Land Lease Deeds, Fire Safety NOCs, Building Stability & Affiliations for your campus. Timely renewal prevents regulatory deficiencies & EoA blocking.'
              : activeRole === 'ro'
              ? 'Surveillance of statutory certificates across Western & Central Regional Institutions. Verify submitted renewal receipts, issue show-cause notices, or trigger regulatory alerts.'
              : activeRole === 'evc'
              ? 'Mandatory physical original document verification for Delhi Engineering & Technology Academy. Cross-check physical stamped deeds against digital docket inside geofence.'
              : 'Pan-India statutory compliance tracking across all 8 Regional Offices. Macro surveillance of institutional land security, building stability, and fire safety norms.'}
          </p>
        </div>

        <button
          onClick={fetchRadar}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span>Refresh Radar</span>
        </button>
      </div>

      {/* Dynamic Summary Stat Ribbon */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#ea580c] via-[#0c2340] to-[#059669]" />

        {/* Card 1: Total */}
        <div
          onClick={() => setActiveFilter('all')}
          className={`p-5 lg:p-6 cursor-pointer transition-all duration-150 hover:bg-slate-50/90 flex flex-col justify-between group ${
            activeFilter === 'all' ? 'bg-slate-50/90' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs sm:text-[13px] font-bold text-slate-700 tracking-wide uppercase">
              {activeRole === 'college'
                ? 'My Dockets'
                : activeRole === 'ro'
                ? 'Regional Dockets'
                : activeRole === 'evc'
                ? 'Inspection Dockets'
                : 'National Dockets'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              All
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
            {summary.total || documents.length}
          </div>
          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 font-medium">
            {activeRole === 'college'
              ? 'Apex Institute Certificates'
              : activeRole === 'ro'
              ? 'Under Regional Surveillance'
              : activeRole === 'evc'
              ? 'Scheduled Campus Check'
              : 'Pan-India Active Certificates'}
          </p>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mr-2">
              <div className="h-full bg-slate-600 rounded-full w-3/4 group-hover:w-full transition-all duration-500" />
            </div>
            <span className="shrink-0 font-bold text-slate-500 group-hover:text-slate-800 transition">View →</span>
          </div>
        </div>

        {/* Card 2: Valid or Pending Clearance */}
        <div
          onClick={() => setActiveFilter(activeRole === 'ro' ? 'pending' : activeRole === 'evc' ? 'verified' : 'valid')}
          className={`p-5 lg:p-6 cursor-pointer transition-all duration-150 hover:bg-emerald-50/40 flex flex-col justify-between group ${
            (activeRole === 'ro' && activeFilter === 'pending') ||
            (activeRole === 'evc' && activeFilter === 'verified') ||
            activeFilter === 'valid'
              ? 'bg-emerald-50/40'
              : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs sm:text-[13px] font-bold text-emerald-700 tracking-wide uppercase">
              {activeRole === 'ro'
                ? 'Pending Clearance'
                : activeRole === 'evc'
                ? 'Physical Verified'
                : 'Statutory Valid'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {activeRole === 'ro' ? 'RO Review' : activeRole === 'evc' ? 'On-Site' : 'Clear'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-display tabular-nums">
            {activeRole === 'ro'
              ? summary.pendingClearance || 1
              : activeRole === 'evc'
              ? summary.verifiedOnsiteCount || 0
              : summary.valid || 0}
          </div>
          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 font-medium">
            {activeRole === 'ro'
              ? 'Receipts uploaded by colleges'
              : activeRole === 'evc'
              ? 'Stamped inside geofence'
              : '>60 Days Buffer'}
          </p>
          <div className="mt-3.5 pt-2.5 border-t border-emerald-100/60 flex items-center justify-between text-xs text-emerald-700">
            <div className="w-full bg-emerald-100 h-1 rounded-full overflow-hidden mr-2">
              <div className="h-full bg-emerald-500 rounded-full w-3/4 group-hover:w-full transition-all duration-500" />
            </div>
            <span className="shrink-0 font-bold group-hover:text-emerald-900 transition">View →</span>
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div
          onClick={() => setActiveFilter(activeRole === 'evc' ? 'pending' : 'expiring')}
          className={`p-5 lg:p-6 cursor-pointer transition-all duration-150 hover:bg-amber-50/40 flex flex-col justify-between group ${
            (activeRole === 'evc' && activeFilter === 'pending') || activeFilter === 'expiring'
              ? 'bg-amber-50/40'
              : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs sm:text-[13px] font-bold text-amber-800 tracking-wide uppercase">
              {activeRole === 'evc' ? 'Pending Check' : 'Expiring Soon'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {activeRole === 'evc' ? 'Awaiting Seal' : '<60d Notice'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 font-display tabular-nums">
            {activeRole === 'evc'
              ? Math.max(0, (summary.total || 0) - (summary.verifiedOnsiteCount || 0))
              : summary.expiringSoon || 0}
          </div>
          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 font-medium">
            {activeRole === 'evc' ? 'Awaiting physical seal verification' : 'Pre-Expiry Alert Horizon'}
          </p>
          <div className="mt-3.5 pt-2.5 border-t border-amber-100/60 flex items-center justify-between text-xs text-amber-700">
            <div className="w-full bg-amber-100 h-1 rounded-full overflow-hidden mr-2">
              <div className="h-full bg-amber-500 rounded-full w-3/4 group-hover:w-full transition-all duration-500" />
            </div>
            <span className="shrink-0 font-bold group-hover:text-amber-900 transition">View →</span>
          </div>
        </div>

        {/* Card 4: Expired / Action Required */}
        <div
          onClick={() => setActiveFilter(activeRole === 'evc' ? 'deficient' : 'expired')}
          className={`p-5 lg:p-6 cursor-pointer transition-all duration-150 hover:bg-rose-50/40 flex flex-col justify-between group ${
            (activeRole === 'evc' && activeFilter === 'deficient') || activeFilter === 'expired'
              ? 'bg-rose-50/40'
              : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs sm:text-[13px] font-bold text-rose-700 tracking-wide uppercase">
              {activeRole === 'evc' ? 'Deficiencies' : 'Expired / Default'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Action Req.
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 font-display tabular-nums">
            {summary.expired || 0}
          </div>
          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 font-medium">
            {activeRole === 'college'
              ? 'Upload renewed receipt immediately'
              : activeRole === 'ro'
              ? 'Show-Cause Notices dispatched'
              : 'Statutory breach under Clause 4.6'}
          </p>
          <div className="mt-3.5 pt-2.5 border-t border-rose-100/60 flex items-center justify-between text-xs text-rose-700">
            <div className="w-full bg-rose-100 h-1 rounded-full overflow-hidden mr-2">
              <div className="h-full bg-rose-500 rounded-full w-3/4 group-hover:w-full transition-all duration-500" />
            </div>
            <span className="shrink-0 font-bold group-hover:text-rose-900 transition">View →</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Regional Scope Dropdown for Officers */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {getFilterOptions().map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-[#0c2340] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          {/* Region selector for RO and HQ */}
          {activeRole !== 'college' && (
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c2340] cursor-pointer"
              >
                <option value="All">All Regions</option>
                <option value="Central">Central Region</option>
                <option value="Western">Western Region</option>
                <option value="Northern">Northern Region</option>
                <option value="Southern">Southern Region</option>
                <option value="Eastern">Eastern Region</option>
              </select>
            </div>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                activeRole === 'college'
                  ? 'Search certificate, authority...'
                  : 'Search by College, cert no...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:border-[#0c2340] transition bg-white"
            />
          </div>
        </div>
      </div>

      {/* Document Grid - Full Width Responsive Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-sm">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No Certificates Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            No compliance certificates match the current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {filteredDocs.map((doc, idx) => (
            <DocumentRadarCard
              key={doc._id || idx}
              document={doc}
              onRenewed={fetchRadar}
              onOpenAlertModal={(d) => openModal('alert', d)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsWatchdogPage;
