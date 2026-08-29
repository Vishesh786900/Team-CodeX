import React, { useState } from 'react';
import {
  CloudSun,
  MapPin,
  Search,
  Droplets,
  Wind,
  Sun,
  Eye,
  Umbrella,
  Compass,
  AlertTriangle,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Language, WeatherData, UserProfile } from '../types';
import { translations } from '../i18n/translations';

interface WeatherViewProps {
  language: Language;
  weather: WeatherData | null;
  user: UserProfile;
  onFetchWeather: (city?: string, lat?: number, lon?: number) => void;
  isLoading: boolean;
}

const POPULAR_AGRICULTURAL_DISTRICTS = [
  'Pune, MH',
  'Nashik, MH',
  'Nagpur, MH',
  'Aurangabad (Chh. Sambhajinagar), MH',
  'Kolhapur, MH',
  'Solapur, MH',
  'Amravati, MH',
  'Latur, MH',
  'Indore, MP',
  'Ludhiana, PB',
  'Karnal, HR',
  'Jaipur, RJ',
  'Varanasi, UP',
  'Guntur, AP',
];

export const WeatherView: React.FC<WeatherViewProps> = ({
  language,
  weather,
  user,
  onFetchWeather,
  isLoading,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [isGpsDetecting, setIsGpsDetecting] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<{ type: 'info' | 'error' | 'success'; message: string } | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setGpsNotification(null);
    onFetchWeather(searchQuery);
    setSearchQuery('');
  };

  const handleUseGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsNotification({
        type: 'error',
        message: language === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये GPS / स्थान सुविधा उपलब्ध नाही. कृपया खालील यादीतून जिल्हा निवडा.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में GPS / स्थान सेवा उपलब्ध नहीं है। कृपया नीचे सूची से जिला चुनें।'
          : 'Geolocation is not supported by your browser. Please select your district from the list.',
      });
      return;
    }

    setIsGpsDetecting(true);
    setGpsNotification({
      type: 'info',
      message: language === 'mr'
        ? 'GPS स्थान शोधत आहे... कृपया ब्राऊझरला परवानगी द्या.'
        : language === 'hi'
        ? 'GPS स्थान खोजा जा रहा है... कृपया ब्राउज़र को अनुमति दें।'
        : 'Detecting GPS coordinates... Please grant location permission if prompted.',
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsDetecting(false);
        const { latitude, longitude } = pos.coords;
        setGpsNotification({
          type: 'success',
          message: language === 'mr'
            ? `स्थान प्राप्त झाले (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)! जवळचे हवामान केंद्र लोड करत आहे...`
            : language === 'hi'
            ? `स्थान मिल गया (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)! नजदीकी मौसम केंद्र लोड हो रहा है...`
            : `GPS detected (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)! Loading nearest microclimate station...`,
        });
        onFetchWeather(undefined, latitude, longitude);
        setTimeout(() => setGpsNotification(null), 4000);
      },
      (err) => {
        setIsGpsDetecting(false);
        console.warn('Geolocation error:', err);
        let errorMsg = '';
        if (err.code === 1) {
          // Permission Denied
          errorMsg = language === 'mr'
            ? 'GPS परवानगी नाकारली गेली आहे. ब्राउझर सेटिंग्जमध्ये लोकेशन चालू करा किंवा खालील जिल्ह्यांवर क्लिक करा.'
            : language === 'hi'
            ? 'GPS अनुमति अस्वीकृत कर दी गई है। कृपया ब्राउज़र सेटिंग्स में लोकेशन ऑन करें या नीचे से जिला चुनें।'
            : 'Location permission was denied. Please allow location access in your browser or select your district below.';
        } else if (err.code === 2) {
          // Position Unavailable
          errorMsg = language === 'mr'
            ? 'GPS सिग्नल मिळू शकला नाही. कृपया खालील यादीतून तुमचा जिल्हा निवडा.'
            : language === 'hi'
            ? 'GPS सिग्नल नहीं मिल सका। कृपया नीचे से अपना जिला चुनें।'
            : 'GPS position unavailable. Please choose your district from the quick buttons below.';
        } else {
          // Timeout or unknown
          errorMsg = language === 'mr'
            ? 'स्थान शोधण्यास जास्त वेळ लागला. जवळचा जिल्हा निवडा.'
            : language === 'hi'
            ? 'स्थान खोजने में समय समाप्त हो गया। कृपया नीचे से जिला चुनें।'
            : 'Location detection timed out. Please select your nearest agricultural district.';
        }

        setGpsNotification({
          type: 'error',
          message: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  if (!weather) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
        <CloudSun className="w-12 h-12 text-emerald-600 mx-auto animate-bounce mb-3" />
        <h3 className="text-base font-bold text-stone-800">Loading Farm Weather...</h3>
      </div>
    );
  }

  return (
    <div id="weather-view-container" className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      
      {/* 1. Top Search & Location Picker Header - Bento Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E4E7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Microclimate Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] flex items-center gap-2">
            <span>{t.weather.title}</span>
          </h1>
          <p className="text-sm text-[#71717A] font-medium mt-1">
            {t.weather.subtitle}
          </p>
        </div>

        {/* Location Search Bar */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district / taluka..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-full bg-[#F4F4F7] border border-[#E4E4E7] text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B]"
            />
          </form>

          <button
            onClick={handleUseGps}
            disabled={isGpsDetecting}
            className={`p-3 rounded-full ${
              isGpsDetecting ? 'bg-emerald-600' : 'bg-[#18181B] hover:bg-black'
            } text-white transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-80`}
            title="Detect My Location via GPS"
          >
            <MapPin className={`w-4 h-4 ${isGpsDetecting ? 'animate-ping text-emerald-200' : ''}`} />
            <span className="hidden sm:inline">
              {isGpsDetecting ? 'Locating...' : 'GPS'}
            </span>
          </button>

          <button
            onClick={() => onFetchWeather(weather.locationName)}
            className="p-3 rounded-full bg-[#F4F4F7] hover:bg-white border border-[#E4E4E7] text-[#18181B] transition-colors shrink-0 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* GPS Status Toast Notification */}
      {gpsNotification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${
            gpsNotification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : gpsNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {gpsNotification.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : gpsNotification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-blue-600" />
            )}
            <span>{gpsNotification.message}</span>
          </div>
          <button
            onClick={() => setGpsNotification(null)}
            className="text-stone-400 hover:text-stone-700 ml-3 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Popular Districts Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[#A1A1AA] font-bold uppercase tracking-wider shrink-0 text-[11px]">Agri Belts:</span>
        {POPULAR_AGRICULTURAL_DISTRICTS.map((district) => (
          <button
            key={district}
            onClick={() => onFetchWeather(district.split(',')[0])}
            className="px-3.5 py-1.5 bg-white hover:bg-[#18181B] hover:text-white border border-[#E4E4E7] rounded-full text-[#71717A] font-semibold whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            {district}
          </button>
        ))}
      </div>

      {/* 2. Core Weather Bento Grid (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bento Tile 1 (Span 2 col): Main Temperature & Sky Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-[32px] border border-[#E4E4E7] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="bg-[#F4F4F7] text-[#18181B] border border-[#E4E4E7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{weather.locationName}</span>
              </span>
              <span className="text-xs text-[#A1A1AA] font-bold uppercase tracking-wider">Live Station</span>
            </div>
            <CloudSun className="w-8 h-8 text-amber-500" />
          </div>

          <div className="my-6">
            <div className="text-6xl sm:text-7xl font-light tracking-tight text-[#18181B]">
              {weather.temp}°
            </div>
            <div className="text-base sm:text-lg font-bold text-[#18181B] mt-1">
              {weather.conditionText}
            </div>
            <p className="text-sm text-[#71717A] font-medium mt-0.5">
              Feels like {weather.feelsLike}°C • Barometric steady
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F4F4F7]">
            <div className="bg-[#F4F4F7] rounded-2xl p-3 text-center">
              <div className="text-[11px] text-[#71717A] font-bold uppercase tracking-wider">{t.weather.windSpeed}</div>
              <div className="text-base font-bold text-[#18181B] mt-0.5">{weather.windSpeedKmH} km/h</div>
            </div>
            <div className="bg-[#F4F4F7] rounded-2xl p-3 text-center">
              <div className="text-[11px] text-[#71717A] font-bold uppercase tracking-wider">Dew Point</div>
              <div className="text-base font-bold text-[#18181B] mt-0.5">{Math.round(weather.temp - 4)}°C</div>
            </div>
            <div className="bg-[#F4F4F7] rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-[#71717A] font-bold uppercase tracking-wider">Evaporation</div>
              <div className="text-base font-bold text-[#18181B] mt-0.5">4.2 mm/d</div>
            </div>
          </div>
        </div>

        {/* Bento Tile 2 (Span 1 col, Dark Bento): Solar Radiation & UV Safety */}
        <div className="col-span-1 bg-[#18181B] rounded-[32px] p-6 sm:p-8 text-white flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
            <span>Solar & UV</span>
            <Sun className="w-5 h-5 text-amber-400" />
          </div>

          <div className="my-4">
            <div className="text-4xl font-bold">{weather.uvIndex}</div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">Moderate Index</div>
            <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
              Safe for foliar spray until 11:30 AM before photosynthetic slowdown.
            </p>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(weather.uvIndex / 11) * 100}%` }} />
          </div>
        </div>

        {/* Bento Tile 3 (Span 1 col, Indigo Bento): Moisture & Rain Probability */}
        <div className="col-span-1 bg-[#EEF2FF] rounded-[32px] border border-[#C7D2FE] p-6 sm:p-8 text-[#18181B] flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start text-xs font-bold uppercase tracking-widest text-[#4338CA]">
            <span>Precipitation</span>
            <Droplets className="w-5 h-5 text-[#4338CA]" />
          </div>

          <div className="my-4">
            <div className="text-4xl font-bold text-[#18181B]">{weather.rainProbability}%</div>
            <div className="text-xs font-bold text-[#4338CA] uppercase tracking-wider mt-1">Rain Probability</div>
            <div className="mt-3 flex justify-between text-xs font-medium text-[#71717A]">
              <span>Relative Humidity</span>
              <span className="font-bold text-[#18181B]">{weather.humidity}%</span>
            </div>
          </div>

          <div className="w-full bg-[#C7D2FE] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4338CA] h-full rounded-full" style={{ width: `${weather.rainProbability}%` }} />
          </div>
        </div>

      </div>

      {/* 3. Actionable Agricultural Weather Advisories Bento Grid */}
      <div className="bg-white rounded-[32px] border border-[#E4E4E7] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Agronomy Logic
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#18181B]">
            {t.weather.farmAdvisoryTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(weather?.agriculturalAdvice || []).map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F4F4F7] rounded-[24px] p-5 sm:p-6 border border-[#E4E4E7] flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4E4E7] flex items-center justify-center text-[#18181B] shrink-0">
                {item.type === 'spraying' ? (
                  <Zap className="w-6 h-6 text-amber-600" />
                ) : item.type === 'irrigation' ? (
                  <Droplets className="w-6 h-6 text-blue-600" />
                ) : item.type === 'rain' ? (
                  <Umbrella className="w-6 h-6 text-teal-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] bg-white px-2.5 py-0.5 rounded-full border border-[#E4E4E7]">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-wider">KVK Standard</span>
                </div>
                <p className="text-xs sm:text-sm text-[#71717A] font-medium mt-2 leading-relaxed">
                  {item.advice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 24-Hour Hourly Timeline Bento Tile */}
      <div className="bg-white rounded-[32px] border border-[#E4E4E7] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#18181B] text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#18181B]" />
              <span>{t.weather.hourlyForecast}</span>
            </h3>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">24-hour meteorological window for farm operations</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] bg-[#F4F4F7] px-3 py-1 rounded-full border border-[#E4E4E7]">
            Live Radar
          </span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          {(weather?.hourly || []).map((hour, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-[#F4F4F7] hover:bg-white p-4 rounded-2xl border border-[#E4E4E7] hover:border-[#18181B] min-w-[88px] transition-all shrink-0 text-center shadow-2xs"
            >
              <span className="text-xs text-[#71717A] font-bold">{hour.time}</span>
              <CloudSun className="w-6 h-6 text-amber-500 my-2.5" />
              <span className="text-base font-bold text-[#18181B]">{hour.temp}°</span>
              <span className="text-[10px] text-[#4338CA] font-bold mt-1 bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                💧 {hour.rainChance}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 7-Day Agricultural Forecast Bento Tile */}
      <div className="bg-white rounded-[32px] border border-[#E4E4E7] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#18181B] text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#18181B]" />
              <span>{t.weather.weeklyForecast}</span>
            </h3>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">7-day agricultural planning & harvest radar</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#DCFCE7]">
            Optimal Sowing Window
          </span>
        </div>

        <div className="divide-y divide-[#E4E4E7]">
          {(weather?.forecast || []).map((day, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F4F4F7] px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3 sm:w-52">
                <div className="w-10 h-10 rounded-xl bg-[#F4F4F7] border border-[#E4E4E7] flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-amber-500 shrink-0" />
                </div>
                <div>
                  <div className="font-bold text-[#18181B] text-sm">{day.day}</div>
                  <div className="text-xs text-[#71717A] font-medium">{day.condition}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-[#18181B] sm:w-40">
                <span className="text-sm">{day.tempMax}°</span>
                <span className="text-[#A1A1AA]">/</span>
                <span className="text-sm text-[#71717A] font-medium">{day.tempMin}°</span>
                <span className="text-[#4338CA] bg-[#EEF2FF] px-2 py-0.5 rounded-full ml-auto">
                  💧 {day.rainChance}%
                </span>
              </div>

              <div className="text-xs text-[#18181B] font-medium bg-[#F4F4F7] px-3.5 py-1.5 rounded-xl border border-[#E4E4E7] sm:max-w-sm">
                💡 {day.advisory}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
