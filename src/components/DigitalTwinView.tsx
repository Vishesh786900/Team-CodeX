import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  History,
  Activity,
  Compass,
} from 'lucide-react';
import { Language, UserProfile, WeatherData, FarmCrop } from '../types';
import { translations } from '../i18n/translations';
import { FARM_MEMORY_LOGS } from '../data/digitalTwinData';

interface DigitalTwinViewProps {
  language: Language;
  user: UserProfile;
  weather: WeatherData | null;
  crops: FarmCrop[];
  onNavigate: (tab: string, extra?: any) => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  language,
  user,
  weather,
  crops,
  onNavigate,
}) => {
  const t = translations[language];
  const primaryCrop = crops[0] || {
    name: 'Cotton',
    variety: 'Bt Cotton (RCH-659 BG-II)',
    stage: 'Vegetative',
    stageProgress: 45,
    areaAcres: 3.0,
    soilType: 'Black Soil (Heavy Clay Loam)',
    irrigationType: 'Drip (Inline 4 LPH)',
    plantedDate: '2026-07-14',
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'soil_irrigation' | 'telemetry'>('overview');

  return (
    <div id="digital-twin-container" className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. Header & AI Context Explainer Banner */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>AI Farm Digital Twin</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Synchronized</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr'
                ? 'शेत डिजिटल मॉडेल (Farm Digital Twin)'
                : language === 'hi'
                ? 'कृषि डिजिटल ट्विन (Farm Digital Twin)'
                : "Farm Digital Twin & Crop Telemetry"}
            </h1>
            <p className="text-sm sm:text-base text-[#52525B] mt-1 font-medium max-w-3xl">
              {language === 'mr'
                ? 'हे प्रोफाइल कृत्रिम बुद्धिमत्तेला (AI) तुमच्या शेतीचा सविस्तर संदर्भ पुरवते, ज्यामुळे दैनंदिन सल्ले व व्हॉट-इफ सिमुलेशन अचूक मिळतात.'
                : language === 'hi'
                ? 'यह प्रोफाइल AI को आपके खेत का वास्तविक संदर्भ प्रदान करता है, जिससे दैनिक कार्य और व्हाट-इफ सिमुलेशन सटीक बनते हैं।'
                : 'This digital profile provides continuous situational context to the AI Decision Engine — calibrating today\'s actions and what-if simulations to your specific 3-acre Cotton parcel.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('what-if')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#18181B] text-white hover:bg-black font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{language === 'mr' ? 'व्हॉट-इफ सिम्युलेटर उघडा' : 'Run What-If Simulator'}</span>
            </button>
            <button
              onClick={() => onNavigate('ai-chat', { prompt: 'Explain how my Farm Digital Twin guides daily crop actions.' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#18181B] font-bold text-xs rounded-full transition-colors cursor-pointer border border-[#E4E4E7]"
            >
              <Info className="w-4 h-4 text-[#71717A]" />
              <span>{language === 'mr' ? 'AI सल्ला विचारा' : 'Ask AI About Profile'}</span>
            </button>
          </div>
        </div>

        {/* Explainability Highlight Callout */}
        <div className="mt-5 p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex items-start gap-3 text-xs text-[#52525B]">
          <Info className="w-4 h-4 text-[#18181B] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#18181B] font-bold">
              {language === 'mr' ? 'स्मार्ट संदर्भ संकल्पना: ' : 'Context-Aware AI Intelligence: '}
            </strong>
            {language === 'mr'
              ? 'हे केवळ एक प्रोफाइल पेज नसून थेट AI निर्णय प्रणालीशी जोडलेले आहे. पिकाची अवस्था, मातीचा प्रकार व हवामानातील बदलांवरून AI आपोआप पुढील कृती सुचवते.'
              : 'This profile gives the AI real-time context about your farm. Rather than offering generic textbook tips, all predictions reflect your soil retention, drip flow rate, and 45-day vegetative stage.'}
          </div>
        </div>
      </div>

      {/* 2. Visual Farm Map & Live Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Interactive Visual Farm Plot Card */}
        <div className="lg:col-span-7 bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#18181B]">
                    {user.village || 'Narayangaon'}, {user.district || 'Wardha'} Parcel #402/1
                  </h2>
                  <p className="text-xs text-[#71717A] font-medium">
                    {user.farmSizeAcres || 3.0} Acres • {user.soilType || 'Black Soil (Heavy Clay Loam)'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                Plot Health: 84/100
              </span>
            </div>

            {/* Farm Visual Representation / Orthomosaic Diagram */}
            <div className="my-5 rounded-2xl bg-linear-to-br from-emerald-950 via-emerald-900 to-[#18181B] p-6 text-white relative overflow-hidden shadow-inner">
              <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                    Plot Geometry: 3.0 Acres Block
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-full text-emerald-200">
                  Lat 20.7453° N, Long 78.6022° E
                </span>
              </div>

              {/* Graphical Crop Row Layout */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-300">Crop Block A</div>
                  <div className="text-sm font-bold text-white mt-1">Cotton (Bt RCH-659)</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">1.5 Acres • Drip Line 1</div>
                  <div className="mt-2 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full inline-block">
                    Vegetative (Day 45)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-300">Crop Block B</div>
                  <div className="text-sm font-bold text-white mt-1">Cotton (Bt RCH-659)</div>
                  <div className="text-xs text-emerald-100/80 mt-0.5">1.5 Acres • Drip Line 2</div>
                  <div className="mt-2 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full inline-block">
                    Vegetative (Day 45)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-300">Water Infrastructure</div>
                    <div className="text-sm font-bold text-white mt-1">Borewell + Pond</div>
                    <div className="text-xs text-emerald-100/80 mt-0.5">Solar Pump 5 HP</div>
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-200">
                    Pressure: 1.8 kg/cm²
                  </div>
                </div>
              </div>

              {/* Soil & Root Zone Cross-Section Telemetry */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-zinc-200">Soil Moisture at 20cm depth:</span>
                  <span className="font-bold text-cyan-300">68% (Optimal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-zinc-200">Soil Type:</span>
                  <span className="font-bold text-amber-300">Deep Black Regur</span>
                </div>
              </div>
            </div>

            {/* Farm Profile Key Parameters Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[10px] font-bold uppercase text-[#71717A]">Farmer</div>
                <div className="text-xs font-bold text-[#18181B] mt-0.5 truncate">{user.name || 'Demo Farmer'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[10px] font-bold uppercase text-[#71717A]">Location</div>
                <div className="text-xs font-bold text-[#18181B] mt-0.5 truncate">{user.district || 'Wardha'}, {user.state || 'MH'}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[10px] font-bold uppercase text-[#71717A]">Sowing Date</div>
                <div className="text-xs font-bold text-[#18181B] mt-0.5">14 July 2026</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[10px] font-bold uppercase text-[#71717A]">Irrigation System</div>
                <div className="text-xs font-bold text-[#18181B] mt-0.5">Drip (4 LPH)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
            <span>Last Telemetry Sync: 10 mins ago</span>
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#18181B] font-bold hover:underline"
            >
              Edit Farm Profile Parameters →
            </button>
          </div>
        </div>

        {/* Right 5 Cols: LIVE FARM STATUS Card */}
        <div className="lg:col-span-5 bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-[#18181B]">
                  {language === 'mr' ? 'थेट शेती स्थिती' : 'LIVE FARM STATUS'}
                </h2>
              </div>
              <span className="bg-[#18181B] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Real-Time
              </span>
            </div>

            <div className="mt-5 space-y-4">
              
              {/* Item 1: Crop Stage Status */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B]">Crop Stage: Vegetative</h4>
                      <p className="text-[11px] text-[#71717A] font-medium">Day 45 of 160 • On Track</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    45% Complete
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#E4E4E7] h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-[45%]" />
                </div>
              </div>

              {/* Item 2: Soil Condition */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B]">Soil Condition: Adequate Moisture</h4>
                      <p className="text-[11px] text-[#71717A] font-medium">Deep Black Soil • 68% Moisture Content</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Optimal
                  </span>
                </div>
                <p className="text-[11px] text-[#52525B] mt-2 leading-relaxed">
                  High water-holding capacity; can buffer 2 days of zero irrigation without canopy stress.
                </p>
              </div>

              {/* Item 3: Weather Risk Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Weather Risk: Moderate</h4>
                      <p className="text-[11px] text-amber-700 font-medium">
                        31°C • 20% Rain Chance • Humidity 65%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    Notice
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 mt-2 leading-relaxed font-medium">
                  Moderate sucking pest pressure potential on young cotton leaves; keep drainage channels open.
                </p>
              </div>

              {/* Item 4: Irrigation Status */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[#18181B]">Irrigation Status: Drip Scheduled</h4>
                      <p className="text-[11px] text-[#71717A] font-medium">Last cycle: 27 Aug • Next: In 2 Days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Calibrated
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E4E4E7]">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2.5 bg-[#18181B] text-white hover:bg-black rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'mr' ? "आजची कृती तपासा" : "View Today's Farm Actions"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. Farm Timeline & Recent Events Log */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E4E4E7]">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#18181B]" />
              <h3 className="text-base sm:text-lg font-bold text-[#18181B]">
                {language === 'mr' ? 'शेती नोंदी व मागील घटना (Farm Memory Timeline)' : 'Recent Farm Observations & Event Logs'}
              </h3>
            </div>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">
              Previous events ingested into AI Memory to continually refine future farming recommendations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('farm-memory')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Open Full Farm Memory View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {FARM_MEMORY_LOGS.slice(0, 3).map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#71717A] font-medium mb-1.5">
                  <span className="font-bold text-[#18181B]">{log.date}</span>
                  <span className="uppercase text-[10px] bg-white border border-[#E4E4E7] px-2 py-0.5 rounded-full font-bold">
                    {log.type}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#18181B]">{log.title}</h4>
                <p className="text-[11px] text-[#52525B] mt-1.5 leading-relaxed font-medium">
                  {log.details}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E4E4E7] text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{log.impactOnAi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
