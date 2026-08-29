import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  FileText,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  X,
  Send,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
  Link,
  Layers,
} from 'lucide-react';
import { Language, GovernmentScheme, UserProfile, LinkSafetyCheck } from '../types';
import { translations } from '../i18n/translations';
import { DEMO_LINK_SAFETY_SAMPLES, checkAgriculturalUrl } from '../data/digitalTwinData';

interface SchemesViewProps {
  language: Language;
  schemes: GovernmentScheme[];
  user: UserProfile;
  onAskAiAboutScheme: (scheme: GovernmentScheme) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  language,
  schemes,
  user,
  onAskAiAboutScheme,
}) => {
  const t = translations[language];

  const [activeMainTab, setActiveMainTab] = useState<'schemes' | 'doc_checker' | 'link_safety'>('schemes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Document Checker State
  const [selectedDocSchemeId, setSelectedDocSchemeId] = useState<string>('pmfby');
  const [userAvailableDocs, setUserAvailableDocs] = useState<Record<string, boolean>>({
    'Aadhaar Card': true,
    '7/12 Extract and 8-A holding copy': true,
    'Land Record (7/12 extract / 8-A / Khasra-Khatauni)': true,
    'Land Ownership Documents (7/12 Extract / Khatauni / Jamabandi)': true,
    'Aadhaar-linked Active Bank Passbook with IFSC': true,
    'Bank Account Passbook / Cancelled Cheque': true,
    'Active Mobile Number for OTP and e-KYC': true,
    'Sowing Certificate / Crop Sowing Self-Declaration (Pik Pahani)': false, // Missing for PMFBY demo
    'Quotation and layout drawing from authorized micro-irrigation dealer': false, // Missing for Drip demo
  });

  // Link Safety Checker State
  const [urlInput, setUrlInput] = useState<string>('https://pmkisan.gov.in');
  const [safetyResult, setSafetyResult] = useState<LinkSafetyCheck | null>(
    checkAgriculturalUrl('https://pmkisan.gov.in')
  );

  const categories = [
    'All',
    'Financial Support',
    'Crop Insurance',
    'Irrigation & Solar',
    'Equipment & Drones',
    'Credit & Loans',
  ];

  const statesList = [
    'All',
    'All India',
    'Maharashtra',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Rajasthan',
    'Punjab',
    'Haryana',
  ];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.localName.hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.localName.mr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefits.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || scheme.category === selectedCategory;

    const matchesState =
      selectedState === 'All' ||
      scheme.state === 'All India' ||
      scheme.state === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  });

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  const toggleDocCheck = (docName: string) => {
    setUserAvailableDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const selectedDocScheme = schemes.find((s) => s.id === selectedDocSchemeId) || schemes[0];
  const requiredDocs = selectedDocScheme.requiredDocuments || [];
  const missingDocs = requiredDocs.filter((doc) => !userAvailableDocs[doc]);

  const handleRunUrlCheck = (urlToCheck?: string) => {
    const target = urlToCheck || urlInput;
    setUrlInput(target);
    const res = checkAgriculturalUrl(target);
    setSafetyResult(res);
  };

  return (
    <div id="schemes-view-container" className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Scheme → Action Converter
              </span>
              <span className="bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] px-3 py-1 rounded-full text-xs font-bold">
                Calibrated for Demo Farmer (3.0 Acres Cotton, Wardha)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              {language === 'mr' ? 'शासकीय कृषी योजना व कृती मार्गदर्शक' : 'Government Schemes & Action Converter'}
            </h1>
            <p className="text-sm text-[#52525B] font-medium mt-1 max-w-2xl">
              {language === 'mr'
                ? 'तुमच्या शेत संदर्भानुसार पात्र ठरणाऱ्या योजना, आवश्यक कागदपत्रे आणि पुढील कृती थेट मिळवा.'
                : 'Turn static government scheme guidelines into proactive eligibility checks, document checklists, and application actions.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveMainTab('doc_checker')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMainTab === 'doc_checker'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] hover:bg-[#F4F4F7]'
              }`}
            >
              🧾 Smart Document Checker
            </button>
            <button
              onClick={() => setActiveMainTab('link_safety')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMainTab === 'link_safety'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] hover:bg-[#F4F4F7]'
              }`}
            >
              🛡️ Link Safety Checker
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] flex items-center gap-2.5 text-xs text-[#52525B]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-[#18181B] font-bold">Prototype Data Notice:</strong> Scheme criteria and eligibility matches are algorithmic decision-support estimates. Always verify on official government portals (pmkisan.gov.in, mahadbt.maharashtra.gov.in).
          </span>
        </div>
      </div>

      {/* Main Tab Toggle Bar */}
      <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2">
        <button
          onClick={() => setActiveMainTab('schemes')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'schemes'
              ? 'bg-[#18181B] text-white'
              : 'bg-[#FAFAFA] text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          🏛️ Scheme → Action Converter ({schemes.length})
        </button>
        <button
          onClick={() => setActiveMainTab('doc_checker')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'doc_checker'
              ? 'bg-[#18181B] text-white'
              : 'bg-[#FAFAFA] text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          🧾 Smart Document Checker
        </button>
        <button
          onClick={() => setActiveMainTab('link_safety')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeMainTab === 'link_safety'
              ? 'bg-[#18181B] text-white'
              : 'bg-[#FAFAFA] text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          🛡️ Agricultural Link Safety Checker
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SCHEME -> ACTION CONVERTER                                        */}
      {/* ========================================================================= */}
      {activeMainTab === 'schemes' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E4E4E7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#71717A] absolute left-4 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name, subsidy, crop or category..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#FAFAFA] border border-[#E4E4E7] focus:bg-white focus:outline-hidden focus:border-[#18181B] text-[#18181B] placeholder:text-[#71717A] transition-all"
                />
              </div>

              <div className="w-full sm:w-52 shrink-0">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full py-2.5 px-4 text-xs rounded-full bg-[#FAFAFA] border border-[#E4E4E7] text-[#18181B] font-bold focus:outline-hidden focus:border-[#18181B]"
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      State: {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-[#FAFAFA] text-[#71717A] hover:text-[#18181B] border border-[#E4E4E7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards */}
          <div className="space-y-4">
            {filteredSchemes.map((scheme) => {
              const isExpanded = expandedSchemeId === scheme.id;
              const displayName =
                language === 'mr'
                  ? scheme.localName.mr
                  : language === 'hi'
                  ? scheme.localName.hi
                  : scheme.name;

              return (
                <div
                  key={scheme.id}
                  id={`scheme-card-${scheme.id}`}
                  className="bg-white rounded-[28px] border border-[#E4E4E7] shadow-xs hover:border-[#18181B] transition-all overflow-hidden"
                >
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3 py-0.5 rounded-full">
                            {scheme.category}
                          </span>
                          <span className="text-[11px] font-bold bg-[#FAFAFA] text-[#71717A] border border-[#E4E4E7] px-3 py-0.5 rounded-full">
                            {scheme.state}
                          </span>
                          <span className="text-[10px] text-[#71717A] font-medium">
                            Last Verified: {scheme.lastVerified}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-[#18181B] leading-tight">
                          {displayName}
                        </h3>

                        {/* Scheme -> Action Converter Pillars */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                          
                          {/* 1. Why It May Match */}
                          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                            <div className="text-[10px] uppercase font-bold text-[#71717A] mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Why It Matches:</span>
                            </div>
                            <p className="text-xs text-[#18181B] font-semibold leading-relaxed">
                              {scheme.whyItMatches || 'Matches 3.0-acre registered landholding in Maharashtra.'}
                            </p>
                          </div>

                          {/* 2. Potential Eligibility */}
                          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                            <div className="text-[10px] uppercase font-bold text-[#71717A] mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Potential Eligibility:</span>
                            </div>
                            <p className="text-xs text-[#18181B] font-semibold leading-relaxed">
                              {scheme.potentialEligibility || 'Potentially eligible – verify official criteria.'}
                            </p>
                          </div>

                          {/* 3. Next Action */}
                          <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7]">
                            <div className="text-[10px] uppercase font-bold text-[#15803D] mb-1 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3 text-emerald-600" />
                              <span>Recommended Next Action:</span>
                            </div>
                            <p className="text-xs text-[#14532D] font-bold leading-relaxed">
                              {scheme.nextAction || 'Visit official government portal.'}
                            </p>
                          </div>

                        </div>

                        {/* Benefits Highlight */}
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Financial Benefit: {scheme.benefits}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="mt-5 pt-4 border-t border-[#E4E4E7] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(scheme.id)}
                          className="text-xs font-bold text-[#18181B] flex items-center gap-1.5 bg-[#FAFAFA] hover:bg-white border border-[#E4E4E7] px-4 py-2 rounded-full transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Requirements & Steps'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onAskAiAboutScheme(scheme)}
                          className="text-xs font-bold text-[#18181B] flex items-center gap-1.5 bg-[#FAFAFA] hover:bg-white border border-[#E4E4E7] px-4 py-2 rounded-full transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Ask AI Krishi Mitra</span>
                        </button>
                      </div>

                      <a
                        href={scheme.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Expanded Requirements Checklist */}
                  {isExpanded && (
                    <div className="px-6 sm:px-7 pb-7 pt-4 bg-[#FAFAFA] border-t border-[#E4E4E7] space-y-4 text-xs">
                      <div>
                        <h4 className="font-bold text-[#71717A] text-xs uppercase tracking-wider mb-2">
                          Required Documents Checklist:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(scheme.requiredDocuments || []).map((doc, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-[#E4E4E7] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#18181B]"
                            >
                              📄 {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#71717A] text-xs uppercase tracking-wider mb-2">
                          Application Process Steps:
                        </h4>
                        <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-[#E4E4E7] text-[#18181B] font-medium">
                          {(scheme.applicationProcess || []).map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-[#18181B] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 🧾 SMART DOCUMENT CHECKER                                         */}
      {/* ========================================================================= */}
      {activeMainTab === 'doc_checker' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-[#18181B]">Smart Scheme Document Readiness Checker</h2>
              </div>
              <p className="text-xs text-[#71717A] font-medium">
                Select a target government scheme to review required vs. available documentation before applying.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <select
                value={selectedDocSchemeId}
                onChange={(e) => setSelectedDocSchemeId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-xs font-bold text-[#18181B] focus:outline-hidden"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheme Document Readiness Score Banner */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            missingDocs.length === 0
              ? 'bg-[#F0FDF4] border-[#DCFCE7]'
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              {missingDocs.length === 0 ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              )}
              <div>
                <h3 className="text-sm font-bold text-[#18181B]">
                  {missingDocs.length === 0
                    ? 'All Required Documents Ready for Submission'
                    : `${missingDocs.length} Document${missingDocs.length > 1 ? 's' : ''} May Be Required to Complete Your Application`}
                </h3>
                <p className="text-xs text-[#52525B] mt-0.5">
                  Target Scheme: <strong className="text-[#18181B]">{selectedDocScheme.name}</strong>
                </p>
              </div>
            </div>

            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shrink-0 ${
              missingDocs.length === 0
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {requiredDocs.length - missingDocs.length} / {requiredDocs.length} Ready
            </span>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase text-[#71717A] mb-3">
              Interactive Checklist (Click to Toggle Document Status):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requiredDocs.map((doc, idx) => {
                const isReady = userAvailableDocs[doc] ?? false;
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDocCheck(doc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isReady
                        ? 'bg-[#FAFAFA] border-emerald-300 hover:bg-emerald-50/50'
                        : 'bg-white border-dashed border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                        isReady ? 'bg-emerald-600' : 'bg-amber-400'
                      }`}>
                        {isReady ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#18181B]">{doc}</div>
                        <div className="text-[10px] text-[#71717A]">
                          {isReady ? 'Verified in profile' : 'Click if already obtained'}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isReady ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Action & Official Portal Link */}
          <div className="pt-4 border-t border-[#E4E4E7] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#71717A]">
              Next Step: {selectedDocScheme.nextAction || 'Complete verification on official state portal.'}
            </span>

            <a
              href={selectedDocScheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <span>Go to {new URL(selectedDocScheme.officialUrl).hostname}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 🛡️ AGRICULTURAL LINK SAFETY CHECKER                                */}
      {/* ========================================================================= */}
      {activeMainTab === 'link_safety' && (
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-[#18181B]">Agricultural Link & Scheme URL Safety Checker</h2>
            </div>
            <p className="text-xs text-[#71717A] font-medium">
              Protect yourself from phishing portals, fake subsidy links, and fraudulent payment gateways.
            </p>
          </div>

          {/* Critical Anti-Fraud Warning Box */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
            <Lock className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">CRITICAL SAFETY DIRECTIVE:</strong> Government agriculture portals will NEVER ask for your Bank ATM PIN, UPI PIN, or Aadhaar OTP over WhatsApp/SMS links. Always verify the domain ends with <strong>.gov.in</strong> or <strong>.nic.in</strong>.
            </div>
          </div>

          {/* URL Input Form */}
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-2">
              Enter or Paste Any Agricultural Link to Check:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g., https://pmkisan.gov.in"
                className="flex-1 bg-[#FAFAFA] border border-[#E4E4E7] rounded-full px-4 py-3 text-xs sm:text-sm text-[#18181B] focus:outline-hidden focus:border-[#18181B]"
              />
              <button
                onClick={() => handleRunUrlCheck()}
                className="px-6 py-3 bg-[#18181B] hover:bg-black text-white text-xs font-bold rounded-full transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Link Safety</span>
              </button>
            </div>
          </div>

          {/* Sample Pre-loaded URLs */}
          <div>
            <span className="text-[10px] font-bold uppercase text-[#71717A] mb-2 block">
              Quick Test Samples:
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_LINK_SAFETY_SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunUrlCheck(s.url)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    s.status === 'safe'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                  }`}
                >
                  {s.status === 'safe' ? '✓' : '⚠️'} {s.domain}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Result Dashboard */}
          {safetyResult && (
            <div className={`p-6 rounded-2xl border ${
              safetyResult.status === 'safe'
                ? 'bg-[#F0FDF4] border-[#DCFCE7]'
                : safetyResult.status === 'suspicious'
                ? 'bg-red-50 border-red-200'
                : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#71717A]">
                    Domain Under Analysis:
                  </span>
                  <h3 className="text-base font-bold text-[#18181B] mt-0.5">{safetyResult.domain || safetyResult.url}</h3>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border shrink-0 ${
                  safetyResult.status === 'safe'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}>
                  {safetyResult.status === 'safe' ? 'VERIFIED SAFE PORTAL' : '⚠️ HIGH RISK / SUSPICIOUS'}
                </span>
              </div>

              {/* Reasons list */}
              <div className="my-4 space-y-1.5 text-xs text-[#18181B]">
                {safetyResult.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 font-medium">
                    <span className={safetyResult.status === 'safe' ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {safetyResult.status === 'safe' ? '✓' : '✗'}
                    </span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Warning note */}
              {safetyResult.warningNote && (
                <div className="p-3 rounded-xl bg-white/80 border border-black/5 text-xs font-bold text-[#18181B]">
                  {safetyResult.warningNote}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
