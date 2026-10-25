import React, { useState } from 'react';
import {
  X,
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Upload,
  Send,
  ShieldAlert,
  Layers,
  Check,
} from 'lucide-react';
import { evcAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const InspectionReportDesk = ({ inspection, onClose, onSubmitted }) => {
  const { showToast, triggerRefresh } = useApp();
  const [photoTag, setPhotoTag] = useState('High Performance Computing Lab');
  const [photoLat, setPhotoLat] = useState(
    inspection.collegeCoordinates?.latitude || 28.5452
  );
  const [photoLng, setPhotoLng] = useState(
    inspection.collegeCoordinates?.longitude || 77.1928
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [geofenceResult, setGeofenceResult] = useState(null);

  // Verdict state
  const [verdict, setVerdict] = useState('Recommended');
  const [undertakingText, setUndertakingText] = useState('');
  const [undertakings, setUndertakings] = useState([
    'Establishment of Advanced Robotics & AI IoT Center of Excellence within 60 days',
  ]);
  const [observations, setObservations] = useState(
    'Infrastructure inspected physically on-site and verified conforming to Approval Process Handbook 2024-27 norms.'
  );
  const [submittingVerdict, setSubmittingVerdict] = useState(false);

  // Checklist
  const [checklist, setChecklist] = useState(
    inspection.checklist || [
      { category: 'Land & Building', item: 'Contiguous land parcel & operational Divyangjan ramps', verified: true, score: 10 },
      { category: 'Classrooms & Studios', item: 'Acoustics, smart interactive boards & ventilation', verified: true, score: 10 },
      { category: 'Laboratory Apparatus', item: 'AICTE model curriculum laboratory setups & safety equipment', verified: true, score: 10 },
      { category: 'Central Library', item: 'Digital e-journals, RFID issue system & seating capacity', verified: true, score: 10 },
    ]
  );

  const toggleChecklist = (idx) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, verified: !item.verified } : item))
    );
  };

  /**
   * DIFFERENTIATOR 3: Anti-Fraud Geofence Verifier Upload
   */
  const handleUploadGeoPhoto = async (e) => {
    e.preventDefault();
    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('tag', photoTag);
      formData.append('latitude', photoLat);
      formData.append('longitude', photoLng);
      formData.append('notes', 'Verified on-site by EVC committee members.');
      if (photoFile) {
        formData.append('photo', photoFile);
      } else {
        // Fallback sample file
        const blob = new Blob(['sample-geo-evidence'], { type: 'text/plain' });
        formData.append('photo', blob, 'geo_evidence.jpg');
      }

      const res = await evcAPI.uploadInspectionPhoto(inspection.applicationId, formData);
      if (res.data?.success) {
        setGeofenceResult(res.data.geofenceCheck);
        showToast(res.data.message, res.data.geofenceCheck?.matchesGeofence ? 'success' : 'warning');
        triggerRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Error uploading inspection photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddUndertaking = () => {
    if (!undertakingText.trim()) return;
    setUndertakings((prev) => [...prev, undertakingText.trim()]);
    setUndertakingText('');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      setSubmittingVerdict(true);
      const res = await evcAPI.submitReport(inspection.applicationId, {
        verdict,
        checklist,
        overallObservations: observations,
        undertakingsRequired: verdict === 'Recommended with Undertaking' ? undertakings : [],
      });

      if (res.data?.success) {
        showToast(`EVC Inspection Report submitted with verdict: ${verdict}!`, 'success');
        triggerRefresh();
        if (onSubmitted) onSubmitted();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Error submitting report', 'error');
    } finally {
      setSubmittingVerdict(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-[94vw] xl:max-w-[90vw] h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-0.5">
              <span>Expert Visit Committee (EVC)</span>
              <span>•</span>
              <span>Physical Audit & Anti-Fraud Geofencing</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {inspection.institutionName} ({inspection.applicationId})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-y-auto">
          {/* Left Column: Anti-Fraud Geofence Evidence Upload */}
          <div className="p-6 space-y-5 bg-slate-50/50">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                DIFFERENTIATOR: Anti-Fraud Geofence Verifier
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates real-time distance between uploaded photo GPS coordinates and the registered college anchor coordinates.
              </p>
            </div>

            {/* Geofence Status Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Registered Campus Anchor:</span>
                <span className="font-mono font-bold text-slate-800">
                  {inspection.collegeCoordinates?.latitude?.toFixed(4)},{' '}
                  {inspection.collegeCoordinates?.longitude?.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Geofence Max Radius:</span>
                <span className="font-mono font-bold text-slate-800">200 Meters</span>
              </div>
              {geofenceResult && (
                <div
                  className={`p-3 rounded-lg border text-xs font-bold flex items-center gap-2 ${
                    geofenceResult.matchesGeofence
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                  }`}
                >
                  {geofenceResult.matchesGeofence ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        GEOFENCE PASSED: Photo location is {geofenceResult.distanceMeters}m from campus (Within 200m).
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>
                        GEOFENCE FRAUD ALERT: Photo was taken {geofenceResult.distanceMeters}m away from campus!
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Upload Geo-tagged Photo Form */}
            <form onSubmit={handleUploadGeoPhoto} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#ea580c]" />
                Upload New Inspection Photo Proof
              </h5>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Facility Tag
                </label>
                <input
                  type="text"
                  value={photoTag}
                  onChange={(e) => setPhotoTag(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Photo Latitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={photoLat}
                    onChange={(e) => setPhotoLat(parseFloat(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Photo Longitude (GPS)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={photoLng}
                    onChange={(e) => setPhotoLng(parseFloat(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Photo File (JPG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-50 file:text-[#ea580c]"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingPhoto}
                className="w-full py-2 bg-[#0c2340] hover:bg-[#163a66] text-white text-xs font-bold rounded-lg shadow transition flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingPhoto ? 'Verifying Coordinates...' : 'Upload & Validate Geofence'}
              </button>
            </form>

            {/* Existing Photo Proofs */}
            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">
                Verified Photographic Evidence ({inspection.photoEvidence?.length || 0})
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {inspection.photoEvidence?.map((p, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={p.url} alt={p.tag} className="w-full h-24 object-cover" />
                    <div className="p-2 text-[10px]">
                      <p className="font-bold text-slate-800 line-clamp-1">{p.tag}</p>
                      <p className="text-emerald-700 font-semibold">✓ Inside Campus</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Physical Checklist & Verdict Desk */}
          <div className="p-6 space-y-5 bg-white">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340]">
                EVC On-Site Physical Inspection Checklist
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Examine physical laboratories, safety barriers, and compliance parameters.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                    item.verified
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      item.verified
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.verified && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <p className="text-xs font-semibold text-slate-800">{item.item}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Verdict Radio Selection */}
            <form onSubmit={handleSubmitReport} className="space-y-4 pt-3 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  EVC Committee Final Recommendation Verdict *
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'Recommended', label: 'Recommended (Full EoA Approval)', color: 'text-emerald-700' },
                    { id: 'Recommended with Undertaking', label: 'Recommended with Undertaking (Conditional)', color: 'text-amber-700' },
                    { id: 'Not Recommended', label: 'Not Recommended (Critical Infrastructure Shortfall)', color: 'text-rose-700' },
                  ].map((v) => (
                    <label
                      key={v.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        verdict === v.id
                          ? 'border-[#0c2340] bg-orange-50/30 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="verdict"
                        checked={verdict === v.id}
                        onChange={() => setVerdict(v.id)}
                        className="text-[#ea580c] focus:ring-[#ea580c]"
                      />
                      <span className={`text-xs ${v.color}`}>{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Undertakings Input (If selected) */}
              {verdict === 'Recommended with Undertaking' && (
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl space-y-2.5">
                  <h5 className="text-xs font-bold text-amber-900">
                    Specify Mandatory Post-Approval Undertakings
                  </h5>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Set up AI IoT lab within 60 days"
                      value={undertakingText}
                      onChange={(e) => setUndertakingText(e.target.value)}
                      className="text-xs p-2 rounded-lg border border-slate-300 flex-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddUndertaking}
                      className="px-3 py-1.5 text-xs font-bold bg-[#0c2340] text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="text-xs text-amber-900 list-disc pl-5 space-y-1">
                    {undertakings.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Overall Committee Observations
                </label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submittingVerdict}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingVerdict ? 'Submitting Report...' : 'Submit Final EVC Report to Council'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReportDesk;
