# 🌾 Smart Krishi Assistant

> **AI-powered farming companion for modern Indian farmers**

Smart Krishi Assistant is a multilingual AI farming platform designed to help farmers make better decisions about **crop health, diseases, pests, weather, irrigation, and government schemes**.

The platform combines **Google Gemini AI, image-based crop analysis, location-aware weather intelligence, multilingual assistance, and government-scheme matching** into one simple farmer-friendly application.

It supports **English, Hindi, and Marathi**, making agricultural technology more accessible to farmers across India.

---

## 🚀 Live Application

🌐 **Smart Krishi Assistant:**
https://smart-krishi-assistant.ai.studio

---

## ✨ Key Features

### 🤖 AI Farming Assistant

Farmers can ask agricultural questions and receive practical, step-by-step guidance from **Krishi Mitra**, the application's AI farming assistant.

The AI considers information such as:

* 🌱 Current crop
* 📅 Crop age
* 📍 Farmer's location
* 🌦️ Local weather
* 💧 Irrigation
* 🪴 Soil conditions
* 🐛 Pest symptoms
* 🍃 Crop diseases
* 💬 Previous conversation context

The application uses a server-side Gemini API integration and includes fallback responses when the AI service is unavailable.

---

### 📸 AI Crop Disease & Pest Detection

Farmers can provide a crop photograph for AI-powered visual analysis.

The image-analysis system can identify or assess:

* 🌾 Crop species
* 🦠 Diseases
* 🐛 Pests and insects
* 🧪 Nutrient deficiencies
* 🌿 Physical crop damage
* ✅ Healthy crops

The analysis provides:

* Crop identification
* Crop confidence
* Estimated growth stage
* Detected condition
* Condition type
* Confidence score
* Visible symptoms
* Immediate actions
* Prevention recommendations
* Expert/KVK advice
* Weather-related risk information

The backend sends crop images to Gemini's vision capabilities and expects structured JSON analysis.

> ⚠️ **Important:** AI crop diagnosis is an initial assessment and should not replace professional agricultural advice.

---

### 🌐 Multilingual Support

The assistant is designed for Indian farmers and supports:

| Language     | Code |
| ------------ | ---- |
| 🇬🇧 English | `en` |
| 🇮🇳 Hindi   | `hi` |
| 🇮🇳 Marathi | `mr` |

The AI response is generated entirely in the farmer's selected language.

---

### 🎤 Voice & Text-to-Speech

The application includes multilingual speech functionality for:

* English
* Hindi
* Marathi

The backend provides a `/api/speech/tts` endpoint that converts assistant responses into audio and returns an MPEG audio stream.

The application also requests microphone access for voice functionality.

---

### 🌦️ Location-Aware Weather Intelligence

The weather system can work with:

* 📍 GPS coordinates
* 🏙️ City/town names
* 🗺️ District-based weather information

When GPS coordinates are supplied, the application attempts reverse geocoding to determine the user's town, village, or city.

Weather information includes:

* 🌡️ Temperature
* 🤒 Feels-like temperature
* ☁️ Weather condition
* 💧 Humidity
* 🌧️ Rain probability
* 💦 Expected rainfall
* 💨 Wind speed
* 🧭 Wind direction
* ☀️ UV index
* 🌅 Sunrise
* 🌇 Sunset
* 📅 Daily forecast
* ⏱️ Hourly forecast
* 🌱 Agricultural recommendations

The system also generates farming advice based on conditions such as high humidity and heat stress.

---

### 🏛️ Government Schemes

Smart Krishi Assistant provides information about agricultural government schemes.

The backend currently includes schemes such as:

* **PM-KISAN**
* **Pradhan Mantri Fasal Bima Yojana (PMFBY)**
* **Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)**
* **PM-KUSUM Solar Agricultural Pump Scheme**

Scheme information can include:

* Eligibility
* Benefits
* Required documents
* Application process
* Official portal
* State availability
* Verification date

The `/api/schemes` endpoint supports filtering by **category, state, and search terms**.

---

### 🎯 AI Government Scheme Matching

Farmers can receive scheme recommendations based on their requirements.

Matching can consider:

* State
* Land size
* Primary crops
* Irrigation requirements
* Equipment requirements
* Crop insurance interest
* Organic farming interest
* Solar requirements

The system returns matching schemes with a **match score and reason**.

---

## 🧠 AI Safety & Agricultural Guidance

The AI assistant is designed to provide practical agricultural information in simple language.

Its guidance emphasizes:

* Step-by-step recommendations
* Preventive farming practices
* Integrated Pest Management (IPM)
* Appropriate irrigation
* Crop-specific context
* Weather-aware recommendations
* Consultation with KVK/agriculture extension officers
* Following official pesticide/fertilizer labels

It is also instructed not to present uncertain image-based diagnoses as guaranteed facts.

---

## 🏗️ Technology Stack

### Frontend

* ⚛️ React 19
* ⚡ Vite 6
* 🎨 Tailwind CSS 4
* 🎞️ Motion
* 🧩 Lucide React
* 🟦 TypeScript

### Backend

* 🟢 Node.js
* 🚂 Express
* 📘 TypeScript
* ⚡ Vite middleware
* 🤖 Google Gemini API

### Cloud & Data

* 🔥 Firebase
* ☁️ Firestore
* 🔐 Firebase Authentication
* 📦 Firebase Storage

The project's package configuration includes React, Vite, Express, Firebase, Google GenAI, Tailwind, Motion, and TypeScript dependencies.

---

## 🏛️ System Architecture

```text
                    ┌─────────────────────────┐
                    │   Farmer / User         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ React + Vite Frontend   │
                    │                         │
                    │ • AI Chat               │
                    │ • Crop Scanner          │
                    │ • Weather               │
                    │ • Schemes               │
                    │ • Voice                 │
                    └────────────┬────────────┘
                                 │
                         HTTP / REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Express + TypeScript    │
                    │       Backend           │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
       ┌────────────┐     ┌─────────────┐    ┌─────────────┐
       │ Gemini AI  │     │   Weather   │    │  Firestore  │
       │            │     │   Services  │    │ / Firebase  │
       └────────────┘     └─────────────┘    └─────────────┘
              │
              ▼
       AI Agricultural
          Guidance
```

---

## 🔌 Main API Endpoints

| Endpoint                |   Method | Purpose                                 |
| ----------------------- | -------: | --------------------------------------- |
| `/api/health`           |      GET | Backend health check                    |
| `/api/ai/chat`          |     POST | Multilingual AI farming assistant       |
| `/api/ai/analyze-image` |     POST | Crop/disease/pest image analysis        |
| `/api/speech/tts`       | GET/POST | Text-to-speech                          |
| `/api/weather`          |      GET | Weather and agricultural weather advice |
| `/api/schemes`          |      GET | Search/filter government schemes        |
| `/api/schemes`          |     POST | Add a government scheme                 |
| `/api/schemes/:id`      |      PUT | Update a scheme                         |
| `/api/schemes/:id`      |   DELETE | Delete a scheme                         |
| `/api/ai/scheme-match`  |     POST | Match farmers with schemes              |

The AI chat and image-analysis endpoints are implemented in the Express server.

---

## 📂 Project Structure

```text
smart-krishi-assistant/
│
├── src/
│   ├── main.tsx
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
│
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
│
├── .env.example
├── .gitignore
├── bun.lock
└── README.md
```

The application uses `src/main.tsx` as the frontend entry point and Vite/React for the client application.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd smart-krishi-assistant
```

### 2. Install dependencies

```bash
npm install
```

The project also contains a Bun lockfile, so Bun can be used if preferred.

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The server reads `GEMINI_API_KEY` from the environment before initializing the Google GenAI client.

> 🔐 **Never commit your `.env.local` or API keys to GitHub.**

The project's `.gitignore` excludes `.env*` files while explicitly allowing `.env.example`.

---

## ▶️ Run the Application

### Development

```bash
npm run dev
```

The project uses an Express server with Vite middleware during development.

The original project configuration also defines:

```bash
npm run build
npm start
npm run preview
npm run lint
```

---

## 🏭 Production Build

Build the frontend and backend:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

In production, Express serves the generated Vite `dist` directory.

---

## 📱 Required Permissions

Depending on the features being used, the application can request:

| Permission     | Usage                       |
| -------------- | --------------------------- |
| 📷 Camera      | Crop image capture/scanning |
| 🎤 Microphone  | Voice interaction           |
| 📍 Geolocation | Location-aware weather      |

These permissions are declared in the application metadata.

---

## 🔄 How It Works

### Ask an Agricultural Question

```text
Farmer
  ↓
Select Language
  ↓
Enter Question
  ↓
Add Crop / Location / Weather Context
  ↓
Gemini AI
  ↓
Krishi Mitra
  ↓
Practical Agricultural Guidance
```

### Scan a Crop

```text
Take / Upload Crop Photo
          ↓
     Image Analysis
          ↓
       Gemini AI
          ↓
Crop + Disease/Pest Detection
          ↓
Symptoms + Confidence
          ↓
Immediate Actions
          ↓
Prevention + Expert Advice
```

### Find Government Schemes

```text
Farmer Profile
      ↓
Land + Crop + Requirements
      ↓
Scheme Matching
      ↓
Match Score
      ↓
Recommended Government Schemes
```

---

## 🗃️ Farmer Profile Data

The project blueprint defines farmer profile information such as:

* User ID
* Full name
* Phone
* Email
* State
* District
* Village
* Land area
* Primary crops
* Soil type
* Irrigation type
* Preferred language
* Created/updated timestamps

---

## 📊 Crop Scan Data

Crop scan records can contain:

* Crop name
* Detected condition
* Condition type
* Confidence
* Crop image
* Symptoms
* Immediate steps
* Prevention
* Expert advice
* Timestamp

---

## 🛡️ Reliability & Fallbacks

The application is designed to remain usable when external AI requests fail.

For AI chat:

```text
Gemini API
    ↓
Success → AI Response
    ↓
Failure
    ↓
Grounded Agricultural Fallback
```

For crop image analysis:

```text
Gemini Vision
    ↓
Successful JSON
    ↓
Crop Analysis

API Failure
    ↓
Fallback Analysis
```

This fallback behavior is implemented directly in the backend.

---

## ⚠️ Disclaimer

Smart Krishi Assistant provides **AI-assisted agricultural information** and should be treated as a decision-support tool.

AI-generated crop diagnoses and recommendations may be incorrect or incomplete.

Farmers should:

* Verify serious crop problems with qualified agricultural experts.
* Follow official product labels for agricultural chemicals.
* Consult their local **Krishi Vigyan Kendra (KVK)** or Agriculture Extension Officer.
* Verify government-scheme eligibility and current terms through official government portals.

---

## 🔮 Future Enhancements

Potential future improvements include:

* 📡 Integration with live agricultural weather APIs
* 🌾 More crop and disease models
* 🛰️ Satellite-based crop monitoring
* 📊 Farm analytics dashboard
* 💧 Smart irrigation recommendations
* 🧪 Soil-health recommendations
* 📈 Crop-price intelligence
* 🗺️ More precise village-level weather
* 📲 WhatsApp/SMS notifications
* 🧑‍🌾 Direct expert consultation
* 📚 Expanded regional-language support
* 🔔 Crop disease and weather alerts
* 📅 Personalized crop activity calendar

---

## 🎯 Project Objective

The main objective of **Smart Krishi Assistant** is to make agricultural knowledge more accessible by bringing AI-powered assistance directly to farmers in a simple, multilingual interface.

The platform aims to help farmers:

**Understand → Detect → Decide → Act**

🌱 **Understand** crop problems
📸 **Detect** diseases and pests
🤖 **Decide** using AI-assisted information
🚜 **Act** with practical farming guidance

---

## 👨‍💻 Development

Built using modern web technologies with a focus on:

* Accessibility
* Multilingual interaction
* AI-assisted agriculture
* Location-aware information
* Farmer-friendly UX
* Resilient backend services
* Practical agricultural guidance

---

## 📄 License

Add your preferred open-source license here, for example:

```text
MIT License
```

If this is a college, hackathon, or institutional project, replace this section with the license or usage terms required by your organization.

---

## 🌾 Smart Krishi Assistant

**Technology for farmers. Intelligence for crops. Better decisions for agriculture.**

> *“Empowering every farmer with accessible agricultural intelligence.”*
