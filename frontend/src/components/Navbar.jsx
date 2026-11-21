import React from 'react';
import { Building2, User, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onNavigate, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">NagarSetu</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-orange-500" /> AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">Civic Intelligence Platform</p>
          </div>
        </div>

        {/* Right-side controls: Dark/Light toggle + Sign In / User info */}
        <div className="flex items-center gap-2">

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Auth area */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">{user.full_name}</div>
                <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                  {isAdmin ? 'Administrator' : 'Citizen'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all bg-orange-600 hover:bg-orange-700 text-white shadow-sm shadow-orange-500/20"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
