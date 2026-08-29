import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface OfflineBannerProps {
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  const messages = {
    en: "Internet connection is weak or offline. Cached crop advisories remain accessible.",
    hi: "इंटरनेट कनेक्शन कमजोर या बंद है। सुरक्षित की गई कृषि जानकारी उपलब्ध है।",
    mr: "इंटरनेट कनेक्शन कमजोर किंवा बंद आहे. सेव्ह केलेली कृषी माहिती उपलब्ध आहे.",
  };

  return (
    <div
      id="offline-banner"
      className="bg-amber-500 text-stone-950 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium sticky top-0 z-50 shadow-sm"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{messages[language] || messages.en}</span>
    </div>
  );
};
