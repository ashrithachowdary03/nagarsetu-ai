import React, { useState } from 'react';
import { Building2, Lock, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ defaultTab = 'login', onSuccess, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password, role);
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCitizen = async () => {
    setEmail('citizen@demo.org');
    setPassword('Citizen123!');
    setTab('login');
    setError('');
    setLoading(true);
    try {
      await login('citizen@demo.org', 'Citizen123!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@nagarsetu.gov.in');
    setPassword('Admin123!');
    setTab('login');
    setError('');
    setLoading(true);
    try {
      await login('admin@nagarsetu.gov.in', 'Admin123!');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-6 text-white text-center relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-semibold"
            >
              ✕
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold">NagarSetu AI Portal</h3>
          <p className="text-xs text-orange-100 mt-1">Sign in to report, track, or resolve civic grievances</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 text-sm font-bold">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-3 text-center transition ${tab === 'login' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/40' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-3 text-center transition ${tab === 'register' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/40' : 'text-slate-500 hover:text-slate-800'}`}
          >
            New Citizen Registration
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Quick Demo Logins Banner */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              One-Click Evaluation Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCitizen}
                disabled={loading}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <User className="w-3.5 h-3.5 text-blue-600" /> Citizen Demo
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={loading}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-orange-500"
                >
                  <option value="citizen">Citizen</option>
                  <option value="admin">Civic Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Processing...' : (tab === 'login' ? 'Sign In' : 'Create Account')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
