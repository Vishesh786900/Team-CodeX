import { FarmCrop, ScanResult } from '../types';

export interface CropInfoTemplate {
  name: string;
  hindiName: string;
  marathiName: string;
  scientificName: string;
  durationDays: number;
  stages: Array<{
    stageName: string;
    weeks: string;
    description: string;
    waterNeeds: string;
    fertilizerAdvisory: string;
    pestWatch: string;
  }>;
  commonDiseases: string[];
  commonPests: string[];
}

export const CROP_TEMPLATES: Record<string, CropInfoTemplate> = {
  Tomato: {
    name: "Tomato",
    hindiName: "टमाटर (Tomato)",
    marathiName: "टोमॅटो (Tomato)",
    scientificName: "Solanum lycopersicum",
    durationDays: 120,
    stages: [
      {
        stageName: "Nursery & Germination",
        weeks: "Week 1–3",
        description: "Seedling emergence and initial root establishment in nursery bed.",
        waterNeeds: "Light sprinkling twice daily, avoid waterlogging.",
        fertilizerAdvisory: "Trichoderma soil drenching and 19:19:19 starter dose.",
        pestWatch: "Damping-off fungal rot and flea beetles.",
      },
      {
        stageName: "Transplanting & Early Growth",
        weeks: "Week 4–6",
        description: "Transplanting seedlings to main field with drip lateral lines and staking.",
        waterNeeds: "Moderate drip irrigation every 2 days.",
        fertilizerAdvisory: "Apply DAP + Potash basal dose and 12:61:00 for root growth.",
        pestWatch: "Cutworms, leaf miners, and early sucking pests.",
      },
      {
        stageName: "Vegetative Growth & Branching",
        weeks: "Week 7–9",
        description: "Rapid vegetative branching and canopy expansion.",
        waterNeeds: "Regular moisture; critical not to let soil dry out.",
        fertilizerAdvisory: "13:40:13 and Micronutrient foliar spray (Zinc, Boron).",
        pestWatch: "Early Blight (Alternaria), Whiteflies, and Red Spider Mites.",
      },
      {
        stageName: "Flowering & Fruit Setting",
        weeks: "Week 10–13",
        description: "Flower clusters blossom and small green fruits develop.",
        waterNeeds: "Strictly uniform irrigation to prevent flower drop.",
        fertilizerAdvisory: "00:52:34 (MKP) + Calcium Nitrate and Boron spray.",
        pestWatch: "Fruit Borer (Helicoverpa), Leaf Curl Virus, Blossom End Rot.",
      },
      {
        stageName: "Fruit Ripening & Harvesting",
        weeks: "Week 14–17+",
        description: "Fruits turn pink/red; continuous picking every 3–4 days.",
        waterNeeds: "Reduce water slightly during ripening to increase sugar & firmness.",
        fertilizerAdvisory: "00:00:50 (Potassium Sulphate) for fruit shine and shelf life.",
        pestWatch: "Late blight if wet weather occurs, Fruit fly infestation.",
      },
    ],
    commonDiseases: ["Early Blight", "Late Blight", "Tomato Leaf Curl Virus (TLCV)", "Bacterial Wilt", "Damping-Off"],
    commonPests: ["Whiteflies", "Tomato Fruit Borer", "Leaf Miner", "Thrips", "Aphids"],
  },
  Wheat: {
    name: "Wheat",
    hindiName: "गेहूं (Wheat)",
    marathiName: "गहू (Wheat)",
    scientificName: "Triticum aestivum",
    durationDays: 125,
    stages: [
      {
        stageName: "CRI (Crown Root Initiation)",
        weeks: "Week 1–3 (Day 20–25)",
        description: "Crucial first irrigation stage when crown roots initiate below soil.",
        waterNeeds: "Most critical irrigation (Day 21). Missing CRI reduces yield significantly.",
        fertilizerAdvisory: "First top dressing of Urea (1/3rd quantity) after first irrigation.",
        pestWatch: "Termites and armyworm at soil base.",
      },
      {
        stageName: "Tillering Stage",
        weeks: "Week 4–6 (Day 35–45)",
        description: "Formation of multiple productive tillers per plant.",
        waterNeeds: "Second irrigation at day 40–45.",
        fertilizerAdvisory: "Zinc Sulphate foliar spray and broadleaf weedicide application.",
        pestWatch: "Aphids (Mahoo) colonies on underside of leaves.",
      },
      {
        stageName: "Jointing & Stem Elongation",
        weeks: "Week 7–9 (Day 60–65)",
        description: "Stems elongate rapidly and internodes develop.",
        waterNeeds: "Third irrigation at jointing stage.",
        fertilizerAdvisory: "Second top dressing of Nitrogen before flag leaf emergence.",
        pestWatch: "Yellow Rust (stripe rust) in cooler North/Central zones.",
      },
      {
        stageName: "Flowering & Heading (Boot stage)",
        weeks: "Week 10–12 (Day 80–85)",
        description: "Earheads emerge from boot leaf and flowering occurs.",
        waterNeeds: "Fourth critical irrigation. Avoid high-pressure wind to prevent lodging.",
        fertilizerAdvisory: "00:52:34 foliar spray for uniform grain filling.",
        pestWatch: "Karnal Bunt, Brown Rust, and Head Blight.",
      },
      {
        stageName: "Grain Milking to Maturity",
        weeks: "Week 13–17 (Day 100–120)",
        description: "Grains fill with starch and turn golden yellow as crop ripens.",
        waterNeeds: "Last light irrigation at dough stage; stop water 15 days before harvest.",
        fertilizerAdvisory: "No further fertilizer needed.",
        pestWatch: "Bird damage and rodents.",
      },
    ],
    commonDiseases: ["Yellow Stripe Rust", "Brown Leaf Rust", "Loose Smut", "Karnal Bunt", "Powdery Mildew"],
    commonPests: ["Wheat Aphid", "Termite", "Armyworm", "Pink Stem Borer"],
  },
  Onion: {
    name: "Onion",
    hindiName: "प्याज (Onion)",
    marathiName: "कांदा (Onion)",
    scientificName: "Allium cepa",
    durationDays: 130,
    stages: [
      {
        stageName: "Transplanting & Establishment",
        weeks: "Week 1–3",
        description: "Root establishment after transplanting 45-day nursery seedlings.",
        waterNeeds: "Frequent light irrigation to keep top 2 inches moist.",
        fertilizerAdvisory: "Basal dose: 50kg DAP + 50kg MOP + 10kg Sulphur per acre.",
        pestWatch: "Cutworm and seedling damping-off.",
      },
      {
        stageName: "Vegetative Foliage Growth",
        weeks: "Week 4–7",
        description: "Rapid leaf formation (6–8 healthy green leaves).",
        waterNeeds: "Irrigate every 6–8 days depending on soil type.",
        fertilizerAdvisory: "Urea top dressing + 19:19:19 foliar spray.",
        pestWatch: "Thrips (tiny yellow/black insects causing silvery white streaks).",
      },
      {
        stageName: "Bulb Initiation & Swelling",
        weeks: "Week 8–12",
        description: "Base of leaves starts swelling into bulbs.",
        waterNeeds: "Uniform irrigation essential. Water stress causes split bulbs.",
        fertilizerAdvisory: "00:52:34 + Boron foliar spray for solid bulb core.",
        pestWatch: "Purple Blotch (Alternaria porri), Stemphylium blight, Thrips.",
      },
      {
        stageName: "Bulb Maturity & Neck Fall",
        weeks: "Week 13–16",
        description: "Bulbs attain full size; tops fall over (neck fall) naturally at 50% maturity.",
        waterNeeds: "Completely stop irrigation 12–15 days before harvest for good storage.",
        fertilizerAdvisory: "00:00:50 for skin color, pungency, and storage life.",
        pestWatch: "Bulb rot and storage mold.",
      },
    ],
    commonDiseases: ["Purple Blotch", "Stemphylium Blight", "Basal Rot (Fusarium)", "Downy Mildew", "Colletotrichum Blight"],
    commonPests: ["Onion Thrips", "Maggot / Fly", "Armyworm", "Mites"],
  },
  Cotton: {
    name: "Cotton",
    hindiName: "कपास (Cotton)",
    marathiName: "कापूस (Cotton)",
    scientificName: "Gossypium hirsutum",
    durationDays: 160,
    stages: [
      {
        stageName: "Germination & Seedling",
        weeks: "Week 1–3",
        description: "Seed emergence, square formation starts in early branches.",
        waterNeeds: "Light moisture, avoid standing water.",
        fertilizerAdvisory: "Basal NPK dose and biofertilizer seed treatment.",
        pestWatch: "Early sucking pests: Thrips, Jassids, and Aphids.",
      },
      {
        stageName: "Vegetative & Square Formation",
        weeks: "Week 4–8",
        description: "Formation of flower buds (squares) on sympodial branches.",
        waterNeeds: "Regular irrigation every 8–10 days.",
        fertilizerAdvisory: "Split dose of Nitrogen + Magnesium Sulphate spray.",
        pestWatch: "Whitefly, Leafhopper (Jassid), and Spotted Bollworm.",
      },
      {
        stageName: "Flowering & Boll Development",
        weeks: "Week 9–14",
        description: "Peak blooming, white flowers turn pink, green bolls swell.",
        waterNeeds: "Peak water consumption phase. Drought causes boll dropping.",
        fertilizerAdvisory: "13:00:45 (Potassium Nitrate) + Boron spray.",
        pestWatch: "Pink Bollworm (PBL), Spodoptera, Grey Mildew (Dahiya).",
      },
      {
        stageName: "Boll Bursting & Picking",
        weeks: "Week 15–20+",
        description: "Bolls burst open revealing clean white cotton lint.",
        waterNeeds: "Taper off water; stop during active picking.",
        fertilizerAdvisory: "Defoliant spray if mechanized harvesting.",
        pestWatch: "Stainers, late pink bollworm damage in leftover bolls.",
      },
    ],
    commonDiseases: ["Grey Mildew (Dahiya)", "Bacterial Leaf Blight", "Alternaria Leaf Spot", "Root Rot"],
    commonPests: ["Pink Bollworm (PBL)", "Whitefly", "Jassid (Amrasca)", "Thrips", "Mealybug"],
  },
  Rice: {
    name: "Rice (Paddy)",
    hindiName: "धान / चावल (Rice)",
    marathiName: "भात / धान (Paddy)",
    scientificName: "Oryza sativa",
    durationDays: 135,
    stages: [
      {
        stageName: "Nursery & Transplanting",
        weeks: "Week 1–4",
        description: "Seedling raising in nursery followed by transplanting in puddled field.",
        waterNeeds: "Maintain 2–3 cm standing water in nursery, 5 cm after transplanting.",
        fertilizerAdvisory: "Basal DAP + Zinc Sulphate at transplanting.",
        pestWatch: "Caseworm, Thrips, and Root rot.",
      },
      {
        stageName: "Tillering Stage",
        weeks: "Week 5–8",
        description: "Active tillering produces maximum culms per hill.",
        waterNeeds: "Alternate wetting and drying (AWD) saves water and strengthens roots.",
        fertilizerAdvisory: "First top dressing of Nitrogen (Urea).",
        pestWatch: "Stem Borer (dead hearts), Gall Midge, Blast.",
      },
      {
        stageName: "Panicle Initiation & Booting",
        weeks: "Week 9–11",
        description: "Earhead begins forming inside the stem sheath.",
        waterNeeds: "Crucial to maintain 5 cm water layer from panicle to flowering.",
        fertilizerAdvisory: "Second top dressing of Potash + Urea.",
        pestWatch: "Brown Plant Hopper (BPH), Leaf Folder, Sheath Blight.",
      },
      {
        stageName: "Flowering & Grain Filling",
        weeks: "Week 12–15",
        description: "Panicle fully emerges, pollination occurs, grains fill milky starch.",
        waterNeeds: "Maintain shallow water; drain 10 days before harvest.",
        fertilizerAdvisory: "Foliar spray of 00:52:34 for uniform grain weight.",
        pestWatch: "Gundhi Bug, False Smut, Bacterial Leaf Streak.",
      },
    ],
    commonDiseases: ["Rice Blast (Magnaporthe)", "Sheath Blight", "Bacterial Leaf Blight (BLB)", "False Smut"],
    commonPests: ["Brown Plant Hopper (BPH)", "Yellow Stem Borer", "Leaf Folder", "Gundhi Bug"],
  },
};

export const CROP_STAGE_TEMPLATES: Record<
  string,
  {
    image: string;
    stages: Array<{ name: string; dayStart: number; dayEnd: number }>;
  }
> = {
  Tomato: {
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Nursery (रोपवाटिका)', dayStart: 1, dayEnd: 25 },
      { name: 'Early Growth (लागवड)', dayStart: 26, dayEnd: 45 },
      { name: 'Vegetative (शाकीय वाढ)', dayStart: 46, dayEnd: 60 },
      { name: 'Flowering (फुलोरा)', dayStart: 61, dayEnd: 85 },
      { name: 'Fruiting & Picking (तोडणी)', dayStart: 86, dayEnd: 130 },
    ],
  },
  Onion: {
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Transplanting (पुनर्लागवड)', dayStart: 1, dayEnd: 20 },
      { name: 'Vegetative (पात वाढ)', dayStart: 21, dayEnd: 50 },
      { name: 'Bulb Initiation (कांदा धरणे)', dayStart: 51, dayEnd: 85 },
      { name: 'Bulb Swelling (कांदा पोसणे)', dayStart: 86, dayEnd: 110 },
      { name: 'Maturity (मान पडणे व काढणी)', dayStart: 111, dayEnd: 135 },
    ],
  },
  Wheat: {
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'CRI Root Stage (मुकुट मुळे)', dayStart: 1, dayEnd: 25 },
      { name: 'Tillering (फुटवे)', dayStart: 26, dayEnd: 45 },
      { name: 'Jointing (कांड्या धरणे)', dayStart: 46, dayEnd: 70 },
      { name: 'Flowering (ओंबी बाहेर पडणे)', dayStart: 71, dayEnd: 95 },
      { name: 'Grain Filling & Harvest (दाणे भरणे)', dayStart: 96, dayEnd: 125 },
    ],
  },
  Cotton: {
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Seedling (उगवण)', dayStart: 1, dayEnd: 25 },
      { name: 'Square Formation (पात्या धरणे)', dayStart: 26, dayEnd: 60 },
      { name: 'Flowering (फुले उमलणे)', dayStart: 61, dayEnd: 95 },
      { name: 'Boll Development (बोंडे भरणे)', dayStart: 96, dayEnd: 130 },
      { name: 'Boll Bursting (कापूस वेचणी)', dayStart: 131, dayEnd: 170 },
    ],
  },
  'Rice (Paddy)': {
    image: 'https://images.unsplash.com/photo-1536704680372-7deb3b4a2f8c?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Nursery (लावणी)', dayStart: 1, dayEnd: 25 },
      { name: 'Tillering (फुटवे)', dayStart: 26, dayEnd: 55 },
      { name: 'Panicle Initiation (पोटरी)', dayStart: 56, dayEnd: 80 },
      { name: 'Flowering (फुलोरा)', dayStart: 81, dayEnd: 105 },
      { name: 'Grain Filling (दाणे भरणे)', dayStart: 106, dayEnd: 135 },
    ],
  },
  Sugarcane: {
    image: 'https://images.unsplash.com/photo-1594488518001-08182283cb7a?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Germination (उगवण)', dayStart: 1, dayEnd: 35 },
      { name: 'Tillering (फुटवे)', dayStart: 36, dayEnd: 100 },
      { name: 'Grand Growth (कांड्या वाढ)', dayStart: 101, dayEnd: 240 },
      { name: 'Ripening (साखर भरणे)', dayStart: 241, dayEnd: 360 },
      { name: 'Harvesting (तोडणी)', dayStart: 361, dayEnd: 420 },
    ],
  },
  Soybean: {
    image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e53703?w=600&auto=format&fit=crop&q=80',
    stages: [
      { name: 'Emergence (उगवण)', dayStart: 1, dayEnd: 15 },
      { name: 'Vegetative (शाकीय वाढ)', dayStart: 16, dayEnd: 35 },
      { name: 'Flowering (फुलोरा)', dayStart: 36, dayEnd: 55 },
      { name: 'Pod Formation (शेंगा भरणे)', dayStart: 56, dayEnd: 80 },
      { name: 'Maturity (काढणी)', dayStart: 81, dayEnd: 100 },
    ],
  },
};

export const INITIAL_DEMO_CROPS: FarmCrop[] = [
  {
    id: 'crop-1',
    name: 'Tomato',
    variety: 'Abhinav Hybrid',
    plantedDate: '2026-07-10',
    areaAcres: 2.5,
    soilType: 'Medium Black Loam',
    irrigationType: 'Drip Irrigation',
    stage: 'Flowering',
    stageProgress: 65,
    notes: 'Healthy flowering observed; staked with bamboo poles and trellis wire.',
    wateringScheduleDays: 2,
    lastWatered: '2026-08-27',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'crop-2',
    name: 'Onion',
    variety: 'Bhima Super (Kharif)',
    plantedDate: '2026-07-28',
    areaAcres: 3.0,
    soilType: 'Red Loam',
    irrigationType: 'Sprinkler Irrigation',
    stage: 'Vegetative',
    stageProgress: 40,
    notes: 'Vegetative foliage active; regular weed monitoring ongoing.',
    wateringScheduleDays: 4,
    lastWatered: '2026-08-26',
    image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'crop-3',
    name: 'Wheat',
    variety: 'GW-322',
    plantedDate: '2026-08-05',
    areaAcres: 4.0,
    soilType: 'Deep Alluvial',
    irrigationType: 'Flood / Furrow',
    stage: 'Early Growth',
    stageProgress: 25,
    notes: 'CRI crown root stage completed; first urea application done.',
    wateringScheduleDays: 10,
    lastWatered: '2026-08-25',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
  },
];

export const SAMPLE_SCAN_CASES: Array<{
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  category: string;
  imageUrl: string;
  result: ScanResult;
}> = [
  {
    id: 'sample-tomato-blight',
    name: 'Tomato: Early Blight',
    nameHi: 'टमाटर: अगेती झुलसा (Early Blight)',
    nameMr: 'टोमॅटो: अगेती करपा (Early Blight)',
    category: 'Disease',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69107937?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-1',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69107937?w=700&auto=format&fit=crop&q=80',
      scanType: 'disease',
      cropName: 'Tomato (Solanum lycopersicum)',
      cropConfidence: 94,
      cropStage: 'Vegetative / Flowering',
      condition: 'Early Blight (Alternaria solani)',
      conditionType: 'disease',
      confidence: 88,
      symptoms: [
        'Concentric dark brown rings with target-board pattern on lower older leaves',
        'Yellow chlorotic halos surrounding dark spots',
        'Leaf edges curling inward and premature leaf drop',
      ],
      immediateSteps: [
        'Prune and carefully remove heavily infected lower leaves and destroy away from the field.',
        'Avoid overhead sprinkler watering; use drip irrigation to prevent water splashing on leaves.',
        'Ensure proper plant spacing and staking to improve air circulation through the plant canopy.',
        'If recommended by local agriculture extension, spray Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3 g/L with thorough coverage.',
      ],
      prevention: [
        'Practice 2-year crop rotation with non-solanaceous crops (e.g. Maize, Pulses).',
        'Apply organic mulch (paddy straw/plastic) to prevent soil-borne fungal spores from splashing onto foliage.',
        'Maintain balanced nitrogen nutrition — avoid excess nitrogen which creates soft succulent tissue.',
      ],
      expertAdvice: 'Early blight spreads rapidly in humid weather (24-29°C) with frequent dew or rain. Consult your nearest Krishi Vigyan Kendra (KVK) for regional chemical spray advisory.',
      weatherRiskNote: 'High humidity (>70%) increases spore germination risk.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sample-cotton-whitefly',
    name: 'Cotton: Whitefly Infestation',
    nameHi: 'कपास: सफेद मक्खी (Whitefly)',
    nameMr: 'कापूस: पांढरी माशी (Whitefly)',
    category: 'Pest',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-2',
      imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=700&auto=format&fit=crop&q=80',
      scanType: 'pest',
      cropName: 'Cotton (Gossypium hirsutum)',
      cropConfidence: 91,
      cropStage: 'Vegetative to Square formation',
      condition: 'Whitefly (Bemisia tabaci) Infestation',
      conditionType: 'pest',
      confidence: 86,
      symptoms: [
        'Tiny white winged insects congregating on the underside of cotton leaves',
        'Sticky honeydew excretion on leaf surfaces followed by black sooty mold',
        'Yellowing, crinkling, and downward curling of foliage',
      ],
      immediateSteps: [
        'Install yellow sticky traps @ 10–12 traps per acre at canopy height to monitor and trap adult flies.',
        'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 1500 ppm @ 5 ml/L of water during early detection.',
        'If pest population crosses Economic Threshold Level (ETL: 6-8 adults per leaf), consult agricultural officer for approved insect growth regulators like Pyriproxyfen 10% EC.',
      ],
      prevention: [
        'Avoid excessive chemical nitrogen fertilizer application which triggers rapid vegetative growth favoured by sucking pests.',
        'Conserve natural predators like Chrysoperla (green lacewing) and ladybird beetles.',
        'Keep field borders free from weeds like Parthenium and Abutilon which serve as alternate hosts.',
      ],
      expertAdvice: 'Whitefly acts as a vector for Cotton Leaf Curl Virus (CLCuV). Early biological intervention prevents viral spread.',
      weatherRiskNote: 'Dry spells with warm daytime temperatures favor rapid whitefly multiplication.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sample-wheat-rust',
    name: 'Wheat: Yellow Rust',
    nameHi: 'गेहूं: पीला रतुआ / हल्दी रोग (Yellow Rust)',
    nameMr: 'गहू: तांबेरा / पिवळा गंज रोग (Yellow Rust)',
    category: 'Disease',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-3',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
      scanType: 'disease',
      cropName: 'Wheat (Triticum aestivum)',
      cropConfidence: 96,
      cropStage: 'Jointing / Heading Stage',
      condition: 'Yellow Stripe Rust (Puccinia striiformis)',
      conditionType: 'disease',
      confidence: 90,
      symptoms: [
        'Linear yellow/orange stripes of powdery pustules parallel to leaf veins',
        'Yellow dust rubs off easily when touching infected leaves with fingers',
        'Rapid chlorosis and drying of photosynthetic leaf area',
      ],
      immediateSteps: [
        'Inspect field daily in early morning for yellow powder on flag leaves.',
        'Immediately spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25% WG upon first symptom appearance.',
        'Repeat spray after 15 days if cloudy cool weather persists.',
      ],
      prevention: [
        'Sow rust-resistant recommended wheat varieties (e.g. HD-2967, DBW-187, DBW-303).',
        'Avoid late sowing of wheat in cooler northern regions.',
        'Maintain balanced N:P:K fertilization (120:60:40 kg/ha) with adequate potash.',
      ],
      expertAdvice: 'Yellow rust can reduce wheat yield by up to 50% if the flag leaf gets infected before grain filling. Contact your district agriculture officer immediately.',
      weatherRiskNote: 'Cool temperatures (10–15°C) with morning fog create optimal conditions for stripe rust.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sample-onion-thrips',
    name: 'Onion: Thrips Infestation',
    nameHi: 'प्याज: थ्रिप्स / मरोड़िया कीट (Onion Thrips)',
    nameMr: 'कांदा: फुलकिडे / थ्रिप्स (Onion Thrips)',
    category: 'Pest',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-4',
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
      scanType: 'pest',
      cropName: 'Onion (Allium cepa)',
      cropConfidence: 93,
      cropStage: 'Bulb Initiation Stage',
      condition: 'Onion Thrips (Thrips tabaci)',
      conditionType: 'pest',
      confidence: 87,
      symptoms: [
        'Silvery white patches and sunken translucent streaks on inner leaf sheaths',
        'Leaf tips turn brown, wither, and twist into curled shapes',
        'Stunted bulb development due to reduced photosynthetic foliage',
      ],
      immediateSteps: [
        'Install blue sticky traps @ 15–20 per acre (thrips are strongly attracted to blue color).',
        'Sprinkler irrigation or overhead misting knocks down thrips naturally.',
        'Spray Fipronil 5% SC @ 1.5 ml/L or Spinetoram 11.7% SC @ 1 ml/L with a sticking/wetting agent (silicon surfactant).',
      ],
      prevention: [
        'Plant 2 border rows of Maize or Sorghum around onion fields as natural live windbreaks/barriers.',
        'Ensure deep summer ploughing to expose pupating thrips in soil to predatory birds and sun heat.',
      ],
      expertAdvice: 'Thrips transmit Iris Yellow Spot Virus (IYSV). Always spray during early morning or late evening when thrips emerge from leaf axils.',
      weatherRiskNote: 'Dry spells with lack of rainfall increase thrips population drastically.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sample-rice-healthy',
    name: 'Rice: Healthy Crop',
    nameHi: 'धान: स्वस्थ व निरोगी फसल (Healthy Rice)',
    nameMr: 'भात: निरोगी व सशक्त पीक (Healthy Paddy)',
    category: 'Healthy',
    imageUrl: 'https://images.unsplash.com/photo-1536704680372-7deb3b4a2f8c?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-5',
      imageUrl: 'https://images.unsplash.com/photo-1536704680372-7deb3b4a2f8c?w=700&auto=format&fit=crop&q=80',
      scanType: 'crop',
      cropName: 'Rice (Oryza sativa)',
      cropConfidence: 97,
      cropStage: 'Active Tillering to Panicle Initiation',
      condition: 'Healthy Paddy Crop - No Pathogen Detected',
      conditionType: 'healthy',
      confidence: 96,
      symptoms: [
        'Uniform lush green foliage with upright vigorous leaves',
        'Strong tillering with clean leaf sheaths and absence of dead hearts',
        'Firm white root system with no signs of root rot or galling',
      ],
      immediateSteps: [
        'Maintain optimum shallow water depth (2–5 cm) across the field.',
        'Apply scheduled second top dressing of Nitrogen (Urea) and MOP for panicle nourishment.',
        'Conduct routine morning scouts for Brown Plant Hopper (BPH) at the base of rice clumps.',
      ],
      prevention: [
        'Practice Alternate Wetting and Drying (AWD) water management.',
        'Avoid over-application of urea which makes the crop prone to lodging and blast fungus.',
      ],
      expertAdvice: 'Crop is in excellent physiological health! Continue following the seasonal nutrient calendar.',
      weatherRiskNote: 'Optimal growing conditions observed.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sample-chili-leafcurl',
    name: 'Chili: Leaf Curl Virus',
    nameHi: 'मिर्च: पत्ती मरोड़ रोग (Chili Leaf Curl Virus)',
    nameMr: 'मिरची: चुरडा-मुरडा / बोकड्या रोग (Chili Leaf Curl)',
    category: 'Disease',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=700&auto=format&fit=crop&q=80',
    result: {
      id: 'scan-sample-6',
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=700&auto=format&fit=crop&q=80',
      scanType: 'disease',
      cropName: 'Chili / Pepper (Capsicum annuum)',
      cropConfidence: 92,
      cropStage: 'Vegetative to Flowering',
      condition: 'Chili Leaf Curl Begomovirus (Vector: Whitefly/Thrips)',
      conditionType: 'disease',
      confidence: 89,
      symptoms: [
        'Upward and downward curling, puckering, and crinkling of young leaves (Bokadya)',
        'Thickening and swelling of leaf veins with stunted bushy plant stature',
        'Severe reduction in flower bud retention and fruit setting',
      ],
      immediateSteps: [
        'Uproot and burn severely infected viral plants to prevent viral spread to surrounding healthy hills.',
        'Control vector insect population (Whitefly & Thrips) using Diafenthiuron 50% WP @ 1.2 g/L or Acephate 75% SP @ 1.5 g/L.',
        'Spray micronutrient mixture with Zinc and Boron to assist recover vegetative vigour.',
      ],
      prevention: [
        'Raise chili nursery under 40-mesh insect-proof nylon net to prevent early vector infection.',
        'Intercrop with barrier crops like Maize or Sorghum (4:1 ratio).',
        'Use reflective silver-black plastic mulch which repels sucking pests.',
      ],
      expertAdvice: 'Viral diseases cannot be cured once inside plant cells; management depends 100% on vector control and field sanitation.',
      weatherRiskNote: 'Dry warm weather leads to high vector activity.',
      timestamp: new Date().toISOString(),
    },
  },
];
