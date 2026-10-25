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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition">
      {/* 1. Indian National Tricolor Hairline Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Modern Council Brand & Seal */}
          <div
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition shrink-0">
              <span className="font-bold text-lg sm:text-xl text-orange-400 font-sans">प्र</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 font-sans leading-none block">
                AICTE Pravah
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden lg:block leading-tight mt-1">
                अखिल भारतीय तकनीकी शिक्षा परिषद • Statutory Approval Portal
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs (Visible on lg+ screens: 1024px, 1280px, 1440px, 1920px) */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs gap-1">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm transition cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-blue-600" />
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
              className={`flex items-center gap-2 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm transition relative cursor-pointer ${
                currentView === 'radar'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
              }`}
            >
              <Radar className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-orange-600" />
              <span>Validity Watchdog</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => navigateTo('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm transition cursor-pointer ${
                currentView === 'audit'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
              }`}
            >
              <History className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-slate-600" />
              <span>Audit Logs</span>
            </button>
          </nav>

          {/* Right Controls: User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
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
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/70 bg-white shadow-2xs max-w-[130px] sm:max-w-none">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${currentRoleObj.color}`}>
                <CurrentIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                  {currentRoleObj.label}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono leading-none mt-0.5 truncate hidden sm:block max-w-[150px]">
                  {user?.email || currentRoleObj.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign Out of Portal"
              className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/70 border border-slate-200/70 transition shadow-2xs cursor-pointer bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </div>

        {/* Tablet / Mobile Navigation Tabs Bar (Visible on screens < lg, i.e., 13-inch small laptops, tablets, mobile) */}
        <div className="flex lg:hidden items-center justify-around bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/70 mb-2.5 gap-1 shadow-2xs">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
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
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition relative cursor-pointer ${
              currentView === 'radar'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="truncate">Validity Watchdog</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => navigateTo('audit')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition cursor-pointer ${
              currentView === 'audit'
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="truncate">Audit Logs</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
