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
      badge: 'Applicant',
      activeTab: 'border-slate-900 bg-slate-900 text-white shadow-xs',
      iconActive: 'bg-slate-800 text-white border-slate-700',
      desc: 'File new EoA applications, resolve deficiency objections & track SLA countdown.',
    },
    {
      id: 'ro',
      label: 'Regional Officer (RO)',
      short: 'Regional RO',
      email: 'ro@gmail.com',
      icon: Building2,
      badge: 'Scrutiny Desk',
      activeTab: 'border-slate-900 bg-slate-900 text-white shadow-xs',
      iconActive: 'bg-slate-800 text-white border-slate-700',
      desc: 'Dual-pane scrutiny desk, APH 2024-27 clause checklist & 7-day stage SLAs.',
    },
    {
      id: 'evc',
      label: 'EVC Committee Chair',
      short: 'EVC Audit',
      email: 'evc@gmail.com',
      icon: ClipboardCheck,
      badge: 'Field Audit',
      activeTab: 'border-slate-900 bg-slate-900 text-white shadow-xs',
      iconActive: 'bg-slate-800 text-white border-slate-700',
      desc: 'Anti-fraud 200m geofenced physical campus inspection & photo verification.',
    },
    {
      id: 'admin',
      label: 'Central AICTE HQ',
      short: 'Central HQ',
      email: 'admin@gmail.com',
      icon: ShieldCheck,
      badge: 'Apex Council',
      activeTab: 'border-slate-900 bg-slate-900 text-white shadow-xs',
      iconActive: 'bg-slate-800 text-white border-slate-700',
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
    <div className="min-h-screen lg:h-screen w-full bg-modern-canvas flex flex-col justify-between lg:overflow-hidden selection:bg-slate-200 selection:text-slate-900">
      
      {/* 1. Official National Tricolor Hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a] shrink-0" />

      {/* 2. Official Council Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-6 sm:px-10 lg:px-12 xl:px-16 py-3 shrink-0 shadow-2xs">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white shadow-xs shrink-0">
              <span className="font-bold text-base text-orange-400 font-sans">प्र</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-slate-900 tracking-tight font-sans">
                  AICTE Pravah
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70">
                  SIH 26262
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal hidden sm:block leading-none mt-0.5">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Statutory Approval Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Statutory Portal Online
            </span>
            <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/70 font-semibold text-[11px]">
              APH 2024–27
            </span>
          </div>
        </div>
      </header>

      {/* 3. Main Center Content */}
      <main className="flex-1 w-full px-6 sm:px-10 lg:px-12 xl:px-16 py-4 lg:py-6 flex items-center justify-center overflow-y-auto lg:overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center">
          
          {/* Left Column: Official Council Overview & 4 Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 xl:space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-slate-600 text-xs font-medium mb-3 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Ministry of Education, Government of India
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.16]">
                Automated AICTE Approval Workflow & Compliance Monitoring
              </h1>
              <p className="text-xs sm:text-sm xl:text-base text-slate-500 leading-relaxed max-w-2xl mt-2 font-normal">
                High-assurance statutory governance enforcing strict 7-day stage SLAs, 200m anti-proxy geofencing, cross-institution Ghost Faculty detection, and tamper-proof QR approval dockets.
              </p>
            </div>

            {/* 4 Clean Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Zero-Deficiency Scrutiny</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Automated checks for land contiguity, fire NOCs, and building stability before filing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900">7-Day Stage SLA Engine</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Dual-pane regional officer verification with automated auto-escalation matrix.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900">200m Geofenced EVC</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Anti-fraud GPS coordinate lock preventing proxy audits during committee campus visits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Verifiable QR Dockets</h3>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Cryptographically sealed approval orders publicly verifiable by banks and students.
                </p>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span><strong className="text-slate-800 font-semibold">10,000+</strong> Technical Colleges</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span><strong className="text-slate-800 font-semibold">5</strong> Regional Offices</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong className="text-slate-800 font-semibold">100%</strong> Digital Verification</span>
              </span>
            </div>
          </div>

          {/* Right Column: Clean, High-Trust Single Sign-On Console */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.02)] p-6 sm:p-7">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  National SSO Gateway
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70">
                  Role-Based Access
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sign In to Portal
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select your designated role below to automatically populate access credentials:
              </p>
            </div>

            {/* 4 Clean Modern Role Pills */}
            <div className="grid grid-cols-2 gap-2 mb-3.5">
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
                        : 'border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? r.iconActive
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold leading-tight truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {r.short}
                      </p>
                      <p className={`text-[10px] font-mono truncate mt-0.5 leading-none ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {r.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Context Notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 mb-3.5 flex items-start gap-2 text-xs text-slate-600">
              <span className="text-sm shrink-0 mt-0.5">🏛️</span>
              <p className="leading-snug">
                Accessing as <strong className="text-slate-900 font-semibold">{currentRole.label}</strong>. {currentRole.desc}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
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
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition bg-slate-50/50 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Security Password
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Demo: <strong className="text-slate-700 font-semibold">aicte123</strong>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition font-mono bg-slate-50/50 hover:bg-white focus:bg-white"
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
                className="w-full py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter {currentRole.label} Workspace</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit TLS Encrypted
              </span>
              <span className="font-mono">NIC e-Gov v3.1</span>
            </div>
          </div>

        </div>
      </main>

      {/* 4. Official Council Footer */}
      <footer className="bg-white/80 border-t border-slate-200/70 py-2.5 px-6 sm:px-10 lg:px-12 xl:px-16 text-xs text-slate-400 shrink-0">
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
