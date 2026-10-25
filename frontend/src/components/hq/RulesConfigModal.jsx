import React, { useState, useEffect } from 'react';
import { X, Sliders, CheckCircle2, ShieldCheck, Save } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const RulesConfigModal = ({ onClose, onSaved }) => {
  const { showToast, triggerRefresh } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState({
    scrutinySlaDays: 7,
    evcSlaDays: 14,
    docWarningDays: 60,
    geofenceMaxDistanceMeters: 200,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getRules();
      if (res.data?.success) {
        setRules(res.data.rules);
      }
    } catch (err) {
      console.warn('Using default rules preset');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminAPI.updateRules(rules);
      if (res.data?.success) {
        showToast('Approval Process Handbook rules updated dynamically across council!', 'success');
        triggerRefresh();
        if (onSaved) onSaved();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Error updating rules', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0c2340]">
            <Sliders className="w-5 h-5 text-[#ea580c]" />
            <span>Configurable Rules Engine (APH Policies)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Adjust council statutory SLA durations and warning intervals dynamically without requiring software redeployment.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Regional Scrutiny Allowed SLA (Days)
              </label>
              <span className="font-mono text-xs font-bold text-[#ea580c]">
                {rules.scrutinySlaDays} Days
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="21"
              value={rules.scrutinySlaDays}
              onChange={(e) => setRules({ ...rules, scrutinySlaDays: parseInt(e.target.value) })}
              className="w-full accent-[#ea580c]"
            />
            <span className="text-[10px] text-slate-400">Default statutory norm: 7 working days</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                EVC Committee Inspection SLA (Days)
              </label>
              <span className="font-mono text-xs font-bold text-[#ea580c]">
                {rules.evcSlaDays} Days
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="30"
              value={rules.evcSlaDays}
              onChange={(e) => setRules({ ...rules, evcSlaDays: parseInt(e.target.value) })}
              className="w-full accent-[#ea580c]"
            />
            <span className="text-[10px] text-slate-400">Default norm: 14 days</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Document Expiry Advance Warning Window (Days)
              </label>
              <span className="font-mono text-xs font-bold text-[#ea580c]">
                {rules.docWarningDays} Days
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              value={rules.docWarningDays}
              onChange={(e) => setRules({ ...rules, docWarningDays: parseInt(e.target.value) })}
              className="w-full accent-[#ea580c]"
            />
            <span className="text-[10px] text-slate-400">
              When Land Lease / Fire NOC has fewer days left, system triggers Amber notice
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Anti-Fraud Geofence Radius Threshold (Meters)
              </label>
              <span className="font-mono text-xs font-bold text-[#ea580c]">
                {rules.geofenceMaxDistanceMeters}m
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={rules.geofenceMaxDistanceMeters}
              onChange={(e) =>
                setRules({ ...rules, geofenceMaxDistanceMeters: parseInt(e.target.value) })
              }
              className="w-full accent-[#ea580c]"
            />
            <span className="text-[10px] text-slate-400">
              Maximum allowable distance between photo GPS and registered campus boundary
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0c2340] hover:bg-[#163a66] rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Updating Policies...' : 'Save & Enforce Across Council'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RulesConfigModal;
