import React from 'react';
import { Home, Camera, Bot, CloudSun, Building2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface BottomNavProps {
  language: Language;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  language,
  activeTab,
  onTabChange,
}) => {
  const t = translations[language];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md border border-[#E4E4E7] px-3 py-2 rounded-full shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1">
        
        {/* 1. Home / Dashboard */}
        <button
          id="bottom-nav-dashboard"
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-full transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#18181B] font-bold'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'dashboard' ? 'scale-110 text-[#18181B]' : ''}`} />
          <span className="text-[10px] mt-0.5 whitespace-nowrap truncate max-w-[56px] leading-tight font-medium">
            {t.nav.dashboard}
          </span>
        </button>

        {/* 2. Crop Scanner */}
        <button
          id="bottom-nav-scanner"
          onClick={() => onTabChange('crop-scanner')}
          className={`flex flex-col items-center justify-center py-1 rounded-full transition-all ${
            activeTab === 'crop-scanner'
              ? 'text-[#18181B] font-bold'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Camera className={`w-5 h-5 ${activeTab === 'crop-scanner' ? 'scale-110 text-[#18181B]' : ''}`} />
          <span className="text-[10px] mt-0.5 whitespace-nowrap truncate max-w-[56px] leading-tight font-medium">
            {t.nav.scanCrop}
          </span>
        </button>

        {/* 3. Central Highlighted AI Assistant Button */}
        <button
          id="bottom-nav-ai"
          onClick={() => onTabChange('ai-chat')}
          className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md border-2 transition-all transform group-hover:scale-105 ${
              activeTab === 'ai-chat'
                ? 'bg-[#18181B] border-emerald-400 text-white ring-4 ring-emerald-500/20'
                : 'bg-[#18181B] border-white text-white'
            }`}
          >
            <Bot className="w-6 h-6" />
          </div>
          <span className={`text-[10px] mt-1 font-bold ${activeTab === 'ai-chat' ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
            {t.assistantName}
          </span>
        </button>

        {/* 4. Weather */}
        <button
          id="bottom-nav-weather"
          onClick={() => onTabChange('weather')}
          className={`flex flex-col items-center justify-center py-1 rounded-full transition-all ${
            activeTab === 'weather'
              ? 'text-[#18181B] font-bold'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <CloudSun className={`w-5 h-5 ${activeTab === 'weather' ? 'scale-110 text-[#18181B]' : ''}`} />
          <span className="text-[10px] mt-0.5 whitespace-nowrap truncate max-w-[56px] leading-tight font-medium">
            {t.nav.weather}
          </span>
        </button>

        {/* 5. Schemes */}
        <button
          id="bottom-nav-schemes"
          onClick={() => onTabChange('schemes')}
          className={`flex flex-col items-center justify-center py-1 rounded-full transition-all ${
            activeTab === 'schemes'
              ? 'text-[#18181B] font-bold'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <Building2 className={`w-5 h-5 ${activeTab === 'schemes' ? 'scale-110 text-[#18181B]' : ''}`} />
          <span className="text-[10px] mt-0.5 whitespace-nowrap truncate max-w-[56px] leading-tight font-medium">
            {t.nav.schemes}
          </span>
        </button>

      </div>
    </nav>
  );
};
