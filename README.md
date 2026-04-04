# TEAM NAME: TAURUS

# GAUMITRA

**Smart Cattle Health Monitoring System**  
Real-time IoT sensor data · AI-powered veterinary analysis · Disease early-warning

---

## Tech Stack

- **Backend:** Node.js + MongoDB
- **AI:** Groq / LLaMA 3.3
- **Hardware:** Arduino / IoT
- **Status:** Prototype

---

## 1. Overview

GauMitra is a full-stack IoT platform that acts as a Fitbit for cattle. A smart collar worn by each cow continuously reads four vital signs — body temperature, heart rate, activity level, and rumen methane — and streams them to a REST API.

The server enriches the raw data with veterinary-grade statistical analysis and then queries a large language model (Groq / LLaMA 3.3) to produce a structured health report with:

- Risk classification
- Probable diagnosis
- Farmer recommendations

The project is currently a working prototype with all core pipeline stages implemented end-to-end.

---

## 2. Key Features

- Real-time sensor ingestion via REST (Arduino collars)
- Automatic cow profile creation (no manual setup)
- Statistical preprocessing:
  - Z-scores
  - Deviation severity
  - Range percentile
  - Critical threshold flags
- Composite risk score (0–100)
- Disease pattern matching (6 conditions)
- AI-powered clinical validation using LLaMA 3.3
- Report history (auto-pruned to last 5)
- Bulk endpoint for all cows' latest status
- SMS system when the cow is in a critical condition

---

## 3. Architecture

| Layer                 | Responsibility              |
| --------------------- | --------------------------- |
| Arduino / Collar      | Reads vitals and POSTs data |
| REST API (Express)    | Validates + routes requests |
| Services + Statistics | Computes risk + stores data |
| Groq / LLaMA 3.3      | AI clinical analysis        |

---

## 4. Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB
- Groq API key

---

### Install

```bash
git clone <your-repo-url>
cd server
npm install
cd my-app
npm install
```

---

### Environment Variables

```
PORT=8000
MONGODB_URI=mongodb+srv://cow:fit@cluster0.4jyhpyy.mongodb.net/?appName=Cluster0
GROQ_API_KEY=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
FRONTEND_DOMAIN=http://localhost:3000
```

---

### Run

```bash
npm run dev
npm start
```

---

## 5. Veterinary Reference Ranges

| Parameter   | Normal Low | Normal High | Critical Low | Critical High | Unit  |
| ----------- | ---------- | ----------- | ------------ | ------------- | ----- |
| Temperature | 38.0       | 39.3        | 37.5         | 40.5          | °C    |
| Heart Rate  | 48         | 84          | 36           | 100           | bpm   |
| Activity    | 20         | 90          | 5            | 100           | units |
| Methane     | 0          | 200         | 0            | 500           | ppm   |

---
