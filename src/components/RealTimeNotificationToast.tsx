import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  CloudRain,
  AlertTriangle,
  Building2,
  Sprout,
  ArrowRight,
  TrendingUp,
  Radio,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FarmNotification, Language } from '../types';

interface RealTimeToastProps {
  notifications: FarmNotification[];
  onDismiss: (id: string) => void;
  onSelect: (notif: FarmNotification) => void;
  language: Language;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const RealTimeNotificationToast: React.FC<RealTimeToastProps> = ({
  notifications,
  onDismiss,
  onSelect,
  language,
  soundEnabled,
  onToggleSound,
}) => {
  // Only display the latest 2 unread real-time notifications
  const activeToasts = notifications.slice(0, 2);

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'pest':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'scheme':
        return <Building2 className="w-5 h-5 text-emerald-500" />;
      case 'crop':
      default:
        return <Sprout className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getCategoryLabel = (type: string) => {
    if (language === 'mr') {
      switch (type) {
        case 'weather':
          return 'हवामान इशारा';
        case 'pest':
          return 'कीड व रोग अलर्ट';
        case 'scheme':
          return 'सरकारी योजना';
        default:
          return 'शेती सल्ला';
      }
    } else if (language === 'hi') {
      switch (type) {
        case 'weather':
          return 'मौसम अलर्ट';
        case 'pest':
          return 'कीट व रोग चेतावनी';
        case 'scheme':
          return 'सरकारी योजना';
        default:
          return 'फसल सलाह';
      }
    } else {
      switch (type) {
        case 'weather':
          return 'Weather Alert';
        case 'pest':
          return 'Pest & Disease Alert';
        case 'scheme':
          return 'Government Scheme';
        default:
          return 'Crop Advisory';
      }
    }
  };

  return (
    <div
      id="realtime-toast-container"
      className="fixed top-20 sm:top-24 right-4 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm sm:max-w-md w-full"
    >
      <AnimatePresence mode="popLayout">
        {activeToasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            icon={getIcon(toast.type)}
            categoryLabel={getCategoryLabel(toast.type)}
            language={language}
            onDismiss={() => onDismiss(toast.id)}
            onSelect={() => onSelect(toast)}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: FarmNotification;
  icon: React.ReactNode;
  categoryLabel: string;
  language: Language;
  onDismiss: () => void;
  onSelect: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  toast,
  icon,
  categoryLabel,
  language,
  onDismiss,
  onSelect,
  soundEnabled,
  onToggleSound,
}) => {
  const [progress, setProgress] = useState(100);
  const DURATION_MS = 7500;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(remaining);

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -16, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto bg-white border-2 border-[#18181B] rounded-[24px] shadow-2xl overflow-hidden relative group"
    >
      {/* Live progress countdown bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#F4F4F7]">
        <div
          className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 sm:p-5 pt-4">
        {/* Top Header Badge & Live indicator */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{language === 'mr' ? 'लाईव्ह सूचना' : language === 'hi' ? 'लाइव अलर्ट' : 'Real-time Alert'}</span>
            </span>
            <span className="text-[11px] font-semibold text-[#71717A]">{categoryLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              className="p-1 text-[#A1A1AA] hover:text-[#18181B] rounded-lg transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Notification Chimes' : 'Enable Notification Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onDismiss}
              className="p-1 text-[#A1A1AA] hover:text-[#18181B] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex gap-3.5 items-start">
          <div className="p-2.5 rounded-2xl bg-[#F4F4F7] border border-[#E4E4E7] shrink-0 mt-0.5">
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[#18181B] leading-snug line-clamp-2">
              {toast.title}
            </h4>
            <p className="text-xs text-[#52525B] mt-1 leading-relaxed line-clamp-3 font-medium">
              {toast.message}
            </p>

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F4F4F7]">
              <span className="text-[10px] font-medium text-[#A1A1AA]">
                {toast.date || 'Just now'}
              </span>

              <button
                onClick={onSelect}
                className="flex items-center gap-1 text-xs font-bold text-[#18181B] hover:text-emerald-700 bg-[#F4F4F7] hover:bg-[#E4E4E7] px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <span>{language === 'mr' ? 'तपशील पहा' : language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
