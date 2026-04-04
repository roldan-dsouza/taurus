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

---

## 3. Architecture

| Layer                 | Responsibility              |
| --------------------- | --------------------------- |
| Arduino / Collar      | Reads vitals and POSTs data |
| REST API (Express)    | Validates + routes requests |
| Services + Statistics | Computes risk + stores data |
| Groq / LLaMA 3.3      | AI clinical analysis        |

---

## 4. Project Structure

```

server/
├── src/
│   ├── models/
│   │   ├── cow.model.mjs
│   │   ├── cow_sensor_data.model.mjs
│   │   └── report.model.mjs
│   ├── routes/
│   │   └── cow.route.mjs
│   ├── controllers/
│   │   ├── cow.controller.mjs
│   │   └── cow.groq.controller.mjs
│   ├── services/
│   │   ├── cow.service.mjs
│   │   └── groq.services.mjs
│   └── prompt/
│       └── prompt.mjs
└── .env

```

---

## 5. Data Models

### 5.1 Cow

| Field     | Description       |
| --------- | ----------------- |
| cow_id    | Unique identifier |
| cow_name  | Name of cow       |
| cow_breed | Breed             |
| cow_dob   | Date of birth     |
| device_id | Collar device ID  |

---

### 5.2 CowSensorData

| Field         | Description      |
| ------------- | ---------------- |
| cow_id        | Reference to Cow |
| temperature   | °C (35–42)       |
| heartbeat     | bpm (40–120)     |
| activity      | Activity score   |
| methane_level | ppm              |
| location      | GPS coordinates  |
| reading_time  | Timestamp        |

---

### 5.3 Report

| Field                  | Description    |
| ---------------------- | -------------- |
| cow_id                 | Reference      |
| report_details_history | Last 5 reports |

---

## 6. API Reference

**Base URL:**

```

[http://localhost:8000/api/cows](http://localhost:8000/api/cows)

```

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | /sensor-data     | Add sensor reading |
| GET    | /:cow_id/latest  | Latest reading     |
| GET    | /                | All cows + risk    |
| POST   | /analyze/:cow_id | AI analysis        |

---

### 6.1 POST `/sensor-data`

```json
{
  "cow_id": "COW101",
  "cow_name": "Bessie",
  "cow_breed": "Holstein",
  "cow_dob": "2019-04-12",
  "device_id": "DEV-001",
  "temperature": 38.9,
  "heartbeat": 72,
  "activity": 55,
  "methane_level": 180
}
```

---

### 6.2 POST `/analyze/:cow_id`

```json
{
  "success": true,
  "message": "Successful",
  "data": {
    "message": "Cow health report generated",
    "jsonResponse": {
      "Risk_Level": "Medium",
      "Composite_Risk_Score": 42.5,
      "possible_disease": "Respiratory Infection",
      "differential_diagnosis": "General Infection",
      "parameter_flags": {
        "temperature": "elevated (moderate)",
        "heartbeat": "elevated (mild)",
        "activity": "depressed (mild)",
        "methane_level": "normal (normal)"
      },
      "reason": "Temperature z-score + elevated HR...",
      "recommendation": "Monitor closely..."
    }
  }
}
```

---

## 7. Statistical Analysis Engine

### 7.1 Metrics

- Z-score
- Severity classification
- Direction (↑ ↓ normal)
- Percentile
- Critical flag

---

### 7.2 Composite Risk Score

| Parameter   | Weight |
| ----------- | ------ |
| Temperature | 35%    |
| Heart rate  | 25%    |
| Activity    | 20%    |
| Methane     | 20%    |

**Risk Levels:**

- 0–19 → Low
- 20–49 → Medium
- 50–100 → High

---

### 7.3 Disease Detection

Matches against:

- Respiratory Infection
- Bloat
- Ketosis
- Heat Stress
- Mastitis
- General Infection

---

## 8. Setup & Installation

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

## 10. Veterinary Reference Ranges

| Parameter   | Normal Low | Normal High | Critical Low | Critical High | Unit  |
| ----------- | ---------- | ----------- | ------------ | ------------- | ----- |
| Temperature | 38.0       | 39.3        | 37.5         | 40.5          | °C    |
| Heart Rate  | 48         | 84          | 36           | 100           | bpm   |
| Activity    | 20         | 90          | 5            | 100           | units |
| Methane     | 0          | 200         | 0            | 500           | ppm   |

---
