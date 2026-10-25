import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const RegionalHeatmapChart = ({ data = [] }) => {
  const [activeTab, setActiveTab] = useState('velocity'); // 'velocity' | 'comparison'

  const chartData =
    data.length > 0
      ? data
      : [
          { region: 'Northern', total: 42, approved: 34, overdue: 2, avgDaysSpent: 5.2, velocityRate: 81 },
          { region: 'Western', total: 58, approved: 46, overdue: 3, avgDaysSpent: 6.4, velocityRate: 79 },
          { region: 'Southern', total: 74, approved: 65, overdue: 1, avgDaysSpent: 4.8, velocityRate: 88 },
          { region: 'Eastern', total: 36, approved: 28, overdue: 0, avgDaysSpent: 4.1, velocityRate: 92 },
          { region: 'Central', total: 48, approved: 37, overdue: 4, avgDaysSpent: 7.2, velocityRate: 77 },
        ];

  // Modern SaaS Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{label} Region</span>
            <span className="text-[10px] text-slate-400 font-mono">RO Desk</span>
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Chart Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans">
              National Clearance Velocity & Regional Bottleneck Radar
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Real-time comparative performance across 5 AICTE Regional Offices (Northern, Western, Southern, Eastern, Central).
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs shrink-0 gap-1">
          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Clearance Volume
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Velocity Flow (Area)
          </button>
        </div>
      </div>

      {/* Main Chart Canvas with Gradient Fill */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'velocity' ? (
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="approvedBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="overdueBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#be123c" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="total" name="Total Applications" fill="url(#totalBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="approved" name="Statutory Clearances" fill="url(#approvedBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="overdue" name="SLA Breaches" fill="url(#overdueBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="approvedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} iconType="circle" />
              <Area type="monotone" dataKey="total" name="Total Filed" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#totalAreaGrad)" />
              <Area type="monotone" dataKey="approved" name="Clearances Granted" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#approvedAreaGrad)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Regional Status Summary Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
        {chartData.map((reg) => {
          const isCritical = reg.overdue >= 2;
          const isWarning = reg.overdue === 1;

          return (
            <div
              key={reg.region}
              className="bg-slate-50/80 hover:bg-slate-100/80 p-3 rounded-xl border border-slate-200/70 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{reg.region}</span>
                <span className="font-mono text-[11px] font-bold text-slate-500">{reg.total} Files</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Clearance:</span>
                <span className="font-semibold text-emerald-700 font-mono">{reg.approved} ({Math.round((reg.approved / reg.total) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-mono">SLA Pace: {reg.avgDaysSpent}d</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isCritical
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isCritical ? `${reg.overdue} Overdue` : isWarning ? '1 Overdue' : 'On Schedule'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionalHeatmapChart;
