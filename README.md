# Weather Intelligence App

A clean, modern React + Vite single-page web application providing real-time city weather searches, 7-day weather forecasts, temperature trend charts, and smart rule-based activity recommendations using Open-Meteo public APIs.

## Features

- **City Search & Geocoding**: Search any city worldwide using Open-Meteo Geocoding. Supports multiple match pickers when search returns multiple cities (e.g. London, UK vs. London, Ontario).
- **Current Weather Panel**: Displays temperature, condition labels with dynamic Lucide icons, wind speed, wind direction, daily high/low range, and precipitation sum.
- **7-Day Forecast Cards**: Interactive daily forecast cards with condition icons, min/max temperature visual bars, wind speeds, and total rainfall.
- **Temperature Trend Chart**: Interactive line/area chart built with Recharts displaying 7-day maximum and minimum temperature curves with custom tooltips.
- **Planning Recommendations**: Smart rule-based weather directives (heavy rain warnings, extreme heat/cold advisories, wind alerts) and activity suitability scores for outdoor dining, jogging, cycling, sightseeing, and parks.
- **Location & Favorites**: HTML5 GPS location support and persistent LocalStorage bookmarked favorite cities.
- **Temperature Units**: Toggle seamlessly between Metric (°C, km/h) and Imperial (°F, mph).
- **Resilient Error Handling**: Clear messages for "City not found", network failures with a retry button, and smooth skeleton loading states.

## APIs Used (Free, Public, No API Keys Required)

1. **Geocoding API**:
   `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5`
2. **Forecast API**:
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto`

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the Vite development server on port 3000
npm run dev
```

### Production Build

```bash
# Build production bundle to dist/
npm run build

# Preview production build
npm run preview
```
