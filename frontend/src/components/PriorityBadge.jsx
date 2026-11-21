import React from 'react';
import { AlertOctagon, Flame, ShieldAlert, Info } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const configs = {
    'Critical': {
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: AlertOctagon,
      label: 'Critical'
    },
    'High': {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Flame,
      label: 'High'
    },
    'Medium': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: ShieldAlert,
      label: 'Medium'
    },
    'Low': {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      icon: Info,
      label: 'Low'
    }
  };

  const conf = configs[priority] || configs['Medium'];
  const Icon = conf.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${conf.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {conf.label}
    </span>
  );
}
