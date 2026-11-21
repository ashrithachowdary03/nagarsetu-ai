import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  MapPin, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  User, 
  FileText,
  ShieldAlert,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

export default function TrackComplaintPage({ initialRefId }) {
  const [referenceId, setReferenceId] = useState(initialRefId || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusPipeline = [
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed'
  ];

  const fetchComplaint = async (ref) => {
    if (!ref || !ref.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getComplaint(ref.trim());
      setComplaint(data);
    } catch (err) {
      setComplaint(null);
      setError(err.message || `No grievance record found with ID '${ref}'`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRefId) {
      setReferenceId(initialRefId);
      fetchComplaint(initialRefId);
    }
  }, [initialRefId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaint(referenceId);
  };

  const getStepIndex = (status) => {
    const idx = statusPipeline.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = complaint ? getStepIndex(complaint.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Track Grievance Status
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Enter your unique Reference ID to view live AI triage, department assignment, and field resolution logs.
        </p>

        <form onSubmit={handleSearch} className="flex items-center bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-md focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 dark:focus-within:ring-orange-900/40 transition mt-4">
          <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
          <input
            type="text"
            placeholder="e.g. NS-2026-88012"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="w-full bg-transparent text-sm font-mono uppercase focus:outline-hidden text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          Enter the unique Reference ID provided upon submission (e.g., <span className="font-mono font-semibold text-orange-600">NS-2026-XXXXX</span>)
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {complaint && (
        <div className="space-y-6">
          
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md overflow-hidden">
            
            {/* Top Bar */}
            <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-extrabold text-lg text-orange-400">
                    {complaint.reference_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                <h2 className="text-xl font-bold text-white">{complaint.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>

            {/* Step Pipeline */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Resolution Progression
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {statusPipeline.map((st, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div 
                      key={st}
                      className={`p-3 rounded-2xl border text-center transition ${
                        isCurrent 
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md' 
                          : isPassed 
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700 font-semibold' 
                            : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase mb-1">
                        Step 0{idx + 1}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {st}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Problem Description
                  </h3>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {complaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">Location</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                      <span className="truncate">{complaint.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5">Assigned Dept</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span className="truncate">{complaint.assigned_department || complaint.suggested_department}</span>
                    </div>
                  </div>
                </div>

                {complaint.image_url && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Submitted Photograph Evidence
                    </h3>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900">
                      <img 
                        src={complaint.image_url} 
                        alt="Grievance Evidence" 
                        className="w-full max-h-56 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                
                {/* AI Triage Box */}
                <div className="p-4 bg-orange-50/70 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      AI Triage Synthesis
                    </div>
                    <span className="text-[11px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-700 font-bold text-orange-700 dark:text-orange-400">
                      {Math.round((complaint.ai_confidence || 0.85) * 100)}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {complaint.ai_summary}
                  </p>

                  <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-orange-200/60 dark:border-orange-700/40">
                    <strong className="text-orange-900 dark:text-orange-400">Priority Assessment:</strong> {complaint.priority_reason}
                  </div>

                  {complaint.image_observations && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-orange-200/60 dark:border-orange-700/40">
                      <strong className="text-orange-900 dark:text-orange-400">Vision Observations:</strong> {complaint.image_observations}
                    </div>
                  )}

                  {complaint.uncertainty_notes && (
                    <div className="text-[11px] text-amber-800 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/30 p-2 rounded-xl border border-amber-200 dark:border-amber-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{complaint.uncertainty_notes}</span>
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Official Activity Timeline ({complaint.updates?.length || 0})
                  </h3>
                  
                  <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                    {(complaint.updates || []).map((up, idx) => (
                      <div key={idx} className="relative pl-8 text-xs space-y-1">
                        <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white dark:border-slate-800 shadow-xs"></div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{up.updated_by}</span>
                          <span className="text-[11px]">
                            {new Date(up.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          Status: <span className="text-orange-600">{up.new_status}</span>
                        </div>
                        {up.remarks && (
                          <div className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            {up.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
