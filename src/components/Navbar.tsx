import React from 'react';
import { Sprout, Globe, Bell, User, CloudSun, Shield, Volume2, VolumeX, Menu, X, LogIn } from 'lucide-react';
import { Language, UserProfile, WeatherData, FarmNotification } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile;
  weather: WeatherData | null;
  notifications: FarmNotification[];
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  autoVoice: boolean;
  onToggleVoice: () => void;
  isAuthenticated?: boolean;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  user,
  weather,
  notifications,
  onOpenNotifications,
  onOpenAdmin,
  activeTab,
  onTabChange,
  autoVoice,
  onToggleVoice,
  isAuthenticated = false,
  onOpenAuthModal,
}) => {
  const t = translations[language];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'digital-twin', label: language === 'mr' ? 'डिजिटल मॉडेल' : 'Digital Twin' },
    { id: 'what-if', label: language === 'mr' ? 'व्हॉट-इफ' : 'What-If Sim' },
    { id: 'ai-chat', label: t.nav.askAi },
    { id: 'crop-scanner', label: t.nav.scanCrop },
    { id: 'weather', label: t.nav.weather },
    { id: 'schemes', label: t.nav.schemes },
    { id: 'village-intel', label: language === 'mr' ? 'गावनिहाय माहिती' : 'Village Intel' },
  ];

  return (
    <header id="main-header" className="bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Quick Toggles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#18181B] border border-[#27272A] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-xl tracking-tight text-[#18181B] leading-tight flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-2 py-0.5 rounded-full">
                  AI
                </span>
              </div>
              <div className="text-xs text-[#71717A] font-medium hidden sm:block">
                {t.appTagline}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links - Segmented Bento Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4F4F7] p-1 rounded-full border border-[#E4E4E7]">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B] hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls: Language, Weather, Voice, Notification, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Weather Quick Pill (Desktop & Tablet) */}
            {weather && (
              <button
                id="header-weather-pill"
                onClick={() => onTabChange('weather')}
                className="hidden md:flex items-center gap-2 bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-full text-xs font-semibold text-[#18181B] shadow-xs transition-colors cursor-pointer"
                title={`${weather.locationName}: ${weather.temp}°C, ${weather.conditionText}`}
              >
                <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="max-w-[75px] truncate font-medium text-[#71717A]">{weather.locationName}</span>
                <span className="font-bold text-[#18181B] bg-white border border-[#E4E4E7] px-2 py-0.5 rounded-full text-xs">
                  {weather.temp}°C
                </span>
              </button>
            )}

            {/* Language Selector Dropdown / Segmented Buttons */}
            <div
              id="language-selector-group"
              className="flex items-center bg-[#F4F4F7] border border-[#E4E4E7] rounded-full p-0.5"
            >
              <button
                id="lang-btn-mr"
                onClick={() => onLanguageChange('mr')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  language === 'mr'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
                title="मराठी भाषा"
              >
                मराठी
              </button>
              <button
                id="lang-btn-hi"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
                title="हिंदी भाषा"
              >
                हिंदी
              </button>
              <button
                id="lang-btn-en"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
                title="English Language"
              >
                EN
              </button>
            </div>

            {/* Voice Audio Readout Quick Toggle */}
            <button
              id="voice-toggle-btn"
              onClick={onToggleVoice}
              className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                autoVoice
                  ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D]'
                  : 'bg-[#F4F4F7] border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]'
              }`}
              title={autoVoice ? "Voice Output Active" : "Voice Output Muted"}
            >
              {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notifications Bell with Real-time indicator */}
            <button
              id="notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-2xl bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer group"
              title="Real-Time Farm Alerts & Notifications"
            >
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Sign In button for guest or Profile Avatar for logged in */}
            {!isAuthenticated && onOpenAuthModal ? (
              <button
                id="header-signin-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Sign In / Register"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">
                  {language === 'mr' ? 'साइन इन' : 'Sign In'}
                </span>
              </button>
            ) : (
              <button
                id="profile-nav-btn"
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#18181B] border-[#18181B] text-white'
                    : 'bg-[#F4F4F7] hover:bg-white border-[#E4E4E7] text-[#18181B]'
                }`}
                title="Farmer Profile & Settings"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'K'}
                </div>
                <span className="text-xs font-bold hidden md:inline truncate max-w-[80px]">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            )}

            {/* Admin Portal Quick Icon */}
            <button
              id="admin-portal-header-btn"
              onClick={onOpenAdmin}
              className="hidden lg:flex p-2 rounded-2xl bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
              title="Admin Portal (Schemes & Content)"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] text-[#18181B] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-white border-t border-[#E4E4E7] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-between transition-colors ${
                activeTab === item.id
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#71717A] hover:bg-[#F4F4F7] hover:text-[#18181B]'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#71717A] hover:text-[#18181B] flex items-center gap-1.5 py-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>{t.nav.admin}</span>
            </button>
            <div className="text-[11px] text-[#A1A1AA] font-semibold uppercase tracking-wider">
              Gemini 3.7 Pro
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
