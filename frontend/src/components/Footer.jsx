import React from 'react';
import { Building2, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">NagarSetu AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging Citizens and Better Governance through AI-powered grievance intelligence, automated triage, and transparent tracking.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Track: Civic Pulse – Digital Governance
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('submit')} className="hover:text-orange-400 transition">
                  Submit Civic Grievance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-orange-400 transition">
                  Track Grievance Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public-stats')} className="hover:text-orange-400 transition">
                  Civic Pulse Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-orange-400 transition">
                  Admin Resolution Command
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI & Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li>Multimodal Vision & NLP AI Engine</li>
              <li>Explainable Priority Reasoning</li>
              <li>Automated Department Triage</li>
              <li>Similar Complaint Detection (FR-09)</li>
              <li>Sanitized Non-sensitive Public Feeds</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Demo Credentials</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div>
                <span className="text-slate-300 font-semibold block">Citizen Demo:</span>
                <code className="text-amber-400 text-[11px]">citizen@demo.org / Citizen123!</code>
              </div>
              <div>
                <span className="text-slate-300 font-semibold block">Admin Demo:</span>
                <code className="text-amber-400 text-[11px]">admin@nagarsetu.gov.in / Admin123!</code>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NagarSetu AI Platform. Developed for Transparent Civic Infrastructure Triage.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Powered by NagarSetu AI & Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
