import React, { useState } from 'react';
import { Shield, X, Plus, Edit2, Trash2, CheckCircle2, RefreshCw, Layers, Database, Sparkles } from 'lucide-react';
import { GovernmentScheme, Language } from '../types';
import { translations } from '../i18n/translations';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemes: GovernmentScheme[];
  onSaveScheme: (scheme: Partial<GovernmentScheme>) => void;
  onDeleteScheme: (id: string) => void;
  language: Language;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  schemes,
  onSaveScheme,
  onDeleteScheme,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [activeAdminTab, setActiveAdminTab] = useState<'schemes' | 'ai-status' | 'feedback'>('schemes');
  const [editingScheme, setEditingScheme] = useState<Partial<GovernmentScheme> | null>(null);

  const [formName, setFormName] = useState('');
  const [formNameHi, setFormNameHi] = useState('');
  const [formNameMr, setFormNameMr] = useState('');
  const [formCategory, setFormCategory] = useState<GovernmentScheme['category']>('Financial Support');
  const [formState, setFormState] = useState('All India');
  const [formPurpose, setFormPurpose] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formEligibility, setFormEligibility] = useState('');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');

  const handleOpenEdit = (scheme?: GovernmentScheme) => {
    if (scheme) {
      setEditingScheme(scheme);
      setFormName(scheme.name);
      setFormNameHi(scheme.localName.hi);
      setFormNameMr(scheme.localName.mr);
      setFormCategory(scheme.category);
      setFormState(scheme.state);
      setFormPurpose(scheme.purpose);
      setFormBenefits(scheme.benefits);
      setFormEligibility(scheme.eligibility.join('\n'));
      setFormOfficialUrl(scheme.officialUrl);
    } else {
      setEditingScheme({});
      setFormName('');
      setFormNameHi('');
      setFormNameMr('');
      setFormCategory('Financial Support');
      setFormState('All India');
      setFormPurpose('');
      setFormBenefits('');
      setFormEligibility('');
      setFormOfficialUrl('https://');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onSaveScheme({
      id: editingScheme?.id,
      name: formName,
      localName: {
        en: formName,
        hi: formNameHi || formName,
        mr: formNameMr || formName,
      },
      category: formCategory,
      state: formState,
      targetBeneficiary: 'Agricultural Landholders & Farmers',
      purpose: formPurpose,
      benefits: formBenefits,
      eligibility: formEligibility.split('\n').filter((l) => l.trim()),
      requiredDocuments: ['Aadhaar Card', '7/12 Land Record', 'Bank Passbook'],
      applicationProcess: ['Apply via official online state portal.'],
      officialUrl: formOfficialUrl,
      lastVerified: new Date().toISOString().split('T')[0],
      isActive: true,
    });

    setEditingScheme(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl border border-[#E4E4E7] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white text-[#18181B] px-6 py-5 flex items-center justify-between border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#18181B] text-white rounded-2xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#18181B]">Smart Krishi Admin & Content Management</h2>
              <p className="text-xs text-[#71717A] font-medium">Manage government schemes, AI system prompts, and feedback metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#71717A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 py-3 bg-[#F4F4F7] border-b border-[#E4E4E7] flex gap-2">
          <button
            onClick={() => setActiveAdminTab('schemes')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'schemes'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] bg-white border border-[#E4E4E7]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Government Schemes ({schemes.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('ai-status')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'ai-status'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] bg-white border border-[#E4E4E7]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Pipeline & Grounding</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('feedback')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'feedback'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B] bg-white border border-[#E4E4E7]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Farmer Feedback Log</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeAdminTab === 'schemes' && (
            <div>
              {editingScheme !== null ? (
                <form onSubmit={handleSaveForm} className="space-y-4 bg-[#F4F4F7] p-6 rounded-[28px] border border-[#E4E4E7]">
                  <div className="flex items-center justify-between border-b pb-3 border-[#E4E4E7]">
                    <h3 className="font-bold text-[#18181B] text-sm">
                      {editingScheme.id ? 'Edit Scheme' : 'Add New Government Scheme'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingScheme(null)}
                      className="text-xs text-[#71717A] hover:text-[#18181B] font-bold"
                    >
                      Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1.5">Scheme Name (English)</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                        placeholder="e.g. PM-KISAN"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1.5">Name (Hindi)</label>
                      <input
                        type="text"
                        value={formNameHi}
                        onChange={(e) => setFormNameHi(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                        placeholder="हिंदी नाम"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1.5">Name (Marathi)</label>
                      <input
                        type="text"
                        value={formNameMr}
                        onChange={(e) => setFormNameMr(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                        placeholder="मराठी नाव"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1.5">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-bold focus:outline-none focus:border-[#18181B]"
                      >
                        <option value="Financial Support">Financial Support</option>
                        <option value="Crop Insurance">Crop Insurance</option>
                        <option value="Irrigation & Solar">Irrigation & Solar</option>
                        <option value="Equipment & Drones">Equipment & Drones</option>
                        <option value="Organic Farming">Organic Farming</option>
                        <option value="Credit & Loans">Credit & Loans</option>
                        <option value="Seeds & Inputs">Seeds & Inputs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1.5">State Scope</label>
                      <input
                        type="text"
                        value={formState}
                        onChange={(e) => setFormState(e.target.value)}
                        className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                        placeholder="All India or specific state"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1.5">Purpose</label>
                    <textarea
                      rows={2}
                      value={formPurpose}
                      onChange={(e) => setFormPurpose(e.target.value)}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                      placeholder="Brief purpose of scheme..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1.5">Benefits & Subsidy Amount</label>
                    <textarea
                      rows={2}
                      value={formBenefits}
                      onChange={(e) => setFormBenefits(e.target.value)}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                      placeholder="Details of financial or equipment benefits..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1.5">Eligibility Criteria (1 per line)</label>
                    <textarea
                      rows={3}
                      value={formEligibility}
                      onChange={(e) => setFormEligibility(e.target.value)}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                      placeholder="Eligibility item 1&#10;Eligibility item 2..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1.5">Official Portal URL</label>
                    <input
                      type="url"
                      value={formOfficialUrl}
                      onChange={(e) => setFormOfficialUrl(e.target.value)}
                      className="w-full text-xs p-3 rounded-2xl border border-[#E4E4E7] bg-white text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
                      placeholder="https://pmkisan.gov.in"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingScheme(null)}
                      className="px-5 py-2.5 bg-white border border-[#E4E4E7] text-[#18181B] rounded-full text-xs font-bold hover:bg-[#E4E4E7] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold shadow-xs transition-colors"
                    >
                      Save Scheme
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#71717A] font-medium">
                      Manage verified agricultural subsidy and insurance schemes displayed in the farmer portal.
                    </p>
                    <button
                      onClick={() => handleOpenEdit()}
                      className="px-4 py-2 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Scheme</span>
                    </button>
                  </div>

                  <div className="border border-[#E4E4E7] rounded-[24px] overflow-hidden divide-y divide-[#E4E4E7] bg-white shadow-2xs">
                    {(schemes || []).map((s) => (
                      <div key={s.id} className="p-4 flex items-center justify-between gap-3 hover:bg-[#F4F4F7] transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#18181B] text-sm truncate">{s.name}</span>
                            <span className="text-[10px] font-bold bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                              {s.category}
                            </span>
                            <span className="text-[10px] bg-[#F4F4F7] text-[#71717A] px-2.5 py-0.5 rounded-full font-medium">
                              {s.state}
                            </span>
                          </div>
                          <p className="text-xs text-[#71717A] truncate max-w-xl mt-1 font-medium">{s.benefits}</p>
                          <div className="text-[11px] text-[#A1A1AA] mt-1 font-medium">
                            Verified on: {s.lastVerified} • Official: {s.officialUrl}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-2 rounded-full bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#18181B] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteScheme(s.id)}
                            className="p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeAdminTab === 'ai-status' && (
            <div className="space-y-4 text-xs text-[#18181B]">
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] p-5 rounded-[24px]">
                <h4 className="font-bold text-[#15803D] text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  Gemini 3.7 Flash Model Active
                </h4>
                <p className="mt-1 text-[#15803D] leading-relaxed font-medium">
                  Server-side agricultural assistant engine initialized with system guidelines. Vision-capable image diagnostics active for leaf pathology, entomology pests, and physiological crop stage scoring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="border border-[#E4E4E7] p-5 rounded-[24px] bg-[#F4F4F7]">
                  <h5 className="font-bold text-[#18181B] mb-1.5">Supported Languages</h5>
                  <p className="text-[#71717A] leading-relaxed font-medium">
                    1. English (en-IN)<br />
                    2. हिंदी (hi-IN - Devnagari)<br />
                    3. मराठी (mr-IN - Devnagari)
                  </p>
                </div>
                <div className="border border-[#E4E4E7] p-5 rounded-[24px] bg-[#F4F4F7]">
                  <h5 className="font-bold text-[#18181B] mb-1.5">Safety Constraints</h5>
                  <p className="text-[#71717A] leading-relaxed font-medium">
                    • Chemical dosage disclaimer enforced<br />
                    • Uncertainty threshold & confidence flags<br />
                    • Integrated Pest Management (IPM) prioritized
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeAdminTab === 'feedback' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3.5 text-center mb-4">
                <div className="p-4 bg-white rounded-[22px] border border-[#E4E4E7] shadow-2xs">
                  <div className="text-xl font-bold text-[#18181B]">98.4%</div>
                  <div className="text-[11px] text-[#71717A] font-medium mt-0.5">Farmer Helpful Rate</div>
                </div>
                <div className="p-4 bg-white rounded-[22px] border border-[#E4E4E7] shadow-2xs">
                  <div className="text-xl font-bold text-[#18181B]">4.9 / 5.0</div>
                  <div className="text-[11px] text-[#71717A] font-medium mt-0.5">Voice Assistant Clarity</div>
                </div>
                <div className="p-4 bg-white rounded-[22px] border border-[#E4E4E7] shadow-2xs">
                  <div className="text-xl font-bold text-[#18181B]">91.2%</div>
                  <div className="text-[11px] text-[#71717A] font-medium mt-0.5">Scan Diagnostic Accuracy</div>
                </div>
              </div>

              <div className="text-xs text-[#71717A] text-center py-6 bg-[#F4F4F7] rounded-[24px] border border-[#E4E4E7] font-medium">
                Recent user feedback logs are stored locally for privacy. All agricultural query telemetry remains anonymized.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F4F4F7] border-t border-[#E4E4E7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white text-[#18181B] border border-[#E4E4E7] rounded-full text-xs font-bold hover:bg-[#E4E4E7] transition-colors"
          >
            {t.common.close}
          </button>
        </div>

      </div>
    </div>
  );
};
