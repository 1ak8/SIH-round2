import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Printer,
  ShieldCheck,
  QrCode,
  Download,
  Building2,
  CheckCircle2,
  Award,
  AlertCircle,
  Loader2,
  Clock,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { scrutinyAPI } from '../../services/api';

export const ApprovalDocketModal = ({ application, onClose }) => {
  const { activeRole } = useAuth();
  const { showToast, triggerRefresh } = useApp();
  const [approving, setApproving] = useState(false);

  const [app, setApp] = useState(() => ({
    applicationId: application?.applicationId || 'AICTE-2026-C-1042',
    institutionName: application?.institutionName || 'Apex Institute of Technology, Bhopal',
    applicationType: application?.applicationType || 'Extension of Approval (EoA)',
    academicYear: application?.academicYear || '2026-2027',
    region: application?.region || 'Central',
    status: application?.status || 'Approved',
    stage: application?.stage || 'Final Decision',
    infrastructureDetails: application?.infrastructureDetails || {
      address: 'Bhadbhada Road, Suraj Nagar, Bhopal, MP - 462044',
      landAreaAcres: 6.2,
      builtUpAreaSqMtr: 14200,
    },
    courses:
      application?.courses && application.courses.length > 0
        ? application.courses
        : [
            { courseName: 'B.Tech', branch: 'Computer Science & Engineering', level: 'UG', proposedIntake: 180, approvedIntake: 120 },
            { courseName: 'B.Tech', branch: 'Artificial Intelligence & Data Science', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
            { courseName: 'B.Tech', branch: 'Electronics & Communication', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
          ],
    qrCodeDataUrl: application?.qrCodeDataUrl || '',
  }));

  const isApproved = app.status === 'Approved';
  const canApprove = (activeRole === 'hq' || activeRole === 'admin') && !isApproved;

  useEffect(() => {
    if (application) {
      setApp({
        applicationId: application.applicationId || 'AICTE-2026-C-1042',
        institutionName: application.institutionName || 'Apex Institute of Technology, Bhopal',
        applicationType: application.applicationType || 'Extension of Approval (EoA)',
        academicYear: application.academicYear || '2026-2027',
        region: application.region || 'Central',
        status: application.status || 'Approved',
        stage: application.stage || 'Final Decision',
        infrastructureDetails: application.infrastructureDetails || {
          address: 'Bhadbhada Road, Suraj Nagar, Bhopal, MP - 462044',
          landAreaAcres: 6.2,
          builtUpAreaSqMtr: 14200,
        },
        courses:
          application.courses && application.courses.length > 0
            ? application.courses
            : [
                { courseName: 'B.Tech', branch: 'Computer Science & Engineering', level: 'UG', proposedIntake: 180, approvedIntake: 120 },
                { courseName: 'B.Tech', branch: 'Artificial Intelligence & Data Science', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
                { courseName: 'B.Tech', branch: 'Electronics & Communication', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
              ],
        qrCodeDataUrl: application.qrCodeDataUrl || '',
      });
    }
  }, [application]);

  useEffect(() => {
    if (isApproved) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#0c2340', '#059669', '#d97706'],
      });
    }
  }, [isApproved]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const res = await scrutinyAPI.directApprove(app.applicationId, {
        approvalRemarks: 'Final Statutory Approval granted post-EVC review by AICTE Council Chairman & Member Secretary.',
      });
      if (res.data?.success) {
        setApp((prev) => ({
          ...prev,
          status: 'Approved',
          stage: 'Final Decision',
        }));
        confetti({
          particleCount: 130,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#059669', '#10b981', '#34d399', '#ea580c', '#0c2340'],
        });
        showToast(
          `🎉 Statutory Approval Granted! Letter of Approval (LoA) for ${app.institutionName} officially sealed.`,
          'success'
        );
        triggerRefresh();
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Approval grant failed', 'error');
    } finally {
      setApproving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Outer Floating Close Button for easy mobile / desktop exit */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl border border-slate-700 transition cursor-pointer"
        title="Close (Esc)"
        aria-label="Close"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>

      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden print:max-h-none print:overflow-visible print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar - Always Docked at Top */}
        <div className="shrink-0 bg-gradient-to-r from-rose-950 via-rose-900 to-[#0c2340] text-white px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between no-print border-b border-rose-950/30">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isApproved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-bold tracking-wide truncate max-w-[170px] sm:max-w-none">
              {isApproved ? 'AICTE Letter of Approval (LoA) Docket' : 'LoA Draft Preview — Council Desk'}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isApproved
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
              }`}
            >
              {isApproved ? 'Official & Sealed' : 'Draft Preview'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canApprove && (
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sealing...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5" />
                    <span>Approve & Seal</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-rose-200 hover:text-white rounded-lg hover:bg-white/20 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actionable Preview Alert Banner for Admin/HQ */}
        {canApprove && (
          <div className="shrink-0 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Review Letter of Approval Before Sealing
                </p>
                <p className="text-[11px] text-amber-800">
                  Carefully scrutinize institutional details, approved seat matrix, and EVC statutory clearance. Once verified, apply the statutory seal.
                </p>
              </div>
            </div>
            <button
              onClick={handleApprove}
              disabled={approving}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer shrink-0"
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying Council Seal...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Approve & Seal LoA</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Scrollable Letter Document Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-slate-50/70 print:p-0 print:overflow-visible print:bg-white">
          <div
            id="printable-docket"
            className="bg-white shadow-xs p-6 sm:p-8 rounded-xl border border-slate-200 text-slate-800 font-sans print:p-0 print:shadow-none print:border-none"
          >
          {/* Draft vs Official Status Strip */}
          {isApproved ? (
            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-800 text-xs text-center font-bold tracking-wide uppercase mb-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Statutory Approval Granted — Official Council Clearance Docket Sealed</span>
            </div>
          ) : (
            <div className="bg-amber-100/70 border border-amber-300 p-2 rounded-lg text-amber-900 text-xs text-center font-bold tracking-wide uppercase mb-4 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>LoA Draft Preview — Awaiting Final Statutory Council Seal</span>
            </div>
          )}

          {/* Council Official Letterhead */}
          <div className="border-b-2 border-[#0c2340] pb-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full border-2 border-[#0c2340] flex items-center justify-center bg-orange-50 font-bold text-[#0c2340] text-lg">
                🏛️
              </div>
              <div className="text-center">
                <h2 className="text-xl font-extrabold tracking-tight text-[#0c2340] uppercase">
                  All India Council for Technical Education
                </h2>
                <p className="text-xs font-semibold text-slate-600">
                  (A Statutory Body Under Ministry of Education, Govt. of India)
                </p>
                <p className="text-xs text-slate-500">
                  Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 | www.aicte-india.org
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 font-mono mt-3 pt-2 border-t border-slate-200">
              <span>F.No: AICTE/APH/{app.academicYear}/{app.applicationId}</span>
              <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900">To,</p>
              <p className="text-slate-800 font-medium">The Principal / Registrar,</p>
              <p className="font-bold text-[#0c2340]">{app.institutionName}</p>
              <p className="text-slate-600">{app.infrastructureDetails?.address}</p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Sub: AICTE Approval for {app.applicationType} for the Academic Year {app.academicYear} - Reg.
              </p>
              <p className="mt-1 text-slate-700">
                Sir / Madam, In terms of the provisions under the All India Council for Technical Education (Grant of Approvals for Technical Institutions) Regulations, 2024 notified by the Council and statutory provisions of the Approval Process Handbook 2024-27, I am directed to convey the approval of the Council to:
              </p>
            </div>

            {/* Approved Courses Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 font-bold text-slate-800 text-xs uppercase tracking-wider">
                Approved Programs & Intake Details ({app.academicYear})
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Program</th>
                    <th className="py-2 px-3 font-semibold">Specialization / Branch</th>
                    <th className="py-2 px-3 font-semibold">Level</th>
                    <th className="py-2 px-3 font-semibold text-right">Approved Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {app.courses?.map((course, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">{course.courseName}</td>
                      <td className="py-2 px-3 text-slate-700">{course.branch}</td>
                      <td className="py-2 px-3 text-slate-600">{course.level}</td>
                      <td className="py-2 px-3 text-right font-bold text-[#0c2340]">
                        {course.approvedIntake || course.proposedIntake}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statutory Compliance Note */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-lg text-emerald-900 text-xs leading-relaxed">
              <strong>Statutory Compliance Clause:</strong> The Institution shall adhere strictly to the norms, standards, and conditions prescribed by AICTE from time to time. Physical verification and compliance with conditional undertakings remain subject to surprise EVC inspection under Section 10(p) of the AICTE Act.
            </div>

            {/* Multi-Tier Statutory Clearances & Committee Endorsement Register */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50/70 p-3 sm:p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0c2340]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Statutory Clearances & Committee Endorsements
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Chain of Trust: Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Tier 1: RO Scrutiny Clearance Seal */}
                <div className="p-3 bg-white rounded-lg border-2 border-slate-200 shadow-2xs relative overflow-hidden">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-slate-700 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4 text-slate-800" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Tier 1 • Regional Bureau
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded">
                          ✓ Scrutiny Passed
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">Dr. A. K. Sharma</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Regional Officer & Scrutiny Bureau Head</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Mandatory norms, land titles, and AICTE APH cadre ratios verified with zero non-conformances.
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Seal: AICTE-{app.region?.toUpperCase() || 'CENTRAL'}-RO-PASS</span>
                        <span className="text-emerald-700 font-bold">SHA-256 Validated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tier 2: EVC Physical Inspection Seal */}
                <div className="p-3 bg-white rounded-lg border-2 border-emerald-200 shadow-2xs relative overflow-hidden">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Tier 2 • On-Site EVC
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded">
                          ✓ Physical Audit 100%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        {app.assignedEVC || 'Prof. S. N. Deshmukh'}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium">Chairman, Expert Visit Committee (NIT Nominee)</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Geofenced physical audit satisfied. Classrooms, computer labs, and fire safety verified on-site.
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Geofence: 23.2599° N, 77.4126° E</span>
                        <span className="text-emerald-700 font-bold">Audit Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification and Signatures */}
            <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* QR Code Validation */}
              <div className="flex items-center gap-3">
                <div className="p-1 border-2 border-slate-800 rounded bg-white shrink-0">
                  {app.qrCodeDataUrl ? (
                    <img src={app.qrCodeDataUrl} alt="QR Code" className="w-18 h-18 sm:w-20 sm:h-20" />
                  ) : (
                    <div className="w-18 h-18 sm:w-20 sm:h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                      <QrCode className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isApproved ? 'Cryptographically Sealed' : 'Validation Token Generated'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 max-w-xs leading-tight">
                    {isApproved
                      ? 'AICTE Sovereign Ledger Hash verified. Scan with smartphone to verify docket authenticity.'
                      : 'Digital verification hash will be sealed and committed upon Council clearance.'}
                  </p>
                </div>
              </div>

              {/* Committee Rubber Stamps & Apex Signature */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-center sm:text-right">
                {/* RO Stamp */}
                <div className="border border-slate-300 rounded-lg p-1.5 bg-slate-50 text-left font-mono text-[9px] w-24 sm:w-28 shadow-2xs">
                  <div className="font-extrabold text-slate-700 uppercase tracking-tighter">RO BUREAU</div>
                  <div className="text-emerald-700 font-bold text-[9px]">CLEARED ✓</div>
                  <div className="text-slate-500 text-[8px] truncate">Dr. A.K. Sharma</div>
                </div>

                {/* EVC Stamp */}
                <div className="border border-emerald-300 rounded-lg p-1.5 bg-emerald-50/60 text-left font-mono text-[9px] w-24 sm:w-28 shadow-2xs">
                  <div className="font-extrabold text-emerald-800 uppercase tracking-tighter">EVC AUDIT</div>
                  <div className="text-emerald-700 font-bold text-[9px]">VERIFIED ✓</div>
                  <div className="text-slate-500 text-[8px] truncate">Prof. Deshmukh</div>
                </div>

                {/* Apex Council Signature */}
                <div className="text-center sm:text-right pl-2 border-l border-slate-200">
                  {isApproved ? (
                    <>
                      <div className="w-32 sm:w-36 h-9 mx-auto sm:ml-auto flex items-center justify-center font-serif text-[#0c2340] italic text-sm sm:text-base border-b border-slate-400 mb-0.5">
                        Dr. Abhay Jere
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-[#0c2340]">Member Secretary</p>
                      <p className="text-[10px] text-slate-500">AICTE New Delhi</p>
                      <p className="text-[9px] text-emerald-700 font-mono mt-0.5">Digitally Sealed</p>
                    </>
                  ) : (
                    <>
                      <div className="w-32 sm:w-36 h-9 mx-auto sm:ml-auto flex items-center justify-center font-mono text-amber-600 text-xs border-b border-dashed border-amber-400 mb-0.5">
                        [Pending Seal]
                      </div>
                      <p className="text-[11px] sm:text-xs font-bold text-slate-500">Member Secretary</p>
                      <p className="text-[10px] text-slate-400">AICTE New Delhi</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer - Always Docked at Bottom */}
      <div className="shrink-0 p-3 sm:p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isApproved
                ? 'Docket officially validated and archived in Central AICTE Repository.'
                : 'Statutory approval will seal this Letter of Approval and dispatch notifications.'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer text-center"
            >
              {isApproved ? 'Close Docket' : 'Close Preview'}
            </button>
            {canApprove && (
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying Council Seal...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Approve & Seal LoA</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDocketModal;
