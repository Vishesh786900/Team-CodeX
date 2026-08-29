import React, { useState } from 'react';
import {
  Camera,
  Bot,
  CloudSun,
  Bug,
  Stethoscope,
  Building2,
  Sprout,
  ArrowRight,
  Mic,
  Droplets,
  AlertTriangle,
  Sparkles,
  Calendar,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Cpu,
  Layers,
  History,
  Users,
  FileCheck,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Clock,
  CircleDot,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language, UserProfile, WeatherData, FarmCrop, TodayAction } from '../types';
import { translations } from '../i18n/translations';
import { TODAYS_FARM_ACTIONS } from '../data/digitalTwinData';
import { SpeechAssistant } from '../utils/speech';

interface DashboardViewProps {
  language: Language;
  user: UserProfile;
  weather: WeatherData | null;
  crops: FarmCrop[];
  onNavigate: (tab: string, extra?: any) => void;
  onQuickAsk: (prompt: string) => void;
  onOpenVoiceModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  user,
  weather,
  crops,
  onNavigate,
  onQuickAsk,
  onOpenVoiceModal,
}) => {
  const t = translations[language];
  const [quickInput, setQuickInput] = useState('');
  const [actions, setActions] = useState<TodayAction[]>(TODAYS_FARM_ACTIONS);
  const [speakingActionId, setSpeakingActionId] = useState<string | null>(null);

  const handleSpeakAction = (act: TodayAction) => {
    if (speakingActionId === act.id) {
      SpeechAssistant.stop();
      setSpeakingActionId(null);
      return;
    }

    const title =
      language === 'mr' && act.titleLocal?.mr
        ? act.titleLocal.mr
        : language === 'hi' && act.titleLocal?.hi
        ? act.titleLocal.hi
        : act.title;

    const why =
      language === 'mr' && act.whyLocal?.mr
        ? act.whyLocal.mr
        : language === 'hi' && act.whyLocal?.hi
        ? act.whyLocal.hi
        : act.why;

    const text = `${title}. ${why}.`;
    setSpeakingActionId(act.id);
    SpeechAssistant.speak(
      text,
      language,
      () => setSpeakingActionId(null),
      () => setSpeakingActionId(null)
    );
  };

  const toggleActionComplete = (actionId: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAsk(quickInput);
    setQuickInput('');
  };

  const primaryCrop = crops[0] || {
    name: 'Cotton',
    variety: 'Bt Cotton (RCH-659 BG-II)',
    stage: 'Vegetative',
    areaAcres: 3.0,
  };

  return (
    <div id="dashboard-container" className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP SECTION: 5-SECOND CLARITY HERO BANNER & FARM CONTEXT CHIPS       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sprout className="w-3.5 h-3.5" />
                <span>Smart Krishi Assistant</span>
              </span>
              <span className="bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] px-3 py-1 rounded-full text-xs font-bold">
                📍 {user.village || 'Narayangaon'}, {user.district || 'Wardha'}, {user.state || 'Maharashtra'}
              </span>
              <span className="bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] px-3 py-1 rounded-full text-xs font-bold">
                🌱 {primaryCrop.name} ({user.farmSizeAcres || 3.0} Acres)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr'
                ? `रामराम ${user.name || 'शेतकरी मित्र'}, आजचे शेती नियोजन`
                : language === 'hi'
                ? `नमस्ते ${user.name || 'किसान साथी'}, आज का कृषि मार्गदर्शन`
                : `Good morning, ${user.name || 'Demo Farmer'}`}
            </h1>

            <p className="text-[#52525B] font-medium text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              {language === 'mr'
                ? 'AI तुमच्या शेतीचा संदर्भ समजून आज काय करावे, का करावे आणि परिस्थिती बदलल्यास काय होईल हे सांगते.'
                : language === 'hi'
                ? 'AI आपके खेत का संदर्भ समझकर आपको बताता है कि आज क्या करना है, क्यों करना है और मौसम बदलने पर क्या होगा।'
                : 'AI understands your farm context and proactively tells you what to do today, why to do it, and what may happen if conditions change.'}
            </p>
          </div>

          {/* Quick Context Stats Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Crop Stage</span>
              <span className="text-sm font-bold text-[#18181B] mt-0.5">{primaryCrop.stage} (Day 45)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Soil & Irrigation</span>
              <span className="text-sm font-bold text-[#18181B] mt-0.5">Black Soil • Drip</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Temperature</span>
              <span className="text-sm font-bold text-[#18181B] mt-0.5">{weather?.temp || 31}°C (Warm)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Rain Probability</span>
              <span className="text-sm font-bold text-[#18181B] mt-0.5">{weather?.rainProbability || 20}% Chance</span>
            </div>
          </div>
        </div>

        {/* Instant Search / Voice Ask Bar */}
        <form
          onSubmit={handleQuickSubmit}
          className="mt-6 bg-[#FAFAFA] rounded-2xl p-1.5 sm:p-2 flex items-center border border-[#E4E4E7] focus-within:border-[#18181B] transition-all"
        >
          <button
            type="button"
            onClick={onOpenVoiceModal || (() => onNavigate('ai-chat'))}
            className="p-2.5 rounded-xl bg-white text-[#18181B] border border-[#E4E4E7] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3"
            title="Voice Assistant"
          >
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'कापूस, खत, रोग किंवा हवामानाबद्दल थेट विचारा...'
                : language === 'hi'
                ? 'कपास, खाद, कीट या मौसम के बारे में कुछ भी पूछें...'
                : 'Ask Krishi Mitra about cotton pests, fertilizer dosage, or rain precautions...'
            }
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-[#18181B] bg-transparent placeholder:text-[#71717A] focus:outline-hidden"
          />

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <span>{t.aiChat.send}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROMINENT SECTION: 🧠 TODAY'S FARM ACTION                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E4E4E7]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#18181B] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#18181B] tracking-tight">
                {language === 'mr'
                  ? "🧠 आजची शेती कृती (Today's Farm Action)"
                  : language === 'hi'
                  ? "🧠 आज की कृषि कार्रवाई (Today's Farm Action)"
                  : "🧠 TODAY'S FARM ACTION"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#52525B] font-medium mt-1">
              {language === 'mr'
                ? 'AI तुमच्या शेताचा संदर्भ, हवामान व पीक अवस्थेनुसार आज काय करावे आणि का करावे हे सुचवते.'
                : language === 'hi'
                ? 'AI आपके खेत के संदर्भ, मौसम और फसल की स्थिति के अनुसार प्राथमिकता निर्धारित करता है।'
                : 'Prioritized actionable decisions calibrated for your 3-acre Black Soil Cotton field.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] px-3 py-1 rounded-full">
              3 Prioritized Actions
            </span>
          </div>
        </div>

        {/* 3 Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {actions.map((act) => {
            const isHigh = act.priority === 'high';
            const isMed = act.priority === 'medium';
            const isLow = act.priority === 'low';

            return (
              <div
                key={act.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  act.isCompleted
                    ? 'bg-zinc-50 border-zinc-200 opacity-60'
                    : isHigh
                    ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                    : isMed
                    ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                    : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Priority and Time Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        isHigh
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : isMed
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {isHigh ? '🔴 High Priority' : isMed ? '🟡 Medium Priority' : '🟢 Low Priority'}
                    </span>

                    <span className="text-[11px] font-semibold text-[#52525B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.time}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base font-bold text-[#18181B] ${
                      act.isCompleted ? 'line-through' : ''
                    }`}
                  >
                    {language === 'mr' && act.titleLocal?.mr
                      ? act.titleLocal.mr
                      : language === 'hi' && act.titleLocal?.hi
                      ? act.titleLocal.hi
                      : act.title}
                  </h3>

                  {/* Explainable "Why" Section */}
                  <div className="mt-3 p-3 rounded-xl bg-white/80 border border-black/5">
                    <div className="text-[10px] uppercase font-bold text-[#71717A] mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Why to do it:</span>
                    </div>
                    <p className="text-xs text-[#18181B] font-medium leading-relaxed">
                      {language === 'mr' && act.whyLocal?.mr
                        ? act.whyLocal.mr
                        : language === 'hi' && act.whyLocal?.hi
                        ? act.whyLocal.hi
                        : act.why}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Confidence & Interactive Completion Toggle */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeakAction(act)}
                      className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                        speakingActionId === act.id
                          ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4338CA] animate-pulse'
                          : 'bg-white hover:bg-[#18181B] text-[#71717A] hover:text-white border-[#E4E4E7]'
                      }`}
                      title={
                        language === 'mr'
                          ? 'मराठीत ऐका'
                          : language === 'hi'
                          ? 'हिंदी में सुनें'
                          : 'Listen to advice'
                      }
                    >
                      {speakingActionId === act.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-[#4338CA]" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <div className="text-[11px] font-bold text-[#52525B]">
                      Confidence: <span className="text-[#18181B] font-extrabold">{act.confidencePercent}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleActionComplete(act.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      act.isCompleted
                        ? 'bg-zinc-200 text-zinc-700'
                        : 'bg-[#18181B] text-white hover:bg-black'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{act.isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision Support Disclaimer */}
        <div className="mt-5 text-center text-[11px] text-[#71717A] font-medium">
          ⚠️ Recommended action • Decision-support estimate only • Verify ground conditions locally.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE 3-FEATURE HERO BENTO TILES: DIGITAL TWIN, WHAT-IF & SCANNER       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tile 1: AI Farm Digital Twin */}
        <div
          onClick={() => onNavigate('digital-twin')}
          className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-[#18181B] group-hover:text-emerald-400 group-hover:border-[#18181B] transition-colors">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                Core Feature #1
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#18181B] group-hover:text-emerald-700 transition-colors">
              {language === 'mr' ? '१. शेत डिजिटल मॉडेल' : '1. AI Farm Digital Twin'}
            </h3>
            <p className="text-xs text-[#52525B] mt-1.5 font-medium leading-relaxed">
              Real-time synchronization of your 3-acre parcel, soil retention, drip flow, and crop stage telemetry.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-bold text-[#18181B]">
            <span>Explore Farm Twin</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 2: What-If Farm Simulator */}
        <div
          onClick={() => onNavigate('what-if')}
          className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center group-hover:bg-[#18181B] group-hover:text-indigo-400 group-hover:border-[#18181B] transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-full">
                Core Feature #2
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#18181B] group-hover:text-indigo-700 transition-colors">
              {language === 'mr' ? '२. व्हॉट-इफ सिम्युलेटर' : '2. What-If Farm Simulator'}
            </h3>
            <p className="text-xs text-[#52525B] mt-1.5 font-medium leading-relaxed">
              Simulate heavy rain, delayed drip irrigation, or heatwaves before taking costly field actions.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-bold text-[#18181B]">
            <span>Run What-If Scenarios</span>
            <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 3: Explainable Crop Scan */}
        <div
          onClick={() => onNavigate('crop-scanner')}
          className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center group-hover:bg-[#18181B] group-hover:text-rose-400 group-hover:border-[#18181B] transition-colors">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full">
                Core Feature #3
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#18181B] group-hover:text-rose-700 transition-colors">
              {language === 'mr' ? '३. पीक रोग स्कॅनर' : '3. Explainable Crop Scan'}
            </h3>
            <p className="text-xs text-[#52525B] mt-1.5 font-medium leading-relaxed">
              Multi-crop leaf diagnosis with confidence breakdown, explainable symptoms, and KVK escalation.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs font-bold text-[#18181B]">
            <span>Upload or Capture Photo</span>
            <ArrowRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. AI FARM STATUS SCORE SECTION                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-2xl border border-[#E4E4E7] text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
              🌱 AI Farm Status Score
            </span>
            <div className="text-5xl font-extrabold text-[#18181B] my-2">84<span className="text-xl font-normal text-[#71717A]">/100</span></div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              Good Farm Vigor
            </span>
            <p className="text-[11px] text-[#71717A] mt-2">
              Decision-support health index (non-scientific estimate)
            </p>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-sm font-bold uppercase text-[#71717A]">
              Contributing Factors Breakdown:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs flex items-center justify-between">
                <span className="font-semibold text-[#52525B]">Weather Risk Factor:</span>
                <span className="font-bold text-emerald-700">Low / Moderate (31°C)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs flex items-center justify-between">
                <span className="font-semibold text-[#52525B]">Crop Growth Phase:</span>
                <span className="font-bold text-emerald-700">Vegetative (45% On-track)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs flex items-center justify-between">
                <span className="font-semibold text-[#52525B]">Recent Logged Observations:</span>
                <span className="font-bold text-[#18181B]">5 Telemetry Logs</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs flex items-center justify-between">
                <span className="font-semibold text-[#52525B]">Soil Moisture Level:</span>
                <span className="font-bold text-cyan-700">68% (Optimal Black Soil)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              <strong className="font-bold">Main Improvement Area:</strong> Rainfall preparedness & inspection of lower leaf canopy for sucking pests.
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. VISUAL FLOW: 🔄 HOW IT WORKS                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            System Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-2">
            {language === 'mr' ? 'सिस्टम कसे कार्य करते (How It Works)' : 'How Smart Krishi Assistant Works'}
          </h2>
          <p className="text-xs text-[#52525B] mt-1 font-medium">
            From field telemetry to actionable decisions in an unbroken context loop.
          </p>
        </div>

        {/* Visual Flow Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
          
          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
            <div className="text-xs font-bold text-[#18181B]">Farmer Data</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">3 Acres • Cotton</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
            <div className="text-xs font-bold text-[#18181B]">Digital Twin</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">Soil & Drip Twin</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
            <div className="text-xs font-bold text-[#18181B]">Live Data</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">Weather + History</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-bold flex items-center justify-center mb-2">4</span>
            <div className="text-xs font-bold text-[#18181B]">AI Engine</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">Decision Rules</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center mb-2">5</span>
            <div className="text-xs font-bold text-[#18181B]">Today's Action</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">What & Why</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-indigo-700 text-white text-xs font-bold flex items-center justify-center mb-2">6</span>
            <div className="text-xs font-bold text-[#18181B]">What-If Sim</div>
            <div className="text-[10px] text-[#71717A] mt-0.5">Future Scenarios</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center mb-2">7</span>
            <div className="text-xs font-bold text-emerald-900">Farmer Action</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Timely Decision</div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. COMPARISON: 💡 WHY WE ARE DIFFERENT                                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
            {language === 'mr' ? '💡 आपण इतरांपेक्षा वेगळे का आहोत?' : '💡 Why Smart Krishi Assistant is Different'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-xs font-bold uppercase text-zinc-500 mb-2">
              Traditional Agri Apps (Information Only)
            </div>
            <ul className="space-y-2 text-xs text-zinc-700 font-medium">
              <li>❌ Generic textbook articles not linked to your specific plot.</li>
              <li>❌ Farmer must search and guess what action is relevant today.</li>
              <li>❌ No simulation of "what happens if rain arrives early".</li>
              <li>❌ Long, unstructured text answers without actionable priorities.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7]">
            <div className="text-xs font-bold uppercase text-[#15803D] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Krishi Assistant (Context + AI + Action)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#14532D] font-bold">
              <li>✅ Calibrated to Demo Farmer (Wardha • 3 Acres • Black Soil • Cotton).</li>
              <li>✅ Proactively delivers 3 prioritized actions with "Why" and Confidence.</li>
              <li>✅ Interactive What-If Simulator for rain, heatwaves, and irrigation delays.</li>
              <li>✅ Scheme → Action Converter and link safety verification for subsidy fraud protection.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. SUPPORTING INTEGRATIONS BENTO ROW (SCHEMES, VILLAGE, MEMORY)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Scheme -> Action Converter */}
        <div
          onClick={() => onNavigate('schemes')}
          className="bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                Action Converter
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#18181B]">Government Schemes</h4>
            <p className="text-xs text-[#71717A] mt-1 font-medium">
              PM-KISAN, PMFBY, and Solar Drip matched to your 3-acre Cotton profile.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1">
            <span>Check Eligibility & Docs</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Village Intelligence */}
        <div
          onClick={() => onNavigate('village-intel')}
          className="bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                18 Area Nodes
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#18181B]">Village Intelligence</h4>
            <p className="text-xs text-[#71717A] mt-1 font-medium">
              Anonymized pest surveillance and regional moisture trends for Wardha.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-blue-700 flex items-center gap-1">
            <span>View Cluster Map</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* AI Farm Memory */}
        <div
          onClick={() => onNavigate('farm-memory')}
          className="bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <History className="w-5 h-5 text-purple-600" />
              <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                Longitudinal Logs
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#18181B]">AI Farm Memory</h4>
            <p className="text-xs text-[#71717A] mt-1 font-medium">
              5 past observations and fertigation cycles retained in AI context.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-purple-700 flex items-center gap-1">
            <span>View Timeline</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>

    </div>
  );
};
