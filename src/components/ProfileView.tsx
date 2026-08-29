import React, { useState } from 'react';
import {
  User,
  Globe,
  Volume2,
  Save,
  Shield,
  CheckCircle2,
  LogIn,
  LogOut,
  Sparkles,
  Bell,
  Mail,
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';

interface ProfileViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  autoVoice: boolean;
  onToggleVoice: () => void;
  onOpenAdmin: () => void;
  isAuthenticated: boolean;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  onLanguageChange,
  user,
  onUpdateUser,
  autoVoice,
  onToggleVoice,
  onOpenAdmin,
  isAuthenticated,
  onOpenAuthModal,
  onSignOut,
}) => {
  const t = translations[language];

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when user prop changes
  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setNotificationsEnabled(user.notificationsEnabled ?? true);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      phone,
      notificationsEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="profile-view-container" className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      
      {/* 1. Profile Header - Bento Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[22px] bg-[#18181B] flex items-center justify-center text-white text-2xl font-bold shadow-2xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isAuthenticated
                  ? 'bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7]'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isAuthenticated
                  ? (language === 'mr' ? 'प्रमाणित खाते (Signed In)' : 'Verified Account')
                  : (language === 'mr' ? 'अतिथी खाते (Guest Account)' : 'Guest Mode')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">{user.name}</h1>
            <p className="text-xs sm:text-sm text-[#71717A] font-medium mt-0.5">
              {user.email || (language === 'mr' ? 'खाते सक्रिय' : 'Account active')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'mr' ? 'लॉग आउट (Sign Out)' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>{language === 'mr' ? 'साइन इन / नोंदणी करा' : 'Sign In / Sign Up'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] rounded-full text-xs font-bold text-[#18181B] hover:text-black transition-colors shadow-2xs cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#18181B]" />
            <span>{t.nav.admin}</span>
          </button>
        </div>
      </div>

      {/* 2. Account Preferences & Settings Bento Card */}
      <form onSubmit={handleSave} className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E4E7] shadow-xs space-y-6">
        
        {/* Account Details */}
        <div>
          <h3 className="text-sm font-bold text-[#18181B] mb-4 pb-3 border-b border-[#E4E4E7] flex items-center gap-2">
            <User className="w-4 h-4 text-[#18181B]" />
            <span>{language === 'mr' ? 'खाते तपशील (Account Details)' : 'Account Details'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#18181B] mb-1.5">
                {language === 'mr' ? 'नाव' : 'Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F7] text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#18181B] mb-1.5">
                {language === 'mr' ? 'मोबाईल नंबर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-3 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F7] text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#18181B] mb-1.5">
                {language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full p-3 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F7] text-[#18181B] font-medium focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="text-sm font-bold text-[#18181B] mb-4 pb-3 border-b border-[#E4E4E7] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#18181B]" />
            <span>{language === 'mr' ? 'भाषा आणि ऑडिओ सेटिंग्ज' : 'Language & Audio Settings'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Preferred Language */}
            <div className="bg-[#F4F4F7] p-5 rounded-[22px] border border-[#E4E4E7] space-y-2.5">
              <label className="block font-bold text-[#18181B]">
                {language === 'mr' ? 'इंटरफेस आणि आवाज भाषा' : 'Interface & Voice Language'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onLanguageChange('mr')}
                  className={`flex-1 py-2.5 rounded-full font-bold transition-all cursor-pointer ${
                    language === 'mr'
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  मराठी
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('hi')}
                  className={`flex-1 py-2.5 rounded-full font-bold transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`flex-1 py-2.5 rounded-full font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Auto voice playback toggle */}
            <div className="bg-[#F4F4F7] p-5 rounded-[22px] border border-[#E4E4E7] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#18181B]" />
                  <span>{language === 'mr' ? 'स्वयंचलित आवाज वाचन' : 'Auto Readout Responses'}</span>
                </div>
                <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
                  {language === 'mr' ? 'AI उत्तरे आपोआप आवाजात ऐकवा' : 'Automatically speaks AI answers aloud'}
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleVoice}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  autoVoice ? 'bg-[#18181B]' : 'bg-[#E4E4E7]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                    autoVoice ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & System */}
        <div>
          <h3 className="text-sm font-bold text-[#18181B] mb-4 pb-3 border-b border-[#E4E4E7] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#18181B]" />
            <span>{language === 'mr' ? 'सूचना आणि सूचना सेटिंग्ज' : 'Notifications & Alerts'}</span>
          </h3>

          <div className="bg-[#F4F4F7] p-5 rounded-[22px] border border-[#E4E4E7] flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#18181B] flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#18181B]" />
                <span>{language === 'mr' ? 'हवामान आणि योजना सूचना' : 'Weather & Scheme Advisory Alerts'}</span>
              </div>
              <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
                {language === 'mr' ? 'महत्त्वाच्या हवामान आणि बाजारभाव सूचना मिळवा' : 'Receive crucial weather forecasts and crop advisories'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                notificationsEnabled ? 'bg-[#18181B]' : 'bg-[#E4E4E7]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E4E4E7]">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-[#15803D] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'mr' ? 'प्रोफाइल यशस्वीरीत्या जतन केले!' : 'Settings updated successfully!'}</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'mr' ? 'बदल जतन करा' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
