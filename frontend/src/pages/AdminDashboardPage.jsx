import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  ShieldAlert, 
  Building, 
  MapPin, 
  ExternalLink, 
  Edit3, 
  Layers, 
  Loader2, 
  Copy,
  AlertTriangle,
  X
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
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const PRIORITY_COLORS = {
  'Critical': '#ef4444',
  'High': '#f97316',
  'Medium': '#f59e0b',
  'Low': '#64748b'
};

const CATEGORY_COLORS = ['#ea580c', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#64748b'];

export default function AdminDashboardPage({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [similarComplaints, setSimilarComplaints] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [actionStatus, setActionStatus] = useState('');
  const [actionDept, setActionDept] = useState('');
  const [actionPriority, setActionPriority] = useState('');
  const [actionRemarks, setActionRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackType, setFeedbackType] = useState('success'); // 'success' | 'error'
  const [toast, setToast] = useState(null); // { msg, type }

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminStats, list] = await Promise.all([
        api.getAdminStats(),
        api.listComplaints({
          category: categoryFilter || undefined,
          priority: priorityFilter || undefined,
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          user_only: false
        })
      ]);
      setStats(adminStats);
      setComplaints(list);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, priorityFilter, statusFilter, searchQuery]);

  const handleOpenDetail = async (c) => {
    setSelectedComplaint(c);
    setActionStatus(c.status);
    setActionDept(c.assigned_department || c.suggested_department || 'Roads Department');
    setActionPriority(c.priority);
    setActionRemarks('');
    setFeedbackMsg('');

    setLoadingSimilar(true);
    try {
      const similar = await api.getSimilarComplaints(c.id);
      setSimilarComplaints(similar);
    } catch {
      setSimilarComplaints([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveAdminAction = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdating(true);
    setFeedbackMsg('');

    try {
      const updated = await api.updateComplaint(selectedComplaint.id, {
        status: actionStatus,
        assigned_department: actionDept,
        priority: actionPriority,
        remarks: actionRemarks || undefined
      });
      setSelectedComplaint(updated);
      setFeedbackMsg('✅ Complaint successfully updated in municipal database.');
      setFeedbackType('success');
      showToast('✅ Status updated successfully!', 'success');
      loadData();
    } catch (err) {
      const errMsg = '❌ Failed to update: ' + err.message;
      setFeedbackMsg(errMsg);
      setFeedbackType('error');
      showToast(errMsg, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const departmentList = [
    "Roads Department",
    "Water Supply Department",
    "Sanitation Department",
    "Drainage Department",
    "Electrical Department",
    "Public Works Department",
    "General Grievance Cell"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 tracking-wider">
              Official Administration
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Zone Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Civic Resolution Command
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            Review AI triage analysis, confirm priorities, assign field departments, and manage complaint life-cycles.
          </p>
        </div>

        <button 
          onClick={loadData}
          className="self-start md:self-auto px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
        >
          Refresh Live Data
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Total Grievances</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.total_complaints}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-900/10 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">Pending Triage</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pending_complaints}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-indigo-700 dark:text-indigo-400">In Progress</div>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.in_progress_complaints}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Resolved</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved_complaints}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50/40 dark:bg-red-900/10 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-red-700 dark:text-red-400 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Critical
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{stats.critical_complaints}</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">Closed</div>
            <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">{stats.closed_complaints}</div>
          </div>

        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
              Grievance Category Breakdown
            </h3>
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">
              Priority Distribution (AI Recommended)
            </h3>
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
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center gap-3">
        
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, keyword, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="">All Categories</option>
          <option value="Roads and potholes">Roads & Potholes</option>
          <option value="Water supply and leakage">Water Supply & Leakage</option>
          <option value="Garbage and sanitation">Garbage & Sanitation</option>
          <option value="Drainage and sewage">Drainage & Sewage</option>
          <option value="Streetlights">Streetlights</option>
          <option value="Public infrastructure">Public Infrastructure</option>
          <option value="Other civic issues">Other</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

      </div>

      {/* Complaints Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Active Grievance Registry ({complaints.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sorted by newest</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            <span className="text-sm dark:text-slate-400">Fetching grievances...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
            No complaints found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Title & Citizen</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">AI Priority</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                      {c.reference_id}
                    </td>
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {c.user_name || 'Anonymous Citizen'} · {c.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {c.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {c.assigned_department || c.suggested_department}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3 h-3" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-orange-400">
                    {selectedComplaint.reference_id}
                  </span>
                  <StatusBadge status={selectedComplaint.status} />
                  <PriorityBadge priority={selectedComplaint.priority} />
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {feedbackMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedbackType === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400'
                }`}>
                  {feedbackMsg}
                </div>
              )}

              {/* Description & Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Citizen Description</div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Reported Location:</strong> {selectedComplaint.location}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Citizen:</strong> {selectedComplaint.user_name} ({selectedComplaint.user_email || 'No email'})
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Photograph Evidence</div>
                  {selectedComplaint.image_url ? (
                    <img
                      src={selectedComplaint.image_url}
                      alt="Complaint"
                      className="w-full max-h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="p-8 bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 text-center text-xs text-slate-400 dark:text-slate-500">
                      No photograph submitted.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="p-4 bg-orange-50/80 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-orange-800 dark:text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    AI Triage Verification
                  </span>
                  <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                    Confidence: {Math.round((selectedComplaint.ai_confidence || 0.85) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <strong>Summary:</strong> {selectedComplaint.ai_summary}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Priority Reason:</strong> {selectedComplaint.priority_reason}
                </p>
                {selectedComplaint.image_observations && (
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Vision Observations:</strong> {selectedComplaint.image_observations}
                  </p>
                )}
              </div>

              {/* Similar Complaints */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                <div className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Similar & Duplicate Grievance Detection (FR-09)
                </div>
                
                {loadingSimilar ? (
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning proximity and keyword similarity...
                  </div>
                ) : similarComplaints.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No active duplicate or closely related grievances detected in this sector.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {similarComplaints.map((sim) => (
                      <div 
                        key={sim.reference_id}
                        className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            <span className="font-mono text-orange-600">{sim.reference_id}</span> · {sim.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{sim.similarity_reason}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold text-[10px]">
                          {sim.similarity_score}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Action Form */}
              <form onSubmit={handleSaveAdminAction} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                  Update Official Status & Assignment
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Status
                    </label>
                    <select
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Assigned Department
                    </label>
                    <select
                      value={actionDept}
                      onChange={(e) => setActionDept(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden"
                    >
                      {departmentList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Priority Level
                    </label>
                    <select
                      value={actionPriority}
                      onChange={(e) => setActionPriority(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Official Remarks / Field Work Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter dispatch note, work crew assigned, or completion remark for citizen tracking history..."
                    value={actionRemarks}
                    onChange={(e) => setActionRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    {updating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                    ) : 'Save & Update Status'}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
