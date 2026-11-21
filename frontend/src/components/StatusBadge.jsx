import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  CheckCheck, 
  FileCheck2 
} from 'lucide-react';

export default function StatusBadge({ status }) {
  const configs = {
    'Submitted': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
      dot: 'bg-blue-500'
    },
    'Under Review': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      dot: 'bg-amber-500'
    },
    'Assigned': {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: ArrowUpRight,
      dot: 'bg-purple-500'
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Clock,
      dot: 'bg-indigo-500'
    },
    'Resolved': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    'Closed': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: CheckCheck,
      dot: 'bg-slate-500'
    }
  };

  const conf = configs[status] || configs['Submitted'];
  const Icon = conf.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot} animate-pulse`}></span>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
