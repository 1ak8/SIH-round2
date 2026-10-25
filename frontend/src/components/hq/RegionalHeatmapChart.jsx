import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export const RegionalHeatmapChart = ({ data = [] }) => {
  const chartData = data.length > 0
    ? data
    : [
        { region: 'Northern', total: 18, approved: 12, overdue: 1, avgDaysSpent: 5.2 },
        { region: 'Western', total: 24, approved: 16, overdue: 2, avgDaysSpent: 6.8 },
        { region: 'Southern', total: 32, approved: 25, overdue: 1, avgDaysSpent: 4.9 },
        { region: 'Eastern', total: 14, approved: 9, overdue: 0, avgDaysSpent: 4.1 },
        { region: 'Central', total: 22, approved: 14, overdue: 3, avgDaysSpent: 7.6 },
      ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-600 shrink-0" />
            <span>Regional Clearance Velocity & Bottleneck Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Comparative performance across AICTE Regional Offices (RO Northern, Western, Southern, Eastern, Central).
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60 shrink-0">
          Live Pan-India Sync
        </span>
      </div>

      {/* Responsive Chart Container */}
      <div className="h-60 sm:h-72 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="total" name="Total Filed" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" name="Clearances" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="overdue" name="SLA Breaches" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Status Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
        {chartData.map((reg) => (
          <div key={reg.region} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-center text-xs">
            <span className="font-semibold text-slate-800 block text-xs">{reg.region}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1.5 inline-block ${
                reg.overdue >= 2
                  ? 'bg-rose-100 text-rose-800'
                  : reg.overdue === 1
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {reg.overdue >= 2 ? 'Backlog Alert' : reg.overdue === 1 ? 'Moderate Delay' : 'Optimal Velocity'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalHeatmapChart;
