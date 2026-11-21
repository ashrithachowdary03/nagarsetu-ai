import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MapPin, 
  Search,
  Loader2,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AIAnalysisModal from '../components/AIAnalysisModal';

export default function CitizenDashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchCitizenComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.listComplaints({ user_only: true });
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching citizen complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCitizenComplaints();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sign in to Access Citizen Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Please sign in to track all your submitted civic grievances and receive field resolution notifications.
        </p>
      </div>
    );
  }

  const total = complaints.length;
  const pending = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const inProgress = complaints.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length;
  const resolved = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            Citizen Grievance Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome, {user.full_name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Overview of your reported civic issues and real-time municipal responses.
          </p>
        </div>

        <button
          onClick={() => onNavigate('submit')}
          className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Report New Issue
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Total Reported</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-bold uppercase text-amber-600 mb-1">Under Review</div>
          <div className="text-2xl font-extrabold text-amber-600">{pending}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-bold uppercase text-indigo-600 mb-1">In Progress</div>
          <div className="text-2xl font-extrabold text-indigo-600">{inProgress}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-1">Resolved</div>
          <div className="text-2xl font-extrabold text-emerald-600">{resolved}</div>
        </div>

      </div>

      {/* Grievances List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Grievance History</h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{total} records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            <span className="text-sm dark:text-slate-400">Loading complaints...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">You haven't submitted any civic complaints yet.</p>
            <button
              onClick={() => onNavigate('submit')}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Submit Your First Grievance
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {complaints.map((c) => (
              <div 
                key={c.id} 
                className="p-6 hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-lg border border-orange-200 dark:border-orange-700">
                      {c.reference_id}
                    </span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{c.title}</h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{c.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.assigned_department || c.suggested_department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" /> AI Insights
                  </button>
                  <button
                    onClick={() => onNavigate('track', c.reference_id)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    Track Progress <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        onTrack={(ref) => {
          setSelectedComplaint(null);
          onNavigate('track', ref);
        }}
      />

    </div>
  );
}
