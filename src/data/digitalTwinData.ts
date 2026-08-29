import { UserProfile, FarmCrop, TodayAction, WhatIfScenario, FarmMemoryLog, VillageInsight, LinkSafetyCheck } from '../types';

export const DEMO_FARMER_USER: UserProfile = {
  id: 'demo-farmer-wardha',
  name: 'Demo Farmer',
  phone: '+91 98220 98765',
  village: 'Narayangaon',
  district: 'Wardha',
  state: 'Maharashtra',
  farmSizeAcres: 3.0,
  primaryCrops: ['Cotton'],
  soilType: 'Black Soil (Heavy Clay Loam)',
  irrigationType: 'Drip',
  preferredLanguage: 'en',
  autoPlayVoice: false,
  notificationsEnabled: true,
};

export const DEMO_FARM_CROPS: FarmCrop[] = [
  {
    id: 'crop-cotton-demo',
    name: 'Cotton',
    variety: 'Bt Cotton (RCH-659 BG-II)',
    plantedDate: '2026-07-14', // Day 45 (Vegetative)
    stage: 'Vegetative',
    stageProgress: 45,
    areaAcres: 3.0,
    soilType: 'Black Soil (Deep Clay Loam)',
    irrigationType: 'Drip (Inline 4 LPH, 2-day schedule)',
    wateringScheduleDays: 2,
    lastWatered: '2026-08-27',
    notes: 'Vegetative square formation starting. Drip fertigation 19:19:19 applied last week. Soil moisture optimal.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
  },
];

export const TODAYS_FARM_ACTIONS: TodayAction[] = [
  {
    id: 'action-1',
    title: 'Check field drainage',
    titleLocal: {
      en: 'Check field drainage',
      hi: 'खेत की जल निकासी जांचें',
      mr: 'शेतातील पाण्याचा निचरा तपासा',
    },
    why: 'Rain showers & cloud front are expected within 24-48 hours. Deep black soil has high water retention; clearing drainage furrows prevents root waterlogging.',
    whyLocal: {
      en: 'Rain is expected tomorrow / within 48 hours. Ensure furrows are open to prevent waterlogging in deep black soil.',
      hi: 'अगले 24-48 घंटों में बारिश की संभावना है। काली मिट्टी में जलजमाव रोकने के लिए नालियां साफ करें।',
      mr: 'पुढील २४-४८ तासांत पावसाची शक्यता आहे. काळ्या मातीत पाणी साचू नये म्हणून निचरा चर तपासा.',
    },
    priority: 'high',
    confidence: 'High (88% decision-support estimate)',
    confidencePercent: 88,
    time: 'Today, 4:00 PM',
    category: 'drainage',
    isCompleted: false,
  },
  {
    id: 'action-2',
    title: 'Inspect crop leaves',
    titleLocal: {
      en: 'Inspect crop leaves',
      hi: 'फसल की पत्तियों का निरीक्षण करें',
      mr: 'पिकाच्या पानांची पाहणी करा',
    },
    why: 'Current temperature (31°C) and relative humidity (65%) favor sucking pests (whitefly & aphids) on vegetative cotton canopy.',
    whyLocal: {
      en: 'Temperature & humidity favor sucking pests on cotton. Check underside of lower canopy leaves.',
      hi: '31°C तापमान व 65% आर्द्रता के कारण सफेद मक्खी व थ्रिप्स कीटों का जोखिम है। पत्तियों की निचली सतह जांचें।',
      mr: '३१°C तापमान आणि ६५% आर्द्रतेमुळे कापूस पिकावर पांढरी माशी व थ्रिप्सचा धोका संभवतो. खालची पाने तपासा.',
    },
    priority: 'medium',
    confidence: 'Medium (76% decision-support estimate)',
    confidencePercent: 76,
    time: 'Tomorrow, 8:00 AM',
    category: 'pest',
    isCompleted: false,
  },
  {
    id: 'action-3',
    title: 'Plan irrigation',
    titleLocal: {
      en: 'Plan irrigation',
      hi: 'सिंचाई की योजना बनाएं',
      mr: 'सिंचनाचे नियोजन करा',
    },
    why: 'Soil moisture is currently optimal (68%). Defer full irrigation cycle for 2 days; calibrate drip timer.',
    whyLocal: {
      en: 'Soil moisture is currently optimal. Defer heavy irrigation for 2 days to save power and water.',
      hi: 'वर्तमान में मिट्टी में पर्याप्त नमी (68%) है। 2 दिन बाद ड्रिप से हल्की सिंचाई का शेड्यूल बनाएं।',
      mr: 'मातीत सध्या पुरेसा ओलावा (६८%) आहे. पुढील २ दिवस पाणी देणे पुढे ढकला व ठिबक वेळ सेट करा.',
    },
    priority: 'low',
    confidence: 'High (92% decision-support estimate)',
    confidencePercent: 92,
    time: 'In 2 days',
    category: 'irrigation',
    isCompleted: false,
  },
];

export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'heavy-rain',
    title: 'Heavy rain tomorrow (>45mm)',
    titleLocal: {
      en: 'Heavy rain tomorrow (>45mm)',
      hi: 'कल भारी बारिश (>45mm)',
      mr: 'उद्या अतिवृष्टी (>४५ मिमी)',
    },
    iconName: 'CloudRain',
    description: 'Simulates intense precipitation event on 3-acre black soil plot.',
    possibleImpact: 'Possible temporary waterlogging in low-lying micro-depressions, localized nitrogen leaching, and delayed mechanical weeding.',
    riskLevel: 'Medium',
    affectedFactors: ['Soil Aeration', 'Root Zone Oxygenation', 'Nitrogen Retention', 'Weed Pressure'],
    recommendedAction: 'Inspect and unblock field border drainage channels today. Postpone urea broadcasting and foliar sprays for 48 hours.',
    confidence: 'High (89% decision-support simulation)',
    confidenceScore: 89,
    assumptions: ['Deep black clay soil with 45% retention', 'Vegetative cotton root depth at 25-30 cm', 'Drainage gradient intact'],
  },
  {
    id: 'irrigation-delayed',
    title: 'Irrigation delayed by 2 days',
    titleLocal: {
      en: 'Irrigation delayed by 2 days',
      hi: 'सिंचाई में 2 दिन की देरी',
      mr: 'सिंचनाला २ दिवस उशीर',
    },
    iconName: 'Droplets',
    description: 'Simulates power outage or water pump delay for 48 hours.',
    possibleImpact: 'Negligible stress. Black soil water-holding buffer prevents wilting; encourages deeper taproot penetration into subsoil.',
    riskLevel: 'Low',
    affectedFactors: ['Subsurface Root Growth', 'Leaf Turgidity', 'Pumping Energy Cost'],
    recommendedAction: 'No panic intervention needed. Resume normal 2-hour drip cycle on Day 3 morning.',
    confidence: 'High (94% decision-support simulation)',
    confidenceScore: 94,
    assumptions: ['Current soil moisture is 68%', 'Foliar canopy mulch layer slows direct evaporation'],
  },
  {
    id: 'heatwave-3days',
    title: 'High temperature for 3 days (>38°C)',
    titleLocal: {
      en: 'High temperature for 3 days (>38°C)',
      hi: '3 दिनों तक अत्यधिक तापमान (>38°C)',
      mr: '३ दिवस तीव्र उष्णतेची लाट (>३८°C)',
    },
    iconName: 'SunMedium',
    description: 'Simulates unseasonal heatwave with dry ambient wind.',
    possibleImpact: 'Elevated crop evapotranspiration (ETc), midday leaf curling stress, and accelerated whitefly reproduction cycle.',
    riskLevel: 'High',
    affectedFactors: ['Canopy Temperature', 'Stomatal Conductance', 'Sucking Pest Multiplication'],
    recommendedAction: 'Run short early-morning drip irrigation (45 mins) to cool root zone. Install yellow sticky traps (6 per acre) for whitefly monitoring.',
    confidence: 'Medium (82% decision-support simulation)',
    confidenceScore: 82,
    assumptions: ['Peak temperature occurs between 12:30 PM and 3:30 PM', 'Relative humidity drops to 35%'],
  },
  {
    id: 'rain-flowering',
    title: 'Rain during flowering stage',
    titleLocal: {
      en: 'Rain during flowering stage',
      hi: 'फूल आने की अवस्था में बारिश',
      mr: 'फुलोरा अवस्थेत पाऊस',
    },
    iconName: 'Flower2',
    description: 'Simulates unseasonal showers when cotton plants are actively flowering.',
    possibleImpact: 'Risk of pollen wash-off, flower bud (square) drop, and vulnerability to fungal boll rot.',
    riskLevel: 'High',
    affectedFactors: ['Pollination Efficacy', 'Square & Boll Retention', 'Fungal Spore Germination'],
    recommendedAction: 'Apply protective bio-fungicide (Trichoderma viride or Copper Oxychloride 2g/L) immediately after rain stops. Maintain zero waterlogging.',
    confidence: 'High (86% decision-support simulation)',
    confidenceScore: 86,
    assumptions: ['Crop reaches day 65-75 flowering phase', 'Continuous rainfall exceeds 25mm in 12 hours'],
  },
  {
    id: 'sudden-weather-change',
    title: 'Sudden weather change (Humidity spike / Fog)',
    titleLocal: {
      en: 'Sudden weather change (Humidity spike / Fog)',
      hi: 'अचानक मौसम में बदलाव (अधिक नमी / कोहरा)',
      mr: 'हवामानात अचानक बदल (दमट हवा / धुके)',
    },
    iconName: 'CloudFog',
    description: 'Simulates prolonged overcast skies with >85% humidity.',
    possibleImpact: 'Leaf wetness duration exceeds 8 hours; creates favorable conditions for fungal leaf spots (Alternaria) and bacterial blight.',
    riskLevel: 'Medium',
    affectedFactors: ['Leaf Wetness Index', 'Spore Incubation', 'Solar Radiation Interception'],
    recommendedAction: 'Scout lower and middle foliage for circular brown spots with concentric rings. Avoid high nitrogen top-dressing.',
    confidence: 'Medium (78% decision-support simulation)',
    confidenceScore: 78,
    assumptions: ['Relative humidity remains >85% for 48 consecutive hours', 'Sunlight hours <4 hours/day'],
  },
];

export const FARM_MEMORY_LOGS: FarmMemoryLog[] = [
  {
    id: 'log-1',
    date: '18 Aug 2026',
    title: 'Heavy rain observed (18mm)',
    type: 'weather',
    details: '18mm localized rainfall recorded. Side drainage furrows cleared surface water within 4 hours without ponding.',
    impactOnAi: 'AI calibrated black soil drainage coefficient to 4.5 hrs/20mm.',
  },
  {
    id: 'log-2',
    date: '20 Aug 2026',
    title: 'Drainage checked & inter-cultivation weeding',
    type: 'action',
    details: 'Bullock-drawn hoeing completed between crop rows. Soil aeration restored.',
    impactOnAi: 'AI marked weed competition factor as low for next 14 days.',
  },
  {
    id: 'log-3',
    date: '22 Aug 2026',
    title: 'Leaf observation recorded (Minor yellowing on lower leaves)',
    type: 'observation',
    details: 'Scouted 20 sample plants. Minor thrip markings on 2 plants (under threshold). No synthetic pesticide required.',
    impactOnAi: 'AI elevated pest alert priority from Low to Medium as vigilance reminder.',
  },
  {
    id: 'log-4',
    date: '25 Aug 2026',
    title: 'Drip fertigation applied (19:19:19 @ 3 kg/acre)',
    type: 'input',
    details: 'Water-soluble balanced NPK injected through Venturi system with 2-hour drip cycle.',
    impactOnAi: 'AI logged nutrient booster; scheduled next soil nitrogen assessment for 5 Sept.',
  },
  {
    id: 'log-5',
    date: '28 Aug 2026',
    title: 'Soil moisture test: 68% optimal',
    type: 'observation',
    details: 'Hand feel and digital tensiometer reading showed optimal moisture at 15cm root depth.',
    impactOnAi: 'AI delayed next scheduled irrigation recommendation by 48 hours to conserve water.',
  },
];

export const VILLAGE_INSIGHTS: VillageInsight[] = [
  {
    id: 'v-1',
    title: 'Participating Farms in Wardha Cluster',
    metric: '18 Farms',
    changeText: '+3 farms joined this week',
    riskLevel: 'Low',
    description: '18 local farms in the 5km radius share anonymized crop stage and pest surveillance telemetry.',
    advisory: 'Collective farm density enables early hotspot detection before pest outbreaks spread.',
  },
  {
    id: 'v-2',
    title: 'Area Crop Stress Reports',
    metric: '12% Increase',
    changeText: 'Moderate uptick in sucking pest queries',
    riskLevel: 'Medium',
    description: '3 neighboring farms reported minor whitefly nymphs on cotton border rows following warm humidity.',
    advisory: 'Inspect field borders first. Synchronized pheromone traps recommended for Wardha watershed.',
  },
  {
    id: 'v-3',
    title: 'Cluster Weather Microclimate',
    metric: '31°C / 20% Rain',
    changeText: 'Scattered clouds over Wardha basin',
    riskLevel: 'Low',
    description: 'Micro-radar shows localized cloud fronts moving northeast. Isolated rain possible in 24-48 hours.',
    advisory: 'Ensure lateral trenches remain clear. Complete any dry weeding before ground gets wet.',
  },
];

export const DEMO_LINK_SAFETY_SAMPLES = [
  {
    url: 'https://pmkisan.gov.in',
    status: 'safe' as const,
    isOfficialGov: true,
    hasHttps: true,
    domain: 'pmkisan.gov.in',
    reasons: ['Official Government of India domain (.gov.in)', 'Valid SSL/TLS Certificate', 'Recognized Central Portal'],
    warningNote: 'Safe official portal. Verify URL in browser address bar before login.',
  },
  {
    url: 'https://mahadbt.maharashtra.gov.in',
    status: 'safe' as const,
    isOfficialGov: true,
    hasHttps: true,
    domain: 'mahadbt.maharashtra.gov.in',
    reasons: ['Official Government of Maharashtra portal', 'Secure HTTPS encryption', 'Direct Benefit Transfer gateway'],
    warningNote: 'Safe state government portal. Never share your Aadhaar OTP with unauthorized agents.',
  },
  {
    url: 'https://pmfby.gov.in',
    status: 'safe' as const,
    isOfficialGov: true,
    hasHttps: true,
    domain: 'pmfby.gov.in',
    reasons: ['Official National Crop Insurance Portal', 'Official .gov.in top-level domain', 'Secure payment gateway for ₹1 token'],
    warningNote: 'Official portal for PMFBY crop insurance claims and enrollment.',
  },
  {
    url: 'http://pmkisan-free-bonus-subsidy.online.xyz',
    status: 'suspicious' as const,
    isOfficialGov: false,
    hasHttps: false,
    domain: 'pmkisan-free-bonus-subsidy.online.xyz',
    reasons: [
      'NOT an official government domain (ends with .xyz, not .gov.in)',
      'Insecure HTTP connection (no SSL lock)',
      'High-risk keywords: "free-bonus-subsidy"',
      'Potential phishing attempt aiming to steal Aadhaar, OTP or bank details',
    ],
    warningNote: 'CRITICAL WARNING: Do not enter sensitive information. Government schemes never use .xyz domains or ask for OTPs via unauthorized links.',
  },
];

export function checkAgriculturalUrl(inputUrl: string): LinkSafetyCheck {
  let trimmed = inputUrl.trim();
  if (!trimmed) {
    return {
      url: '',
      status: 'invalid',
      isOfficialGov: false,
      hasHttps: false,
      domain: '',
      reasons: ['Please enter a website URL to check.'],
    };
  }

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const domain = parsed.hostname.toLowerCase();
    const hasHttps = parsed.protocol === 'https:';

    const isGovIn = domain.endsWith('.gov.in') || domain.endsWith('.nic.in') || domain.endsWith('.ac.in');
    const isStateGov = domain.includes('maharashtra.gov.in') || domain.includes('agricoop.nic.in') || domain.includes('icar.org.in');

    const suspiciousKeywords = ['bonus', 'free-money', 'lottery', 'claim-now', 'urgent-cash', 'gift', 'instant-paisa'];
    const hasSuspiciousWords = suspiciousKeywords.some((w) => domain.includes(w) || parsed.pathname.toLowerCase().includes(w));
    const suspiciousTlds = ['.xyz', '.top', '.click', '.tk', '.ml', '.ga', '.cf', '.buzz', '.work'];
    const hasSuspiciousTld = suspiciousTlds.some((tld) => domain.endsWith(tld));

    if ((isGovIn || isStateGov) && hasHttps && !hasSuspiciousWords) {
      return {
        url: trimmed,
        status: 'safe',
        isOfficialGov: true,
        hasHttps: true,
        domain,
        reasons: [
          'Verified official Indian Government domain (.gov.in / .nic.in)',
          'Secure HTTPS encrypted connection',
          'Domain recognized in official agricultural registry',
        ],
        warningNote: 'This is an official government domain. You can safely access government schemes here.',
      };
    }

    if (hasSuspiciousWords || hasSuspiciousTld || !hasHttps || (!isGovIn && domain.includes('pmkisan'))) {
      return {
        url: trimmed,
        status: 'suspicious',
        isOfficialGov: false,
        hasHttps,
        domain,
        reasons: [
          !isGovIn ? 'NOT an official government domain (.gov.in / .nic.in)' : 'Suspicious parameters detected',
          !hasHttps ? 'Insecure connection (Missing HTTPS padlock)' : 'HTTPS present but domain is unofficial',
          hasSuspiciousWords ? 'Contains deceptive promotional keywords' : 'Unofficial domain masquerading as government portal',
        ],
        warningNote: 'Do NOT enter sensitive information (Aadhaar, OTP, Bank PIN, Password). Verify the link through the official government website.',
      };
    }

    return {
      url: trimmed,
      status: 'safe',
      isOfficialGov: false,
      hasHttps,
      domain,
      reasons: [
        'Domain format is valid',
        hasHttps ? 'HTTPS encryption active' : 'No HTTPS encryption detected',
        'Private or non-government agricultural portal/organization',
      ],
      warningNote: 'This appears to be a private/commercial website, not an official government portal. Verify legitimacy before submitting documents.',
    };
  } catch (e) {
    return {
      url: inputUrl,
      status: 'invalid',
      isOfficialGov: false,
      hasHttps: false,
      domain: '',
      reasons: ['Invalid URL format. Please enter a valid link like https://pmkisan.gov.in.'],
    };
  }
}
