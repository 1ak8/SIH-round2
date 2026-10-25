import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  ShieldAlert,
} from 'lucide-react';
import { scrutinyAPI, applicationAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import RegionalInboxTable from './RegionalInboxTable';
import DigitalScrutinyDesk from './DigitalScrutinyDesk';

export const RODashboard = () => {
  const { showToast, refreshKey } = useApp();
  const [loading, setLoading] = useState(true);
  const [queueData, setQueueData] = useState({
    underScrutiny: [],
    deficiencyRaised: [],
    readyForEVC: [],
    overdueScrutiny: [],
    all: [],
  });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQueue();
  }, [refreshKey]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await scrutinyAPI.getQueue({ region: 'All' });
      if (res.data?.success) {
        setQueueData(res.data.queue);
      }
    } catch (err) {
      showToast(err.message || 'Error loading regional queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredList = () => {
    let list = [];
    switch (activeTab) {
      case 'scrutiny':
        list = queueData.underScrutiny;
        break;
      case 'deficiency':
        list = queueData.deficiencyRaised;
        break;
      case 'evc':
        list = queueData.readyForEVC;
        break;
      case 'overdue':
        list = queueData.overdueScrutiny;
        break;
      default:
        list = queueData.all;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (a) =>
          a.applicationId.toLowerCase().includes(q) ||
          a.institutionName.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const displayedList = getFilteredList();

  return (
    <div className="space-y-6">
      {/* Clean Boxless Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Regional Desk</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-600 font-medium">Central Region (Bhopal)</span>
            <span className="text-slate-300">•</span>
            <span>APH 2024–27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Regional Officer Scrutiny Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Dual-pane statutory verification against Approval Process Handbook norms & 7-day stage SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200/80 text-xs sm:text-[13px] font-medium font-mono shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Stage SLA: 7 Working Days</span>
          </div>
        </div>
      </div>

      {/* KPI Ribbon (Unified Connected Surface) */}
      <div className="relative bg-white rounded-xl border border-slate-200/70 shadow-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden">
        <MetricCard
          title="Under Scrutiny"
          value={queueData.underScrutiny.length}
          subtitle="Files pending document check"
          icon={FileText}
          variant="navy"
          badgeText="Active Desk"
          onClick={() => setActiveTab(activeTab === 'scrutiny' ? 'all' : 'scrutiny')}
          isActive={activeTab === 'scrutiny'}
          statusHint="Pending verification desk"
        />

        <MetricCard
          title="Deficiencies Raised"
          value={queueData.deficiencyRaised.length}
          subtitle="Awaiting institute clarifications"
          icon={AlertTriangle}
          variant="warning"
          badgeText="Objection Open"
          onClick={() => setActiveTab(activeTab === 'deficiency' ? 'all' : 'deficiency')}
          isActive={activeTab === 'deficiency'}
          statusHint="Clarifications pending"
        />

        <MetricCard
          title="Ready For EVC"
          value={queueData.readyForEVC.length}
          subtitle="Cleared for on-site physical inspection"
          icon={CheckCircle}
          variant="success"
          badgeText="EVC Queue"
          onClick={() => setActiveTab(activeTab === 'evc' ? 'all' : 'evc')}
          isActive={activeTab === 'evc'}
          statusHint="Inspection roster mapped"
        />

        <MetricCard
          title="SLA Overdue Breaches"
          value={queueData.overdueScrutiny.length}
          subtitle="Files exceeding allowed 7-day limit"
          icon={ShieldAlert}
          variant="danger"
          badgeText={queueData.overdueScrutiny.length > 0 ? 'HQ Alert' : 'Nil'}
          onClick={() => setActiveTab(activeTab === 'overdue' ? 'all' : 'overdue')}
          isActive={activeTab === 'overdue'}
          statusHint={
            queueData.overdueScrutiny.length > 0
              ? 'Overdue escalation flagged'
              : 'Zero SLA violations'
          }
        />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Files', count: queueData.all.length },
            { id: 'scrutiny', label: 'Under Scrutiny', count: queueData.underScrutiny.length },
            { id: 'deficiency', label: 'Deficiencies', count: queueData.deficiencyRaised.length },
            { id: 'evc', label: 'Ready for EVC', count: queueData.readyForEVC.length },
            { id: 'overdue', label: 'Overdue SLAs', count: queueData.overdueScrutiny.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-medium px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : tab.id === 'overdue' && tab.count > 0
                      ? 'bg-rose-100 text-rose-700 font-semibold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Application ID, Institute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-[13px] pl-8 pr-8 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white transition font-normal"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Inbox Table */}
      <RegionalInboxTable
        applications={displayedList}
        onSelectApplication={(app) => setSelectedApp(app)}
      />

      {/* Side-by-Side Dual Pane Scrutiny Modal */}
      {selectedApp && (
        <DigitalScrutinyDesk
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onActionCompleted={fetchQueue}
        />
      )}
    </div>
  );
};

export default RODashboard;
