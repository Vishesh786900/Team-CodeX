import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Stethoscope,
  RefreshCw,
  Bookmark,
  MessageSquare,
  Share2,
  ChevronRight,
  ShieldAlert,
  Info,
  X,
  Volume2,
} from 'lucide-react';
import { Language, ScanResult, ScanType, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_SCAN_CASES } from '../data/cropKnowledge';
import { SpeechAssistant } from '../utils/speech';

interface CropScannerViewProps {
  language: Language;
  user: UserProfile;
  onAnalyzeImage: (image: string, scanType: ScanType) => Promise<ScanResult>;
  onSaveScanResult: (result: ScanResult) => void;
  onAskAiWithResult: (result: ScanResult) => void;
  initialScanType?: ScanType;
}

export const CropScannerView: React.FC<CropScannerViewProps> = ({
  language,
  user,
  onAnalyzeImage,
  onSaveScanResult,
  onAskAiWithResult,
  initialScanType = 'all',
}) => {
  const t = translations[language];

  const [scanType, setScanType] = useState<ScanType>(initialScanType);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Analysis steps text sequence
  const analysisSteps = [
    t.cropScanner.analyzingSteps.step1,
    t.cropScanner.analyzingSteps.step2,
    t.cropScanner.analyzingSteps.step3,
    t.cropScanner.analyzingSteps.step4,
    t.cropScanner.analyzingSteps.step5,
  ];

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert(
        language === 'mr'
          ? 'कॅमेरा सुरू करण्यात अडचण आली. कृपया फोटो अपलोड पर्याय वापरा.'
          : language === 'hi'
          ? 'कैमरा शुरू करने में समस्या हुई। कृपया फोटो अपलोड विकल्प का उपयोग करें।'
          : 'Could not access camera. Please use file upload.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setSelectedImage(dataUrl);
      triggerAnalysis(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      triggerAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = (sample: (typeof SAMPLE_SCAN_CASES)[0]) => {
    setSelectedImage(sample.imageUrl);
    setActiveResult(sample.result);
    setIsSaved(false);
  };

  const triggerAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setActiveResult(null);
    setIsSaved(false);
    setCurrentStepIndex(0);

    // Realistic step cycling animation
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const result = await onAnalyzeImage(imageData, scanType);
      clearInterval(interval);
      setActiveResult(result);
    } catch (error) {
      clearInterval(interval);
      console.error('Scan error:', error);
      alert(t.common.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!activeResult) return;
    onSaveScanResult(activeResult);
    setIsSaved(true);
  };

  const [isSpeakingResult, setIsSpeakingResult] = useState(false);

  const handleVoiceListen = () => {
    if (!activeResult) return;
    if (isSpeakingResult) {
      SpeechAssistant.stop();
      setIsSpeakingResult(false);
      return;
    }

    let readout = '';
    if (language === 'mr') {
      readout = `पिक: ${activeResult.cropName}. निदान: ${activeResult.condition}. विश्वासार्हता: ${activeResult.cropConfidence} टक्के. तातडीचे उपाय: ${activeResult.immediateSteps.join('. ')}. तज्ज्ञ सल्ला: ${activeResult.expertAdvice}`;
    } else if (language === 'hi') {
      readout = `फसल: ${activeResult.cropName}. निदान: ${activeResult.condition}. विश्वसनीयता: ${activeResult.cropConfidence} प्रतिशत. तुरंत करने योग्य उपाय: ${activeResult.immediateSteps.join('. ')}. विशेषज्ञ सलाह: ${activeResult.expertAdvice}`;
    } else {
      readout = `Crop: ${activeResult.cropName}. Diagnosis: ${activeResult.condition}. Confidence: ${activeResult.cropConfidence} percent. Immediate action steps: ${activeResult.immediateSteps.join('. ')}. Expert advice: ${activeResult.expertAdvice}`;
    }

    setIsSpeakingResult(true);
    SpeechAssistant.speak(
      readout,
      language,
      () => setIsSpeakingResult(false),
      () => setIsSpeakingResult(false)
    );
  };

  return (
    <div id="crop-scanner-container" className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      
      {/* 1. Header Banner - Bento Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E4E7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Gemini Vision AI Sentinel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">{t.cropScanner.title}</h1>
          <p className="text-sm text-[#71717A] font-medium mt-1 max-w-xl">
            {t.cropScanner.subtitle}
          </p>
        </div>

        {/* Mode Selector Segmented Control */}
        <div className="flex items-center bg-[#F4F4F7] p-1.5 rounded-full border border-[#E4E4E7] self-start sm:self-center">
          <button
            onClick={() => setScanType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              scanType === 'all' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            {language === 'mr' ? 'सर्व तपासणी' : language === 'hi' ? 'पूर्ण जांच' : 'All Scan'}
          </button>
          <button
            onClick={() => setScanType('disease')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              scanType === 'disease' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            {language === 'mr' ? 'रोग' : language === 'hi' ? 'रोग' : 'Disease'}
          </button>
          <button
            onClick={() => setScanType('pest')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              scanType === 'pest' ? 'bg-[#18181B] text-white shadow-xs' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            {language === 'mr' ? 'कीड' : language === 'hi' ? 'कीट' : 'Pest'}
          </button>
        </div>
      </div>

      {/* 2. Upload / Camera Area */}
      {!activeResult && !isAnalyzing && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E4E4E7] shadow-sm space-y-6">
          
          {/* Camera Feed Modal / View */}
          {isCameraActive ? (
            <div className="relative rounded-[28px] overflow-hidden bg-black aspect-video max-w-lg mx-auto flex flex-col items-center justify-center border border-[#18181B]">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-[24px] m-4 pointer-events-none flex items-center justify-center">
                <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-xs font-bold">
                  {t.cropScanner.cameraPrompt}
                </span>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold backdrop-blur-xs"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-white text-[#18181B] hover:bg-[#F4F4F7] rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.cropScanner.captureBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Take Camera Photo Action Bento Tile */}
              <button
                onClick={startCamera}
                className="bg-[#F4F4F7] hover:bg-white border-2 border-dashed border-[#E4E4E7] hover:border-[#18181B] rounded-[28px] p-8 sm:p-10 flex flex-col items-center justify-center text-center group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E4E4E7] group-hover:bg-[#18181B] text-[#18181B] group-hover:text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#18181B] text-lg">{t.cropScanner.takePhoto}</h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-xs font-medium">{t.cropScanner.cameraPrompt}</p>
              </button>

              {/* Upload Image from Device Bento Tile */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#F4F4F7] hover:bg-white border-2 border-dashed border-[#E4E4E7] hover:border-[#18181B] rounded-[28px] p-8 sm:p-10 flex flex-col items-center justify-center text-center group transition-all cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E4E4E7] group-hover:bg-[#18181B] text-[#18181B] group-hover:text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#18181B] text-lg">{t.cropScanner.uploadPhoto}</h3>
                <p className="text-xs text-[#71717A] mt-1 max-w-xs font-medium">{t.cropScanner.dragDropText}</p>
              </div>

            </div>
          )}

          {/* 3. Instant Sample Image Tester Cards */}
          <div className="pt-6 border-t border-[#E4E4E7]">
            <div className="mb-4">
              <h4 className="font-bold text-[#18181B] text-base">{t.cropScanner.samplePhotosTitle}</h4>
              <p className="text-xs text-[#71717A] font-medium">{t.cropScanner.samplePhotosSubtitle}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {(SAMPLE_SCAN_CASES || []).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample)}
                  className="group rounded-2xl border border-[#E4E4E7] hover:border-[#18181B] bg-[#F4F4F7] hover:bg-white overflow-hidden text-left transition-all hover:shadow-xs focus:outline-none p-1.5"
                >
                  <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-[#E4E4E7]">
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#18181B]/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {sample.category}
                    </span>
                  </div>
                  <div className="p-2">
                    <div className="font-bold text-xs text-[#18181B] truncate">
                      {language === 'mr' ? sample.nameMr : language === 'hi' ? sample.nameHi : sample.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. Multi-Stage Animated Analyzing View */}
      {isAnalyzing && (
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E4E4E7] shadow-sm text-center max-w-md mx-auto space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-[#F4F4F7] border-t-[#18181B] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#18181B] animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#18181B] mb-2">Analyzing your crop...</h3>
            <p className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] py-2 px-4 rounded-full border border-[#DCFCE7] min-h-[36px] flex items-center justify-center">
              {analysisSteps[currentStepIndex]}
            </p>
          </div>

          <div className="space-y-2 max-w-xs mx-auto text-xs text-[#A1A1AA]">
            {(analysisSteps || []).map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 transition-opacity ${
                  idx <= currentStepIndex ? 'text-[#18181B] font-bold opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    idx <= currentStepIndex ? 'bg-[#18181B]' : 'bg-[#E4E4E7]'
                  }`}
                />
                <span className="truncate">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Diagnosis Result Bento Grid */}
      {activeResult && !isAnalyzing && (
        <div className="space-y-6">
          
          {/* Main Diagnostic Header Bento */}
          <div className="bg-white rounded-[32px] border border-[#E4E4E7] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-4">
                {activeResult.imageUrl && (
                  <img
                    src={activeResult.imageUrl}
                    alt="Scan"
                    className="w-20 h-20 rounded-[20px] object-cover border border-[#E4E4E7] shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#15803D] px-3 py-0.5 rounded-full border border-[#DCFCE7]">
                      {activeResult.cropName}
                    </span>
                    <span className="text-xs font-bold bg-[#F4F4F7] text-[#71717A] px-2.5 py-0.5 rounded-full">
                      {activeResult.cropConfidence}% {t.common.confidence}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-[#18181B]">
                    {activeResult.condition}
                  </h2>
                </div>
              </div>

              {/* Status Badge & Voice Readout */}
              <div className="flex items-center gap-3 self-start sm:self-center">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    activeResult.conditionType === 'healthy'
                      ? 'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]'
                      : activeResult.conditionType === 'pest'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {activeResult.conditionType === 'healthy' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : activeResult.conditionType === 'pest' ? (
                    <Bug className="w-4 h-4" />
                  ) : (
                    <Stethoscope className="w-4 h-4" />
                  )}
                  <span>
                    {activeResult.conditionType === 'healthy'
                      ? t.cropScanner.healthyBadge
                      : activeResult.conditionType === 'pest'
                      ? t.cropScanner.pestBadge
                      : t.cropScanner.diseaseBadge}
                  </span>
                </span>

                <button
                  onClick={handleVoiceListen}
                  className={`px-3.5 py-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                    isSpeakingResult
                      ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4338CA] animate-pulse shadow-xs'
                      : 'bg-[#F4F4F7] hover:bg-[#18181B] text-[#18181B] hover:text-white border-[#E4E4E7]'
                  }`}
                  title="Listen to diagnosis"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {isSpeakingResult
                      ? language === 'mr'
                        ? 'थांबवा'
                        : language === 'hi'
                        ? 'रोकें'
                        : 'Stop'
                      : language === 'mr'
                      ? 'निदान ऐका (मराठी)'
                      : language === 'hi'
                      ? 'निदान सुनें (हिंदी)'
                      : 'Listen Diagnosis'}
                  </span>
                </button>
              </div>
            </div>

            {/* Bento Grid Diagnostic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              
              {/* Visible Symptoms Bento Tile */}
              <div className="bg-[#F4F4F7] rounded-[24px] p-6 border border-[#E4E4E7]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#18181B]" />
                  <span>{t.cropScanner.symptoms}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#18181B]">
                  {(activeResult.symptoms || []).map((sym, idx) => (
                    <li key={idx} className="bg-white p-3 rounded-xl border border-[#E4E4E7] flex items-start gap-2.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] mt-2 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Action Steps Bento Tile */}
              <div className="bg-[#F0FDF4] rounded-[24px] p-6 border border-[#DCFCE7]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  <span>{t.cropScanner.immediateAction}</span>
                </h4>
                <div className="space-y-2">
                  {(activeResult.immediateSteps || []).map((step, idx) => (
                    <div key={idx} className="bg-white border border-[#DCFCE7] p-3 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-[#18181B] font-medium shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-[#15803D] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Pest Management Tile */}
              <div className="bg-white rounded-[24px] p-6 border border-[#E4E4E7]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#18181B]" />
                  <span>{t.cropScanner.preventionTips}</span>
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-[#71717A]">
                  {(activeResult.prevention || []).map((prev, idx) => (
                    <p key={idx} className="flex items-start gap-2 font-medium">
                      <span className="text-[#18181B] font-bold">•</span>
                      <span>{prev}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* ICAR & KVK Advisory Notes Tile */}
              <div className="bg-[#EEF2FF] border border-[#C7D2FE] p-6 rounded-[24px] flex flex-col justify-between text-xs text-[#18181B]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#4338CA] font-bold uppercase tracking-wider text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.cropScanner.expertNote}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{activeResult.expertAdvice}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C7D2FE]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-[11px] text-[#71717A] italic">
                    Decision-support estimate only • Verify with agricultural extension officer.
                  </p>
                  <button
                    onClick={() =>
                      alert(
                        language === 'mr'
                          ? 'केव्हीके (KVK) वर्धा विस्तार अधिकाऱ्यांना निदान अहवाल व फोटो यशस्वीरीत्या पाठवला आहे. (सिम्युलेशन)'
                          : language === 'hi'
                          ? 'केवीके (KVK) वर्धा कृषि विज्ञान केंद्र को फसल निदान रिपोर्ट सफलतापूर्वक भेजी गई। (सिमुलेशन)'
                          : 'Crop diagnosis report and photos forwarded to Krishi Vigyan Kendra (KVK) Wardha Agronomist Extension Desk. (Simulation)'
                      )
                    }
                    className="px-3 py-1.5 bg-[#4338CA] hover:bg-indigo-900 text-white rounded-full text-[11px] font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    Escalate to Wardha KVK
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 mt-6 border-t border-[#E4E4E7] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isSaved
                      ? 'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]'
                      : 'bg-[#F4F4F7] hover:bg-white text-[#18181B] border border-[#E4E4E7]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSaved ? t.common.success : t.cropScanner.saveResult}</span>
                </button>

                <button
                  onClick={() => onAskAiWithResult(activeResult)}
                  className="px-5 py-2.5 bg-[#18181B] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.cropScanner.askAiAboutThis}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveResult(null);
                  setSelectedImage(null);
                }}
                className="px-5 py-2.5 bg-[#F4F4F7] hover:bg-white text-[#18181B] border border-[#E4E4E7] rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.cropScanner.scanAgain}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
