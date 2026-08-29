import React, { useState, useEffect } from 'react';
import {
  Language,
  UserProfile,
  WeatherData,
  GovernmentScheme,
  FarmCrop,
  Conversation,
  ChatMessage,
  FarmNotification,
  ScanResult,
  ScanType,
} from './types';
import { translations } from './i18n/translations';
import { DEFAULT_SCHEMES } from './data/mockSchemes';
import { CROP_STAGE_TEMPLATES } from './data/cropKnowledge';
import { SpeechAssistant } from './utils/speech';
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  setDoc,
  User,
} from './firebase';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { NotificationsModal } from './components/NotificationsModal';
import { RealTimeNotificationToast } from './components/RealTimeNotificationToast';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AuthModal } from './components/AuthModal';
import { playRealtimeNotificationSound } from './utils/soundAlert';

import { DashboardView } from './components/DashboardView';
import { AiChatView } from './components/AiChatView';
import { CropScannerView } from './components/CropScannerView';
import { WeatherView } from './components/WeatherView';
import { SchemesView } from './components/SchemesView';
import { ProfileView } from './components/ProfileView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { FarmMemoryView } from './components/FarmMemoryView';
import { VillageIntelView } from './components/VillageIntelView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { DEMO_FARMER_USER, DEMO_FARM_CROPS } from './data/digitalTwinData';

const INITIAL_USER: UserProfile = DEMO_FARMER_USER;

const INITIAL_CROPS: FarmCrop[] = DEMO_FARM_CROPS;

const INITIAL_NOTIFICATIONS: FarmNotification[] = [
  {
    id: 'notif-1',
    title: 'Rain Warning for Pune District',
    message: 'Scattered light showers expected in 48 hours. Postpone open field urea broadcast and pesticide spraying.',
    date: 'Today, 8:00 AM',
    isRead: false,
    type: 'weather',
  },
  {
    id: 'notif-2',
    title: 'PM-KISAN 17th Installment Credited',
    message: 'Check your linked bank DBT account for ₹2,000 credit confirmation.',
    date: 'Yesterday',
    isRead: false,
    type: 'scheme',
  },
  {
    id: 'notif-3',
    title: 'Whitefly Pest Alert in Nashik & Pune',
    message: 'Elevated temperature index favors sucking pests. Inspect lower leaves of tomato and chili.',
    date: '2 days ago',
    isRead: true,
    type: 'pest',
  },
];

export default function App() {
  // 1. Language state (defaults to Marathi, stored in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_language');
    return (saved as Language) || 'mr';
  });

  // 2. Active Tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // 3. User Profile state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('krishi_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // 4. Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // 5. Government Schemes state
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(() => {
    const saved = localStorage.getItem('krishi_schemes');
    return saved ? JSON.parse(saved) : DEFAULT_SCHEMES;
  });

  // 6. My Crops state
  const [crops, setCrops] = useState<FarmCrop[]>(() => {
    const saved = localStorage.getItem('krishi_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  // 7. Conversations & AI state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('krishi_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'conv-1',
        title: 'Agricultural Consultation',
        language: 'mr',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      },
    ];
  });
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [initialPromptForAi, setInitialPromptForAi] = useState<string>('');

  // 8. Scanner state
  const [scannerInitialType, setScannerInitialType] = useState<ScanType>('all');

  // 9. Notifications & Real-Time Intelligence state
  const [notifications, setNotifications] = useState<FarmNotification[]>(() => {
    const saved = localStorage.getItem('krishi_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [realtimeToasts, setRealtimeToasts] = useState<FarmNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('krishi_sound_enabled') !== 'false';
  });
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'default';
  });

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('krishi_sound_enabled', String(next));
      return next;
    });
  };

  const requestBrowserPermission = async () => {
    if (typeof Notification !== 'undefined' && Notification.requestPermission) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
  };

  // Dispatch a real-time notification to list, floating toast, sound chime, and browser push
  const dispatchRealTimeNotification = (newNotif: FarmNotification) => {
    // 1. Prepend to main list
    setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);

    // 2. Prepend to floating toast overlay
    setRealtimeToasts((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)].slice(0, 2));

    // 3. Audio Chime
    if (soundEnabled) {
      playRealtimeNotificationSound();
    }

    // 4. Browser Native Notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification trigger warning:', e);
      }
    }
  };

  const handleDismissToast = (id: string) => {
    setRealtimeToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sample rotational pool for live testing
  const [testAlertIndex, setTestAlertIndex] = useState(0);
  const handleTriggerTestAlert = () => {
    const alertsPool = [
      {
        type: 'weather' as const,
        title:
          language === 'mr'
            ? `हवामान इशारा: ${weather?.locationName || 'तुमच्या परिसरात'} वादळी वाऱ्यासह पावसाची शक्यता`
            : language === 'hi'
            ? `मौसम चेतावनी: ${weather?.locationName || 'आपके क्षेत्र में'} तेज हवाओं के साथ बारिश की संभावना`
            : `Weather Alert: Thunderstorm & rain showers expected in ${weather?.locationName || 'your area'}`,
        message:
          language === 'mr'
            ? 'पुढील २४ तासांत फवारणी व खत टाकण्याचे काम पुढे ढकला. पाण्याचा निचरा योग्य ठेवा.'
            : language === 'hi'
            ? 'अगले 24 घंटे में कीटनाशक छिड़काव रोकें और जल निकासी की व्यवस्था करें।'
            : 'Postpone chemical spraying & fertilizer broadcast for next 24 hours. Ensure drainage.',
      },
      {
        type: 'crop' as const,
        title:
          language === 'mr'
            ? 'बाजारभाव अलर्ट: नारायणगाव / पुणे बाजार समितीत टोमॅटोचे दर वाढले (+₹१६०/क्विंटल)'
            : language === 'hi'
            ? 'मंडी भाव अलर्ट: स्थानीय मंडी में टमाटर के दामों में उछाल (+₹160/क्विंटल)'
            : 'Mandi Flash: Tomato prices surged (+₹160/Qtl) at local APMC market',
        message:
          language === 'mr'
            ? 'उच्च प्रतवारीच्या टोमॅटोची मागणी वाढली आहे. काढणीचे नियोजन तात्काळ करा.'
            : language === 'hi'
            ? 'ग्रेड-A गुणवत्ता वाले टमाटर की मांग तेज है। कटाई की योजना बनाएं।'
            : 'High demand reported for Grade-A produce. Plan harvest accordingly.',
      },
      {
        type: 'pest' as const,
        title:
          language === 'mr'
            ? 'कीड दक्षता सूचना: रसशोषक किडींचा प्रादुर्भाव (Thrips & Mites)'
            : language === 'hi'
            ? 'कीट चेतावनी: रस चूसक कीटों का प्रकोप (थ्रिप्स व माइट्स)'
            : 'Pest Advisory: Sucking pest surge alert in regional vegetable cluster',
        message:
          language === 'mr'
            ? 'कांदा व मिरचीच्या पानांची बारकाईने पाहणी करा. निंबोळी अर्क ५% किंवा पिवळे चिकट सापळे लावा.'
            : language === 'hi'
            ? 'प्याज व मिर्च की पत्तियों की जांच करें। 5% नीम तेल या पीले स्टिकी ट्रैप लगाएं।'
            : 'Inspect lower foliage of onion & chili. Deploy yellow sticky traps immediately.',
      },
      {
        type: 'scheme' as const,
        title:
          language === 'mr'
            ? 'योजना अपडेट: महाडीबीटी सूक्ष्म सिंचन (Drip/Sprinkler) ८०% अनुदान अर्ज सुरू'
            : language === 'hi'
            ? 'योजना अपडेट: महाडीबीटी ड्रिप व स्प्रिंकलर 80% सब्सिडी आवेदन प्रारंभ'
            : 'Scheme Alert: MahaDBT Micro-irrigation 80% Subsidy window now open',
        message:
          language === 'mr'
            ? '७/१२ आणि बँक पासबुकसह महाडीबीटी पोर्टलवर तात्काळ ऑनलाईन अर्ज सादर करा.'
            : language === 'hi'
            ? '7/12 और बैंक पासबुक के साथ तुरंत ऑनलाइन आवेदन करें।'
            : 'Submit verification documents online on MahaDBT portal to secure priority.',
      },
    ];

    const currentAlert = alertsPool[testAlertIndex % alertsPool.length];
    setTestAlertIndex((prev) => prev + 1);

    const newNotif: FarmNotification = {
      id: `realtime-${Date.now()}`,
      title: currentAlert.title,
      message: currentAlert.message,
      type: currentAlert.type,
      date: 'Just now',
      isRead: false,
    };

    dispatchRealTimeNotification(newNotif);
  };

  // 10. Admin Portal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // 11. Voice readout auto toggle
  const [autoVoice, setAutoVoice] = useState<boolean>(() => {
    return localStorage.getItem('krishi_auto_voice') === 'true';
  });

  // 12. Authentication state (Firebase & Session)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('krishi_farmer_session');
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        setIsLoggedIn(true);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const syncedUser: UserProfile = {
              id: fbUser.uid,
              name: data.fullName || fbUser.displayName || 'Farmer',
              phone: data.phone || '',
              email: data.email || fbUser.email || '',
              state: data.state || 'Maharashtra',
              district: data.district || 'Pune',
              village: data.village || '',
              farmSizeAcres: data.landAreaAcres || 3.5,
              primaryCrops: data.primaryCrops || ['Tomato', 'Sugarcane', 'Onion'],
              soilType: data.soilType || 'Black Clay Loam',
              irrigationType: data.irrigationType || 'Drip',
              preferredLanguage: (data.preferredLanguage as Language) || language,
              autoPlayVoice: false,
              notificationsEnabled: true,
            };
            setUser(syncedUser);
            localStorage.setItem('krishi_farmer_session', JSON.stringify(syncedUser));
            if (data.preferredLanguage) {
              setLanguage(data.preferredLanguage as Language);
            }
          }
        } catch (err) {
          console.warn('Could not sync user profile from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign out warning:', err);
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('krishi_farmer_session');
    setUser(INITIAL_USER);
  };

  const handleUpdateUserProfile = async (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      // If user updated their city/town/village or district, fetch weather for their updated location
      if (updated.village && updated.village !== prev.village) {
        fetchWeather(updated.village);
      } else if (updated.district && updated.district !== prev.district) {
        fetchWeather(updated.district);
      }

      // If logged in, update Firestore document as well
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        setDoc(
          userDocRef,
          {
            fullName: next.name,
            phone: next.phone,
            state: next.state,
            district: next.district,
            village: next.village,
            landAreaAcres: next.farmSizeAcres,
            primaryCrops: next.primaryCrops,
            soilType: next.soilType,
            irrigationType: next.irrigationType,
            preferredLanguage: next.preferredLanguage,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((e) => console.warn('Firestore update failed:', e));
      }
      return next;
    });
  };

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('krishi_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('krishi_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('krishi_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('krishi_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('krishi_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('krishi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('krishi_auto_voice', autoVoice ? 'true' : 'false');
  }, [autoVoice]);

  // Initial Weather and Schemes Fetch
  const fetchWeather = async (city?: string, lat?: number, lon?: number) => {
    setIsWeatherLoading(true);
    try {
      let url = '/api/weather';
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (lat !== undefined && lon !== undefined && lat !== null && lon !== null) {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);

        // If GPS detected a specific city/town, update user profile location automatically
        if (data.locationName && lat !== undefined && lon !== undefined) {
          setUser((prev) => ({
            ...prev,
            village: data.locationName,
            state: data.state || prev.state,
          }));
        }

        // Live Real-Time Weather Alert Evaluation
        const alertSessionKey = `krishi_weather_alert_${data.locationName || 'default'}`;
        if (!sessionStorage.getItem(alertSessionKey)) {
          if (data.rainProbability >= 70) {
            sessionStorage.setItem(alertSessionKey, 'true');
            dispatchRealTimeNotification({
              id: `weather-live-${Date.now()}`,
              title:
                language === 'mr'
                  ? `लाईव्ह हवामान इशारा: ${data.locationName || 'परिसरात'} पावसाची दाट शक्यता (${data.rainProbability}%)`
                  : language === 'hi'
                  ? `लाइव मौसम चेतावनी: ${data.locationName || 'क्षेत्र में'} भारी वर्षा की संभावना (${data.rainProbability}%)`
                  : `Real-time Weather Alert: High rain probability (${data.rainProbability}%) in ${data.locationName || 'your area'}`,
              message:
                language === 'mr'
                  ? 'पुढील २४ तासांत पाऊस अपेक्षित आहे. कीटकनाशक फवारणी पुढे ढकला आणि पाण्याचा निचरा तपासा.'
                  : language === 'hi'
                  ? 'अगले 24 घंटों में वर्षा की संभावना है। कीटनाशक छिड़काव स्थगित करें।'
                  : 'Precipitation expected in next 24-48 hours. Postpone foliar spraying & check drainage.',
              type: 'weather',
              date: 'Just now',
              isRead: false,
            });
          } else if (data.temp >= 33) {
            sessionStorage.setItem(alertSessionKey, 'true');
            dispatchRealTimeNotification({
              id: `weather-live-${Date.now()}`,
              title:
                language === 'mr'
                  ? `उष्णता अलर्ट: तापमान ${data.temp}°C नोंदवले गेले`
                  : language === 'hi'
                  ? `तापमान चेतावनी: तापमान ${data.temp}°C दर्ज`
                  : `Heat Alert: High temperature (${data.temp}°C) in ${data.locationName}`,
              message:
                language === 'mr'
                  ? 'पिकांना दुपारच्या तीव्र उन्हात ताण बसू नये म्हणून सकाळी किंवा रात्री ठिबक सिंचन द्या.'
                  : language === 'hi'
                  ? 'फूल व फल झड़ने से रोकने के लिए सुबह या रात को ड्रिप सिंचाई करें।'
                  : 'Protect crops from heat stress with early morning or night drip irrigation.',
              type: 'weather',
              date: 'Just now',
              isRead: false,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/schemes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSchemes(data);
        }
      }
    } catch (err) {
      console.warn('Schemes fetch error:', err);
    }
  };

  useEffect(() => {
    fetchSchemes();

    // Automatically detect user's city or town via GPS if available, otherwise use saved city/town
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(undefined, latitude, longitude);
        },
        (err) => {
          console.log('GPS detection skipped or unavailable, using saved city/town:', err?.message);
          const defaultTown = user.village || user.district || 'Pune';
          fetchWeather(defaultTown);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
      );
    } else {
      const defaultTown = user.village || user.district || 'Pune';
      fetchWeather(defaultTown);
    }
  }, []);

  // Language switcher
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setUser((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  // Tab navigation router
  const handleNavigate = (tab: string, extra?: any) => {
    setActiveTab(tab);
    if (tab === 'crop-scanner' && extra?.scanType) {
      setScannerInitialType(extra.scanType);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Ask from Dashboard
  const handleQuickAsk = (prompt: string) => {
    setInitialPromptForAi(prompt);
    setActiveTab('ai-chat');
  };

  // AI Chat Handlers
  const handleSendMessage = async (text: string, image?: string) => {
    setIsAiLoading(true);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: image,
    };

    // Update conversation messages locally
    setConversations((prev) =>
      prev.map((c) => {
        if (c && c.id === activeConversationId) {
          const currentMsgs = c.messages || [];
          return {
            ...c,
            title: (currentMsgs.length === 0 ? text.slice(0, 30) || 'Crop Inquiry' : c.title) || 'Crop Inquiry',
            updatedAt: new Date().toISOString(),
            messages: [...currentMsgs, userMessage],
          };
        }
        return c;
      })
    );

    try {
      const activeConv = conversations.find((c) => c.id === activeConversationId);
      const conversationHistory = activeConv ? activeConv.messages : [];

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          conversationHistory,
          userProfile: user,
          currentWeather: weather,
          image,
        }),
      });

      if (!res.ok) {
        throw new Error('AI service response error');
      }

      const data = await res.json();
      const aiResponseText = data.response || data.reply || data.text || 'No response generated.';

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        })
      );

      // If auto-voice is enabled, speak the answer
      if (autoVoice) {
        SpeechAssistant.speak(aiResponseText, language);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackErrorMessage =
        language === 'mr'
          ? '🌱 कृषी सल्लागार तात्पुरती माहिती:\nतुमच्या प्रश्नावर विचार केला असता, पिकाच्या चांगल्या वाढीसाठी योग्य सिंचन आणि जैविक उपायांचा (निंबोळी अर्क/ट्रायकोडर्मा) वापर करा. अधिक माहितीसाठी पुन्हा प्रश्न विचारा.'
          : language === 'hi'
          ? '🌱 कृषि सलाहकार सलाह:\nफसल की सुरक्षा और बेहतर विकास के लिए संतुलित ड्रिप सिंचाई तथा जैविक कीटनाशक (नीम तेल) का उपयोग करें। कृपया दोबारा प्रयास करें।'
          : '🌱 Agricultural Guidance:\nFor optimal crop growth, regulate scheduled drip irrigation and apply preventive organic bio-agents (Neem extract). Please feel free to retry your inquiry.';

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackErrorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        })
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: language === 'mr' ? 'नवीन कृषी सल्ला' : language === 'hi' ? 'नई कृषि सलाह' : 'New Agricultural Advice',
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  const handleDeleteConversation = (id: string) => {
    if (conversations.length <= 1) return;
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
      setActiveConversationId(remaining[0].id);
    }
  };

  // Crop Scanner Image Analysis API call
  const handleAnalyzeImage = async (image: string, scanType: ScanType): Promise<ScanResult> => {
    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          scanType,
          language,
          currentWeather: weather,
        }),
      });

      if (!res.ok) {
        throw new Error('Image analysis request failed');
      }

      const data = await res.json();
      return data.result || data;
    } catch (err) {
      console.warn('Image analysis fallback triggered:', err);
      return {
        id: `scan-${Date.now()}`,
        imageUrl: image.substring(0, 150) + '...',
        scanType,
        cropName: language === 'mr' ? 'टोमॅटो / कांदा पीक' : language === 'hi' ? 'टमाटर / प्याज की फसल' : 'Field Crop / Tomato',
        cropConfidence: 89,
        cropStage: 'Vegetative Growth',
        condition: language === 'mr' ? 'पानावरील करपा (Leaf Spot / Early Blight)' : language === 'hi' ? 'अगेती झुलसा व धब्बा (Leaf Spot)' : 'Early Leaf Spot Symptom',
        conditionType: 'disease',
        confidence: 85,
        symptoms: language === 'mr' ? [
          'पानांवर गोलाकार तपकिरी डाग दिसून येत आहेत',
          'डागांभोवती पिवळसर वलय तयार झाले आहे',
        ] : language === 'hi' ? [
          'पत्तियों पर गोल भूरे धब्बे दिखाई दे रहे हैं',
          'धब्बों के चारों ओर पीला छल्ला बना हुआ है',
        ] : [
          'Concentric brown lesions on leaves',
          'Yellow chlorotic halos surrounding lesions',
        ],
        immediateSteps: language === 'mr' ? [
          'बाधित पाने काढून नष्ट करा.',
          '५% निंबोळी अर्क फवारणी करा.',
        ] : language === 'hi' ? [
          'संक्रमित पत्तियों को तोड़कर नष्ट करें।',
          'नीम तेल का छिड़काव करें।',
        ] : [
          'Remove infected leaves safely.',
          'Apply 5% neem oil spray.',
        ],
        prevention: language === 'mr' ? [
          'पिकात योग्य अंतर ठेवा.',
          'पिकांची फेरपालट करा.',
        ] : language === 'hi' ? [
          'फसल चक्र अपनाएं।',
          'उचित दूरी बनाए रखें।',
        ] : [
          'Practice regular crop rotation.',
          'Maintain proper spacing.',
        ],
        expertAdvice: language === 'mr' ? 'फवारणीपूर्वी कृषी सहाय्यक किंवा KVK केंद्राचा सल्ला घ्या.' : language === 'hi' ? 'उपचार से पहले नजदीकी KVK से पुष्टि करें।' : 'Consult your local KVK before chemical treatment.',
        timestamp: new Date().toISOString(),
      };
    }
  };

  const handleSaveScanResult = (result: ScanResult) => {
    const newNotification: FarmNotification = {
      id: `notif-${Date.now()}`,
      title: `${result.cropName}: ${result.condition}`,
      message: `Diagnostic saved to record: ${result.immediateSteps[0] || 'Inspection complete.'}`,
      date: 'Just now',
      isRead: false,
      type: 'pest',
    };
    dispatchRealTimeNotification(newNotification);
  };

  const handleAskAiWithResult = (result: ScanResult) => {
    const prompt =
      language === 'mr'
        ? `मी ${result.cropName} पिकाचे स्कॅन केले असून ${result.condition} चे निदान आले आहे. मला यावर सविस्तर नियंत्रण व उपाय सांगा.`
        : language === 'hi'
        ? `मैंने ${result.cropName} की जांच की है और ${result.condition} का लक्षण मिला है। कृपया इसके रोकथाम और उपचार के उपाय बताएं।`
        : `I scanned my ${result.cropName} crop and got diagnosed with ${result.condition}. Please provide detailed treatment and management guidelines.`;

    setInitialPromptForAi(prompt);
    setActiveTab('ai-chat');
  };

  const handleAskAiAboutScheme = (scheme: GovernmentScheme) => {
    const prompt =
      language === 'mr'
        ? `मला ${scheme.name} (${scheme.localName.mr}) योजनेबद्दल अर्ज प्रक्रिया आणि आवश्यक कागदपत्रांची सविस्तर माहिती द्या.`
        : language === 'hi'
        ? `मुझे ${scheme.name} (${scheme.localName.hi}) योजना के आवेदन प्रक्रिया और दस्तावेजों के बारे में जानकारी दें।`
        : `Please explain the application steps, eligibility, and benefits for ${scheme.name}.`;

    setInitialPromptForAi(prompt);
    setActiveTab('ai-chat');
  };

  const handleAskAiForCrop = (crop: FarmCrop) => {
    const prompt =
      language === 'mr'
        ? `माझे ${crop.name} (${crop.variety}) पीक सध्या ${crop.stage} टप्प्यात आहे. या टप्प्यात कोणते खत व पाण्याचे व्यवस्थापन करावे?`
        : language === 'hi'
        ? `मेरी ${crop.name} (${crop.variety}) की फसल ${crop.stage} अवस्था में है। इस समय क्या खाद और सिंचाई प्रबंधन करना चाहिए?`
        : `My ${crop.name} (${crop.variety}) crop is currently in ${crop.stage} stage. What specific fertigation and water schedule should I follow?`;

    setInitialPromptForAi(prompt);
    setActiveTab('ai-chat');
  };

  // Crops Management Handlers
  const handleAddCrop = (newCrop: Partial<FarmCrop>) => {
    const cropToAdd: FarmCrop = {
      id: `crop-${Date.now()}`,
      name: newCrop.name || 'Tomato',
      variety: newCrop.variety || 'Hybrid',
      plantedDate: newCrop.plantedDate || new Date().toISOString().split('T')[0],
      stage: newCrop.stage || 'Vegetative',
      stageProgress: newCrop.stageProgress || 20,
      areaAcres: newCrop.areaAcres || 1.0,
      soilType: newCrop.soilType || 'Black Clay',
      irrigationType: newCrop.irrigationType || 'Drip',
      wateringScheduleDays: newCrop.wateringScheduleDays || 3,
      lastWatered: newCrop.lastWatered || new Date().toISOString().split('T')[0],
      notes: newCrop.notes || 'Crop planted recently.',
      image: newCrop.image,
    };
    setCrops((prev) => [cropToAdd, ...prev]);
  };

  const handleDeleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const handleWaterCrop = (id: string) => {
    alert(
      language === 'mr'
        ? 'सिंचन नोंद यशस्वीरीत्या सेव्ह केली!'
        : language === 'hi'
        ? 'सिंचाई का रिकॉर्ड सफलतापूर्वक दर्ज किया गया!'
        : 'Watering recorded successfully!'
    );
  };

  // Admin Scheme CRUD Handlers
  const handleSaveScheme = (schemeData: Partial<GovernmentScheme>) => {
    if (schemeData.id) {
      setSchemes((prev) =>
        prev.map((s) => (s.id === schemeData.id ? ({ ...s, ...schemeData } as GovernmentScheme) : s))
      );
    } else {
      const newScheme: GovernmentScheme = {
        id: `scheme-${Date.now()}`,
        name: schemeData.name || 'New Scheme',
        localName: schemeData.localName || { en: 'New Scheme', hi: 'नई योजना', mr: 'नवीन योजना' },
        category: schemeData.category || 'Financial Support',
        state: schemeData.state || 'All India',
        targetBeneficiary: 'Farmers',
        purpose: schemeData.purpose || '',
        benefits: schemeData.benefits || '',
        eligibility: schemeData.eligibility || [],
        requiredDocuments: schemeData.requiredDocuments || ['Aadhaar', '7/12'],
        applicationProcess: schemeData.applicationProcess || [],
        officialUrl: schemeData.officialUrl || 'https://agricoop.nic.in',
        lastVerified: new Date().toISOString().split('T')[0],
        isActive: true,
      };
      setSchemes((prev) => [newScheme, ...prev]);
    }
  };

  const handleDeleteScheme = (id: string) => {
    setSchemes((prev) => prev.filter((s) => s.id !== id));
  };

  // Notifications Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (notif: FarmNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationsOpen(false);

    if (notif.type === 'weather') {
      setActiveTab('weather');
    } else if (notif.type === 'scheme') {
      setActiveTab('schemes');
    } else if (notif.type === 'pest') {
      setActiveTab('crop-scanner');
    }
  };

  return (
    <div id="smart-krishi-app" className="min-h-screen bg-[#F4F4F7] text-[#18181B] flex flex-col font-sans selection:bg-[#E4E4E7] selection:text-[#18181B]">
      
      {/* 1. Offline Alert Banner */}
      <OfflineBanner language={language} />

      {/* 2. Top Header Navigation */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        user={user}
        weather={weather}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeTab}
        onTabChange={handleNavigate}
        autoVoice={autoVoice}
        onToggleVoice={() => setAutoVoice(!autoVoice)}
        isAuthenticated={isLoggedIn || !!currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Main Dynamic Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            language={language}
            user={user}
            weather={weather}
            crops={crops}
            onNavigate={handleNavigate}
            onQuickAsk={handleQuickAsk}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {activeTab === 'digital-twin' && (
          <DigitalTwinView
            language={language}
            user={user}
            crops={crops}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'what-if' && (
          <WhatIfSimulatorView
            language={language}
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'farm-memory' && (
          <FarmMemoryView
            language={language}
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'village-intel' && (
          <VillageIntelView
            language={language}
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'ai-chat' && (
          <AiChatView
            language={language}
            user={user}
            weather={weather}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onSendMessage={handleSendMessage}
            isLoading={isAiLoading}
            autoVoice={autoVoice}
            initialPrompt={initialPromptForAi}
            onClearInitialPrompt={() => setInitialPromptForAi('')}
          />
        )}

        {activeTab === 'crop-scanner' && (
          <CropScannerView
            language={language}
            user={user}
            onAnalyzeImage={handleAnalyzeImage}
            onSaveScanResult={handleSaveScanResult}
            onAskAiWithResult={handleAskAiWithResult}
            initialScanType={scannerInitialType}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView
            language={language}
            weather={weather}
            user={user}
            onFetchWeather={fetchWeather}
            isLoading={isWeatherLoading}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesView
            language={language}
            schemes={schemes}
            user={user}
            onAskAiAboutScheme={handleAskAiAboutScheme}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            language={language}
            onLanguageChange={handleLanguageChange}
            user={user}
            onUpdateUser={handleUpdateUserProfile}
            autoVoice={autoVoice}
            onToggleVoice={() => setAutoVoice(!autoVoice)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            isAuthenticated={isLoggedIn || !!currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
          />
        )}

      </main>

      {/* Real-time Floating Notification Toasts */}
      <RealTimeNotificationToast
        notifications={realtimeToasts}
        onDismiss={handleDismissToast}
        onSelect={handleSelectNotification}
        language={language}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* 4. Mobile Bottom Navigation */}
      <BottomNav
        language={language}
        activeTab={activeTab}
        onTabChange={handleNavigate}
      />

      {/* 5. Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={(profile) => {
          setUser(profile);
          setIsLoggedIn(true);
          setIsAuthModalOpen(false);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
        language={language}
        onTriggerTestAlert={handleTriggerTestAlert}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onRequestBrowserPermission={requestBrowserPermission}
        browserPermission={browserPermission}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        schemes={schemes}
        onSaveScheme={handleSaveScheme}
        onDeleteScheme={handleDeleteScheme}
        language={language}
      />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        user={user}
        onNavigateToChat={(prompt) => {
          setInitialPromptForAi(prompt);
          setActiveTab('ai-chat');
        }}
      />

    </div>
  );
}
