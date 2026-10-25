import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  Upload,
  AlertTriangle,
  Send,
  X,
} from 'lucide-react';
import { applicationAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ApplicationWizard = ({ onCreated, onCancel }) => {
  const { showToast, triggerRefresh } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    institutionName: 'Apex Institute of Technology, Bhopal',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    region: 'Central',
    infrastructureDetails: {
      landAreaAcres: 6.2,
      builtUpAreaSqMtr: 14500,
      totalClassrooms: 36,
      totalLabs: 24,
      computerCount: 550,
      internetBandwidthMbps: 1000,
      latitude: 23.2599,
      longitude: 77.4126,
      address: 'Bhadbhada Road, Suraj Nagar, Bhopal, MP - 462044',
    },
    courses: [
      {
        courseName: 'B.Tech',
        branch: 'Computer Science & Engineering',
        level: 'UG',
        proposedIntake: 180,
      },
      {
        courseName: 'B.Tech',
        branch: 'Artificial Intelligence & Data Science',
        level: 'UG',
        proposedIntake: 60,
      },
      {
        courseName: 'B.Tech',
        branch: 'Electronics & Communication',
        level: 'UG',
        proposedIntake: 60,
      },
    ],
    documents: [
      {
        docType: 'Land Lease Deed',
        issueDate: '2021-04-10',
        expiryDate: '2026-12-31',
        fileUrl: '',
      },
      {
        docType: 'Fire Safety NOC',
        issueDate: '2025-01-15',
        expiryDate: '2027-01-14',
        fileUrl: '',
      },
      {
        docType: 'Building Structural Stability',
        issueDate: '2024-03-20',
        expiryDate: '2028-03-19',
        fileUrl: '',
      },
    ],
  });

  // Course addition handler
  const [newCourse, setNewCourse] = useState({
    courseName: 'B.Tech',
    branch: '',
    level: 'UG',
    proposedIntake: 60,
  });

  const handleAddCourse = () => {
    if (!newCourse.branch.trim()) {
      showToast('Please enter course branch/specialization', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...newCourse }],
    }));
    setNewCourse({ courseName: 'B.Tech', branch: '', level: 'UG', proposedIntake: 60 });
  };

  const handleRemoveCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, idx) => idx !== index),
    }));
  };

  /**
   * DIFFERENTIATOR 6: Pre-Submission Document Validator
   * Scans all statutory documents on client-side for expired dates or missing certificates
   */
  const validateDocumentsClientSide = () => {
    const issues = [];
    const now = new Date();

    formData.documents.forEach((doc) => {
      if (!doc.expiryDate) {
        issues.push({
          type: 'missing_date',
          docType: doc.docType,
          message: `Expiry date for ${doc.docType} is not specified.`,
        });
      } else {
        const exp = new Date(doc.expiryDate);
        const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0) {
          issues.push({
            type: 'expired',
            docType: doc.docType,
            message: `CRITICAL: ${doc.docType} is already expired! Scrutiny rejection guaranteed.`,
          });
        } else if (daysLeft < 30) {
          issues.push({
            type: 'expiring_soon',
            docType: doc.docType,
            message: `Warning: ${doc.docType} expires in ${daysLeft} days. Renewal recommended before filing.`,
          });
        }
      }
    });

    return issues;
  };

  const validationIssues = validateDocumentsClientSide();
  const hasCriticalValidationIssue = validationIssues.some((i) => i.type === 'expired');

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await applicationAPI.create(formData);
      if (res.data?.success) {
        showToast(
          'Application successfully filed! Forwarded to Regional Scrutiny Desk with SLA clock started.',
          'success'
        );
        triggerRefresh();
        if (onCreated) onCreated(res.data.application);
      }
    } catch (err) {
      showToast(err.message || 'Failed to file application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden w-full my-4">
      {/* Wizard Header */}
      <div className="bg-[#0c2340] text-white p-5 sm:p-6 relative">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="pr-10 sm:pr-0">
            <div className="flex items-center gap-2 text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
              <span>Step {currentStep} of 4</span>
              <span>•</span>
              <span className="hidden sm:inline">AICTE Approval Process Handbook (APH 2024-27)</span>
              <span className="sm:hidden">APH 2024-27</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Statutory Application Filing Wizard
            </h2>
          </div>
          {onCancel && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onCancel}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <span>Close Form</span>
              </button>
              <button
                onClick={onCancel}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Close"
                aria-label="Close Form"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-4 gap-2 mt-6 text-xs">
          {[
            { num: 1, label: 'Institution & Land' },
            { num: 2, label: 'Programs & Intake' },
            { num: 3, label: 'Statutory Docs' },
            { num: 4, label: 'Final Verification' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-lg border flex items-center gap-2 ${
                currentStep === s.num
                  ? 'bg-orange-500/20 border-orange-400 text-white font-bold'
                  : currentStep > s.num
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="truncate">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {/* Step 1: Institutional & Land Data */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#ea580c]" />
              Institution Identity & Campus Infrastructure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Full Name *
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Category *
                </label>
                <select
                  value={formData.applicationType}
                  onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
                >
                  <option>Extension of Approval (EoA)</option>
                  <option>New Approval</option>
                  <option>Intake Increase</option>
                  <option>Course Addition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AICTE Regional Jurisdiction *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#ea580c]"
                >
                  <option>Central</option>
                  <option>Western</option>
                  <option>Northern</option>
                  <option>Southern</option>
                  <option>Eastern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.academicYear}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Campus Norms (APH Chapter 1 Verification)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Land Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.infrastructureDetails.landAreaAcres}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        infrastructureDetails: {
                          ...formData.infrastructureDetails,
                          landAreaAcres: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Built-up Area (Sq.Mtr)
                  </label>
                  <input
                    type="number"
                    value={formData.infrastructureDetails.builtUpAreaSqMtr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        infrastructureDetails: {
                          ...formData.infrastructureDetails,
                          builtUpAreaSqMtr: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Total Classrooms
                  </label>
                  <input
                    type="number"
                    value={formData.infrastructureDetails.totalClassrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        infrastructureDetails: {
                          ...formData.infrastructureDetails,
                          totalClassrooms: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Total High-Tech Labs
                  </label>
                  <input
                    type="number"
                    value={formData.infrastructureDetails.totalLabs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        infrastructureDetails: {
                          ...formData.infrastructureDetails,
                          totalLabs: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  GPS Latitude (Geofencing Anchor)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.infrastructureDetails.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      infrastructureDetails: {
                        ...formData.infrastructureDetails,
                        latitude: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  GPS Longitude (Geofencing Anchor)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.infrastructureDetails.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      infrastructureDetails: {
                        ...formData.infrastructureDetails,
                        longitude: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Course & Intake Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ea580c]" />
              Proposed Programs & Intake Capacity
            </h3>

            {/* Courses Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Program</th>
                    <th className="py-2.5 px-3">Specialization</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3 text-right">Proposed Intake</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.courses.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{c.courseName}</td>
                      <td className="py-2 px-3 text-slate-700">{c.branch}</td>
                      <td className="py-2 px-3 text-slate-600">{c.level}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#0c2340]">
                        {c.proposedIntake}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(i)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Course Section */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Add New Program</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <select
                  value={newCourse.courseName}
                  onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                  className="text-xs p-2 rounded-lg border border-slate-300"
                >
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>MCA</option>
                  <option>MBA</option>
                  <option>Diploma</option>
                </select>
                <input
                  type="text"
                  placeholder="Specialization (e.g. Cyber Security)"
                  value={newCourse.branch}
                  onChange={(e) => setNewCourse({ ...newCourse, branch: e.target.value })}
                  className="text-xs p-2 rounded-lg border border-slate-300"
                />
                <input
                  type="number"
                  placeholder="Intake (60)"
                  value={newCourse.proposedIntake}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, proposedIntake: parseInt(e.target.value) || 60 })
                  }
                  className="text-xs p-2 rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="bg-[#0c2340] hover:bg-[#163a66] text-white text-xs font-bold rounded-lg px-3 py-2 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Statutory Document Upload & Pre-Submission Validator */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#ea580c]" />
                Mandatory Statutory Documents & Validity Checks
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Pre-Submission Validator Active
              </span>
            </div>

            {/* DIFFERENTIATOR 6: Intelligent Client-side Validation Banner */}
            {validationIssues.length > 0 ? (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  hasCriticalValidationIssue
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    Pre-Submission Validator Found {validationIssues.length} Attention Flag(s):
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {validationIssues.map((issue, idx) => (
                    <li key={idx}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>All Documents Valid:</strong> Expiry dates conform to AICTE Approval Process Handbook standards.
                </span>
              </div>
            )}

            {/* Document list inputs */}
            <div className="space-y-3">
              {formData.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{doc.docType}</p>
                    <p className="text-[11px] text-slate-500">Statutory Certificate</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      Statutory Expiry Date:
                    </label>
                    <input
                      type="date"
                      value={doc.expiryDate}
                      onChange={(e) => {
                        const newDocs = [...formData.documents];
                        newDocs[idx].expiryDate = e.target.value;
                        setFormData({ ...formData, documents: newDocs });
                      }}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      File Upload (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-50 file:text-[#ea580c]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Final Verification & Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Final Application Audit & Council Submission
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold text-slate-900">{formData.institutionName}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{formData.applicationType}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Regional Desk:</span>
                <span className="font-semibold text-[#0c2340]">{formData.region} Regional Office</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-500">Programs Enrolled:</span>
                <span className="font-bold text-[#ea580c]">{formData.courses.length} Approved Programs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statutory SLA Allowed:</span>
                <span className="font-mono font-bold text-emerald-700">7 Working Days (Scrutiny Stage)</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>Applicant Declaration:</strong> I hereby declare that all information furnished is authentic and conforms to Approval Process Handbook 2024-27. In the event of discrepancy or fraudulent evidence, AICTE reserves full jurisdiction under Section 10(u) of AICTE Act.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0c2340] hover:bg-[#163a66] rounded-lg shadow-sm transition"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-lg shadow-md transition disabled:opacity-50"
            >
              {submitting ? (
                'Submitting Application...'
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Sign & Submit to AICTE Regional Desk
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;
