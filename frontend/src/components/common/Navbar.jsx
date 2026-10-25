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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition">
      {/* 1. Indian National Tricolor Hairline Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Refined Council Brand & Seal */}
          <div
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c2340] to-[#163a66] border border-orange-500/50 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:border-orange-400 transition shrink-0">
              <span className="font-black text-lg text-orange-400 font-display">प्र</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#0c2340] font-display">
                  AICTE Pravah
                </span>
                <span className="hidden sm:inline-block text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200/80">
                  SIH 26262
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium hidden md:block">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Statutory Approval & Compliance Desk
              </p>
            </div>
          </div>

          {/* Center: Sleek Segmented Pill Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-white text-[#0c2340] shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition relative cursor-pointer ${
                currentView === 'radar'
                  ? 'bg-white text-[#0c2340] shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Radar className="w-4 h-4 text-[#ea580c]" />
              <span>Validity Watchdog</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => navigateTo('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                currentView === 'audit'
                  ? 'bg-white text-[#0c2340] shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-4 h-4 text-slate-600" />
              <span>Audit Logs</span>
            </button>
          </nav>

          {/* Right Controls: Fast Demo Breach + Interactive Role Switcher + Exit */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Demo SLA Breach Simulation (Only for HQ & RO desks) */}
            {(activeRole === 'hq' || activeRole === 'ro') && (
              <button
                onClick={handleFastSimulateBreach}
                disabled={simulating}
                title="Fast-forward application time by 10 days to demonstrate automated SLA breach alerts"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulate SLA Breach (+10d)</span>
              </button>
            )}

            {/* Current Logged-in User Profile Display */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 shadow-2xs">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${currentRoleObj.color}`}>
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentRoleObj.label}
                </p>
                <p className="text-xs text-slate-500 font-mono leading-none mt-0.5 truncate max-w-[150px]">
                  {user?.email || currentRoleObj.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign Out of Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/90 transition shadow-2xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
