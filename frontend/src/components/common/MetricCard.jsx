import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badgeText,
  onClick,
  isActive = false,
  statusHint,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'bg-rose-50 text-rose-600 border-rose-200/60',
          badge: 'text-rose-700 bg-rose-50 border-rose-200/80',
          dot: 'bg-rose-500',
          accentText: 'text-rose-600',
          hintDot: 'bg-rose-500',
          defaultHint: value > 0 ? 'Requires immediate action' : 'Zero breaches active',
        };
      case 'warning':
        return {
          icon: 'bg-amber-50 text-amber-600 border-amber-200/60',
          badge: 'text-amber-800 bg-amber-50 border-amber-200/80',
          dot: 'bg-amber-500',
          accentText: 'text-amber-700',
          hintDot: 'bg-amber-500',
          defaultHint: value > 0 ? 'Awaiting resolution' : 'Zero objections open',
        };
      case 'success':
        return {
          icon: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
          badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
          dot: 'bg-emerald-500',
          accentText: 'text-emerald-700',
          hintDot: 'bg-emerald-500',
          defaultHint: 'Statutory verified',
        };
      case 'saffron':
        return {
          icon: 'bg-orange-50 text-orange-600 border-orange-200/60',
          badge: 'text-orange-700 bg-orange-50 border-orange-200/80',
          dot: 'bg-orange-500',
          accentText: 'text-orange-600',
          hintDot: 'bg-orange-500',
          defaultHint: 'Compliance radar active',
        };
      case 'navy':
        return {
          icon: 'bg-slate-100 text-slate-700 border-slate-200/80',
          badge: 'text-slate-700 bg-slate-100 border-slate-200/80',
          dot: 'bg-slate-500',
          accentText: 'text-slate-900',
          hintDot: 'bg-slate-400',
          defaultHint: 'Active docket roster',
        };
      default:
        return {
          icon: 'bg-blue-50 text-blue-600 border-blue-200/60',
          badge: 'text-blue-700 bg-blue-50 border-blue-200/80',
          dot: 'bg-blue-500',
          accentText: 'text-blue-700',
          hintDot: 'bg-blue-500',
          defaultHint: 'System tracked',
        };
    }
  };

  const styles = getVariantStyles();
  const isCode = typeof value === 'string' && (value.includes('-') || value.includes('AICTE'));

  return (
    <div
      onClick={onClick}
      className={`relative p-5 transition-all duration-150 flex flex-col justify-between group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'bg-slate-50/80 ring-1 ring-inset ring-slate-300'
          : 'hover:bg-slate-50/60'
      }`}
    >
      {/* Top Header: Icon + Title + Live Status Badge */}
      <div className="flex items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${styles.icon}`}
            >
              <Icon className="w-4 h-4 stroke-[2]" />
            </div>
          )}
          <span className="text-xs font-medium text-slate-500 truncate">
            {title}
          </span>
        </div>
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border shrink-0 ${styles.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value & Subtitle */}
      <div className="mt-auto pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <div
            className={`font-semibold tracking-tight leading-none ${
              variant === 'danger' && (typeof value === 'number' ? value > 0 : String(value).toLowerCase().includes('overdue'))
                ? 'text-rose-600'
                : 'text-slate-900'
            } ${
              isCode
                ? 'text-base sm:text-lg font-mono font-bold tracking-tight text-slate-800'
                : 'text-2xl sm:text-[26px] tabular-nums'
            }`}
          >
            {value}
          </div>
        </div>

        {subtitle && (
          <p className="mt-1.5 text-xs text-slate-500 font-normal leading-relaxed line-clamp-1">
            {subtitle}
          </p>
        )}

        {/* Micro Visual Status Footnote */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-normal text-slate-400 truncate">
            <span className={`w-1.5 h-1.5 rounded-full ${styles.hintDot}`} />
            <span className="truncate">{statusHint || styles.defaultHint}</span>
          </span>

          {onClick && (
            <span
              className={`shrink-0 ml-2 font-medium transition-all flex items-center gap-1 text-[11px] ${
                isActive
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-400 group-hover:text-slate-800'
              }`}
            >
              <span>{isActive ? 'Filtered' : 'Filter'}</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
