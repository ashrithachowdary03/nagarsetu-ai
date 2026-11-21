import React, { useState } from 'react';
import { 
  ArrowRight, 
  PlusCircle, 
  Search, 
  BarChart3, 
  Workflow, 
  Building2, 
  ShieldCheck,
  Lock,
  Mail,
  User,
  Shield,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onNavigate }) {
  const { user, login, register, logout, isAdmin } = useAuth();

  const [authTab, setAuthTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authTab === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCitizen = async () => {
    setError('');
    setLoading(true);
    try {
      await login('citizen@demo.org', 'Citizen123!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('admin@nagarsetu.gov.in', 'Admin123!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const featureSections = [
    {
      id: 'submit',
      title: 'Submit Grievance',
      desc: 'Report civic issues with photographs, descriptions, and automatic GPS location.',
      icon: PlusCircle,
      badge: 'Citizen Action',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-700'
    },
    {
      id: 'track',
      title: 'Track Grievance',
      desc: 'Enter your unique Reference ID to check live inspection findings and resolution status.',
      icon: Search,
      badge: 'Live Status',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-700'
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      desc: 'Explore the 4-stage automated triage, priority scoring, and departmental routing process.',
      icon: Workflow,
      badge: 'Resolution Guide',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-700'
    },
    {
      id: 'categories',
      title: 'Municipal Categories',
      desc: 'View all 7 supported civic domains from Roads & Potholes to Water Supply and Streetlights.',
      icon: Building2,
      badge: 'Jurisdictions',
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-700'
    },
    {
      id: 'public-stats',
      title: 'Civic Pulse Dashboard',
      desc: 'City-wide open governance analytics, category trends, and resolution statistics.',
      icon: BarChart3,
      badge: 'Transparency',
      color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 border-teal-200 dark:border-teal-700'
    },
    {
      id: 'admin-dashboard',
      title: 'Admin Command Desk',
      desc: 'Official portal for municipal administrators to review AI recommendations and assign crews.',
      icon: ShieldCheck,
      badge: 'Authorities',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-200 dark:border-purple-700'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          NagarSetu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">AI</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
          Bridging Citizens and Better Governance.
        </p>
      </section>

      {/* Not signed in → Auth Card */}
      {!user && (
        <section className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xl overflow-hidden">
            
            {/* Quick Demo Access */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white text-center space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> One-Click Quick Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDemoCitizen}
                  disabled={loading}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" /> Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  disabled={loading}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-300" /> Admin Demo
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setError(''); }}
                className={`flex-1 py-3.5 text-center transition ${authTab === 'login' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50 dark:bg-orange-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setError(''); }}
                className={`flex-1 py-3.5 text-center transition ${authTab === 'register' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50 dark:bg-orange-900/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Register Citizen
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authTab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="citizen@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{authTab === 'login' ? 'Sign In & Access Platform' : 'Create Account & Access'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </section>
      )}

      {/* Signed in → Features */}
      {user && (
        <div className="space-y-16 animate-in fade-in duration-300">
          
          {/* Welcome card */}
          <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md p-8 sm:p-10 text-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Signed In as <strong className="font-extrabold">{user.full_name}</strong> ({user.role === 'admin' ? 'Administrator' : 'Citizen'})
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
                Your account is active. You can report civic grievances, track active complaints, and explore all governance sections.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('submit')}
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2.5"
              >
                <span>Report a Grievance</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={logout}
                className="w-full sm:w-auto px-5 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-2xl transition inline-flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </section>

          {/* Feature Grid */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Features & Respected Sections</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select any dedicated section to interact with the platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureSections.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    onClick={() => onNavigate(f.id)}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-600 transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${f.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          {f.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                      <span>Open Section</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
