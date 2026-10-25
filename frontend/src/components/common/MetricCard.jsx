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
          icon: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-2xs group-hover:bg-rose-100',
          badge: 'text-rose-700 bg-rose-50/90 border-rose-200',
          dot: 'bg-rose-500',
          topLine: 'bg-gradient-to-r from-rose-800 to-[#0c2340]',
          accentText: 'text-rose-700',
          hintDot: 'bg-rose-500',
          defaultHint: value > 0 ? 'Requires immediate action' : 'Zero breaches active',
        };
      case 'warning':
        return {
          icon: 'bg-amber-50 text-amber-700 border-amber-200/90 shadow-2xs group-hover:bg-amber-100',
          badge: 'text-amber-800 bg-amber-50/90 border-amber-200',
          dot: 'bg-amber-500',
          topLine: 'bg-amber-500',
          accentText: 'text-amber-700',
          hintDot: 'bg-amber-500',
          defaultHint: value > 0 ? 'Awaiting resolution' : 'Zero objections open',
        };
      case 'success':
        return {
          icon: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-2xs group-hover:bg-emerald-100',
          badge: 'text-emerald-700 bg-emerald-50/90 border-emerald-200',
          dot: 'bg-emerald-500',
          topLine: 'bg-emerald-600',
          accentText: 'text-emerald-700',
          hintDot: 'bg-emerald-500',
          defaultHint: 'Statutory verified',
        };
      case 'saffron':
        return {
          icon: 'bg-orange-50 text-[#ea580c] border-orange-200/90 shadow-2xs group-hover:bg-orange-100',
          badge: 'text-[#ea580c] bg-orange-50/90 border-orange-200',
          dot: 'bg-[#ea580c]',
          topLine: 'bg-[#ea580c]',
          accentText: 'text-[#ea580c]',
          hintDot: 'bg-[#ea580c]',
          defaultHint: 'Compliant with APH',
        };
      case 'navy':
        return {
          icon: 'bg-slate-100 text-[#0c2340] border-slate-200/90 shadow-2xs group-hover:bg-slate-200/70',
          badge: 'text-[#0c2340] bg-slate-100/90 border-slate-200',
          dot: 'bg-[#0c2340]',
          topLine: 'bg-[#0c2340]',
          accentText: 'text-[#0c2340]',
          hintDot: 'bg-[#0c2340]',
          defaultHint: 'Active docket roster',
        };
      default:
        return {
          icon: 'bg-blue-50 text-blue-700 border-blue-200/90 shadow-2xs group-hover:bg-blue-100',
          badge: 'text-blue-700 bg-blue-50/90 border-blue-200',
          dot: 'bg-blue-600',
          topLine: 'bg-blue-600',
          accentText: 'text-blue-700',
          hintDot: 'bg-blue-600',
          defaultHint: 'System tracked',
        };
    }
  };

  const styles = getVariantStyles();
  const isCode = typeof value === 'string' && (value.includes('-') || value.includes('AICTE'));

  return (
    <div
      onClick={onClick}
      className={`relative p-5 lg:p-6 transition-all duration-200 flex flex-col justify-between group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'bg-slate-50/95 ring-2 ring-inset ring-[#0c2340]/20'
          : 'hover:bg-gradient-to-b hover:from-slate-50/90 hover:to-transparent'
      }`}
    >
      {/* Individual Metric Top Accent Indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2.5px] transition-all duration-300 ${
          isActive ? styles.topLine : 'bg-transparent group-hover:' + styles.topLine
        }`}
      />

      {/* Top Header: Icon + Title + Live Status Badge */}
      <div className="flex items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${styles.icon}`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
            </div>
          )}
          <span className="text-xs sm:text-[13px] font-bold text-slate-700 tracking-wide uppercase truncate">
            {title}
          </span>
        </div>
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${styles.badge}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
              />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`} />
            </span>
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value & Subtitle */}
      <div className="mt-auto pt-1">
        <div className="flex items-baseline justify-between gap-2">
          <div
            className={`font-bold tracking-tight leading-none ${
              variant === 'danger' && (typeof value === 'number' ? value > 0 : String(value).toLowerCase().includes('overdue'))
                ? 'text-rose-700'
                : 'text-slate-900'
            } ${
              isCode
                ? 'text-lg sm:text-xl font-semibold tracking-tight'
                : 'text-2xl sm:text-3xl tabular-nums'
            }`}
          >
            {value}
          </div>
        </div>

        {subtitle && (
          <p className="mt-2 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed line-clamp-1">
            {subtitle}
          </p>
        )}

        {/* Micro Visual Status Footnote */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 truncate">
            <span className={`w-1.5 h-1.5 rounded-full ${styles.hintDot}`} />
            <span className="truncate">{statusHint || styles.defaultHint}</span>
          </span>

          {onClick && (
            <span
              className={`shrink-0 ml-2 font-bold transition-all flex items-center gap-1 text-xs ${
                isActive
                  ? 'text-[#0c2340] bg-slate-200/90 px-2.5 py-0.5 rounded-md'
                  : 'text-slate-500 group-hover:text-slate-900'
              }`}
            >
              <span>{isActive ? 'Filtered' : 'Filter'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
