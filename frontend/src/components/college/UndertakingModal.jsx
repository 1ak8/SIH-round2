import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { complianceAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const UndertakingModal = ({ undertaking, onClose, onSubmitted }) => {
  const { showToast } = useApp();
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('notes', notes || 'Compliance documentation submitted for review');
      if (file) {
        formData.append('proof', file);
      }

      const res = await complianceAPI.submitProof(undertaking._id || undertaking.id, formData);
      if (res.data?.success) {
        showToast('Compliance evidence submitted successfully! Under review by Regional Officer.', 'success');
        if (onSubmitted) onSubmitted();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit proof', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0c2340]">
            <ShieldCheck className="w-5 h-5 text-[#ea580c]" />
            <span>Submit Post-Approval Compliance Proof</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-3.5 mb-4 text-xs">
          <p className="font-bold text-[#0c2340] mb-0.5">{undertaking.title}</p>
          <p className="text-slate-600 mb-2">{undertaking.description}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Ref: {undertaking.clauseReference}</span>
            <span className="text-[#ea580c] font-bold">
              Due Date: {new Date(undertaking.dueDate).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Compliance Verification Summary / Notes *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detail actions taken, purchase order reference, lab commissioning details or appointment notifications..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Photographic or PDF Evidence (Purchase Order / Lab Photo)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ea580c] hover:file:bg-orange-100"
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
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              {submitting ? 'Uploading...' : 'Submit Compliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UndertakingModal;
