export type Language = 'en' | 'hi' | 'mr';

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  preferredLanguage: Language;
  state: string;
  district: string;
  village: string;
  farmSizeAcres: number;
  soilType: string;
  irrigationType: string;
  primaryCrops: string[];
  autoPlayVoice: boolean;
  notificationsEnabled: boolean;
}

export type ScanType = 'crop' | 'disease' | 'pest' | 'all';

export interface ScanResult {
  id: string;
  imageUrl: string;
  scanType: ScanType;
  cropName: string;
  cropConfidence: number;
  cropStage?: string;
  condition: string; // e.g. "Early Blight", "Whitefly Infestation", "Healthy Plant"
  conditionType: 'healthy' | 'disease' | 'pest' | 'deficiency' | 'physical_damage' | 'unknown';
  confidence: number;
  symptoms: string[];
  immediateSteps: string[];
  prevention: string[];
  expertAdvice: string;
  weatherRiskNote?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  scanResult?: ScanResult;
  timestamp: string;
  feedback?: 'up' | 'down' | null;
}

export interface Conversation {
  id: string;
  title: string;
  language: Language;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface FarmCrop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  areaAcres: number;
  soilType: string;
  irrigationType: string;
  stage: 'Germination' | 'Early Growth' | 'Vegetative' | 'Flowering' | 'Reproductive / Fruiting' | 'Maturity / Harvest';
  stageProgress: number; // 0 to 100
  notes?: string;
  wateringScheduleDays: number;
  lastWatered?: string;
  image?: string;
}

export interface WeatherData {
  locationName: string;
  state: string;
  temp: number;
  feelsLike: number;
  conditionText: string;
  conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm' | 'fog';
  humidity: number;
  rainProbability: number;
  rainfallMm: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecastDaily: Array<{
    day: string;
    date: string;
    maxTemp: number;
    minTemp: number;
    conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm';
    rainProbability: number;
  }>;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    rainProbability: number;
    icon: string;
  }>;
  agriculturalAdvice: Array<{
    id: string;
    type: 'rain' | 'heat' | 'humidity' | 'wind' | 'general';
    title: string;
    advice: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  localName: {
    en: string;
    hi: string;
    mr: string;
  };
  category: 'Financial Support' | 'Crop Insurance' | 'Irrigation & Solar' | 'Equipment & Drones' | 'Organic Farming' | 'Credit & Loans' | 'Seeds & Inputs' | 'Horticulture';
  state: string; // "All India" or specific state like "Maharashtra"
  targetBeneficiary: string;
  purpose: string;
  benefits: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  officialUrl: string;
  lastVerified: string;
  isActive: boolean;
  whyItMatches?: string;
  potentialEligibility?: string;
  nextAction?: string;
}

export interface SchemeMatchQuestionnaire {
  state: string;
  landSizeAcres: number;
  primaryCrops: string[];
  irrigationNeeded: boolean;
  equipmentNeeded: boolean;
  insuranceInterest: boolean;
  organicInterest: boolean;
  solarNeeded: boolean;
}

export interface FarmNotification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'pest' | 'scheme' | 'crop';
  date: string;
  isRead: boolean;
  linkTab?: string;
}

export interface TodayAction {
  id: string;
  title: string;
  titleLocal?: {
    en: string;
    hi: string;
    mr: string;
  };
  why: string;
  whyLocal?: {
    en: string;
    hi: string;
    mr: string;
  };
  priority: 'high' | 'medium' | 'low';
  confidence: 'High' | 'Medium' | 'Low' | string;
  confidencePercent: number;
  time: string;
  category: 'drainage' | 'pest' | 'irrigation' | 'fertilizer' | 'general';
  isCompleted?: boolean;
}

export interface WhatIfScenario {
  id: string;
  title: string;
  titleLocal: {
    en: string;
    hi: string;
    mr: string;
  };
  iconName: string;
  description: string;
  possibleImpact: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  affectedFactors: string[];
  recommendedAction: string;
  confidence: string;
  confidenceScore: number;
  assumptions: string[];
}

export interface FarmMemoryLog {
  id: string;
  date: string;
  title: string;
  type: 'weather' | 'action' | 'observation' | 'input';
  details: string;
  impactOnAi: string;
}

export interface VillageInsight {
  id: string;
  title: string;
  metric: string;
  changeText: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  advisory: string;
}

export interface LinkSafetyCheck {
  url: string;
  status: 'safe' | 'suspicious' | 'invalid';
  isOfficialGov: boolean;
  hasHttps: boolean;
  domain: string;
  reasons: string[];
  warningNote?: string;
}
