import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ClipboardCheck,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState('college');
  const [email, setEmail] = useState('college@gmail.com');
  const [password, setPassword] = useState('aicte123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    {
      id: 'college',
      label: 'College / Institute',
      short: 'Institute',
      email: 'college@gmail.com',
      icon: GraduationCap,
      color: 'saffron',
      badge: 'Applicant',
      activeTab: 'border-[#ea580c] bg-orange-50/90 text-orange-950 shadow-sm ring-1 ring-[#ea580c]/30',
      desc: 'File new EoA applications, resolve deficiency objections & track SLA countdown.',
    },
    {
      id: 'ro',
      label: 'Regional Officer (RO)',
      short: 'Regional RO',
      email: 'ro@gmail.com',
      icon: Building2,
      color: 'navy',
      badge: 'Scrutiny Desk',
      activeTab: 'border-[#0c2340] bg-slate-100/90 text-[#0c2340] shadow-sm ring-1 ring-[#0c2340]/30',
      desc: 'Dual-pane scrutiny desk, APH 2024-27 clause checklist & 7-day stage SLAs.',
    },
    {
      id: 'evc',
      label: 'EVC Committee Chair',
      short: 'EVC Audit',
      email: 'evc@gmail.com',
      icon: ClipboardCheck,
      color: 'emerald',
      badge: 'Field Audit',
      activeTab: 'border-emerald-600 bg-emerald-50/90 text-emerald-950 shadow-sm ring-1 ring-emerald-500/30',
      desc: 'Anti-fraud 200m geofenced physical campus inspection & photo verification.',
    },
    {
      id: 'admin',
      label: 'Central AICTE HQ',
      short: 'Central HQ',
      email: 'admin@gmail.com',
      icon: ShieldCheck,
      color: 'slate',
      badge: 'Apex Council',
      activeTab: 'border-[#071526] bg-[#0c2340]/10 text-[#0c2340] shadow-sm ring-1 ring-[#0c2340]/30',
      desc: 'National SLA auto-escalation matrix, dynamic policy rules & digital seal approval.',
    },
  ];

  const currentRole = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleSelectRole = (r) => {
    setSelectedRole(r.id);
    setEmail(r.email);
    setPassword('aicte123');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      showToast(`Welcome to AICTE Pravah • ${currentRole.label}!`, 'success');
    } else {
      showToast(res.message || 'Invalid credentials. Please verify your email or password.', 'error');
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#f8fafc] bg-grid-subtle flex flex-col justify-between lg:overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      
      {/* 1. Official National Tricolor Hairline */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a] shrink-0 shadow-xs" />

      {/* 2. Official Council Header Bar - Full Screen Width */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 sm:px-10 lg:px-12 xl:px-16 py-3 shrink-0 shadow-2xs">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* National Crest Badge (Option 2: High-Tech Enterprise) */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-blue-500/50 flex items-center justify-center text-white shadow-md shadow-slate-900/10 shrink-0">
              <span className="font-black text-xl text-cyan-400 font-display">प्र</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-black text-slate-900 tracking-tight font-display">
                  AICTE Pravah
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-mono">
                  SIH 26262
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                अखिल भारतीय तकनीकी शिक्षा परिषद • All India Council for Technical Education
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Statutory Portal Online
            </span>
            <span className="font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/90 font-bold text-[11px]">
              APH 2024–27
            </span>
          </div>
        </div>
      </header>

      {/* 3. Main Center Content - Expansive Full Screen Canvas */}
      <main className="flex-1 w-full px-6 sm:px-10 lg:px-12 xl:px-16 py-4 lg:py-6 flex items-center justify-center overflow-y-auto lg:overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Official Council Overview & 4 Pillars (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 xl:space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Ministry of Education, Government of India
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-black text-slate-900 tracking-tight leading-[1.16] font-display">
                Automated AICTE Approval Workflow & Compliance Monitoring
              </h1>
              <p className="text-xs sm:text-sm xl:text-base text-slate-600 leading-relaxed max-w-3xl mt-2 font-normal">
                Next-generation statutory platform enforcing strict 7-day stage SLAs, 200m anti-fraud geofencing, cross-institution Ghost Faculty detection, and verifiable QR approval dockets.
              </p>
            </div>

            {/* 4 Clean Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 transition group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display">Zero-Deficiency Scrutiny</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Automated checks for land contiguity, fire NOCs, and building stability before filing.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-cyan-300 transition group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Clock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display">7-Day Stage SLA Engine</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Dual-pane regional officer verification with automated auto-escalation matrix.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <MapPin className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display">200m Geofenced EVC</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Anti-fraud GPS coordinate lock preventing proxy audits during committee campus visits.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Award className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display">Verifiable QR Dockets</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Cryptographically sealed approval orders publicly verifiable by banks and students.
                </p>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="pt-3 border-t border-slate-200/90 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span><strong>10,000+</strong> Technical Colleges</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span><strong>5</strong> Regional Offices</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>100%</strong> Digital Verification</span>
              </span>
            </div>
          </div>

          {/* Right Column: Clean, High-Trust Single Sign-On Console (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 p-5 sm:p-7">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
                  National SSO Gateway
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Role-Based Access
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
                Sign In to Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your designated role below to automatically populate access credentials:
              </p>
            </div>

            {/* 4 Clean Role Pills */}
            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-start gap-2 cursor-pointer ${
                      isSelected
                        ? r.activeTab
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-tight truncate text-slate-900">
                        {r.short}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5 leading-none">
                        {r.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Context Notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-3.5 flex items-start gap-2">
              <span className="text-sm shrink-0 mt-0.5">🏛️</span>
              <p className="text-xs text-slate-600 leading-snug">
                Logging in as <strong className="text-slate-900 font-bold">{currentRole.label}</strong>. {currentRole.desc}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Panel Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. college@gmail.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Security Password
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Demo: <strong className="text-slate-800">aicte123</strong>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-2.5 sm:py-3 bg-[#0c2340] hover:bg-[#163a66] active:bg-[#071526] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#0c2340]/20 transition flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter {currentRole.label} Workspace</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit TLS Encrypted
              </span>
              <span className="font-mono">NIC e-Gov v3.1</span>
            </div>
          </div>

        </div>
      </main>

      {/* 4. Official Council Footer - Full Screen Width */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-6 sm:px-10 lg:px-12 xl:px-16 text-xs text-slate-500 shrink-0">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <span>
            All India Council for Technical Education • Ministry of Education, Government of India
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            Approval Process Handbook (APH 2024–27) | Smart India Hackathon Round 2
          </span>
        </div>
      </footer>

    </div>
  );
};

export default LoginPage;
