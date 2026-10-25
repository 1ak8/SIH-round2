import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Compass,
  ShieldAlert,
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Draft':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: FileText,
          label: 'Draft',
        };
      case 'Submitted':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
          label: 'Submitted',
        };
      case 'Under Scrutiny':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Compass,
          label: 'Under Scrutiny',
        };
      case 'Deficiency Raised':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          label: 'Deficiency Raised',
        };
      case 'Scrutiny Passed':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          icon: CheckCircle2,
          label: 'Scrutiny Passed',
        };
      case 'EVC Scheduled':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Clock,
          label: 'EVC Scheduled',
        };
      case 'EVC Completed':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: CheckCircle2,
          label: 'EVC Completed',
        };
      case 'Approved':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
          icon: CheckCircle2,
          label: 'Approved',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
          icon: XCircle,
          label: 'Rejected',
        };
      case 'Valid':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          label: 'Statutory Valid',
        };
      case 'Expiring Soon':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          label: 'Expiring Soon',
        };
      case 'Expired':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
          icon: ShieldAlert,
          label: 'Expired',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText,
          label: status || 'Pending',
        };
    }
  };

  const { bg, icon: Icon, label } = getBadgeConfig();
  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${sizeClasses} tracking-tight font-medium`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {label}
    </span>
  );
};

export default StatusBadge;
