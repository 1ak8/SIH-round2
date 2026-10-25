import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  ClipboardCheck,
  Flame,
  Radar,
  History,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { applicationAPI } from '../../services/api';

export const Navbar = () => {
  const { activeRole, user, logout } = useAuth();
  const { currentView, navigateTo, showToast, triggerRefresh } = useApp();
  const [simulating, setSimulating] = useState(false);

  const rolesConfig = [
    {
      id: 'college',
      label: 'College / Institute',
      institution: 'Apex Institute of Technology, Bhopal',
      email: 'college@gmail.com',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      activeBorder: 'border-blue-500 bg-blue-50/60',
      badge: 'Institution Portal',
    },
    {
      id: 'ro',
      label: 'Regional Officer (RO)',
      institution: 'AICTE Central / Western Regional Office',
      email: 'ro@gmail.com',
      icon: Building2,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      activeBorder: 'border-amber-500 bg-amber-50/60',
      badge: 'Scrutiny Desk',
    },
    {
      id: 'evc',
      label: 'EVC Committee Chair',
      institution: 'Expert Visit Committee (NIT Nominee)',
      email: 'evc@gmail.com',
      icon: ClipboardCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      activeBorder: 'border-indigo-500 bg-indigo-50/60',
      badge: 'Physical Audit',
    },
    {
      id: 'hq',
      label: 'Central AICTE HQ',
      institution: 'Member Secretary & Apex Council, New Delhi',
      email: 'admin@gmail.com',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      activeBorder: 'border-emerald-500 bg-emerald-50/60',
      badge: 'Apex Governance',
    },
  ];

  const currentRoleObj = rolesConfig.find((r) => r.id === activeRole) || rolesConfig[0];
  const CurrentIcon = currentRoleObj.icon;

  // Differentiator 1: Live Demo SLA Breach Simulation
  const handleFastSimulateBreach = async () => {
    try {
      setSimulating(true);
      const res = await applicationAPI.simulateSlaBreach('AICTE-2026-C-1042', 10);
      if (res.data?.success) {
        showToast(
          '⚡ DEMO: Artificial time-warp applied (+10 days). SLA breached and escalated to Level 2 HQ!',
          'warning'
        );
        triggerRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Error simulating SLA breach', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out of AICTE Pravah successfully', 'info');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-xs transition">
      {/* 1. Indian National Tricolor Hairline Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          
          {/* Left: Modern SaaS Council Brand & Seal */}
          <div
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition shrink-0">
              <span className="font-bold text-base text-orange-400 font-sans">प्र</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold tracking-tight text-slate-900 font-sans">
                  AICTE Pravah
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/70">
                  SIH 26262
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal hidden md:block leading-none mt-0.5">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Statutory Approval Desk
              </p>
            </div>
          </div>

          {/* Center: Sleek Segmented Pill Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-2xs gap-0.5">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {activeRole === 'college'
                  ? 'My Applications'
                  : activeRole === 'ro'
                  ? 'Scrutiny Desk'
                  : activeRole === 'evc'
                  ? 'Campus Visits'
                  : 'Approval Console'}
              </span>
            </button>

            <button
              onClick={() => navigateTo('radar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition relative cursor-pointer ${
                currentView === 'radar'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-orange-600" />
              <span>Validity Watchdog</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => navigateTo('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition cursor-pointer ${
                currentView === 'audit'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Audit Logs</span>
            </button>
          </nav>

          {/* Right Controls: Fast Demo Breach + User Profile Display + Exit */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Demo SLA Breach Simulation (Only for HQ & RO desks) */}
            {(activeRole === 'hq' || activeRole === 'ro') && (
              <button
                onClick={handleFastSimulateBreach}
                disabled={simulating}
                title="Fast-forward application time by 10 days to demonstrate automated SLA breach alerts"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/70 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulate SLA Breach (+10d)</span>
              </button>
            )}

            {/* Current Logged-in User Profile Display */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/70 bg-white shadow-2xs">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${currentRoleObj.color}`}>
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentRoleObj.label}
                </p>
                <p className="text-[11px] text-slate-400 font-mono leading-none mt-0.5 truncate max-w-[150px]">
                  {user?.email || currentRoleObj.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign Out of Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/70 border border-slate-200/70 transition shadow-2xs cursor-pointer bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
