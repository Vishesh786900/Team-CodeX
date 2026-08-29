import { Language } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  assistantName: string;
  nav: {
    dashboard: string;
    myCrops: string;
    askAi: string;
    scanCrop: string;
    weather: string;
    schemes: string;
    profile: string;
    admin: string;
  };
  common: {
    save: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    add: string;
    viewDetails: string;
    apply: string;
    officialWebsite: string;
    confidence: string;
    daysOld: string;
    plantedOn: string;
    loading: string;
    error: string;
    success: string;
    retry: string;
    searchPlaceholder: string;
    all: string;
    viewAll: string;
    back: string;
    lastVerified: string;
    speak: string;
    listening: string;
    stop: string;
    playAudio: string;
    pauseAudio: string;
  };
  dashboard: {
    greeting: string;
    greetingSub: string;
    todaysAdvisory: string;
    quickActions: string;
    scanCropDesc: string;
    askAiDesc: string;
    weatherDesc: string;
    pestDesc: string;
    diseaseDesc: string;
    schemesDesc: string;
    myCropsTitle: string;
    addCropQuick: string;
    weatherCardTitle: string;
    rainRisk: string;
    highHeatRisk: string;
    humidityAlert: string;
    askKrishiMitraNow: string;
    askPromptPlaceholder: string;
  };
  aiChat: {
    title: string;
    subtitle: string;
    welcomeMsg: string;
    quickPromptsTitle: string;
    quickPrompts: {
      yellowLeaves: string;
      rainAdvice: string;
      onionPest: string;
      fertilizerTiming: string;
      dripIrrigation: string;
      governmentScheme: string;
    };
    inputPlaceholder: string;
    send: string;
    holdToSpeak: string;
    listeningAlert: string;
    uploadLeafPhoto: string;
    newChat: string;
    chatHistory: string;
    noChatsYet: string;
    aiThinking: string;
    feedbackHelpful: string;
    whatHappening: string;
    whyItHappened: string;
    whatToDoNow: string;
    prevention: string;
    expertEscalation: string;
    disclaimer: string;
  };
  cropScanner: {
    title: string;
    subtitle: string;
    takePhoto: string;
    uploadPhoto: string;
    dragDropText: string;
    cameraPrompt: string;
    captureBtn: string;
    retakeBtn: string;
    samplePhotosTitle: string;
    samplePhotosSubtitle: string;
    samples: {
      tomatoBlight: string;
      cottonWhitefly: string;
      wheatRust: string;
      onionThrips: string;
      healthyRice: string;
      chiliLeafCurl: string;
    };
    analyzingSteps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
    };
    resultTitle: string;
    identifiedCrop: string;
    diagnosis: string;
    symptoms: string;
    immediateAction: string;
    preventionTips: string;
    expertNote: string;
    saveResult: string;
    askAiAboutThis: string;
    scanAgain: string;
    healthyBadge: string;
    diseaseBadge: string;
    pestBadge: string;
    disclaimerNotice: string;
  };
  weather: {
    title: string;
    subtitle: string;
    searchCity: string;
    useGps: string;
    currentWeather: string;
    feelsLike: string;
    rainChance: string;
    rainfall: string;
    humidity: string;
    windSpeed: string;
    uvIndex: string;
    sunriseSunset: string;
    hourlyForecast: string;
    weeklyForecast: string;
    farmAdvisoryTitle: string;
    sprayAdvisory: string;
    irrigationAdvisory: string;
  };
  schemes: {
    title: string;
    subtitle: string;
    findSchemesForMe: string;
    findSchemesDesc: string;
    filterState: string;
    filterCategory: string;
    allStates: string;
    allCategories: string;
    eligibilityTitle: string;
    benefitsTitle: string;
    documentsTitle: string;
    applicationSteps: string;
    matchedSchemes: string;
    whyMatchesYou: string;
    startQuiz: string;
    quizQuestion1: string;
    quizQuestion2: string;
    quizQuestion3: string;
    quizQuestion4: string;
    quizQuestion5: string;
    searchPlaceholder?: string;
    viewDetails?: string;
    applyOnline?: string;
    eligibility?: string;
    documentsRequired?: string;
  };
  crops: {
    title: string;
    subtitle: string;
    addNewCrop: string;
    cropName: string;
    variety: string;
    plantedDate: string;
    area: string;
    soilType: string;
    irrigation: string;
    fertilizer?: string;
    pestWatch?: string;
    waterNow?: string;
    currentStage: string;
    cropCalendar: string;
    stageTasks: string;
    waterSchedule: string;
    markWatered: string;
    noCropsYet: string;
  };
  myCrops: {
    title: string;
    subtitle: string;
    addNewCrop: string;
    cropName: string;
    variety: string;
    plantedDate: string;
    area: string;
    soilType: string;
    irrigation: string;
    fertilizer: string;
    pestWatch: string;
    waterNow: string;
    currentStage: string;
    cropCalendar: string;
    stageTasks: string;
    waterSchedule: string;
    markWatered: string;
    noCropsYet: string;
  };
  profile: {
    title: string;
    farmerDetails: string;
    fullName: string;
    phone: string;
    location: string;
    village: string;
    district: string;
    state: string;
    farmSize: string;
    preferredLanguage: string;
    voiceSettings: string;
    autoVoiceDesc: string;
    notifications: string;
    login: string;
    logout: string;
    demoLogin: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Smart Krishi Assistant",
    appTagline: "AI Farming Companion for Every Indian Farmer",
    assistantName: "Krishi Mitra",
    nav: {
      dashboard: "Home",
      myCrops: "My Crops",
      askAi: "Krishi Mitra AI",
      scanCrop: "Scan Crop",
      weather: "Weather",
      schemes: "Govt Schemes",
      profile: "Profile",
      admin: "Admin Portal",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      viewDetails: "View Details",
      apply: "How to Apply",
      officialWebsite: "Official Portal",
      confidence: "Confidence",
      daysOld: "days old",
      plantedOn: "Planted on",
      loading: "Loading...",
      error: "Something went wrong. Please try again.",
      success: "Saved successfully!",
      retry: "Retry",
      searchPlaceholder: "Search crops, diseases, schemes...",
      all: "All",
      viewAll: "View All",
      back: "Back",
      lastVerified: "Last verified",
      speak: "Speak",
      listening: "Listening... Speak now",
      stop: "Stop",
      playAudio: "Listen",
      pauseAudio: "Pause",
    },
    dashboard: {
      greeting: "Namaste, Farmer Friend 👋",
      greetingSub: "What would you like to check or manage on your farm today?",
      todaysAdvisory: "Today's Agricultural Advisory",
      quickActions: "Quick Farm Services",
      scanCropDesc: "Identify crop, detect disease & pests from photo",
      askAiDesc: "Ask any farming question in voice or text",
      weatherDesc: "Local weather forecast & spraying advice",
      pestDesc: "Identify insects, borers & caterpillars",
      diseaseDesc: "Detect leaf spots, wilts & blights",
      schemesDesc: "Explore subsidies, insurance & PM-KISAN",
      myCropsTitle: "My Farm Crops",
      addCropQuick: "Add Crop",
      weatherCardTitle: "Farm Weather Today",
      rainRisk: "Rain Alert: Rainfall likely tomorrow. Postpone irrigation & spraying.",
      highHeatRisk: "Heat Alert: High temperatures expected. Maintain soil moisture.",
      humidityAlert: "Fungal Risk: High humidity observed. Inspect leaves for spots.",
      askKrishiMitraNow: "Ask Krishi Mitra Anything",
      askPromptPlaceholder: "e.g. My tomato leaves have yellow spots, what should I do?",
    },
    aiChat: {
      title: "Krishi Mitra AI",
      subtitle: "Your Multilingual Agricultural Advisor (English • हिंदी • मराठी)",
      welcomeMsg: "Namaskar! I am Krishi Mitra, your farming companion. You can ask me anything about crops, pests, diseases, fertilizers, irrigation, weather, or government schemes. Type your question or click the microphone to speak!",
      quickPromptsTitle: "Common Farming Questions",
      quickPrompts: {
        yellowLeaves: "My tomato leaves are turning yellow, what should I do?",
        rainAdvice: "Is it safe to spray pesticide before rain tomorrow?",
        onionPest: "How to control thrips in onion crop?",
        fertilizerTiming: "When should I apply urea fertilizer to wheat?",
        dripIrrigation: "How much water do cotton plants need during flowering?",
        governmentScheme: "How can I apply for drip irrigation subsidy?",
      },
      inputPlaceholder: "Type your farming question in English, Hindi, or Marathi...",
      send: "Send",
      holdToSpeak: "Hold / Tap to Speak",
      listeningAlert: "Listening... Please speak your farming question",
      uploadLeafPhoto: "Upload Crop Photo",
      newChat: "New Conversation",
      chatHistory: "Saved Chats",
      noChatsYet: "No previous conversations yet.",
      aiThinking: "Krishi Mitra is analyzing your question...",
      feedbackHelpful: "Was this advice helpful?",
      whatHappening: "🌱 What may be happening",
      whyItHappened: "💡 Why it may happen",
      whatToDoNow: "✅ What you can do now",
      prevention: "🛡️ How to prevent it",
      expertEscalation: "⚠️ When to contact an agriculture expert",
      disclaimer: "AI-assisted guidance. Always check product labels and verify with local Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer.",
    },
    cropScanner: {
      title: "Scan Your Crop & Leaf",
      subtitle: "Instant AI identification of crops, leaf diseases, and agricultural pests",
      takePhoto: "Take Photo (Camera)",
      uploadPhoto: "Upload from Gallery",
      dragDropText: "Drag & drop a crop photo here, or click to browse",
      cameraPrompt: "Align crop leaf or pest in the frame and click capture",
      captureBtn: "Capture Photo",
      retakeBtn: "Take Another Photo",
      samplePhotosTitle: "Or Try a Sample Crop Diagnosis",
      samplePhotosSubtitle: "Click any sample image below to see instant AI analysis:",
      samples: {
        tomatoBlight: "Tomato: Early Blight",
        cottonWhitefly: "Cotton: Whitefly Pest",
        wheatRust: "Wheat: Yellow Rust",
        onionThrips: "Onion: Thrips Infestation",
        healthyRice: "Rice: Healthy Crop",
        chiliLeafCurl: "Chili: Leaf Curl Virus",
      },
      analyzingSteps: {
        step1: "🌱 Checking crop type & plant species...",
        step2: "🔎 Scanning leaf patterns & discoloration...",
        step3: "🐛 Checking for insect pests & caterpillars...",
        step4: "🩺 Evaluating fungal & bacterial disease symptoms...",
        step5: "☁️ Correlating with local temperature & humidity...",
      },
      resultTitle: "Crop Diagnosis Report",
      identifiedCrop: "Identified Crop",
      diagnosis: "Diagnosis / Health Status",
      symptoms: "Visible Symptoms",
      immediateAction: "Immediate Treatment Steps",
      preventionTips: "Integrated Pest Management & Prevention",
      expertNote: "Expert Consultation Note",
      saveResult: "Save to Scan History",
      askAiAboutThis: "Ask Krishi Mitra About This",
      scanAgain: "Scan Another Crop",
      healthyBadge: "Healthy Plant",
      diseaseBadge: "Disease Detected",
      pestBadge: "Pest Infestation",
      disclaimerNotice: "Initial AI visual assessment only. Verify before applying chemical treatments.",
    },
    weather: {
      title: "Farm Weather & Advisory",
      subtitle: "Hyperlocal weather forecasts and actionable farming suggestions",
      searchCity: "Search City or District (e.g. Pune, Nashik, Ludhiana...)",
      useGps: "Use My GPS Location",
      currentWeather: "Current Weather",
      feelsLike: "Feels Like",
      rainChance: "Rain Probability",
      rainfall: "Rainfall Amount",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      uvIndex: "UV Index",
      sunriseSunset: "Sunrise & Sunset",
      hourlyForecast: "24-Hour Forecast",
      weeklyForecast: "7-Day Farm Forecast",
      farmAdvisoryTitle: "Actionable Farming Recommendations",
      sprayAdvisory: "Spraying Advisory",
      irrigationAdvisory: "Irrigation Advisory",
    },
    schemes: {
      title: "Government Agricultural Schemes",
      subtitle: "Subsidies, crop insurance, financial support, and equipment schemes for farmers",
      findSchemesForMe: "Find Schemes for My Farm",
      findSchemesDesc: "Answer 4 quick questions to find subsidies you are eligible for",
      filterState: "Filter by State",
      filterCategory: "Filter by Category",
      allStates: "All India / All States",
      allCategories: "All Categories",
      eligibilityTitle: "Who is Eligible",
      benefitsTitle: "Financial & Subsidy Benefits",
      documentsTitle: "Required Documents",
      applicationSteps: "How to Apply",
      matchedSchemes: "Schemes Recommended for Your Farm",
      whyMatchesYou: "Why this matches you",
      startQuiz: "Start Farm Questionnaire",
      quizQuestion1: "Which state is your farm located in?",
      quizQuestion2: "What is your total cultivated land size?",
      quizQuestion3: "What are your primary crops?",
      quizQuestion4: "Do you need irrigation or solar pump assistance?",
      quizQuestion5: "Are you interested in farm machinery subsidies or crop insurance?",
      searchPlaceholder: "Search schemes by keyword, crop, or department...",
      viewDetails: "View Details",
      applyOnline: "Apply on Portal",
      eligibility: "Eligibility Criteria",
      documentsRequired: "Required Documents",
    },
    crops: {
      title: "My Farm Crops",
      subtitle: "Track growth stages, irrigation schedules, and timely farming tasks",
      addNewCrop: "Add New Crop",
      cropName: "Crop Name",
      variety: "Crop Variety",
      plantedDate: "Sowing / Planting Date",
      area: "Area (Acres)",
      soilType: "Soil Type",
      irrigation: "Irrigation Method",
      fertilizer: "Fertilizer Schedule",
      pestWatch: "Pest & Disease Watch",
      waterNow: "Watered Today",
      currentStage: "Current Growth Stage",
      cropCalendar: "Crop Stage Calendar",
      stageTasks: "Key Farm Operations for Current Stage",
      waterSchedule: "Irrigation Interval",
      markWatered: "Record Watering Today",
      noCropsYet: "No crops added yet. Click 'Add New Crop' to start tracking!",
    },
    myCrops: {
      title: "My Farm Crops",
      subtitle: "Track growth stages, irrigation schedules, and timely farming tasks",
      addNewCrop: "Add New Crop",
      cropName: "Crop Name",
      variety: "Crop Variety",
      plantedDate: "Sowing / Planting Date",
      area: "Area (Acres)",
      soilType: "Soil Type",
      irrigation: "Irrigation Method",
      fertilizer: "Fertilizer Schedule",
      pestWatch: "Pest & Disease Watch",
      waterNow: "Watered Today",
      currentStage: "Current Growth Stage",
      cropCalendar: "Crop Stage Calendar",
      stageTasks: "Key Farm Operations for Current Stage",
      waterSchedule: "Irrigation Interval",
      markWatered: "Record Watering Today",
      noCropsYet: "No crops added yet. Click 'Add New Crop' to start tracking!",
    },
    profile: {
      title: "Farmer Profile & Settings",
      farmerDetails: "Farmer & Farm Details",
      fullName: "Full Name",
      phone: "Mobile Number",
      location: "Farm Location",
      village: "Village / Gram Panchayat",
      district: "District",
      state: "State",
      farmSize: "Farm Size (Acres)",
      preferredLanguage: "App & AI Language",
      voiceSettings: "Voice Assistant Settings",
      autoVoiceDesc: "Automatically read AI responses out loud in voice",
      notifications: "Farming Weather & Pest Alerts",
      login: "Login / Register",
      logout: "Log Out",
      demoLogin: "Quick Farmer Demo Login",
    },
  },
  hi: {
    appName: "स्मार्ट कृषि सहायक",
    appTagline: "हर भारतीय किसान के लिए समर्पित AI डिजिटल साथी",
    assistantName: "कृषि मित्र",
    nav: {
      dashboard: "मुख्य पृष्ठ",
      myCrops: "मेरी फसलें",
      askAi: "कृषि मित्र AI",
      scanCrop: "फसल स्कैन",
      weather: "मौसम",
      schemes: "सरकारी योजनाएं",
      profile: "प्रोफ़ाइल",
      admin: "व्यवस्थापक पोर्टल",
    },
    common: {
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      close: "बंद करें",
      delete: "हटाएं",
      edit: "संपादित करें",
      add: "जोड़ें",
      viewDetails: "विवरण देखें",
      apply: "आवेदन कैसे करें",
      officialWebsite: "आधिकारिक पोर्टल",
      confidence: "सटीकता (विश्वास)",
      daysOld: "दिन की फसल",
      plantedOn: "बुआई की तारीख",
      loading: "लोड हो रहा है...",
      error: "कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।",
      success: "सफलतापूर्वक सुरक्षित किया गया!",
      retry: "पुनः प्रयास करें",
      searchPlaceholder: "फसल, रोग या सरकारी योजना खोजें...",
      all: "सभी",
      viewAll: "सभी देखें",
      back: "पीछे जाएं",
      lastVerified: "अंतिम सत्यापन",
      speak: "बोलें",
      listening: "सुन रहे हैं... कृपया बोलें",
      stop: "रोकें",
      playAudio: "आवाज सुनें",
      pauseAudio: "विराम",
    },
    dashboard: {
      greeting: "नमस्ते किसान भाई 👋",
      greetingSub: "आज आप अपनी खेती के लिए क्या जांचना या जानना चाहते हैं?",
      todaysAdvisory: "आज की महत्वपूर्ण कृषि सलाह",
      quickActions: "त्वरित किसान सेवाएं",
      scanCropDesc: "फोटो खींचकर फसल, रोग और कीट की पहचान करें",
      askAiDesc: "आवाज या लिखकर खेती से जुड़ा कोई भी सवाल पूछें",
      weatherDesc: "स्थानीय मौसम पूर्वानुमान और छिड़काव की सलाह",
      pestDesc: "सुंडी, माहू और अन्य कीटों की पहचान करें",
      diseaseDesc: "पत्तियों के धब्बे, झुलसा और फंगल रोग पहचानें",
      schemesDesc: "पीएम-किसान, सब्सिडी और फसल बीमा योजनाएं खोजें",
      myCropsTitle: "मेरी वर्तमान फसलें",
      addCropQuick: "नई फसल जोड़ें",
      weatherCardTitle: "आज का खेत का मौसम",
      rainRisk: "बारिश चेतावनी: कल बारिश की संभावना है। सिंचाई और दवा छिड़काव टालें।",
      highHeatRisk: "तेज धूप चेतावनी: तापमान अधिक रहेगा। मिट्टी में नमी बनाए रखें।",
      humidityAlert: "फफूंद चेतावनी: नमी अधिक है। पत्तियों पर धब्बों की जांच करें।",
      askKrishiMitraNow: "कृषि मित्र से कुछ भी पूछें",
      askPromptPlaceholder: "जैसे: टमाटर की पत्तियों पर पीले धब्बे हैं, क्या करूं?",
    },
    aiChat: {
      title: "कृषि मित्र AI",
      subtitle: "आपका बहुभाषी कृषि मार्गदर्शक (हिंदी • मराठी • English)",
      welcomeMsg: "नमस्कार किसान भाई! मैं आपका कृषि मित्र हूँ। आप मुझसे फसलों, कीटों, बीमारियों, खाद, सिंचाई, मौसम या सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं। अपना सवाल लिखें या माइक दबाकर बोलें!",
      quickPromptsTitle: "अक्सर पूछे जाने वाले प्रश्न",
      quickPrompts: {
        yellowLeaves: "टमाटर की पत्तियां पीली पड़ रही हैं, क्या उपाय करें?",
        rainAdvice: "कल बारिश आने वाली है, क्या आज कीटनाशक छिड़कना सही है?",
        onionPest: "प्याज की फसल में थ्रिप्स (कीट) नियंत्रण कैसे करें?",
        fertilizerTiming: "गेहूं की फसल में यूरिया और डीएपी कब डालना चाहिए?",
        dripIrrigation: "कपास में फूल आते समय ड्रिप से कितना पानी देना चाहिए?",
        governmentScheme: "ड्रिप सिंचाई और स्प्रिंकलर सब्सिडी के लिए आवेदन कैसे करें?",
      },
      inputPlaceholder: "हिंदी, मराठी या अंग्रेजी में अपना सवाल लिखें...",
      send: "भेजें",
      holdToSpeak: "बोलने के लिए माइक दबाएं",
      listeningAlert: "सुन रहे हैं... कृपया अपना सवाल बोलें",
      uploadLeafPhoto: "फसल/पत्ती का फोटो लगाएं",
      newChat: "नई बातचीत शुरू करें",
      chatHistory: "पुरानी बातचीत",
      noChatsYet: "अभी तक कोई बातचीत सुरक्षित नहीं है।",
      aiThinking: "कृषि मित्र जानकारी तैयार कर रहा है...",
      feedbackHelpful: "क्या यह सलाह आपके काम आई?",
      whatHappening: "🌱 क्या समस्या हो सकती है",
      whyItHappened: "💡 यह क्यों हो सकता है",
      whatToDoNow: "✅ अभी आप क्या कर सकते हैं",
      prevention: "🛡️ रोकथाम के उपाय",
      expertEscalation: "⚠️ कृषि विशेषज्ञ से कब संपर्क करें",
      disclaimer: "यह AI आधारित प्राथमिक सलाह है। किसी भी रासायनिक उपचार से पहले स्थानीय कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से पुष्टि करें।",
    },
    cropScanner: {
      title: "फसल और पत्ती स्कैन करें",
      subtitle: "फोटो खींचकर फसल, रोग और कीटों की त्वरित AI पहचान पाएं",
      takePhoto: "कैमरा से फोटो लें",
      uploadPhoto: "गैलरी से फोटो चुनें",
      dragDropText: "फसल का फोटो यहां खींचकर छोड़ें या क्लिक करें",
      cameraPrompt: "पत्ती या कीट को कैमरे के सामने रखें और फोटो खींचें",
      captureBtn: "फोटो खींचें",
      retakeBtn: "दूसरा फोटो लें",
      samplePhotosTitle: "या इनमें से कोई नमूना फोटो जांचें",
      samplePhotosSubtitle: "त्वरित AI विश्लेषण देखने के लिए किसी भी फोटो पर क्लिक करें:",
      samples: {
        tomatoBlight: "टमाटर: अगेती झुलसा (Early Blight)",
        cottonWhitefly: "कपास: सफेद मक्खी (Whitefly)",
        wheatRust: "गेहूं: पीला रतुआ (Yellow Rust)",
        onionThrips: "प्याज: थ्रिप्स कीट",
        healthyRice: "धान: स्वस्थ फसल",
        chiliLeafCurl: "मिर्च: पत्ती मरोड़ रोग (Leaf Curl)",
      },
      analyzingSteps: {
        step1: "🌱 फसल के प्रकार और पौधे की जांच की जा रही है...",
        step2: "🔎 पत्तियों के धब्बे और लक्षणों का विश्लेषण हो रहा है...",
        step3: "🐛 कीड़ों, सुंडियों और कीटों की पहचान की जा रही है...",
        step4: "🩺 फंगल और बैक्टीरियल रोगों की जांच हो रही है...",
        step5: "☁️ स्थानीय तापमान और मौसम से मिलान किया जा रहा है...",
      },
      resultTitle: "फसल निदान रिपोर्ट",
      identifiedCrop: "पहचानी गई फसल",
      diagnosis: "निदान / स्थिति",
      symptoms: "दिखने वाले लक्षण",
      immediateAction: "तत्काल करने योग्य उपाय",
      preventionTips: "एकीकृत कीट प्रबंधन और रोकथाम",
      expertNote: "विशेषज्ञ सलाह नोट",
      saveResult: "रिपोर्ट सुरक्षित करें",
      askAiAboutThis: "कृषि मित्र से इसके बारे में पूछें",
      scanAgain: "दूसरी फसल जांचें",
      healthyBadge: "स्वस्थ पौधा",
      diseaseBadge: "रोग के लक्षण मिले",
      pestBadge: "कीट का प्रकोप मिला",
      disclaimerNotice: "यह फोटो आधारित प्रारंभिक AI जांच है। रसायनों के उपयोग से पहले कृषि विशेषज्ञ से सलाह लें।",
    },
    weather: {
      title: "खेत का मौसम और कृषि सलाह",
      subtitle: "स्थानीय मौसम पूर्वानुमान और खेती के अनुकूल सटीक सुझाव",
      searchCity: "शहर या जिला खोजें (जैसे: पुणे, नासिक, इंदौर, लुधियाना...)",
      useGps: "मेरा GPS स्थान उपयोग करें",
      currentWeather: "वर्तमान मौसम",
      feelsLike: "महसूस तापमान",
      rainChance: "बारिश की संभावना",
      rainfall: "संभावित वर्षा",
      humidity: "हवा में नमी",
      windSpeed: "हवा की गति",
      uvIndex: "यूवी इंडेक्स",
      sunriseSunset: "सूर्योदय व सूर्यास्त",
      hourlyForecast: "24 घंटे का पूर्वानुमान",
      weeklyForecast: "7 दिनों का कृषि मौसम",
      farmAdvisoryTitle: "मौसम अनुसार कृषि सुझाव",
      sprayAdvisory: "दवा छिड़काव सलाह",
      irrigationAdvisory: "सिंचाई सलाह",
    },
    schemes: {
      title: "सरकारी कृषि योजनाएं",
      subtitle: "किसानों के लिए सरकारी सब्सिडी, फसल बीमा, आर्थिक मदद और उपकरण योजनाएं",
      findSchemesForMe: "मेरे खेत के लिए योजनाएं खोजें",
      findSchemesDesc: "4 आसान सवालों के जवाब दें और अपनी पात्रता वाली योजनाएं जानें",
      filterState: "राज्य चुनें",
      filterCategory: "योजना की श्रेणी",
      allStates: "संपूर्ण भारत / सभी राज्य",
      allCategories: "सभी श्रेणियां",
      eligibilityTitle: "पात्रता (किसे मिलेगा लाभ)",
      benefitsTitle: "योजना के लाभ और सब्सिडी",
      documentsTitle: "आवश्यक दस्तावेज",
      applicationSteps: "आवेदन कैसे करें",
      matchedSchemes: "आपके खेत के लिए चुनी गई योजनाएं",
      whyMatchesYou: "यह योजना आपके लिए क्यों उपयोगी है",
      startQuiz: "प्रश्नावली शुरू करें",
      quizQuestion1: "आपका खेत किस राज्य में है?",
      quizQuestion2: "आपके पास कुल कितनी एकड़ जमीन है?",
      quizQuestion3: "आप मुख्य रूप से कौन सी फसलें उगाते हैं?",
      quizQuestion4: "क्या आपको ड्रिप सिंचाई या सोलर पंप की आवश्यकता है?",
      quizQuestion5: "क्या आप कृषि यंत्र सब्सिडी या फसल बीमा में रुचि रखते हैं?",
      searchPlaceholder: "योजना, फसल या विभाग खोजें...",
      viewDetails: "विवरण देखें",
      applyOnline: "पोर्टल पर आवेदन करें",
      eligibility: "पात्रता शर्तें",
      documentsRequired: "आवश्यक दस्तावेज",
    },
    crops: {
      title: "मेरी फसलें और कैलेंडर",
      subtitle: "फसल विकास चरण, सिंचाई चक्र और समय पर जरूरी कृषि कार्य देखें",
      addNewCrop: "नई फसल जोड़ें",
      cropName: "फसल का नाम",
      variety: "फसल की किस्म",
      plantedDate: "बुआई की तारीख",
      area: "क्षेत्रफल (एकड़)",
      soilType: "मिट्टी का प्रकार",
      irrigation: "सिंचाई का साधन",
      fertilizer: "उर्वरक एवं खाद अनुसूची",
      pestWatch: "कीट एवं रोग निगरानी",
      waterNow: "आज पानी दिया",
      currentStage: "वर्तमान विकास चरण",
      cropCalendar: "फसल विकास कैलेंडर",
      stageTasks: "वर्तमान चरण में करने योग्य मुख्य कार्य",
      waterSchedule: "सिंचाई का अंतराल",
      markWatered: "आज पानी दिया (दर्ज करें)",
      noCropsYet: "अभी तक कोई फसल नहीं जोड़ी गई है। 'नई फसल जोड़ें' पर क्लिक करें!",
    },
    myCrops: {
      title: "मेरी फसलें और कैलेंडर",
      subtitle: "फसल विकास चरण, सिंचाई चक्र और समय पर जरूरी कृषि कार्य देखें",
      addNewCrop: "नई फसल जोड़ें",
      cropName: "फसल का नाम",
      variety: "फसल की किस्म",
      plantedDate: "बुआई की तारीख",
      area: "क्षेत्रफल (एकड़)",
      soilType: "मिट्टी का प्रकार",
      irrigation: "सिंचाई का साधन",
      fertilizer: "उर्वरक एवं खाद अनुसूची",
      pestWatch: "कीट एवं रोग निगरानी",
      waterNow: "आज पानी दिया",
      currentStage: "वर्तमान विकास चरण",
      cropCalendar: "फसल विकास कैलेंडर",
      stageTasks: "वर्तमान चरण में करने योग्य मुख्य कार्य",
      waterSchedule: "सिंचाई का अंतराल",
      markWatered: "आज पानी दिया (दर्ज करें)",
      noCropsYet: "अभी तक कोई फसल नहीं जोड़ी गई है। 'नई फसल जोड़ें' पर क्लिक करें!",
    },
    profile: {
      title: "किसान प्रोफ़ाइल और सेटिंग्स",
      farmerDetails: "किसान और खेत का विवरण",
      fullName: "पूरा नाम",
      phone: "मोबाइल नंबर",
      location: "खेत का स्थान",
      village: "गांव / ग्राम पंचायत",
      district: "जिला",
      state: "राज्य",
      farmSize: "जमीन का आकार (एकड़)",
      preferredLanguage: "ऐप और AI की भाषा",
      voiceSettings: "आवाज सहायक सेटिंग्स",
      autoVoiceDesc: "AI के उत्तर स्वतः बोलकर सुनाएं",
      notifications: "मौसम व कीट चेतावनी अलर्ट",
      login: "लॉगिन / खाता बनाएं",
      logout: "लॉगआउट",
      demoLogin: "किसान डेमो लॉगिन",
    },
  },
  mr: {
    appName: "स्मार्ट कृषी सहाय्यक",
    appTagline: "प्रत्येक बळीराजासाठी हक्काचा AI डिजिटल कृषी मित्र",
    assistantName: "कृषी मित्र",
    nav: {
      dashboard: "मुख्य पान",
      myCrops: "माझी पिके",
      askAi: "कृषी मित्र AI",
      scanCrop: "पीक स्कॅन",
      weather: "हवामान",
      schemes: "शासकीय योजना",
      profile: "माझी माहिती",
      admin: "प्रशासक पोर्टल",
    },
    common: {
      save: "जतन करा",
      cancel: "रद्द करा",
      close: "बंद करा",
      delete: "हटवा",
      edit: "बदल करा",
      add: "जोडा",
      viewDetails: "सविस्तर माहिती",
      apply: "अर्ज कसा करावा",
      officialWebsite: "अधिकृत संकेतस्थळ",
      confidence: "अचूकता (विश्वासार्हता)",
      daysOld: "दिवसांचे पीक",
      plantedOn: "लागवड दिनांक",
      loading: "माहिती लोड होत आहे...",
      error: "काहीतरी अडचण आली. कृपया पुन्हा प्रयत्न करा.",
      success: "यशस्वीरित्या जतन झाले!",
      retry: "पुन्हा प्रयत्न करा",
      searchPlaceholder: "पीक, रोग किंवा शासकीय योजना शोधा...",
      all: "सर्व",
      viewAll: "सर्व पहा",
      back: "मागे या",
      lastVerified: "शेवटची पडताळणी",
      speak: "बोला",
      listening: "ऐकत आहे... बोला",
      stop: "थांबवा",
      playAudio: "आवाज ऐका",
      pauseAudio: "थांबवा",
    },
    dashboard: {
      greeting: "रामराम शेतकरी दादा 👋",
      greetingSub: "आज शेतातील कोणत्या कामासाठी किंवा पिकाच्या समस्येसाठी मदत हवी आहे?",
      todaysAdvisory: "आजचा महत्त्वाचा कृषी सल्ला",
      quickActions: "शेतकरी सेवा",
      scanCropDesc: "फोटो काढून पीक, रोग व किडींची त्वरित ओळख करा",
      askAiDesc: "बोलून किंवा लिहून शेतीविषयक कोणताही प्रश्न विचारा",
      weatherDesc: "स्थानिक हवामान अंदाज आणि फवारणीचे नियोजन",
      pestDesc: "अळी, मावा, तुडतुडे व किडींची माहिती मिळवा",
      diseaseDesc: "पानांवरील करपा, भुरी व बुरशीजन्य रोग ओळखा",
      schemesDesc: "पीएम-किसान, ठिबक अनुदान व पीक विमा योजना",
      myCropsTitle: "माझ्या शेतातील पिके",
      addCropQuick: "नवीन पीक जोडा",
      weatherCardTitle: "आजचे शेतातील हवामान",
      rainRisk: "पाऊस इशारा: उद्या पावसाची शक्यता आहे. पाणी देणे व फवारणी पुढे ढकला.",
      highHeatRisk: "उष्णता इशारा: तापमान जास्त राहील. जमिनीत ओल टिकवून ठेवा.",
      humidityAlert: "बुरशी इशारा: हवेत जास्त दमटपणा आहे. पानांवर करपा तपासा.",
      askKrishiMitraNow: "कृषी मित्राला काहीही विचारा",
      askPromptPlaceholder: "उदा. माझ्या कांद्याच्या पिकाला पिवळे डाग पडले आहेत, काय करू?",
    },
    aiChat: {
      title: "कृषी मित्र AI",
      subtitle: "तुमचा बहुभाषिक डिजिटल कृषी सल्लागार (मराठी • हिंदी • English)",
      welcomeMsg: "रामराम शेतकरी बंधूंनो! मी तुमचा कृषी मित्र आहे. पिके, खते, रोग, कीड, हवामान किंवा सरकारी योजनांबद्दल काहीही विचारू शकता. तुमचा प्रश्न खाली टाईप करा किंवा माईक दाबून बोला!",
      quickPromptsTitle: "नेहमी विचारले जाणारे प्रश्न",
      quickPrompts: {
        yellowLeaves: "माझ्या टोमॅटोच्या पिकाची पाने पिवळी पडत आहेत, काय करू?",
        rainAdvice: "उद्या पाऊस पडणार आहे, आज औषध फवारणी करावी का?",
        onionPest: "कांद्यावरील थ्रिप्स (फुलकिडे) कसे नियंत्रित करावे?",
        fertilizerTiming: "गव्हाच्या पिकाला युरिया व डीएपी खताचा पहिला हप्ता कधी द्यावा?",
        dripIrrigation: "कापसाला फुले लागताना ठिबक सिंचनाने किती पाणी द्यावे?",
        governmentScheme: "ठिबक सिंचन व तुषार अनुदानासाठी अर्ज कसा करावा?",
      },
      inputPlaceholder: "मराठी, हिंदी किंवा इंग्रजीत तुमचा प्रश्न विचारा...",
      send: "पाठवा",
      holdToSpeak: "बोलण्यासाठी माईक दाबा",
      listeningAlert: "ऐकत आहे... तुमचा प्रश्न स्पष्ट बोला",
      uploadLeafPhoto: "पिकाचा / पानाचा फोटो पाठवा",
      newChat: "नवीन संवाद",
      chatHistory: "जुन्या संवादांची नोंद",
      noChatsYet: "अद्याप कोणतीही जुनी चर्चा नाही.",
      aiThinking: "कृषी मित्र उत्तर तयार करत आहे...",
      feedbackHelpful: "हा सल्ला उपयुक्त वाटला का?",
      whatHappening: "🌱 संभाव्य समस्या काय आहे",
      whyItHappened: "💡 हे कशामुळे होऊ शकते",
      whatToDoNow: "✅ आत्ता लगेच काय करावे",
      prevention: "🛡️ पुढील प्रतिबंधात्मक उपाय",
      expertEscalation: "⚠️ कृषी तज्ज्ञांचा सल्ला केव्हा घ्यावा",
      disclaimer: "हा AI आधारित प्राथमिक सल्ला आहे. रसायनांच्या वापरापूर्वी कृषी विज्ञान केंद्र किंवा कृषी अधिकाऱ्यांशी संपर्क साधावा.",
    },
    cropScanner: {
      title: "पीक व पान स्कॅन करा",
      subtitle: "फोटो काढून पीक, पानांवरील रोग आणि किडींची त्वरित AI ओळख करा",
      takePhoto: "कॅमेऱ्याने फोटो काढा",
      uploadPhoto: "गॅलरीतून फोटो निवडा",
      dragDropText: "पिकाचा फोटो येथे टाका किंवा फाईल निवडा",
      cameraPrompt: "बाधित पान किंवा कीड कॅमेऱ्याच्या मध्यभागी ठेवून फोटो काढा",
      captureBtn: "फोटो काढा",
      retakeBtn: "दुसरा फोटो काढा",
      samplePhotosTitle: "किंवा खालील नमुना फोटो तपासा",
      samplePhotosSubtitle: "त्वरित AI विश्लेषण पाहण्यासाठी खालील फोटोवर क्लिक करा:",
      samples: {
        tomatoBlight: "टोमॅटो: अगेती करपा (Early Blight)",
        cottonWhitefly: "कापूस: पांढरी माशी (Whitefly)",
        wheatRust: "गहू: तांबेरा रोग (Yellow Rust)",
        onionThrips: "कांदा: थ्रिप्स (फुलकिडे)",
        healthyRice: "भात: निरोगी पीक",
        chiliLeafCurl: "मिरची: चुरडा-मुरडा / बोकड्या (Leaf Curl)",
      },
      analyzingSteps: {
        step1: "🌱 पिकाचा प्रकार आणि वनस्पतीची तपासणी होत आहे...",
        step2: "🔎 पानांवरील डाग आणि लक्षणांचे विश्लेषण सुरू आहे...",
        step3: "🐛 किडी, अळ्या आणि माशीचा प्रादुर्भाव तपासला जात आहे...",
        step4: "🩺 बुरशीजन्य व जिवाणूजन्य रोगांची तपासणी सुरू आहे...",
        step5: "☁️ स्थानिक हवामान आणि आर्द्रतेचा अंदाज घेतला जात आहे...",
      },
      resultTitle: "पीक आरोग्य तपासणी अहवाल",
      identifiedCrop: "ओळखलेले पीक",
      diagnosis: "निदान / सद्यस्थिती",
      symptoms: "दिसून येणारी लक्षणे",
      immediateAction: "तातडीने करावयाचे उपाय",
      preventionTips: "एकीकृत कीड व्यवस्थापन व प्रतिबंध",
      expertNote: "तज्ज्ञ सल्ला टीप",
      saveResult: "अहवाल जतन करा",
      askAiAboutThis: "कृषी मित्राशी यावर चर्चा करा",
      scanAgain: "दुसरे पीक तपासा",
      healthyBadge: "निरोगी पीक",
      diseaseBadge: "रोगाची लक्षणे आढळली",
      pestBadge: "किडींचा प्रादुर्भाव आढळला",
      disclaimerNotice: "हा फोटोवर आधारित प्राथमिक AI अंदाज आहे. खात्रीसाठी स्थानिक कृषी सहाय्यकांचा सल्ला घ्या.",
    },
    weather: {
      title: "शेतातील हवामान व कृषी सल्ला",
      subtitle: "स्थानिक हवामान अंदाज आणि शेतीसाठी उपयुक्त कृषी शिफारशी",
      searchCity: "तालुका किंवा जिल्हा शोधा (उदा: पुणे, नाशिक, नागपूर, सातारा...)",
      useGps: "माझे GPS स्थान वापरा",
      currentWeather: "सध्याचे हवामान",
      feelsLike: "जाणवणारे तापमान",
      rainChance: "पावसाची शक्यता",
      rainfall: "अपेक्षित पाऊस",
      humidity: "हवेतील आर्द्रता",
      windSpeed: "वाऱ्याचा वेग",
      uvIndex: "अल्ट्राव्हायोलेट इंडेक्स",
      sunriseSunset: "सूर्योदय व सूर्यास्त",
      hourlyForecast: "२४ तासांचा अंदाज",
      weeklyForecast: "७ दिवसांचा कृषी हवामान अंदाज",
      farmAdvisoryTitle: "हवामानावर आधारित शेती सल्ला",
      sprayAdvisory: "औषध फवारणी सल्ला",
      irrigationAdvisory: "पाणी नियोजन सल्ला",
    },
    schemes: {
      title: "शासकीय कृषी योजना",
      subtitle: "शेतकऱ्यांसाठी सबसिडी, पीक विमा, अवजारे व आर्थिक मदतीची सर्व माहिती",
      findSchemesForMe: "माझ्या शेतीसाठी योजना शोधा",
      findSchemesDesc: "४ सोप्या प्रश्नांची उत्तरे द्या आणि तुमच्या पात्रतेच्या योजना शोधा",
      filterState: "राज्य निवडा",
      filterCategory: "योजनेचा प्रकार",
      allStates: "संपूर्ण भारत / सर्व राज्ये",
      allCategories: "सर्व प्रकारच्या योजना",
      eligibilityTitle: "पात्रता (कोणाला मिळणार लाभ)",
      benefitsTitle: "अनुदान व आर्थिक लाभ",
      documentsTitle: "लागणारी कागदपत्रे (उदा. ७/१२, आधार)",
      applicationSteps: "अर्ज करण्याची सोपी पद्धत",
      matchedSchemes: "तुमच्या शेतीसाठी सुचवलेल्या योजना",
      whyMatchesYou: "ही योजना तुमच्यासाठी का योग्य आहे",
      startQuiz: "प्रश्नावली सुरू करा",
      quizQuestion1: "तुमची शेती कोणत्या राज्यात आहे?",
      quizQuestion2: "तुमच्याकडे किती एकर शेती आहे?",
      quizQuestion3: "तुम्ही कोणती मुख्य पिके घेता?",
      quizQuestion4: "तुम्हाला ठिबक सिंचन किंवा सौर पंपाची गरज आहे का?",
      quizQuestion5: "तुम्हाला ट्रॅक्टर/अवजारे अनुदान किंवा पीक विम्यात रस आहे का?",
      searchPlaceholder: "योजना, पीक किंवा विभाग शोधा...",
      viewDetails: "सविस्तर माहिती",
      applyOnline: "पोर्टलवर अर्ज करा",
      eligibility: "पात्रतेच्या अटी",
      documentsRequired: "लागणारी कागदपत्रे",
    },
    crops: {
      title: "माझी पिके आणि कॅलेंडर",
      subtitle: "पिकाचे वाढीचे टप्पे, पाण्याचे नियोजन आणि वेळेवर करावयाची शेतीकामे",
      addNewCrop: "नवीन पीक जोडा",
      cropName: "पिकाचे नाव",
      variety: "पिकाचा वाण / जात",
      plantedDate: "लागवड / पेरणी दिनांक",
      area: "क्षेत्र (एकर)",
      soilType: "जमिनीचा प्रकार",
      irrigation: "सिंचनाची पद्धत",
      fertilizer: "खतांचे नियोजन",
      pestWatch: "रोग व कीड निरीक्षण",
      waterNow: "आज पाणी दिले",
      currentStage: "सध्याचा वाढीचा टप्पा",
      cropCalendar: "पीक वाढ कॅलेंडर",
      stageTasks: "या टप्प्यात करावयाची महत्त्वाची कामे",
      waterSchedule: "पाणी देण्याचे अंतर",
      markWatered: "आज पाणी दिले (नोंद करा)",
      noCropsYet: "अद्याप कोणतेही पीक जोडलेले नाही. 'नवीन पीक जोडा' वर क्लिक करा!",
    },
    myCrops: {
      title: "माझी पिके आणि कॅलेंडर",
      subtitle: "पिकाचे वाढीचे टप्पे, पाण्याचे नियोजन आणि वेळेवर करावयाची शेतीकामे",
      addNewCrop: "नवीन पीक जोडा",
      cropName: "पिकाचे नाव",
      variety: "पिकाचा वाण / जात",
      plantedDate: "लागवड / पेरणी दिनांक",
      area: "क्षेत्र (एकर)",
      soilType: "जमिनीचा प्रकार",
      irrigation: "सिंचनाची पद्धत",
      fertilizer: "खतांचे नियोजन",
      pestWatch: "रोग व कीड निरीक्षण",
      waterNow: "आज पाणी दिले",
      currentStage: "सध्याचा वाढीचा टप्पा",
      cropCalendar: "पीक वाढ कॅलेंडर",
      stageTasks: "या टप्प्यात करावयाची महत्त्वाची कामे",
      waterSchedule: "पाणी देण्याचे अंतर",
      markWatered: "आज पाणी दिले (नोंद करा)",
      noCropsYet: "अद्याप कोणतेही पीक जोडलेले नाही. 'नवीन पीक जोडा' वर क्लिक करा!",
    },
    profile: {
      title: "शेतकरी माहिती व सेटिंग्ज",
      farmerDetails: "शेतकरी व शेतीचा तपशील",
      fullName: "पूर्ण नाव",
      phone: "मोबाईल क्रमांक",
      location: "शेताचे ठिकाण",
      village: "गाव / ग्रामपंचायत",
      district: "जिल्हा",
      state: "राज्य",
      farmSize: "शेतीचे क्षेत्र (एकर)",
      preferredLanguage: "अ‍ॅप व AI ची भाषा",
      voiceSettings: "आवाज सहाय्यक सेटिंग्ज",
      autoVoiceDesc: "AI ची उत्तरे आपोआप आवाजात ऐकवा",
      notifications: "हवामान व कीड इशारा सूचना",
      login: "लॉगिन / नवीन खाते",
      logout: "लॉगआउट",
      demoLogin: "शेतकरी डेमो लॉगिन",
    },
  },
};
