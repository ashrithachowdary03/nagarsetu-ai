import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

export default function CategoriesPage({ onNavigate }) {
  const categories = [
    { 
      title: "Roads and Potholes", 
      desc: "Deep asphalt craters, fractured road surfaces, uneven bitumen, road collapse, and damaged dividers.", 
      icon: "🛣️", 
      dept: "Roads Department",
      priorityHint: "Critical for center lane craters; High for major thoroughfares."
    },
    { 
      title: "Garbage and Sanitation", 
      desc: "Overflowing community dumpsters, illegal trash dumping on footpaths, animal scavenging, and bio-sanitary hazards.", 
      icon: "🗑️", 
      dept: "Sanitation Department",
      priorityHint: "High near school/hospital perimeters; Medium for regular street bins."
    },
    { 
      title: "Water Supply and Leakage", 
      desc: "Main supply pipeline bursts, continuous clean water street flooding, contaminated municipal tap water, and zero pressure.", 
      icon: "💧", 
      dept: "Water Supply Department",
      priorityHint: "Critical for trunk main bursts; High for ongoing street flooding."
    },
    { 
      title: "Drainage and Sewage", 
      desc: "Clogged stormwater drains, overflowing sewage manholes, open toxic gutters, and monsoon street waterlogging.", 
      icon: "🌊", 
      dept: "Drainage Department",
      priorityHint: "Critical for missing manhole covers; High for sewage overflow."
    },
    { 
      title: "Streetlights Outage", 
      desc: "Consecutive dead streetlight poles, flickering fixtures, dangling wires, and dark pedestrian corridors.", 
      icon: "💡", 
      dept: "Electrical Department",
      priorityHint: "High for consecutive stretch outages near transit hubs; Medium for single lamps."
    },
    { 
      title: "Public Infrastructure", 
      desc: "Broken pedestrian footpaths, damaged bus shelter roofs, broken park benches, cracked boundary walls, and hazardous municipal property.", 
      icon: "🏛️", 
      dept: "Public Works Department",
      priorityHint: "Medium to Low depending on structural pedestrian hazard."
    },
    { 
      title: "Other Civic Issues", 
      desc: "Encroachments, illegal public banners, noise nuisances, and unclassified municipal grievances.", 
      icon: "📋", 
      dept: "General Grievance Cell",
      priorityHint: "Assessed on a case-by-case basis by municipal officers."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
          Municipal Jurisdictions
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supported Civic Categories & Departments
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          NagarSetu AI automatically maps user grievances directly to the appropriate urban local body department.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700">
                  {c.dept}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{c.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {c.priorityHint}
              </span>
              <button
                onClick={() => onNavigate('submit')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline ml-2 flex-shrink-0"
              >
                Report <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
