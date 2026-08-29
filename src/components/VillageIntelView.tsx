import React from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Radio,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { VILLAGE_INSIGHTS } from '../data/digitalTwinData';

interface VillageIntelViewProps {
  language: Language;
  user: UserProfile;
  onNavigate: (tab: string, extra?: any) => void;
}

export const VillageIntelView: React.FC<VillageIntelViewProps> = ({
  language,
  user,
  onNavigate,
}) => {
  return (
    <div id="village-intel-container" className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Village Intelligence</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>18 Active Telemetry Nodes</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr'
                ? 'गावनिहाय सामूहिक माहिती (Village Intelligence)'
                : language === 'hi'
                ? 'ग्राम स्तरीय सामूहिक विश्लेषण (Village Intelligence)'
                : 'Area & Village Crop Telemetry Intelligence'}
            </h1>
            <p className="text-sm sm:text-base text-[#52525B] mt-1 font-medium max-w-3xl">
              {language === 'mr'
                ? 'वर्धा परिसरातील अनामित (Anonymized) शेत माहितीवरून कीड व हवामान धोक्यांचा आगाऊ अंदाज.'
                : language === 'hi'
                ? 'वर्धा क्षेत्र के गुमनाम (Anonymized) कृषि डेटा से कीट और मौसम जोखिमों की समय पूर्व चेतावनी।'
                : 'Aggregated, privacy-preserved area insights from participating farms across the Wardha agricultural watershed.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#18181B] text-white hover:bg-black font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <span>Back to Farm Dashboard</span>
            </button>
          </div>
        </div>

        {/* Strict Privacy Protection Guarantee Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              {language === 'mr' ? 'गोपनीयता हमी: ' : 'Privacy Protection Guarantee: '}
            </strong>
            {language === 'mr'
              ? 'हे सर्व निष्कर्ष केवळ सामूहिक व अनामित (Anonymized) निरीक्षणांवर आधारित आहेत. कोणत्याही शेतकऱ्याचे वैयक्तिक नाव, फोन किंवा सर्व्हे नंबर शेअर केला जात नाही.'
              : 'Area-level insights are computed strictly from anonymized crop stress telemetry. Individual farmer identities, survey numbers, and financial details are never exposed.'}
          </div>
        </div>
      </div>

      {/* 2. Key Insights Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VILLAGE_INSIGHTS.map((insight) => (
          <div key={insight.id} className="bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#71717A] uppercase">
                  {insight.title}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                    insight.riskLevel === 'High'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : insight.riskLevel === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {insight.riskLevel} Risk
                </span>
              </div>

              <div className="text-2xl font-bold text-[#18181B]">{insight.metric}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">{insight.changeText}</div>

              <p className="text-xs text-[#52525B] mt-3 leading-relaxed font-medium">
                {insight.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E4E7] bg-[#FAFAFA] -mx-6 -mb-6 p-4 rounded-b-[28px]">
              <div className="text-[10px] uppercase font-bold text-[#18181B] mb-1">
                Community Advisory:
              </div>
              <p className="text-[11px] text-[#52525B] font-medium leading-relaxed">
                {insight.advisory}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Regional Cluster Radar / Pest Surveillance Map Simulation */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E4E4E7]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#18181B]">
              Wardha Cotton Watershed Hotspot Radar (5km Radius)
            </h3>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">
              Live automated surveillance clustering data from Deoli, Narayangaon, and Seloo sectors.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase text-zinc-400">
                Cluster Surveillance Map
              </span>
              <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-sm text-zinc-300">
                Center: Wardha (20.74°N, 78.60°E)
              </span>
            </div>

            {/* Simulated Geographic Sector Radar Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Sector North (Narayangaon)</div>
                <div className="text-sm font-bold text-white mt-1">7 Participating Farms</div>
                <div className="text-xs text-amber-400 mt-0.5">Low-level Whitefly reported</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Sector East (Deoli)</div>
                <div className="text-sm font-bold text-white mt-1">6 Participating Farms</div>
                <div className="text-xs text-emerald-400 mt-0.5">Healthy Vegetative Growth</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-zinc-400 font-bold uppercase">Sector South (Seloo)</div>
                <div className="text-sm font-bold text-white mt-1">5 Participating Farms</div>
                <div className="text-xs text-blue-400 mt-0.5">Drainage check completed</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-zinc-300 flex items-center justify-between">
              <span>Synchronized Action: Yellow sticky traps recommended across all 3 sectors.</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <div>
              <h4 className="text-xs font-bold uppercase text-[#71717A] mb-2">
                Why Village Intelligence Matters
              </h4>
              <ul className="space-y-2 text-xs text-[#52525B] font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Early warning before pests migrate from neighboring plots into your cotton field.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Micro-weather patterns are detected faster through multiple ground telemetry points.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Enables synchronized community action (like collective trap placement).</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('what-if')}
              className="mt-4 w-full py-2.5 bg-[#18181B] text-white hover:bg-black font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Simulate Village Pest Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
