import React, { useState } from 'react';
import { X, Calendar, UserCheck, Send } from 'lucide-react';
import { evcAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const InspectionScheduleModal = ({ inspection, onClose, onScheduled }) => {
  const { showToast, triggerRefresh } = useApp();
  const [scheduledDate, setScheduledDate] = useState(
    inspection.scheduledDate
      ? new Date(inspection.scheduledDate).toISOString().split('T')[0]
      : new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [chairperson, setChairperson] = useState(
    inspection.committeeMembers?.[0]?.name || 'Prof. S. N. Deshmukh'
  );
  const [architect, setArchitect] = useState(
    inspection.committeeMembers?.[1]?.name || 'Dr. Anita Roy (SPA Delhi)'
  );
  const [scheduling, setScheduling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setScheduling(true);
      const committeeMembers = [
        { name: chairperson, designation: 'Chairperson', institution: 'NIT Nominee' },
        { name: architect, designation: 'Architectural Expert', institution: 'Council Nominee' },
      ];

      const res = await evcAPI.scheduleInspection(inspection.applicationId, {
        scheduledDate,
        committeeMembers,
      });

      if (res.data?.success) {
        showToast('Inspection visit scheduled and calendar dispatched!', 'success');
        triggerRefresh();
        if (onScheduled) onScheduled();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Error scheduling visit', 'error');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0c2340]">
            <Calendar className="w-5 h-5 text-[#ea580c]" />
            <span>Schedule Physical EVC Inspection</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirmed Inspection Visit Date *
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Committee Chairperson (Senior Professor)
            </label>
            <input
              type="text"
              required
              value={chairperson}
              onChange={(e) => setChairperson(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Architectural / Domain Expert
            </label>
            <input
              type="text"
              required
              value={architect}
              onChange={(e) => setArchitect(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
            />
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
              disabled={scheduling}
              className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {scheduling ? 'Confirming...' : 'Confirm & Dispatch Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionScheduleModal;
