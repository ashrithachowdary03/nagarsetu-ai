import React from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Building2, 
  Eye, 
  AlertTriangle, 
  ExternalLink,
  X
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function AIAnalysisModal({ complaint, isOpen, onClose, onTrack }) {
  if (!isOpen || !complaint) return null;

  const confidencePercent = Math.round((complaint.ai_confidence || 0.85) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">NagarSetu AI Grievance Intelligence</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium text-amber-100">Live Analysis</span>
              </div>
              <p className="text-xs text-orange-100">
                Reference ID: <span className="font-mono font-bold tracking-wider">{complaint.reference_id}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Summary Box */}
          <div className="p-4 bg-orange-50/70 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              AI Technical Synthesis
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium text-sm leading-relaxed">
              {complaint.ai_summary || "Complaint successfully analyzed and cataloged into municipal registry."}
            </p>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Detected Category
              </div>
              <div className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {complaint.category}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Suggested Department
              </div>
              <div className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                {complaint.suggested_department || "Roads Department"}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Recommended Priority Level
                </div>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-800 dark:text-slate-200">Reasoning:</strong> {complaint.priority_reason || "Evaluated based on reported public risk, traffic impact, and municipal health guidelines."}
              </p>
            </div>
          </div>

          {/* Vision Observations */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Computer Vision Observations
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {complaint.image_observations || "No photograph was uploaded for this grievance. Textual triage utilized."}
            </p>
            {complaint.image_url && (
              <div className="mt-3">
                <img 
                  src={complaint.image_url} 
                  alt="Complaint Evidence" 
                  className="w-full max-h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
          </div>

          {/* Confidence */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-slate-100 dark:bg-slate-900/50 rounded-xl text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>AI Engine Confidence: <strong className="text-slate-800 dark:text-slate-200">{confidencePercent}%</strong></span>
            </div>
            {complaint.uncertainty_notes && (
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{complaint.uncertainty_notes}</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-500 italic text-center">
            * AI recommendations are advisory triage inputs. Civic officers review and formally assign field actions.
          </p>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onTrack) onTrack(complaint.reference_id);
            }}
            className="px-5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            Track Grievance <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
