import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  Droplets,
  SunMedium,
  Flower2,
  CloudFog,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  Info,
  HelpCircle,
  RefreshCw,
  Send,
  Zap,
  Gauge,
  Sliders,
} from 'lucide-react';
import { Language, UserProfile, WhatIfScenario } from '../types';
import { translations } from '../i18n/translations';
import { WHAT_IF_SCENARIOS } from '../data/digitalTwinData';

interface WhatIfSimulatorViewProps {
  language: Language;
  user: UserProfile;
  onNavigate: (tab: string, extra?: any) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  language,
  user,
  onNavigate,
}) => {
  const t = translations[language];
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('heavy-rain');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isSimulatingCustom, setIsSimulatingCustom] = useState<boolean>(false);
  const [customResult, setCustomResult] = useState<WhatIfScenario | null>(null);

  const selectedScenario =
    WHAT_IF_SCENARIOS.find((s) => s.id === selectedScenarioId) || WHAT_IF_SCENARIOS[0];

  const handleRunCustomSimulation = () => {
    if (!customQuery.trim()) return;
    setIsSimulatingCustom(true);

    setTimeout(() => {
      const isPest = customQuery.toLowerCase().includes('pest') || customQuery.toLowerCase().includes('कीट') || customQuery.toLowerCase().includes('किड');
      const isRain = customQuery.toLowerCase().includes('rain') || customQuery.toLowerCase().includes('पाऊस') || customQuery.toLowerCase().includes('बारिश');
      const isFertilizer = customQuery.toLowerCase().includes('fertilizer') || customQuery.toLowerCase().includes('खत') || customQuery.toLowerCase().includes('खाद');

      let risk: 'High' | 'Medium' | 'Low' = 'Medium';
      let impact = 'Dynamic simulation completed for 3.0-acre Cotton plot in Wardha.';
      let action = 'Maintain standard field scouting and calibrated drip schedule.';

      if (isPest) {
        risk = 'High';
        impact = 'Potential accelerated nymph hatching within 48-72 hours under current 31°C canopy conditions.';
        action = 'Deploy 6 yellow sticky traps per acre immediately and inspect underside of leaves at 8:00 AM.';
      } else if (isRain) {
        risk = 'Medium';
        impact = 'Localized surface pooling in black clay soil depressions; root zone oxygen levels may dip temporarily.';
        action = 'Keep lateral field drainage furrows unblocked and delay foliar spray operations.';
      } else if (isFertilizer) {
        risk = 'Low';
        impact = 'Soluble fertigation efficiently absorbs into vegetative taproot zone through 4 LPH drippers.';
        action = 'Apply 19:19:19 @ 3kg/acre during morning drip cycle; monitor leaf greenness index.';
      }

      setCustomResult({
        id: 'custom-' + Date.now(),
        title: customQuery,
        titleLocal: {
          en: customQuery,
          hi: customQuery,
          mr: customQuery,
        },
        iconName: 'Zap',
        description: 'Simulated custom scenario based on Wardha Black Soil 3-acre Cotton parameters.',
        possibleImpact: impact,
        riskLevel: risk,
        affectedFactors: ['Canopy Microclimate', 'Soil Water Retention', 'Nutrient Absorption Rate'],
        recommendedAction: action,
        confidence: '85% Decision-support simulation',
        confidenceScore: 85,
        assumptions: ['3.0-acre Bt Cotton parcel', 'Vegetative growth phase (Day 45)', 'Black clay loam soil'],
      });
      setIsSimulatingCustom(false);
    }, 900);
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5" />;
      case 'CloudFog':
        return <CloudFog className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const currentActive = customResult || selectedScenario;

  return (
    <div id="what-if-simulator-container" className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What-If Farm Simulator</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F4F4F7] text-[#18181B] border border-[#E4E4E7] px-2.5 py-1 rounded-full text-xs font-bold">
                <span>Model v2.4 (Grounded)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr'
                ? 'व्हॉट-इफ शेती सिम्युलेटर (What-If Farm Simulator)'
                : language === 'hi'
                ? 'व्हाट-इफ कृषि सिम्युलेटर (What-If Farm Simulator)'
                : 'What-If Farm Scenario Simulator'}
            </h1>
            <p className="text-sm sm:text-base text-[#52525B] mt-1 font-medium max-w-3xl">
              {language === 'mr'
                ? 'हवामान, पाणी किंवा व्यवस्थापनात बदल झाल्यास काय परिणाम होईल? कृतीपूर्वी परिणामांचा अंदाज घ्या.'
                : language === 'hi'
                ? 'यदि मौसम या सिंचाई में बदलाव हो तो फसल पर क्या असर होगा? निर्णय लेने से पहले सिमुलेशन देखें।'
                : 'Simulate weather anomalies, delayed irrigation, and sudden conditions before making costly on-field decisions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('digital-twin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#18181B] font-bold text-xs rounded-full transition-colors cursor-pointer border border-[#E4E4E7]"
            >
              <Layers className="w-4 h-4 text-[#71717A]" />
              <span>{language === 'mr' ? 'डिजिटल ट्विन पहा' : 'View Farm Digital Twin'}</span>
            </button>
          </div>
        </div>

        {/* Prototype & Decision Support Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">
              {language === 'mr' ? 'निर्णय-सपोर्ट अंदाज: ' : 'Decision-Support Simulation Estimate: '}
            </strong>
            {language === 'mr'
              ? 'हे सिमुलेशन शेती डिजिटल मॉडेल (३ एकर काळी माती, कापूस पीक) वर आधारित एक मार्गदर्शक अंदाज आहे. स्थानिक शेत परिस्थितीनुसार अंतिम निर्णय घ्यावा.'
              : 'All simulation outcomes are algorithmic decision-support estimates calibrated to your 3-acre Black Soil Cotton profile. Always verify field microconditions.'}
          </div>
        </div>
      </div>

      {/* 2. Interactive Scenario Selector Bar */}
      <div className="bg-white rounded-[28px] p-6 border border-[#E4E4E7] shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3">
          {language === 'mr' ? 'तयार सिमुलेशन परिस्थिती निवडा' : 'Select a Pre-Configured Farm Scenario'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {WHAT_IF_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id && !customResult;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenarioId(scenario.id);
                  setCustomResult(null);
                }}
                className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm'
                    : 'bg-[#FAFAFA] text-[#18181B] border-[#E4E4E7] hover:bg-[#F4F4F7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-2 rounded-xl ${isSelected ? 'bg-white/10 text-emerald-400' : 'bg-white border border-[#E4E4E7] text-[#18181B]'}`}>
                      {getScenarioIcon(scenario.iconName)}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        scenario.riskLevel === 'High'
                          ? isSelected ? 'bg-red-500/30 text-red-200' : 'bg-red-50 text-red-700 border border-red-200'
                          : scenario.riskLevel === 'Medium'
                          ? isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {scenario.riskLevel} Risk
                    </span>
                  </div>
                  <h3 className="text-xs font-bold line-clamp-2">
                    {language === 'mr'
                      ? scenario.titleLocal.mr
                      : language === 'hi'
                      ? scenario.titleLocal.hi
                      : scenario.title}
                  </h3>
                </div>

                <div className={`mt-3 text-[10px] font-semibold flex items-center justify-between pt-2 border-t ${isSelected ? 'border-white/15 text-zinc-300' : 'border-[#E4E4E7] text-[#71717A]'}`}>
                  <span>Confidence:</span>
                  <span className="font-bold">{scenario.confidenceScore}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Scenario Input Bar */}
        <div className="mt-5 pt-5 border-t border-[#E4E4E7]">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunCustomSimulation()}
                placeholder={
                  language === 'mr'
                    ? 'तुमची स्वतःची परिस्थिती विचारा (उदा. "जर मी दुपारी खत दिले तर काय होईल?")'
                    : language === 'hi'
                    ? 'अपनी परिस्थिति टाइप करें (जैसे "यदि दोपहर में कीटनाशक छिड़काव किया तो क्या होगा?")'
                    : 'Ask your custom scenario (e.g., "What if humidity stays at 90% for 4 days?")'
                }
                className="w-full bg-[#FAFAFA] border border-[#E4E4E7] text-[#18181B] placeholder-[#71717A] text-xs sm:text-sm rounded-full px-5 py-3 focus:outline-hidden focus:border-[#18181B] focus:bg-white"
              />
            </div>
            <button
              onClick={handleRunCustomSimulation}
              disabled={isSimulatingCustom || !customQuery.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-[#18181B] text-white hover:bg-black font-bold text-xs rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSimulatingCustom ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Run Custom Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Detailed Simulation Output Dashboard Card */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        
        {/* Top Header of Result */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                Simulation Result
              </span>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  currentActive.riskLevel === 'High'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : currentActive.riskLevel === 'Medium'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {currentActive.riskLevel} Risk Level
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
              {language === 'mr' && currentActive.titleLocal?.mr
                ? currentActive.titleLocal.mr
                : language === 'hi' && currentActive.titleLocal?.hi
                ? currentActive.titleLocal.hi
                : currentActive.title}
            </h2>
            <p className="text-xs text-[#71717A] mt-1 font-medium">
              Calibrated for: Wardha Parcel • 3.0 Acres Cotton (Bt RCH-659) • Vegetative Stage (Day 45) • Black Soil
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex items-center gap-3 shrink-0">
            <Gauge className="w-6 h-6 text-indigo-600" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#71717A]">AI Confidence</div>
              <div className="text-sm font-bold text-[#18181B]">{currentActive.confidence}</div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          
          {/* Pillar 1: POSSIBLE IMPACT */}
          <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#71717A] mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>1. Possible Farm Impact</span>
              </div>
              <p className="text-sm sm:text-base text-[#18181B] font-semibold leading-relaxed">
                {currentActive.possibleImpact}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E4E4E7]">
              <div className="text-[11px] font-bold text-[#71717A] uppercase mb-2">
                Affected Agronomic Factors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentActive.affectedFactors.map((factor, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-[#E4E4E7] text-[#18181B] rounded-lg text-xs font-medium"
                  >
                    • {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 2: RECOMMENDED ACTION */}
          <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#15803D] mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. Recommended Farmer Action</span>
              </div>
              <p className="text-sm sm:text-base text-[#14532D] font-bold leading-relaxed">
                {currentActive.recommendedAction}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-semibold">
                Mitigation Effectiveness: 88%
              </span>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Add to Today's Actions →</span>
              </button>
            </div>
          </div>

        </div>

        {/* Assumptions & Telemetry Base */}
        <div className="mt-6 p-4 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
          <div className="text-xs font-bold uppercase text-[#71717A] mb-2">
            Simulation Assumptions & Boundary Conditions:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentActive.assumptions.map((assump, idx) => (
              <div key={idx} className="text-xs text-[#52525B] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                <span>{assump}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-[#E4E4E7] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('ai-chat', { prompt: `Tell me more about what to do if: ${currentActive.title}` })}
            className="px-5 py-2.5 bg-[#18181B] text-white hover:bg-black text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'mr' ? 'या सिमुलेशनबद्दल AI ला विचारा' : 'Discuss Simulation with AI Krishi Mitra'}</span>
          </button>

          <button
            onClick={() => onNavigate('crop-scanner')}
            className="px-5 py-2.5 bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#18181B] text-xs font-bold rounded-full transition-colors cursor-pointer border border-[#E4E4E7] flex items-center gap-1.5"
          >
            <span>Scan Crop Leaves for Early Symptoms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
