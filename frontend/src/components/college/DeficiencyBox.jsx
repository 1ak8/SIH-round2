import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, FileText, Upload } from 'lucide-react';
import { scrutinyAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const DeficiencyBox = ({ applicationId, deficiencies = [], onResolved }) => {
  const { showToast } = useApp();
  const [activeDefId, setActiveDefId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openDeficiencies = deficiencies.filter((d) => d.status === 'Open');

  if (openDeficiencies.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-900">Zero Scrutiny Deficiencies</h4>
          <p className="text-xs text-emerald-700">
            No active objections or queries pending from the Regional Scrutiny Desk.
          </p>
        </div>
      </div>
    );
  }

  const handleResolve = async (defId) => {
    if (!responseText.trim()) {
      showToast('Please provide an explanatory response or compliance clarification.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await scrutinyAPI.resolveDeficiency(applicationId, defId, {
        responseText,
        reuploadedDocUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1000&q=80',
      });

      if (res.data?.success) {
        showToast('Deficiency response submitted to Regional Officer for re-scrutiny!', 'success');
        setResponseText('');
        setActiveDefId(null);
        if (onResolved) onResolved();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit response', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Action Required: Regional Scrutiny Objections ({openDeficiencies.length})
          </h4>
          <p className="text-xs text-amber-800">
            The Regional Officer has requested clarifications. Resolve promptly to avoid SLA clock breach.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {openDeficiencies.map((def) => {
          const isReplying = activeDefId === def.deficiencyId;
          return (
            <div
              key={def.deficiencyId || def._id}
              className="bg-white rounded-lg border border-amber-200 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs text-[#0c2340] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-mono">
                  {def.deficiencyId}
                </span>
                <span className="text-[11px] text-slate-500">
                  Raised on: {new Date(def.raisedAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-800 mb-1">
                Field: <span className="text-amber-900">{def.field}</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 mb-3">
                {def.description}
              </p>

              {isReplying ? (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700">
                    Institution Clarification & Proof Note:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter compliance explanation, recruitment advertisement link, or upload reference..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-xs text-slate-500 flex items-center gap-1.5 hover:text-slate-800"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Attach Corrected Document (PDF)
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveDefId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(def.deficiencyId)}
                        disabled={submitting}
                        className="px-4 py-1.5 text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        {submitting ? 'Submitting...' : 'Submit Resolution'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveDefId(def.deficiencyId);
                    setResponseText('');
                  }}
                  className="mt-1 px-3 py-1.5 text-xs font-bold text-white bg-[#0c2340] hover:bg-[#163a66] rounded-lg transition"
                >
                  Reply & Furnish Clarification
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeficiencyBox;
