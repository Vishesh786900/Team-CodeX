import React, { useState } from 'react';
import {
  History,
  Sparkles,
  PlusCircle,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Droplets,
} from 'lucide-react';
import { Language, UserProfile, FarmMemoryLog } from '../types';
import { FARM_MEMORY_LOGS as INITIAL_LOGS } from '../data/digitalTwinData';

interface FarmMemoryViewProps {
  language: Language;
  user: UserProfile;
  onNavigate: (tab: string, extra?: any) => void;
}

export const FarmMemoryView: React.FC<FarmMemoryViewProps> = ({
  language,
  user,
  onNavigate,
}) => {
  const [logs, setLogs] = useState<FarmMemoryLog[]>(INITIAL_LOGS);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newType, setNewType] = useState<'weather' | 'action' | 'observation' | 'input'>('observation');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newEntry: FarmMemoryLog = {
      id: 'log-' + Date.now(),
      date: todayStr,
      title: newTitle.trim(),
      type: newType,
      details: newDetails.trim() || 'Recorded observation in 3.0-acre Cotton plot.',
      impactOnAi: 'Ingested into AI contextual memory for Wardha farm parcel.',
    };

    setLogs([newEntry, ...logs]);
    setNewTitle('');
    setNewDetails('');
    setIsAdding(false);
  };

  return (
    <div id="farm-memory-container" className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. Header & AI Memory Concept Explainer */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>AI Farm Memory</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F4F4F7] text-[#18181B] border border-[#E4E4E7] px-2.5 py-1 rounded-full text-xs font-bold">
                <span>{logs.length} Logged Events</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr'
                ? 'शेत इतिहास व AI स्मरणशक्ती (Farm Memory)'
                : language === 'hi'
                ? 'कृषि इतिहास व AI मेमोरी (Farm Memory)'
                : 'AI Farm Memory & Longitudinal History'}
            </h1>
            <p className="text-sm sm:text-base text-[#52525B] mt-1 font-medium max-w-3xl">
              {language === 'mr'
                ? 'AI तुमच्या शेतातील मागील नोंदी व निरीक्षणे लक्षात ठेवून पुढील सल्ले व निर्णय अधिक अचूक करते.'
                : language === 'hi'
                ? 'AI आपके खेत के पिछले अवलोकनों और कार्यों को याद रखता है ताकि भविष्य की सिफारिशें अधिक सटीक हों।'
                : 'The AI retains your past observations, fertigation logs, and weather events to maintain unbroken situational awareness.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18181B] text-white hover:bg-black font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{isAdding ? 'Cancel' : 'Log New Observation'}</span>
            </button>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="mt-5 p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex items-start gap-3 text-xs text-[#52525B]">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#18181B] font-bold">
              How AI Farm Memory Works:
            </strong>{' '}
            Every recorded rainfall, weeding cycle, or leaf observation automatically refines the weights in Today's Farm Actions and What-If Simulations.
          </div>
        </div>
      </div>

      {/* 2. Add New Observation Form Modal/Collapsible */}
      {isAdding && (
        <form
          onSubmit={handleAddLog}
          className="bg-white rounded-[28px] p-6 border border-emerald-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <h3 className="text-sm font-bold text-[#18181B]">Record New Farm Observation / Action</h3>
            <span className="text-xs text-[#71717A]">Target: Wardha 3.0-Acre Cotton</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#18181B] mb-1">
                Observation or Action Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Sprayed Neem Oil 5ml/L on border rows"
                className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3.5 py-2 text-xs text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Category Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3.5 py-2 text-xs text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
              >
                <option value="observation">Visual Observation</option>
                <option value="action">Field Action / Operation</option>
                <option value="input">Fertigation / Spray Input</option>
                <option value="weather">Weather Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Details & Field Context</label>
            <textarea
              rows={2}
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              placeholder="e.g., Scouted 15 plants; minor leaf edge curl noticed on 2 plants; soil moisture remains high."
              className="w-full bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl px-3.5 py-2 text-xs text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-[#F4F4F7] text-[#18181B] rounded-full text-xs font-bold hover:bg-[#E4E4E7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#18181B] text-white rounded-full text-xs font-bold hover:bg-black flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save into AI Memory</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Memory Timeline List */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
          <h3 className="text-base font-bold text-[#18181B]">Chronological Farm Observation Stream</h3>
          <span className="text-xs text-[#71717A] font-medium">Auto-Synced with Digital Twin</span>
        </div>

        <div className="relative border-l-2 border-[#E4E4E7] ml-4 sm:ml-6 mt-6 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative pl-6 group">
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#18181B] group-hover:border-emerald-600 transition-colors" />

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] hover:border-zinc-300 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#18181B]">{log.date}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        log.type === 'weather'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : log.type === 'action'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : log.type === 'input'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {log.type}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#71717A]">
                    Wardha Cotton Parcel #402/1
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#18181B]">{log.title}</h4>
                <p className="text-xs text-[#52525B] mt-1.5 leading-relaxed font-medium">
                  {log.details}
                </p>

                {/* AI Impact Callout */}
                <div className="mt-3 pt-2.5 border-t border-[#E4E4E7] flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AI Learning: {log.impactOnAi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
