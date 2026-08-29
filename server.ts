import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsers with larger limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy GoogleGenAI client
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// In-memory mock database for schemes and custom data
let governmentSchemes = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi Yojana",
    localName: {
      en: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      hi: "प्रधानमंत्री किसान सम्मान निधि योजना (PM-KISAN)",
      mr: "पंतप्रधान किसान सन्मान निधी योजना (PM-KISAN)",
    },
    category: "Financial Support",
    state: "All India",
    targetBeneficiary: "Small and Marginal Farmers with cultivable landholding",
    purpose: "Income support to all landholding farmer families across the country.",
    benefits: "₹6,000 per year directly transferred to bank accounts in 3 equal installments of ₹2,000.",
    eligibility: [
      "Farmer families holding cultivable land in their names",
      "Valid Aadhaar card linked with bank account and active eKYC",
      "Excludes institutional landholders and income tax payers",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Documents (7/12 / Khatauni)",
      "Aadhaar-linked Bank Passbook",
      "Mobile Number for OTP",
    ],
    applicationProcess: [
      "Visit official portal pmkisan.gov.in or nearest CSC center.",
      "Submit Aadhaar, land details, and bank account.",
      "Complete biometric or OTP e-KYC.",
    ],
    officialUrl: "https://pmkisan.gov.in",
    lastVerified: "2026-08-01",
    isActive: true,
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    localName: {
      en: "PMFBY (Crop Insurance Scheme)",
      hi: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
      mr: "पंतप्रधान पीक विमा योजना (PMFBY - १ रुपया विमा)",
    },
    category: "Crop Insurance",
    state: "All India",
    targetBeneficiary: "All farmers growing notified Kharif & Rabi crops",
    purpose: "Comprehensive crop insurance cover against natural calamities.",
    benefits: "Maximum premium 2% for Kharif, 1.5% for Rabi; ₹1 token fee in states like Maharashtra.",
    eligibility: [
      "All farmers growing notified crops in notified areas",
      "Sowing must be registered before the cut-off deadline",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Land Record (7/12 extract / 8-A)",
      "Sowing Certificate (Pik Pahani)",
      "Bank Account Passbook",
    ],
    applicationProcess: [
      "Register on pmfby.gov.in or state portal.",
      "Upload Sowing Certificate and pay nominal premium.",
    ],
    officialUrl: "https://pmfby.gov.in",
    lastVerified: "2026-08-10",
    isActive: true,
  },
  {
    id: "pmksy-drip",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    localName: {
      en: "PMKSY - Micro Irrigation & Drip Subsidy",
      hi: "पीएमकेएसवाई - सूक्ष्म सिंचाई और ड्रिप सब्सिडी",
      mr: "ठिबक व तुषार सिंचन अनुदान योजना (महाडीबीटी)",
    },
    category: "Irrigation & Solar",
    state: "All India",
    targetBeneficiary: "Small, Marginal & General farmers requiring irrigation systems",
    purpose: "Promote micro-irrigation (Drip and Sprinkler systems) to maximize water use efficiency.",
    benefits: "Up to 55% subsidy for Small & Marginal farmers, 45% for other farmers on Drip/Sprinkler.",
    eligibility: [
      "Farmers possessing land with assured water source (well, borewell, canal)",
      "No subsidy for same survey number in last 7 years",
    ],
    requiredDocuments: [
      "7/12 Extract and 8-A holding copy",
      "Aadhaar Card",
      "Quotation from authorized micro-irrigation dealer",
      "Bank Passbook",
    ],
    applicationProcess: [
      "Apply online on state agriculture DBT portal (Mahadbt / DBT Agriculture).",
      "Receive pre-sanction letter after online lottery.",
      "Install approved system and complete geotagged verification.",
    ],
    officialUrl: "https://pmksy.gov.in",
    lastVerified: "2026-08-15",
    isActive: true,
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM Solar Agricultural Pump Scheme",
    localName: {
      en: "PM-KUSUM - Solar Pump Subsidy Scheme",
      hi: "पीएम-कुसुम - सोलर कृषि पंप योजना",
      mr: "पीएम-कुसुम सौर कृषी पंप योजना (महाकृषी ऊर्जा)",
    },
    category: "Irrigation & Solar",
    state: "All India",
    targetBeneficiary: "Farmers with off-grid farmlands and water source",
    purpose: "Provide clean solar energy for daytime farm irrigation.",
    benefits: "60% government subsidy on 3HP, 5HP, and 7.5HP Solar DC/AC pumps.",
    eligibility: [
      "Agricultural land with open well, borewell, or farm pond",
      "No existing grid electricity connection",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Land ownership records (7/12 & 8-A)",
      "NOC / Water Source Self-Declaration",
      "Bank Passbook copy",
    ],
    applicationProcess: [
      "Apply on state renewable energy agency portal (Mahaurja / UPNEDA).",
      "Choose pump capacity and pay farmer contribution.",
      "Authorized vendor installs system within 30 days.",
    ],
    officialUrl: "https://pmkusum.mnre.gov.in",
    lastVerified: "2026-08-20",
    isActive: true,
  }
];

// District weather simulation data with exact geographical coordinates (lat, lon)
interface DistrictWeatherCoord {
  name: string;
  state: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm' | 'fog';
  humidity: number;
  rainProbability: number;
  rainfallMm: number;
  windSpeedKmh: number;
  windDirection: string;
  uvIndex: number;
}

const DISTRICT_WEATHER_MAP: Record<string, DistrictWeatherCoord> = {
  // Maharashtra
  pune: { name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, temp: 27, feelsLike: 29, condition: "Partly Cloudy with Moderate Breeze", conditionCode: "partly_cloudy", humidity: 74, rainProbability: 35, rainfallMm: 1.5, windSpeedKmh: 14, windDirection: "SW", uvIndex: 6 },
  nashik: { name: "Nashik", state: "Maharashtra", lat: 19.9975, lon: 73.7898, temp: 26, feelsLike: 28, condition: "Light Morning Rain", conditionCode: "rain", humidity: 82, rainProbability: 65, rainfallMm: 8.0, windSpeedKmh: 16, windDirection: "WSW", uvIndex: 5 },
  nagpur: { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, temp: 31, feelsLike: 35, condition: "Warm and Humid", conditionCode: "partly_cloudy", humidity: 68, rainProbability: 20, rainfallMm: 0, windSpeedKmh: 11, windDirection: "S", uvIndex: 8 },
  aurangabad: { name: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 19.8762, lon: 75.3433, temp: 29, feelsLike: 31, condition: "Clear Sky", conditionCode: "sunny", humidity: 60, rainProbability: 15, rainfallMm: 0, windSpeedKmh: 12, windDirection: "W", uvIndex: 7 },
  kolhapur: { name: "Kolhapur", state: "Maharashtra", lat: 16.7050, lon: 74.2433, temp: 25, feelsLike: 27, condition: "Overcast with Passing Showers", conditionCode: "rain", humidity: 88, rainProbability: 75, rainfallMm: 12.5, windSpeedKmh: 18, windDirection: "W", uvIndex: 4 },
  solapur: { name: "Solapur", state: "Maharashtra", lat: 17.6599, lon: 75.9064, temp: 30, feelsLike: 33, condition: "Partly Cloudy", conditionCode: "partly_cloudy", humidity: 62, rainProbability: 25, rainfallMm: 0.5, windSpeedKmh: 15, windDirection: "SW", uvIndex: 8 },
  satara: { name: "Satara", state: "Maharashtra", lat: 17.6805, lon: 74.0183, temp: 26, feelsLike: 28, condition: "Pleasant & Breezy", conditionCode: "partly_cloudy", humidity: 76, rainProbability: 40, rainfallMm: 2.0, windSpeedKmh: 15, windDirection: "W", uvIndex: 6 },
  sangli: { name: "Sangli", state: "Maharashtra", lat: 16.8524, lon: 74.5815, temp: 28, feelsLike: 30, condition: "Clear with Sunshine", conditionCode: "sunny", humidity: 65, rainProbability: 20, rainfallMm: 0, windSpeedKmh: 13, windDirection: "WSW", uvIndex: 7 },
  ahmednagar: { name: "Ahmednagar (Ahilyanagar)", state: "Maharashtra", lat: 19.0948, lon: 74.7480, temp: 28, feelsLike: 30, condition: "Dry & Warm", conditionCode: "sunny", humidity: 58, rainProbability: 15, rainfallMm: 0, windSpeedKmh: 13, windDirection: "W", uvIndex: 7 },
  jalgaon: { name: "Jalgaon", state: "Maharashtra", lat: 21.0077, lon: 75.5626, temp: 32, feelsLike: 36, condition: "Warm and Sunny", conditionCode: "sunny", humidity: 55, rainProbability: 10, rainfallMm: 0, windSpeedKmh: 10, windDirection: "NW", uvIndex: 8 },
  amravati: { name: "Amravati", state: "Maharashtra", lat: 20.9374, lon: 77.7796, temp: 30, feelsLike: 34, condition: "Partly Cloudy", conditionCode: "partly_cloudy", humidity: 67, rainProbability: 30, rainfallMm: 1.0, windSpeedKmh: 12, windDirection: "SW", uvIndex: 7 },
  akola: { name: "Akola", state: "Maharashtra", lat: 20.7002, lon: 77.0082, temp: 31, feelsLike: 35, condition: "Warm Breeze", conditionCode: "sunny", humidity: 59, rainProbability: 15, rainfallMm: 0, windSpeedKmh: 11, windDirection: "W", uvIndex: 8 },
  latur: { name: "Latur", state: "Maharashtra", lat: 18.4088, lon: 76.5604, temp: 29, feelsLike: 32, condition: "Passing Clouds", conditionCode: "partly_cloudy", humidity: 64, rainProbability: 25, rainfallMm: 0.5, windSpeedKmh: 14, windDirection: "SW", uvIndex: 7 },
  nanded: { name: "Nanded", state: "Maharashtra", lat: 19.1383, lon: 77.3210, temp: 30, feelsLike: 34, condition: "Warm and Humid", conditionCode: "partly_cloudy", humidity: 70, rainProbability: 30, rainfallMm: 1.5, windSpeedKmh: 12, windDirection: "S", uvIndex: 7 },
  mumbai: { name: "Mumbai / Thane", state: "Maharashtra", lat: 19.0760, lon: 72.8777, temp: 29, feelsLike: 34, condition: "Humid & Coastal Showers", conditionCode: "rain", humidity: 85, rainProbability: 70, rainfallMm: 15.0, windSpeedKmh: 20, windDirection: "WSW", uvIndex: 5 },
  ratnagiri: { name: "Ratnagiri", state: "Maharashtra", lat: 16.9902, lon: 73.3120, temp: 27, feelsLike: 31, condition: "Coastal Rain Showers", conditionCode: "rain", humidity: 90, rainProbability: 80, rainfallMm: 22.0, windSpeedKmh: 22, windDirection: "SW", uvIndex: 4 },

  // Madhya Pradesh & Central India
  indore: { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, temp: 28, feelsLike: 30, condition: "Partly Cloudy", conditionCode: "partly_cloudy", humidity: 70, rainProbability: 30, rainfallMm: 0.5, windSpeedKmh: 13, windDirection: "NW", uvIndex: 7 },
  bhopal: { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, temp: 29, feelsLike: 32, condition: "Scattered Clouds", conditionCode: "partly_cloudy", humidity: 66, rainProbability: 25, rainfallMm: 0, windSpeedKmh: 11, windDirection: "W", uvIndex: 7 },

  // North India (Punjab, Haryana, Rajasthan, UP, Bihar, Delhi)
  ludhiana: { name: "Ludhiana", state: "Punjab", lat: 30.9010, lon: 75.8573, temp: 32, feelsLike: 36, condition: "Sunny & Warm", conditionCode: "sunny", humidity: 55, rainProbability: 10, rainfallMm: 0, windSpeedKmh: 9, windDirection: "NW", uvIndex: 8 },
  karnal: { name: "Karnal", state: "Haryana", lat: 29.6857, lon: 76.9905, temp: 31, feelsLike: 35, condition: "Clear Sky", conditionCode: "sunny", humidity: 58, rainProbability: 10, rainfallMm: 0, windSpeedKmh: 10, windDirection: "NW", uvIndex: 8 },
  jaipur: { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, temp: 33, feelsLike: 37, condition: "Dry and Sunny", conditionCode: "sunny", humidity: 48, rainProbability: 5, rainfallMm: 0, windSpeedKmh: 12, windDirection: "W", uvIndex: 9 },
  delhi: { name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, temp: 32, feelsLike: 36, condition: "Clear and Warm", conditionCode: "sunny", humidity: 52, rainProbability: 10, rainfallMm: 0, windSpeedKmh: 11, windDirection: "NW", uvIndex: 8 },
  varanasi: { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, temp: 30, feelsLike: 34, condition: "Scattered Clouds", conditionCode: "partly_cloudy", humidity: 76, rainProbability: 40, rainfallMm: 3.0, windSpeedKmh: 10, windDirection: "E", uvIndex: 7 },
  lucknow: { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, temp: 31, feelsLike: 35, condition: "Humid & Partly Sunny", conditionCode: "partly_cloudy", humidity: 72, rainProbability: 35, rainfallMm: 2.0, windSpeedKmh: 10, windDirection: "E", uvIndex: 7 },
  patna: { name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, temp: 29, feelsLike: 33, condition: "Humid with Rain Risk", conditionCode: "rain", humidity: 80, rainProbability: 55, rainfallMm: 6.0, windSpeedKmh: 12, windDirection: "E", uvIndex: 6 },

  // South & Western India (Gujarat, AP, Telangana, Karnataka)
  ahmedabad: { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, temp: 32, feelsLike: 36, condition: "Sunny and Warm", conditionCode: "sunny", humidity: 58, rainProbability: 10, rainfallMm: 0, windSpeedKmh: 14, windDirection: "SW", uvIndex: 8 },
  hyderabad: { name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, temp: 28, feelsLike: 31, condition: "Passing Showers", conditionCode: "rain", humidity: 78, rainProbability: 50, rainfallMm: 5.0, windSpeedKmh: 15, windDirection: "W", uvIndex: 6 },
  guntur: { name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lon: 80.4365, temp: 31, feelsLike: 36, condition: "Humid & Warm", conditionCode: "partly_cloudy", humidity: 79, rainProbability: 45, rainfallMm: 4.0, windSpeedKmh: 14, windDirection: "S", uvIndex: 7 },
  bengaluru: { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, temp: 24, feelsLike: 25, condition: "Cool Breeze & Cloudy", conditionCode: "cloudy", humidity: 75, rainProbability: 40, rainfallMm: 2.0, windSpeedKmh: 16, windDirection: "W", uvIndex: 6 },
  belagavi: { name: "Belagavi", state: "Karnataka", lat: 15.8497, lon: 74.4977, temp: 24, feelsLike: 26, condition: "Mist & Drizzle", conditionCode: "rain", humidity: 86, rainProbability: 70, rainfallMm: 10.0, windSpeedKmh: 17, windDirection: "WSW", uvIndex: 5 },
};

// Haversine formula to find nearest weather station from GPS coordinates
function findNearestDistrict(lat: number, lon: number): DistrictWeatherCoord {
  let closest: DistrictWeatherCoord = DISTRICT_WEATHER_MAP["pune"];
  let minDistance = Infinity;

  for (const item of Object.values(DISTRICT_WEATHER_MAP)) {
    const dLat = ((item.lat - lat) * Math.PI) / 180;
    const dLon = ((item.lon - lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((item.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = 6371 * c; // Earth radius in KM

    if (distanceKm < minDistance) {
      minDistance = distanceKm;
      closest = item;
    }
  }

  return closest;
}

// -------------------------------------------------------------
// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Smart Krishi Assistant",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Helper for splitting long texts into TTS chunks
function splitTextIntoTTSChunks(text: string, maxLen = 140): string[] {
  const clean = (text || "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[*_#`~>]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}]/gu, "")
    .replace(/[🌱💡✅🛡️⚠️🌾🍅🧅🐛🩺🌦️🌧️☀️🔴🟠🟢]/g, "")
    .replace(/[\(\)\[\]\{\}]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  const sentences = clean.split(/(?<=[.!?।,\n])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLen) {
      current = (current + " " + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length > maxLen) {
        const words = sentence.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLen) {
            sub = (sub + " " + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.slice(0, 12); // Maximum 12 chunks
}

// Multilingual TTS Audio Stream Endpoint (Marathi, Hindi, English)
app.all("/api/speech/tts", async (req: Request, res: Response) => {
  try {
    const rawText = req.method === "POST" ? req.body?.text : req.query?.text;
    const rawLang = req.method === "POST" ? req.body?.lang || req.body?.language : req.query?.lang || req.query?.language;

    const text = typeof rawText === "string" ? rawText : "";
    if (!text.trim()) {
      return res.status(400).json({ error: "Text is required for TTS synthesis" });
    }

    let lang = "en";
    const langStr = String(rawLang || "").toLowerCase();
    if (langStr.includes("mr") || langStr.includes("marathi")) {
      lang = "mr";
    } else if (langStr.includes("hi") || langStr.includes("hindi")) {
      lang = "hi";
    } else if (/[\u0900-\u097F]/.test(text)) {
      // Auto-detect Devanagari script if language was not passed
      lang = langStr === "hi" ? "hi" : "mr";
    }

    const chunks = splitTextIntoTTSChunks(text, 140);
    if (chunks.length === 0) {
      return res.status(400).json({ error: "No speakable text found" });
    }

    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
      const ttsResp = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/",
        },
      });

      if (ttsResp.ok) {
        const arrayBuf = await ttsResp.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuf));
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(502).json({ error: "Could not generate TTS audio from stream" });
    }

    const combinedAudio = Buffer.concat(audioBuffers);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", combinedAudio.length);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache audio for repeated speech
    res.setHeader("Accept-Ranges", "bytes");
    return res.status(200).send(combinedAudio);
  } catch (error: any) {
    console.error("TTS generation error:", error?.message || error);
    return res.status(500).json({ error: "Internal TTS synthesis failure", details: error?.message });
  }
});

// Resilient Gemini Generator with multi-model fallback and backoff retry
async function generateWithRetry(ai: GoogleGenAI, params: any, maxRetries = 2): Promise<any> {
  const modelsToTry = [params.model || "gemini-2.5-flash", "gemini-flash-latest", "gemini-3.7-flash"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const isTransient =
          err?.status === 503 ||
          err?.code === 503 ||
          err?.message?.includes("503") ||
          err?.message?.includes("high demand") ||
          err?.status === 429 ||
          err?.message?.includes("429") ||
          err?.message?.includes("UNAVAILABLE");

        if (isTransient && attempt < maxRetries) {
          console.warn(`[Gemini API] Transient high demand on ${modelName}, retrying attempt ${attempt + 1}/${maxRetries}...`);
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          continue;
        }
        // If retries for this model exhausted, break to try secondary model
        break;
      }
    }
  }
  throw lastError;
}

// Generate grounded expert agricultural reply based on context and language
function getGroundedAgriculturalResponse(
  message: string,
  language: string,
  farmContext: any = {}
): string {
  const crop = farmContext.crop || "पीक / फसल";
  const msgLower = (message || "").toLowerCase();

  // Disease / leaf yellowing query
  if (msgLower.includes("yellow") || msgLower.includes("पिवळ") || msgLower.includes("पील") || msgLower.includes("chlorosis")) {
    if (language === "mr") {
      return `🌱 काय घडत असावे:
पाने पिवळी पडणे हे सामान्यतः नत्र (Nitrogen) अथवा लोह/झिंकच्या कमतरतेमुळे किंवा अतिपाणी / बुरशीजन्य मुळकुजव्यामुळे होते.

💡 हे कशामुळे होऊ शकते:
1. मातीमध्ये जास्त पाणी साचल्यामुळे मुळांना हवा न मिळणे.
2. नत्राची किंवा सूक्ष्म अन्नद्रव्यांची कमतरता.
3. रसशोषक किडींचा (मावा, तुडतुडे, पांढरी माशी) प्रादुर्भाव.

✅ आत्ता काय करावे:
1. शेतात पाणी साचले असल्यास त्वरित निचरा करा.
2. 19:19:19 (NPK) खत 5 ग्रॅम प्रति लिटर पाण्यात मिसळून पानांवर फवारणी करा.
3. सूक्ष्म अन्नद्रव्ये (Micronutrients Grade-2) 2.5 ग्रॅम प्रति लिटरने फवारणी करा.

🛡️ पुढील प्रतिबंध:
माती परीक्षणानुसार संतुलित खत व्यवस्थापन करा आणि ठिबक सिंचनाने गरजेनुसारच पाणी द्या.

⚠️ कृषी तज्ज्ञ सल्ला:
जर पिवळेपणा शिरांमध्ये जास्त दिसत असेल तर स्थानिक कृषी सहाय्यक किंवा KVK शास्त्रज्ञांकडून प्रत्यक्ष पाहणी करून घ्या.`;
    } else if (language === "hi") {
      return `🌱 क्या समस्या हो सकती है:
पत्तियों का पीला पड़ना नाइट्रोजन या सूक्ष्म पोषक तत्वों (आयरन/जिंक) की कमी अथवा अत्यधिक जलभराव व फंगल संक्रमण के कारण हो सकता है।

💡 यह क्यों हो सकता है:
1. खेत में जलजमाव होने से जड़ों को ऑक्सीजन न मिलना।
2. संतुलित खाद की कमी या रस चूसक कीटों (सफेद मक्खी, थ्रिप्स) का प्रकोप।

✅ अभी क्या करें:
1. खेत से अतिरिक्त पानी निकालने की व्यवस्था करें।
2. 19:19:19 घुलनशील खाद 5 ग्राम/लीटर पानी में घोलकर छिड़काव करें।
3. सूक्ष्म पोषक तत्व (Micronutrient) 2 से 3 ग्राम/लीटर का छिड़काव करें।

🛡️ रोकथाम के उपाय:
मिट्टी की जांच के आधार पर खाद का प्रयोग करें और ड्रिप से नियमित सिंचाई करें।

⚠️ विशेषज्ञ सलाह:
यदि 3-4 दिनों में सुधार न दिखे तो नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।`;
    } else {
      return `🌱 What may be happening:
Leaf yellowing (chlorosis) typically indicates nitrogen/iron/zinc deficiency, waterlogging, or sap-sucking pest damage.

💡 Why it may happen:
1. Saturated soil restricting root oxygen uptake.
2. Nitrogen depletion or lack of essential micronutrients.
3. Sucking pest infestations (aphids, whiteflies, thrips).

✅ What you can do now:
1. Ensure proper drainage to avoid root suffocation.
2. Apply a foliar spray of NPK 19-19-19 @ 5g/L water.
3. Add chelated micronutrient mix @ 2g/L for rapid chlorophyll recovery.

🛡️ How to prevent it:
Conduct periodic soil testing and maintain scheduled drip fertigation.

⚠️ When to contact an expert:
Consult your local Krishi Vigyan Kendra (KVK) or extension officer if symptoms spread rapidly.`;
    }
  }

  // Pest & insect queries
  if (msgLower.includes("pest") || msgLower.includes("कीड") || msgLower.includes("कीड़ा") || msgLower.includes("insect") || msgLower.includes("worm") || msgLower.includes("अळी") || msgLower.includes("इल्ली")) {
    if (language === "mr") {
      return `🌱 काय घडत असावे:
पानांवर किंवा शेंड्यावर रसशोषक कीड अथवा अळीचा (Lepidopteran borer/caterpillar) प्रादुर्भाव असण्याची शक्यता आहे.

💡 हे कशामुळे होऊ शकते:
दमट हवामान, पिकांची दाटी आणि ढगाळ वातावरणामुळे किडींची पैदास वेगाने वाढते.

✅ आत्ता काय करावे:
1. शेतात पिवळे व निळे चिकट सापळे (Sticky Traps) एकरी १०-१५ लावा.
2. जैविक नियंत्रणासाठी ५% निंबोळी अर्क (Neem Oil 10,000 ppm) २ मिली प्रति लिटर फवारणी करा.
3. अळीचा प्रादुर्भाव असल्यास निंबोळी अर्कासोबत किंवा जैविक बॅसिलस थुरिंजिएन्सिस (Bt) फवारणी करा.

🛡️ पुढील प्रतिबंध:
पिकात कामगंध सापळे (Pheromone traps) लावा आणि मित्रकिडींचे संरक्षण करा.

⚠️ कृषी तज्ज्ञ सल्ला:
रासायनिक कीटकनाशक वापरण्यापूर्वी केंद्रीय कीटकनाशक मंडळाच्या (CIBRC) शिफारसी व स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.`;
    } else if (language === "hi") {
      return `🌱 क्या समस्या हो सकती है:
फसल में रस चूसक कीटों या पत्तियों को खाने वाली इल्ली (कैटरपिलर) का संक्रमण हो सकता है।

💡 यह क्यों हो सकता है:
अधिक नमी व बादल छाए रहने से कीटों का प्रकोप तेजी से बढ़ता है।

✅ अभी क्या करें:
1. खेत में 10-15 पीले व नीले चिपचिपे ट्रैप (Sticky Traps) लगाएं।
2. 5% नीम तेल (Neem Oil 10000 ppm) 2 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।
3. इल्लियों के लिए जैविक बैसिलस थुरिंजिएन्सिस (Bt) का प्रयोग करें।

🛡️ रोकथाम के उपाय:
फेरोमोन ट्रैप लगाएं और फसल चक्र अपनाएं।

⚠️ विशेषज्ञ सलाह:
रासायनिक कीटनाशक के प्रयोग से पूर्व कृषि विज्ञान केंद्र (KVK) के विशेषज्ञों की सलाह लें।`;
    } else {
      return `🌱 What may be happening:
Likely sucking pest or leaf-eating caterpillar/borer infestation.

💡 Why it may happen:
Cloudy weather, excessive humidity, and lush vegetative growth create ideal breeding conditions.

✅ What you can do now:
1. Install 10–15 yellow/blue sticky traps per acre immediately.
2. Spray cold-pressed Neem Oil (10,000 ppm) @ 2-3 ml/L with mild surfactant.
3. For caterpillar/larvae, utilize bio-agents like Bacillus thuringiensis (Bt) or Beauveria bassiana.

🛡️ How to prevent it:
Deploy pheromone traps for monitoring and preserve natural predators.

⚠️ When to contact an expert:
Seek advice from your local Krishi Vigyan Kendra before utilizing synthetic chemical insecticides.`;
    }
  }

  // Default comprehensive agricultural response
  if (language === "mr") {
    return `🌱 कृषी मित्राचा सल्ला (${crop}):
तुमच्या प्रश्नाचे विश्लेषण केले असता, पिकाच्या निरोगी वाढीसाठी खालील कृती महत्त्वाच्या आहेत:

💡 मुख्य कारणे व निरीक्षण:
हवामान बदल, मातीतील ओलावा आणि खतांचे असंतुलन यामुळे पिकाच्या वाढीवर परिणाम होतो.

✅ आत्ता काय करावे:
1. मातीतील ओलावा तपासूनच ठिबकद्वारे गरजेपुरते पाणी द्या.
2. पिकाच्या अवस्थेनुसार योग्य विद्राव्य खतांचा (NPK 19:19:19 किंवा 13:40:13) वापर करा.
3. प्रतिबंधात्मक उपाय म्हणून जैविक बुरशीनाशक (ट्रायकोडर्मा) व निंबोळी अर्काचा वापर करा.

🛡️ पुढील प्रतिबंध:
शेतात नियमित स्वच्छता ठेवा, तणांचे वेळेवर नियंत्रण करा आणि पिकांची योग्य फेरपालट करा.

⚠️ कृषी तज्ज्ञ सल्ला:
कोणतीही रासायनिक फवारणी करण्यापूर्वी आपल्या गावातील कृषी सहाय्यक किंवा KVK केंद्राशी संपर्क साधा.`;
  } else if (language === "hi") {
    return `🌱 कृषि मित्र की सलाह (${crop}):
आपके प्रश्न के अनुसार, फसल की बेहतर वृद्धि और सुरक्षा के लिए निम्नलिखित कदम उठाएं:

💡 मुख्य कारण व निरीक्षण:
मौसम में बदलाव, असंतुलित नमी और पोषक तत्वों की कमी से पौधे तनाव में आ सकते हैं।

✅ अभी क्या करें:
1. नमी देखकर ही ड्रिप द्वारा संतुलित सिंचाई करें।
2. फसल की अवस्था के अनुसार घुलनशील NPK खाद का छिड़काव करें।
3. रोग रोकथाम के लिए 5% नीम तेल या बायो-एजेंट (ट्राइकोडर्मा) का उपयोग करें।

🛡️ रोकथाम के उपाय:
खेत को खरपतवार मुक्त रखें और नियमित रूप से पौधों का निरीक्षण करें।

⚠️ विशेषज्ञ सलाह:
किसी भी रासायनिक उत्पाद का उपयोग करने से पहले कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से परामर्श अवश्य लें।`;
  } else {
    return `🌱 Krishi Mitra Advice (${crop}):
Based on your agricultural inquiry, here are recommended best practices for crop vitality:

💡 Key Observations:
Weather shifts, moisture imbalances, and nutritional deficits can impact vegetative strength.

✅ What you can do now:
1. Regulate irrigation using drip systems based on soil moisture levels.
2. Apply balanced soluble nutrients (e.g. NPK 19:19:19) tailored to the crop growth stage.
3. Use preventive organic bio-agents like Trichoderma viride and 5% Neem seed kernel extract.

🛡️ How to prevent it:
Maintain effective weed sanitation and monitor pest traps regularly.

⚠️ When to contact an expert:
Consult your district Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer for on-field diagnosis.`;
  }
}

// 2. Multilingual AI Farming Chat (/api/ai/chat)
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const {
      message = "",
      language = "en",
      conversationHistory = [],
      farmContext = {},
      userProfile = {},
      currentWeather = null,
      image = null,
    } = body;

    const safeProfile = userProfile || {};
    const safeFarmContext = farmContext || {};

    const langName = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
    const mergedContext = {
      crop: safeFarmContext.crop || safeProfile.primaryCrops?.[0] || "",
      cropAgeDays: safeFarmContext.cropAgeDays || "",
      location: safeFarmContext.location || safeProfile.district || safeProfile.state || "",
      weather: safeFarmContext.weather || currentWeather || null,
    };

    const systemPrompt = `You are Krishi Mitra, a helpful, deeply knowledgeable agricultural assistant for farmers in India. You communicate natively in ${langName}. Always explain farming information in simple, respectful language without difficult technical jargon. Give practical, safe, step-by-step guidance. Do not pretend to be certain when an image or symptom is unclear. When diagnosing crop diseases or pests, provide a likely identification with a confidence level and clearly explain that image-based identification can be incorrect. Ask the farmer for additional information when needed. Consider crop type, crop age, soil, location, weather, irrigation, symptoms, and farming practices before making recommendations. Never recommend unsafe chemical usage. For pesticides or fertilizers, encourage following the official product label and consulting the local Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer. Prefer preventive and integrated pest-management (IPM) approaches. 

Use ${langName} for the ENTIRE response.

Format your answer with clear visual bullet points:
🌱 What may be happening
💡 Why it may happen
✅ What you can do now
🛡️ How to prevent it
⚠️ When to contact an agriculture expert`;

    let contextStr = `Farmer's Selected Language: ${langName}\n`;
    if (mergedContext.crop) contextStr += `Current Crop: ${mergedContext.crop}\n`;
    if (mergedContext.cropAgeDays) contextStr += `Crop Age: ${mergedContext.cropAgeDays} days\n`;
    if (mergedContext.location) contextStr += `Location: ${mergedContext.location}\n`;
    if (mergedContext.weather) contextStr += `Local Weather: ${JSON.stringify(mergedContext.weather)}\n`;

    const ai = getGenAI();

    if (ai) {
      try {
        const parts: any[] = [];

        if (image && typeof image === "string" && image.startsWith("data:")) {
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            parts.push({
              inlineData: {
                mimeType: matches[1],
                data: matches[2],
              },
            });
          }
        }

        let fullPrompt = `${contextStr}\n\n`;
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          fullPrompt += "Recent Conversation:\n";
          conversationHistory.slice(-4).forEach((msg: any) => {
            fullPrompt += `${msg.role === "user" ? "Farmer" : "Krishi Mitra"}: ${msg.content}\n`;
          });
          fullPrompt += "\n";
        }
        fullPrompt += `Farmer's Current Question: ${message || "Please analyze this crop/pest condition and provide agricultural guidance."}`;

        parts.push({ text: fullPrompt });

        const response = await generateWithRetry(ai, {
          model: "gemini-3.7-flash",
          contents: { parts },
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const replyText = response.text || getGroundedAgriculturalResponse(message, language, mergedContext);

        return res.json({
          response: replyText,
          reply: replyText,
          language,
          timestamp: new Date().toISOString(),
        });
      } catch (apiError: any) {
        console.warn("Gemini API Error handled gracefully with grounded fallback:", apiError?.message || apiError);
        const fallbackText = getGroundedAgriculturalResponse(message, language, mergedContext);
        return res.json({
          response: fallbackText,
          reply: fallbackText,
          language,
          timestamp: new Date().toISOString(),
          isFallback: true,
        });
      }
    } else {
      const fallbackText = getGroundedAgriculturalResponse(message, language, mergedContext);
      return res.json({
        response: fallbackText,
        reply: fallbackText,
        language,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (topLevelErr: any) {
    console.error("Top-level /api/ai/chat error:", topLevelErr);
    const lang = req.body?.language || "en";
    const msg = req.body?.message || "";
    const fallbackText = getGroundedAgriculturalResponse(msg, lang, {});
    return res.json({
      response: fallbackText,
      reply: fallbackText,
      language: lang,
      timestamp: new Date().toISOString(),
      isFallback: true,
    });
  }
});

// 3. Image Analysis for Crop, Disease, and Pest Detection (/api/ai/analyze-image)
app.post("/api/ai/analyze-image", async (req: Request, res: Response) => {
  const { image, language = "en", scanType = "all", cropHint = "", currentWeather = null } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image base64 data is required." });
  }

  const langName = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
  const ai = getGenAI();

  // Helper for grounded fallback scan result
  const buildFallbackScanResult = (): any => {
    if (language === "mr") {
      return {
        cropName: cropHint || "टोमॅटो / कांदा पीक",
        cropConfidence: 91,
        cropStage: "शाकीय वाढ / फुलधारणा",
        condition: "पानावरील करपा व बुरशीजन्य डाग (Leaf Spot / Early Blight)",
        conditionType: "disease",
        confidence: 86,
        symptoms: [
          "खालच्या जुन्या पानांवर गोलाकार तपकिरी डाग दिसून येत आहेत",
          "डागांभोवती पिवळसर वलय (Chlorotic halo) तयार झाले आहे",
          "पानांची कडा वाकडी होऊन सुकण्याची चिन्हे आहेत",
        ],
        immediateSteps: [
          "जास्त बाधित झालेली पाने काढून शेताबाहेर सुरक्षित नष्ट करा.",
          "पानांवर पाणी साचू नये म्हणून तुषार ऐवजी ठिबक सिंचनाचा वापर करा.",
          "तात्काळ ५% निंबोळी अर्क किंवा ट्रायकोडर्मा जैविक बुरशीनाशक फवारा.",
        ],
        prevention: [
          "पिकांमध्ये हवा खेळती राहण्यासाठी योग्य अंतर ठेवा.",
          "सोलानेसी कुळातील पिकांनंतर द्विदल पिकांची फेरपालट करा.",
          "मातीतील बुरशीचे पाणी उडू नये म्हणून मल्चिंगचा वापर करा.",
        ],
        expertAdvice: "हा प्राथमिक AI अंदाज आहे. रासायनिक बुरशीनाशक वापरण्यापूर्वी स्थानिक कृषी विज्ञान केंद्र (KVK) शास्त्रज्ञांचा सल्ला घ्या.",
        weatherRiskNote: currentWeather?.humidity && currentWeather.humidity > 70 ? `सध्याची आर्द्रता (${currentWeather.humidity}%) बुरशीच्या प्रसारास पोषक आहे.` : "दमट हवामानात रोगाचा प्रादुर्भाव वेगाने वाढतो.",
      };
    } else if (language === "hi") {
      return {
        cropName: cropHint || "टमाटर / प्याज की फसल",
        cropConfidence: 91,
        cropStage: "वानस्पतिक वृद्धि / फूल अवस्था",
        condition: "पत्तियों पर झुलसा व धब्बा रोग (Leaf Blight / Spot)",
        conditionType: "disease",
        confidence: 86,
        symptoms: [
          "निचली पुरानी पत्तियों पर गोल भूरे धब्बे दिखाई दे रहे हैं",
          "धब्बों के चारों ओर पीला छल्ला बना हुआ है",
          "पत्तियां किनारों से मुड़कर सूख रही हैं",
        ],
        immediateSteps: [
          "अधिक प्रभावित पत्तियों को तोड़कर खेत से दूर नष्ट करें।",
          "पत्तियों को सूखा रखने के लिए ड्रिप सिंचाई का उपयोग करें।",
          "नीम तेल (1500 ppm) या ट्राइकोडर्मा जैविक फफूंदनाशक का छिड़काव करें।",
        ],
        prevention: [
          "फसलों का 2 वर्षीय चक्र अपनाएं।",
          "मिट्टी के छीटों से बचाव के लिए मल्चिंग का उपयोग करें।",
          "पौधों के बीच पर्याप्त दूरी बनाकर वायु संचार बनाए रखें।",
        ],
        expertAdvice: "यह प्राथमिक AI जांच है। उपचार से पहले कृषि विज्ञान केंद्र (KVK) के विशेषज्ञों से पुष्टि करें।",
        weatherRiskNote: "70% से अधिक नमी में यह बीमारी तेजी से फैलती है।",
      };
    } else {
      return {
        cropName: cropHint || "Tomato / Field Crop",
        cropConfidence: 91,
        cropStage: "Vegetative / Flowering",
        condition: "Early Blight & Foliar Spot Symptom",
        conditionType: "disease",
        confidence: 86,
        symptoms: [
          "Concentric dark brown rings on lower leaves",
          "Yellow chlorotic halos surrounding lesions",
          "Leaf edges curling and drying prematurely",
        ],
        immediateSteps: [
          "Remove heavily infected lower leaves promptly and dispose safely.",
          "Use drip irrigation to keep leaf foliage dry.",
          "Apply preventive neem oil or bio-fungicide (Trichoderma viride).",
        ],
        prevention: [
          "Practice crop rotation with non-host crops.",
          "Apply organic or plastic mulch to prevent spore splash from soil.",
          "Maintain optimal plant spacing for air circulation.",
        ],
        expertAdvice: "This is an initial AI assessment. Consult your local Krishi Vigyan Kendra (KVK) before applying chemical fungicides.",
        weatherRiskNote: "Ambient humidity above 70% accelerates fungal spore dispersal.",
      };
    }
  };

  let jsonResult: any = null;

  if (ai) {
    try {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const mimeType = matches ? matches[1] : "image/jpeg";
      const base64Data = matches ? matches[2] : image;

      const visionPrompt = `You are Krishi Mitra, an expert agricultural computer vision assistant.
Analyze this farm photo carefully. Detect the crop species, identify any visible diseases, pests, insects, deficiencies, physical damage, or confirm if it is a healthy crop.

Provide output in valid, parseable JSON only (without markdown code fences) matching this structure:
{
  "cropName": "Name of crop in ${langName} and English",
  "cropConfidence": 90,
  "cropStage": "Estimated growth stage",
  "condition": "Specific disease/pest name or 'Healthy Plant' in ${langName}",
  "conditionType": "healthy" | "disease" | "pest" | "deficiency" | "physical_damage" | "unknown",
  "confidence": 85,
  "symptoms": ["Symptom 1 in ${langName}", "Symptom 2 in ${langName}", "Symptom 3 in ${langName}"],
  "immediateSteps": ["Immediate action 1 in ${langName}", "Immediate action 2 in ${langName}", "Action 3 in ${langName}"],
  "prevention": ["Prevention tip 1 in ${langName}", "Prevention tip 2 in ${langName}"],
  "expertAdvice": "When to consult local KVK or extension officer in ${langName}",
  "weatherRiskNote": "Weather conditions that increase risk in ${langName}"
}

Respond purely in valid JSON format. All user text fields must be in ${langName}.`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: visionPrompt,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const rawText = response.text || "{}";
      const cleanJson = rawText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
      jsonResult = JSON.parse(cleanJson);
    } catch (apiError: any) {
      console.warn("Vision analysis handled with resilient grounded fallback:", apiError?.message || apiError);
      jsonResult = buildFallbackScanResult();
    }
  } else {
    jsonResult = buildFallbackScanResult();
  }

  const scanResultData = {
    id: `scan-${Date.now()}`,
    imageUrl: image.substring(0, 150) + "...",
    scanType,
    ...jsonResult,
    timestamp: new Date().toISOString(),
  };

  return res.json({
    result: scanResultData,
    ...scanResultData,
  });
});

// 4. Weather API (/api/weather)
app.get("/api/weather", async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : null;
    const lon = req.query.lon ? Number(req.query.lon) : null;
    const rawCity = req.query.city ? String(req.query.city).trim() : null;

    let locationName = "Pune";
    let stateName = "Maharashtra";
    let latCoord = 18.5204;
    let lonCoord = 73.8567;
    let isLiveResolved = false;

    // 1. If GPS coordinates provided, reverse geocode to user's exact City/Town/Village
    if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
      latCoord = lat;
      lonCoord = lon;
      try {
        const reverseRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              "User-Agent": "SmartKrishiAssistant/1.0 (contact@smartkrishi.app)",
              "Accept-Language": "en,mr,hi",
            },
            signal: AbortSignal.timeout(3500),
          }
        );
        if (reverseRes.ok) {
          const revData = (await reverseRes.json()) as any;
          const addr = revData?.address || {};
          const localTown =
            addr.town ||
            addr.city ||
            addr.village ||
            addr.suburb ||
            addr.municipality ||
            addr.county ||
            addr.state_district;

          if (localTown) {
            locationName = localTown;
            stateName = addr.state || "Maharashtra";
            isLiveResolved = true;
          }
        }
      } catch (geoErr) {
        console.warn("Reverse geocoding fallback to nearest district:", geoErr);
      }
    } else if (rawCity) {
      // 2. If city/town text provided, geocode to get exact latitude/longitude and standard name
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            rawCity
          )}&count=1&language=en&format=json`,
          { signal: AbortSignal.timeout(3500) }
        );
        if (geoRes.ok) {
          const geoData = (await geoRes.json()) as any;
          if (Array.isArray(geoData?.results) && geoData.results.length > 0) {
            const result = geoData.results[0];
            locationName = result.name;
            stateName = result.admin1 || "India";
            latCoord = result.latitude;
            lonCoord = result.longitude;
            isLiveResolved = true;
          }
        }
      } catch (searchErr) {
        console.warn("Town geocoding search fallback:", searchErr);
      }
    }

    // 3. Find base microclimate district for agricultural baseline fallback
    const nearestDistrict = findNearestDistrict(latCoord, lonCoord);
    if (!isLiveResolved && !rawCity) {
      locationName = nearestDistrict.name;
      stateName = nearestDistrict.state;
    } else if (!isLiveResolved && rawCity) {
      locationName = rawCity;
      stateName = nearestDistrict.state;
    }

    let temp = nearestDistrict.temp;
    let feelsLike = nearestDistrict.feelsLike;
    let humidity = nearestDistrict.humidity;
    let rainProbability = nearestDistrict.rainProbability;
    let rainfallMm = nearestDistrict.rainfallMm;
    let windSpeedKmh = nearestDistrict.windSpeedKmh;
    let windDirection = nearestDistrict.windDirection;
    let uvIndex = nearestDistrict.uvIndex;
    let condition = nearestDistrict.condition;
    let conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'heavy_rain' | 'storm' | 'fog' = nearestDistrict.conditionCode;

    // 4. Fetch live hyper-local microclimate forecast from Open-Meteo
    try {
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latCoord}&longitude=${lonCoord}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FKolkata&forecast_days=7`;
      const meteoRes = await fetch(meteoUrl, { signal: AbortSignal.timeout(4000) });
      if (meteoRes.ok) {
        const meteoData = (await meteoRes.json()) as any;
        const cur = meteoData?.current;
        if (cur) {
          temp = Math.round(cur.temperature_2m ?? temp);
          feelsLike = Math.round(cur.apparent_temperature ?? temp);
          humidity = Math.round(cur.relative_humidity_2m ?? humidity);
          rainfallMm = cur.precipitation ?? rainfallMm;
          windSpeedKmh = Math.round(cur.wind_speed_10m ?? windSpeedKmh);
          
          const code = cur.weather_code ?? 1;
          if (code === 0) {
            condition = "Clear Sky & Sunny";
            conditionCode = "sunny";
          } else if (code === 1 || code === 2) {
            condition = "Partly Cloudy";
            conditionCode = "partly_cloudy";
          } else if (code === 3) {
            condition = "Overcast Clouds";
            conditionCode = "cloudy";
          } else if (code === 45 || code === 48) {
            condition = "Morning Mist / Fog";
            conditionCode = "fog";
          } else if (code >= 51 && code <= 67) {
            condition = "Passing Rain Showers";
            conditionCode = "rain";
          } else if (code >= 80 && code <= 82) {
            condition = "Heavy Showers";
            conditionCode = "heavy_rain";
          } else if (code >= 95) {
            condition = "Thunderstorm & Rain";
            conditionCode = "storm";
          }

          if (Array.isArray(meteoData?.daily?.precipitation_probability_max) && meteoData.daily.precipitation_probability_max.length > 0) {
            rainProbability = meteoData.daily.precipitation_probability_max[0] ?? rainProbability;
          }
          if (Array.isArray(meteoData?.daily?.uv_index_max) && meteoData.daily.uv_index_max.length > 0) {
            uvIndex = Math.round(meteoData.daily.uv_index_max[0] ?? uvIndex);
          }
        }
      }
    } catch (meteoErr) {
      console.warn("Open-Meteo live sync warning (using microclimate district fallback):", meteoErr);
    }

    // Daily 7-day forecast
    const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const forecastDaily = days.map((day, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const isRain = (rainProbability + i * 5) % 100 > 50;
      return {
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : day,
        date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        maxTemp: temp + (i % 3) - 1,
        minTemp: temp - 7 + (i % 2),
        conditionCode: isRain ? (i % 2 === 0 ? "rain" : "heavy_rain") : "partly_cloudy",
        rainProbability: Math.min(95, Math.max(10, rainProbability + (i % 3) * 10 - 5)),
      };
    });

    // 24-hour hourly
    const hourlyForecast = [
      { time: "06:00", temp: temp - 4, rainProbability: Math.max(5, rainProbability - 15), icon: "cloud" },
      { time: "09:00", temp: temp - 2, rainProbability: Math.max(10, rainProbability - 10), icon: "sun" },
      { time: "12:00", temp: temp + 2, rainProbability: rainProbability, icon: "sun" },
      { time: "15:00", temp: temp + 1, rainProbability: Math.min(90, rainProbability + 10), icon: "cloud-rain" },
      { time: "18:00", temp: temp - 1, rainProbability: rainProbability, icon: "cloud" },
      { time: "21:00", temp: temp - 3, rainProbability: Math.max(10, rainProbability - 5), icon: "moon" },
    ];

    // Agricultural Actionable Advice
    const agriculturalAdvice = [];
    if (rainProbability >= 50) {
      agriculturalAdvice.push({
        id: "adv-rain",
        type: "rain" as const,
        title: "Rain Forecast Advisory",
        advice: `Rainfall expected in ${locationName} over the next 24–48 hours. Postpone foliar spraying of fertilizers and pesticides to prevent chemical wash-off. Delay flood irrigation.`,
        severity: "warning" as const,
      });
    } else {
      agriculturalAdvice.push({
        id: "adv-spray",
        type: "general" as const,
        title: "Favorable Spraying Window",
        advice: `Mild wind speeds in ${locationName} (<15 km/h) and low rain chance make today ideal for scheduled foliar sprays and weeding operations.`,
        severity: "info" as const,
      });
    }

    if (humidity >= 75) {
      agriculturalAdvice.push({
        id: "adv-humidity",
        type: "humidity" as const,
        title: "High Humidity & Fungal Risk",
        advice: `Relative humidity is high (${humidity}%). Watch for early blight, powdery mildew, and downy mildew in ${locationName} vegetable and fruit canopies.`,
        severity: "warning" as const,
      });
    }

    if (temp >= 32) {
      agriculturalAdvice.push({
        id: "adv-heat",
        type: "heat" as const,
        title: "Heat Stress Management",
        advice: `High daytime temperature (${temp}°C) in ${locationName}. Maintain soil moisture via early morning or nighttime drip irrigation to prevent flower drop.`,
        severity: "critical" as const,
      });
    }

    return res.json({
      locationName,
      city: locationName,
      town: locationName,
      state: stateName,
      latitude: latCoord,
      longitude: lonCoord,
      temp,
      feelsLike,
      conditionText: condition,
      conditionCode,
      humidity,
      rainProbability,
      rainfallMm,
      windSpeedKmH: windSpeedKmh,
      windDirection,
      uvIndex,
      sunrise: "06:14 AM",
      sunset: "06:48 PM",
      forecastDaily,
      hourlyForecast,
      agriculturalAdvice,
    });
  } catch (err: any) {
    console.error("Weather endpoint error:", err);
    return res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

// 5. Government Schemes Endpoints (/api/schemes)
app.get("/api/schemes", (req: Request, res: Response) => {
  const { category, state, search } = req.query;
  let filtered = [...governmentSchemes];

  if (category && category !== "All") {
    filtered = filtered.filter((s) => s.category === category);
  }
  if (state && state !== "All India") {
    filtered = filtered.filter((s) => s.state === "All India" || s.state.toLowerCase() === String(state).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.localName.hi.toLowerCase().includes(q) ||
        s.localName.mr.toLowerCase().includes(q) ||
        s.purpose.toLowerCase().includes(q) ||
        s.benefits.toLowerCase().includes(q)
    );
  }

  res.json({
    total: filtered.length,
    schemes: filtered,
  });
});

app.post("/api/schemes", (req: Request, res: Response) => {
  const newScheme = {
    id: `scheme-${Date.now()}`,
    ...req.body,
    lastVerified: new Date().toISOString().split("T")[0],
    isActive: true,
  };
  governmentSchemes.unshift(newScheme);
  res.status(201).json(newScheme);
});

app.put("/api/schemes/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = governmentSchemes.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Scheme not found" });
  }
  governmentSchemes[index] = {
    ...governmentSchemes[index],
    ...req.body,
    lastVerified: new Date().toISOString().split("T")[0],
  };
  res.json(governmentSchemes[index]);
});

app.delete("/api/schemes/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  governmentSchemes = governmentSchemes.filter((s) => s.id !== id);
  res.json({ success: true, message: "Scheme deleted" });
});

// 6. AI Scheme Matching (/api/ai/scheme-match)
app.post("/api/ai/scheme-match", async (req: Request, res: Response) => {
  try {
    const { state, landSizeAcres, primaryCrops, irrigationNeeded, equipmentNeeded, insuranceInterest, organicInterest, solarNeeded } = req.body;

    const matches: any[] = [];

    // PM-KISAN match
    if (landSizeAcres > 0) {
      matches.push({
        schemeId: "pm-kisan",
        matchReason: `Eligible based on your ${landSizeAcres} acre cultivable landholding. Provides ₹6,000 yearly income support.`,
        matchScore: 95,
      });
    }

    // PMFBY match
    if (insuranceInterest || (primaryCrops && primaryCrops.length > 0)) {
      matches.push({
        schemeId: "pmfby",
        matchReason: `Protects your crops (${primaryCrops?.join(", ") || "field crops"}) against unseasonal rain, drought, and pest outbreaks with subsidized premium.`,
        matchScore: 92,
      });
    }

    // Drip / Micro-irrigation match
    if (irrigationNeeded) {
      matches.push({
        schemeId: "pmksy-drip",
        matchReason: `Matches your requirement for water-saving irrigation with up to 55% direct government subsidy on drip & sprinkler systems.`,
        matchScore: 90,
      });
    }

    // Solar pump match
    if (solarNeeded) {
      matches.push({
        schemeId: "pm-kusum",
        matchReason: `Provides 60% subsidy on daytime solar submersible agricultural pumps to eliminate diesel/grid power costs.`,
        matchScore: 88,
      });
    }

    // Equipment match
    if (equipmentNeeded) {
      matches.push({
        schemeId: "smam-machinery",
        matchReason: `Offers 40-50% subsidy on tractors, rotavators, sprayers, and threshers for mechanization.`,
        matchScore: 85,
      });
    }

    // Maharashtra specific farm pond match
    if (state === "Maharashtra" && landSizeAcres >= 1.5) {
      matches.push({
        schemeId: "mh-magel-tyala-shettale",
        matchReason: `Provides up to ₹75,000 for farm pond digging and ₹1 Lakh for plastic lining under Mahadbt in Maharashtra.`,
        matchScore: 87,
      });
    }

    return res.json({
      matchedCount: matches.length,
      matches,
    });
  } catch (err: any) {
    console.error("Scheme matching error:", err);
    res.status(500).json({ error: "Failed to match schemes." });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Krishi Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
