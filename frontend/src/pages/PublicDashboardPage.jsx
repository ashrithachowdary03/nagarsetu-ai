import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  Loader2,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const PRIORITY_COLORS = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#f59e0b',
  'Low': '#64748b'
};

export default function PublicDashboardPage({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicStats = async () => {
      setLoading(true);
      try {
        const data = await api.getPublicStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching public pulse stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Compiling Public Civic Pulse...</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Aggregating real-time municipal grievance data</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Public Information & Transparency
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Civic Pulse Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Open governance analytics showcasing municipal grievance reporting volume, category distributions, and community resolution rates. All citizen privacy details are strictly redacted.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Total Grievances
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_complaints}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Logged in registry</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50/20 dark:bg-emerald-900/10 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{stats.resolved_complaints}</div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-500 mt-1">Completed repairs</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> In Action
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{stats.in_progress_complaints}</div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-500 mt-1">Active field crews</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-orange-200 dark:border-orange-700 bg-orange-50/20 dark:bg-orange-900/10 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Resolution Rate
          </div>
          <div className="text-3xl font-extrabold text-orange-600">
            {stats.resolution_rate_percent}%
          </div>
          <div className="text-[11px] text-orange-700 dark:text-orange-500 mt-1">Municipal efficiency</div>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Complaints by Civic Category
            </h3>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Total volume</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.category_distribution}>
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#ea580c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Civic Priority Distribution
            </h3>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">AI triage analysis</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priority_distribution}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.priority}: ${entry.count}`}
                >
                  {stats.priority_distribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PRIORITY_COLORS[entry.priority] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Public Grievance Feed */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live Public Grievance Stream
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent log of reported civic issues (Personal identities strictly masked)
            </p>
          </div>
          <button
            onClick={() => onNavigate('submit')}
            className="self-start sm:self-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition"
          >
            Report an Issue
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {(stats.recent_public_complaints || []).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No civic complaints registered yet. New submissions will appear here in real-time.
            </div>
          ) : (
            (stats.recent_public_complaints || []).map((item) => (
              <div 
                key={item.reference_id} 
                className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-lg border border-orange-200 dark:border-orange-700">
                      {item.reference_id}
                    </span>
                    <StatusBadge status={item.status} />
                    <PriorityBadge priority={item.priority} />
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Area: {item.location_area}</span>
                    </div>
                    <div>Category: {item.category}</div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('track', item.reference_id)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold self-start sm:self-center transition flex items-center gap-1.5"
                >
                  Track <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
