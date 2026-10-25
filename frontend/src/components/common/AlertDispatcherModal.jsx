import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Bell,
  X,
  Send,
  CheckCircle,
  Building2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { complianceAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const AlertDispatcherModal = ({ documentData, onClose }) => {
  const { showToast, triggerRefresh } = useApp();
  const { activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [customNote, setCustomNote] = useState('');
  const [sending, setSending] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [dispatchedAlerts, setDispatchedAlerts] = useState([]);

  const institutionName = documentData?.institutionName || 'Apex Institute of Technology, Bhopal';
  const docType = documentData?.docType || 'Land Lease Deed';
  const daysUntilExpiry = documentData?.daysUntilExpiry ?? 45;

  const getRoleMeta = () => {
    switch (activeRole) {
      case 'college':
        return {
          title: 'Internal Compliance & Support Request',
          subtitle: 'Notify Institute Trustees, Principal & Regional Scrutiny Officer',
          sender: 'Institution Management & Registrar Desk',
          buttonText: 'Dispatch Internal Alert & Notify RO',
        };
      case 'evc':
        return {
          title: 'EVC On-Site Inspection Notice',
          subtitle: 'Formal Inspection Committee notice delivered to Institute Head',
          sender: 'Expert Visit Committee (NIT Nominee)',
          buttonText: 'Dispatch Committee Inspection Alert',
        };
      case 'hq':
        return {
          title: 'Apex Council Statutory Regulatory Directive',
          subtitle: 'Pan-India Council Directive under APH 2024-27 Clause 4.6',
          sender: 'Member Secretary & Apex Council, New Delhi',
          buttonText: 'Dispatch Council Directive',
        };
      case 'ro':
      default:
        return {
          title: 'Regional Office Statutory Compliance Notice',
          subtitle: 'Live Regulatory Watchdog • WhatsApp + Email + In-App Delivery',
          sender: 'Regional Scrutiny Desk (Western & Central Bureau)',
          buttonText: 'Dispatch 3-Channel Alert to Principal',
        };
    }
  };

  const roleMeta = getRoleMeta();

  const handleDispatch = async () => {
    try {
      setSending(true);
      const res = await complianceAPI.dispatchAlert({
        documentId: documentData?._id || documentData?.id,
        customMessage: customNote,
      });

      if (res.data?.success) {
        setDispatched(true);
        setDispatchedAlerts(res.data.dispatchedAlerts || []);
        showToast('3-Channel Regulatory Alert dispatched successfully!', 'success');
        triggerRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to dispatch alert', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Styled in Central AICTE Sovereign Rose-Navy Gradient Theme */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-[#0c2340] text-white p-5 flex items-center justify-between border-b border-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-rose-200 shrink-0 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white font-display">
                {roleMeta.title}
              </h3>
              <p className="text-xs text-rose-200">
                {roleMeta.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Target Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#ea580c]" />
                {institutionName}
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {documentData?.applicationId || 'AICTE-2026-REG'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Document:</span>
              <span className="text-[#ea580c]">{docType}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  daysUntilExpiry <= 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {daysUntilExpiry <= 0
                  ? 'Expired'
                  : `Expiring in ${daysUntilExpiry} days`}
              </span>
            </div>
          </div>

          {/* Channel Tabs */}
          <div className="flex border-b border-slate-200 mb-4">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'whatsapp'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              WhatsApp Alert
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'email'
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail className="w-4 h-4 text-blue-600" />
              Official Email
            </button>
            <button
              onClick={() => setActiveTab('inapp')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
                activeTab === 'inapp'
                  ? 'border-amber-600 text-amber-800 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-600" />
              In-App Notification
            </button>
          </div>

          {/* Channel Preview Body */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs mb-6 shadow-inner">
            {activeTab === 'whatsapp' && (
              <div className="space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> [AICTE Pravah WhatsApp Bot] → +91-98260-11223
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 leading-relaxed">
                  ⚠️ <strong>AICTE URGENT COMPLIANCE NOTICE</strong>
                  <br />
                  Dear Principal, {institutionName},
                  <br />
                  Your statutory <strong>{docType}</strong> is{' '}
                  {daysUntilExpiry <= 0
                    ? 'EXPIRED'
                    : `approaching expiry in ${daysUntilExpiry} days`}.
                  <br />
                  Mandatory renewal proof must be uploaded to AICTE Pravah portal to avoid seat intake freeze.
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-2">
                <div className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> To: registrar@apex.edu.in | Cc: ro.western@aicte-india.org
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 leading-relaxed">
                  <strong>Subject:</strong> Formal Regulatory Notice - Expiry of {docType} ({institutionName})
                  <br /><br />
                  Under Approval Process Handbook Clause 4.6, technical institutions must maintain continuous validity of all building safety and land titles. Failure to furnish renewed clearance within 15 days will result in automated escalation to AICTE Headquarters.
                </div>
              </div>
            )}

            {activeTab === 'inapp' && (
              <div className="space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Bell className="w-4 h-4" /> Push Notification Payload:
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200 leading-relaxed">
                  🔴 High Priority Alert: {docType} requires immediate renewal action. Days remaining: {daysUntilExpiry}. Click here to upload renewal receipt.
                </div>
              </div>
            )}
          </div>

          {/* Custom Officer Note */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add Officer Remark (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Please expedite renewal before Standing Committee review on 15th."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
            />
          </div>

          {dispatched && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl mb-4 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Notice Dispatched!</strong> Official regulatory notices successfully delivered to Institution Management via WhatsApp, Email, and Portal Notifications.
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleDispatch}
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {sending ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{roleMeta.buttonText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDispatcherModal;
