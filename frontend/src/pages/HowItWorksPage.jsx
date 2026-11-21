import React from 'react';
import { Camera, Cpu, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage({ onNavigate }) {
  const workflowSteps = [
    {
      step: "01",
      title: "Citizen Reports Grievance",
      desc: "Upload a photograph, enter a brief description, and provide location details or auto-detect GPS. Eliminates manual paperwork and bureaucratic confusion.",
      icon: Camera,
      color: "from-blue-500 to-indigo-600",
      details: [
        "Optional photograph upload (JPG, PNG, WEBP)",
        "One-click GPS location detection",
        "Instant reference ID generation (NS-2026-XXXXX)"
      ]
    },
    {
      step: "02",
      title: "Multimodal Vision AI Triage",
      desc: "The AI inspects the uploaded photograph and description to identify the core civic problem, visual observations, and potential public hazards.",
      icon: Cpu,
      color: "from-orange-500 to-amber-600",
      details: [
        "Computer vision inspection of physical damage",
        "Automated classification into 7 civic domains",
        "Objective technical summary generation"
      ]
    },
    {
      step: "03",
      title: "Priority & Department Routing",
      desc: "Instant priority recommendation (Critical, High, Medium, Low) with explainable reasoning routed to the responsible municipal department.",
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-600",
      details: [
        "Hazard severity and traffic impact assessment",
        "Transparent justification for priority score",
        "Direct routing to Roads, Water, Sanitation, etc."
      ]
    },
    {
      step: "04",
      title: "Transparent Tracking & Field Action",
      desc: "Citizens track progress in real-time using their unique Reference ID. Every status change logs an official timestamp, assigned team, and remarks.",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      details: [
        "6-step progression pipeline",
        "Immutable activity timeline with officer remarks",
        "Complete transparency until closure"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
          Workflow Architecture
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How NagarSetu AI Resolves Civic Issues
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          An explainable, automated 4-stage pipeline that eliminates bureaucratic delay and ensures citizen grievances reach the right authority instantly.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workflowSteps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  STAGE {s.step}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{s.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                {s.details.map((d, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Ready to Report a Civic Problem?</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Submit your complaint with a photograph to see the AI triage and department routing in action.
        </p>
        <button
          onClick={() => onNavigate('submit')}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition inline-flex items-center gap-2"
        >
          <span>Report a Grievance Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
