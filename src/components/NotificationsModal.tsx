import React, { useState } from 'react';
import {
  Bell,
  X,
  CloudRain,
  AlertTriangle,
  Building2,
  Sprout,
  CheckCheck,
  Radio,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FarmNotification, Language } from '../types';
import { translations } from '../i18n/translations';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: FarmNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: FarmNotification) => void;
  language: Language;
  onTriggerTestAlert?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onRequestBrowserPermission?: () => void;
  browserPermission?: NotificationPermission;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  language,
  onTriggerTestAlert,
  soundEnabled = true,
  onToggleSound,
  onRequestBrowserPermission,
  browserPermission = 'default',
}) => {
  const [filter, setFilter] = useState<'all' | 'weather' | 'pest' | 'scheme' | 'crop'>('all');

  if (!isOpen) return null;
  const t = translations[language];

  const filteredNotifications = notifications.filter((n) => {
    if (!n) return false;
    if (filter === 'all') return true;
    return n.type === filter;
  });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl border border-[#E4E4E7] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="bg-white text-[#18181B] px-6 py-5 flex items-center justify-between border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">
                  {language === 'mr'
                    ? 'शेती सूचना व लाईव्ह अलर्ट'
                    : language === 'hi'
                    ? 'कृषि सूचनाएं व लाइव अलर्ट'
                    : 'Farm Alerts & Real-Time Intelligence'}
                </h2>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'mr' ? 'लाईव्ह' : 'LIVE'}</span>
                </span>
              </div>
              <p className="text-xs text-[#71717A] font-medium">
                {language === 'mr'
                  ? 'हवामान, कीड आणि बाजारभाव रिअल-टाइम सूचना'
                  : language === 'hi'
                  ? 'मौसम, कीट और मंडी भाव की रियल-टाइम सूचनाएं'
                  : 'Real-time microclimate, pest bulletins & mandi updates'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F4F4F7] hover:bg-[#E4E4E7] text-[#71717A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Status & Quick Controls Bar */}
        <div className="px-6 py-3 bg-[#FAFAFA] border-b border-[#E4E4E7] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-[#E4E4E7] text-[#71717A]'
                }`}
                title="Notification Chime Sound"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? (language === 'mr' ? 'ध्वनी चालू' : 'Sound ON') : (language === 'mr' ? 'ध्वनी बंद' : 'Muted')}</span>
              </button>
            )}

            {onRequestBrowserPermission && typeof Notification !== 'undefined' && browserPermission !== 'granted' && (
              <button
                onClick={onRequestBrowserPermission}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'डेस्कटॉप सूचना सुरू करा' : 'Enable Device Alerts'}</span>
              </button>
            )}
          </div>

          {onTriggerTestAlert && (
            <button
              onClick={onTriggerTestAlert}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Simulate a real-time incoming farm alert"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'mr' ? 'लाईव्ह चाचणी अलर्ट' : language === 'hi' ? 'लाइव टेस्ट अलर्ट' : 'Test Real-time Alert'}</span>
            </button>
          )}
        </div>

        {/* Filter Categories & Mark All Read */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E4E4E7] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'weather', 'pest', 'scheme', 'crop'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer capitalize ${
                  filter === cat
                    ? 'bg-[#18181B] text-white'
                    : 'bg-[#F4F4F7] text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                {cat === 'all'
                  ? language === 'mr'
                    ? 'सर्व'
                    : 'All'
                  : cat === 'weather'
                  ? language === 'mr'
                    ? 'हवामान'
                    : 'Weather'
                  : cat === 'pest'
                  ? language === 'mr'
                    ? 'कीड'
                    : 'Pest'
                  : cat === 'scheme'
                  ? language === 'mr'
                    ? 'योजना'
                    : 'Schemes'
                  : language === 'mr'
                  ? 'पीक'
                  : 'Crops'}
              </button>
            ))}
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={onMarkAllRead}
              className="font-bold text-xs text-[#18181B] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'सर्व वाचले' : 'Mark all read'}</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-[#FAFAFA]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-[#A1A1AA]">
              <Bell className="w-10 h-10 mx-auto text-[#A1A1AA] mb-2 opacity-50" />
              <p className="text-sm font-medium">
                {language === 'mr'
                  ? 'कोणत्याही नवीन सूचना नाहीत.'
                  : language === 'hi'
                  ? 'कोई नया अलर्ट नहीं है।'
                  : 'No alerts in this category.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                  notif.isRead
                    ? 'bg-white border-[#E4E4E7] text-[#71717A]'
                    : 'bg-white border-2 border-[#18181B] text-[#18181B] shadow-sm'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-[#F4F4F7] shadow-2xs border border-[#E4E4E7] shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm ${notif.isRead ? 'font-medium' : 'font-bold text-[#18181B]'}`}>
                        {notif?.title || 'Notification'}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#A1A1AA] shrink-0 font-medium">{notif?.date || 'Today'}</span>
                  </div>
                  <p className="text-xs text-[#52525B] mt-1 leading-relaxed font-medium">{notif?.message || ''}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E4E4E7] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{language === 'mr' ? 'रिअल-टाइम मॉनिटरिंग सक्रिय' : 'Real-time alert daemon active'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#18181B] text-white rounded-full text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
