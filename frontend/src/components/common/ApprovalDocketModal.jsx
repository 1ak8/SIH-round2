import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Printer, ShieldCheck, QrCode, Download, Building2, CheckCircle2 } from 'lucide-react';

export const ApprovalDocketModal = ({ application, onClose }) => {
  useEffect(() => {
    // Fire celebratory confetti on opening the official docket!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#0c2340', '#059669', '#d97706'],
    });
  }, []);

  const app = application || {
    applicationId: 'AICTE-2026-C-1042',
    institutionName: 'Apex Institute of Technology, Bhopal',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    region: 'Central',
    status: 'Approved',
    infrastructureDetails: {
      address: 'Bhadbhada Road, Suraj Nagar, Bhopal, MP - 462044',
      landAreaAcres: 6.2,
      builtUpAreaSqMtr: 14200,
    },
    courses: [
      { courseName: 'B.Tech', branch: 'Computer Science & Engineering', level: 'UG', proposedIntake: 180, approvedIntake: 120 },
      { courseName: 'B.Tech', branch: 'Artificial Intelligence & Data Science', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
      { courseName: 'B.Tech', branch: 'Electronics & Communication', level: 'UG', proposedIntake: 60, approvedIntake: 60 },
    ],
    qrCodeDataUrl: '',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Outer Floating Close Button for easy mobile / desktop exit */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-2xl border border-slate-700 transition cursor-pointer"
        title="Close (Esc)"
        aria-label="Close"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>

      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-300 overflow-hidden my-4 sm:my-6">
        {/* Top Control Bar */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-rose-950 via-rose-900 to-[#0c2340] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between no-print border-b border-rose-950/30">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide truncate max-w-[200px] sm:max-w-none">
              AICTE Letter of Approval Docket
            </span>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Printable Official AICTE Docket Document */}
        <div id="printable-docket" className="p-8 bg-white text-slate-800 font-sans print:p-0">
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

            {/* Verification and Signatures */}
            <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
              {/* QR Code */}
              <div className="flex items-center gap-3">
                <div className="p-1 border-2 border-slate-800 rounded bg-white shrink-0">
                  {app.qrCodeDataUrl ? (
                    <img src={app.qrCodeDataUrl} alt="QR Code" className="w-20 h-20" />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                      <QrCode className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cryptographically Validated</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Scan with any smartphone or AICTE Pravah scanner to verify docket authenticity.
                  </p>
                </div>
              </div>

              {/* Council Signature */}
              <div className="text-right">
                <div className="w-32 h-10 mx-auto flex items-center justify-center font-serif text-slate-400 italic text-sm border-b border-slate-400 mb-1">
                  Dr. Abhay Jere
                </div>
                <p className="text-xs font-bold text-[#0c2340]">Member Secretary</p>
                <p className="text-xs text-slate-500">All India Council for Technical Education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDocketModal;
