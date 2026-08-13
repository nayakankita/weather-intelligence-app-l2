import { WeatherCondition, TempUnit, PlanningRecommendation, ActivitySuitability, DailyForecast } from '../types/weather';

export function getWeatherCondition(code: number, isDay: number = 1): WeatherCondition {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: isDay ? 'Sunny and clear sky' : 'Clear starry night',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly clear skies with gentle sunlight',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        category: 'clear',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periodic sun',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Dense cloud cover across the sky',
        iconName: 'Cloud',
        category: 'cloudy',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to fog or mist',
        iconName: 'CloudFog',
        category: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light misty precipitation',
        iconName: 'CloudDrizzle',
        category: 'rain',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Freezing light drizzle, icy conditions possible',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Light rainfall',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rain showers',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy rainfall expected',
        iconName: 'CloudRainWind',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Freezing rain, caution on roads',
        iconName: 'CloudHail',
        category: 'snow',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        description: 'Snow flakes falling',
        iconName: 'Snowflake',
        category: 'snow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Fine icy snow grains',
        iconName: 'Snowflake',
        category: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Intermittent rain showers',
        iconName: 'CloudRain',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Brief heavy snow flurries',
        iconName: 'CloudSnow',
        category: 'snow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Thunderstorm with lightning risk',
        iconName: 'CloudLightning',
        category: 'thunder',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm & Hail',
        description: 'Severe thunderstorm with hail potential',
        iconName: 'CloudLightning',
        category: 'thunder',
      };
    default:
      return {
        label: 'Variable Weather',
        description: 'Mixed atmospheric conditions',
        iconName: 'Cloud',
        category: 'cloudy',
      };
  }
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  if (unit === 'F') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatSpeed(kmh: number, unit: TempUnit): string {
  if (unit === 'F') {
    return `${kmhToMph(kmh)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index] || 'N';
}

export function formatDayName(dateString: string, isFirstDay: boolean = false): { dayName: string; shortDate: string } {
  const date = new Date(dateString + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = isFirstDay ? 'Today' : days[date.getDay()];
  const shortDate = `${months[date.getMonth()]} ${date.getDate()}`;
  return { dayName, shortDate };
}

export function generatePlanningRecommendations(
  maxTemp: number,
  minTemp: number,
  precipitationSum: number,
  windSpeed: number,
  weatherCode: number
): { recommendations: PlanningRecommendation[]; activities: ActivitySuitability[] } {
  const recs: PlanningRecommendation[] = [];

  // 1. Precipitation rule
  if (precipitationSum >= 10 || [65, 82, 95, 96, 99].includes(weatherCode)) {
    recs.push({
      id: 'rain-heavy',
      type: 'danger',
      title: 'Heavy Rain & Wet Conditions',
      text: `Expect significant rainfall (~${precipitationSum.toFixed(1)}mm). Carry an umbrella or waterproof raincoat and plan indoor activities.`,
      category: 'clothing',
      icon: 'Umbrella',
    });
  } else if (precipitationSum > 1.0 || [51, 53, 55, 61, 63, 80].includes(weatherCode)) {
    recs.push({
      id: 'rain-light',
      type: 'warning',
      title: 'Light Rain Likely',
      text: `Precipitation expected (${precipitationSum.toFixed(1)}mm). Keep an umbrella handy and allow extra time for commuting.`,
      category: 'clothing',
      icon: 'CloudRain',
    });
  }

  // 2. Temperature extreme rules
  if (maxTemp >= 35) {
    recs.push({
      id: 'heat-extreme',
      type: 'danger',
      title: 'Extreme Heat Warning',
      text: `Peak temperatures reaching ${Math.round(maxTemp)}°C. Stay hydrated, wear light breathable clothing, and avoid midday sun exposure.`,
      category: 'safety',
      icon: 'SunMedium',
    });
  } else if (maxTemp >= 28) {
    recs.push({
      id: 'heat-warm',
      type: 'info',
      title: 'Warm & Sunny Weather',
      text: `Comfortably warm around ${Math.round(maxTemp)}°C. Perfect for summer attire, but don't forget sunscreen and hydration.`,
      category: 'clothing',
      icon: 'Sun',
    });
  } else if (maxTemp <= 5) {
    recs.push({
      id: 'cold-heavy',
      type: 'warning',
      title: 'Freezing / Cold Conditions',
      text: `Low temperatures around ${Math.round(minTemp)}°C to ${Math.round(maxTemp)}°C. Wear heavy winter coats, thermal layers, and gloves.`,
      category: 'clothing',
      icon: 'Shirt',
    });
  } else if (maxTemp <= 15) {
    recs.push({
      id: 'cold-cool',
      type: 'info',
      title: 'Crisp & Cool Weather',
      text: `Brisk day ahead (${Math.round(maxTemp)}°C max). A jacket or warm sweater is recommended when going outside.`,
      category: 'clothing',
      icon: 'Jacket',
    });
  }

  // 3. Wind rules
  if (windSpeed >= 35) {
    recs.push({
      id: 'wind-high',
      type: 'warning',
      title: 'High Wind Advisory',
      text: `Strong wind gusts up to ${Math.round(windSpeed)} km/h. Secure loose outdoor objects; not ideal for umbrellas or open-air dining.`,
      category: 'travel',
      icon: 'Wind',
    });
  }

  // 4. Ideal outdoor weather rule
  if (maxTemp >= 16 && maxTemp <= 27 && precipitationSum < 1.0 && windSpeed < 25 && [0, 1, 2].includes(weatherCode)) {
    recs.push({
      id: 'outdoor-ideal',
      type: 'success',
      title: 'Great Day for Outdoor Plans!',
      text: `Mild temperature (${Math.round(maxTemp)}°C) with clear/partly clear skies. Excellent weather for hiking, jogging, or outdoor dining.`,
      category: 'activity',
      icon: 'Sparkles',
    });
  }

  // Fallback info if empty
  if (recs.length === 0) {
    recs.push({
      id: 'standard-day',
      type: 'info',
      title: 'Moderate Weather Overview',
      text: `Fair conditions with temperatures ranging from ${Math.round(minTemp)}°C to ${Math.round(maxTemp)}°C. Good for general outdoor travel.`,
      category: 'activity',
      icon: 'Compass',
    });
  }

  // Calculate Activity Suitability
  const activities: ActivitySuitability[] = [
    evaluateActivity('Jogging & Running', 'Footprints', maxTemp, minTemp, precipitationSum, windSpeed, weatherCode),
    evaluateActivity('Outdoor Dining', 'Utensils', maxTemp, minTemp, precipitationSum, windSpeed, weatherCode),
    evaluateActivity('Sightseeing & Walking', 'Camera', maxTemp, minTemp, precipitationSum, windSpeed, weatherCode),
    evaluateActivity('Cycling / Biking', 'Bike', maxTemp, minTemp, precipitationSum, windSpeed, weatherCode),
    evaluateActivity('Parks & Beach', 'Trees', maxTemp, minTemp, precipitationSum, windSpeed, weatherCode),
  ];

  return { recommendations: recs, activities };
}

function evaluateActivity(
  name: string,
  icon: string,
  maxTemp: number,
  minTemp: number,
  prec: number,
  wind: number,
  code: number
): ActivitySuitability {
  let score = 90;
  let reasons: string[] = [];

  // Rain impact
  if (prec > 10) {
    score -= 60;
    reasons.push('heavy rain');
  } else if (prec > 2) {
    score -= 35;
    reasons.push('rain expected');
  }

  // Wind impact
  if (wind > 35) {
    score -= 40;
    reasons.push('strong winds');
  } else if (wind > 20) {
    score -= 15;
    reasons.push('breezy');
  }

  // Temp impact
  if (maxTemp > 35) {
    score -= 40;
    reasons.push('intense heat');
  } else if (maxTemp < 5) {
    score -= 35;
    reasons.push('very cold');
  }

  // Thunderstorm impact
  if ([95, 96, 99].includes(code)) {
    score -= 80;
    reasons.push('lightning hazard');
  }

  score = Math.max(10, Math.min(100, score));

  let status: ActivitySuitability['status'] = 'excellent';
  if (score < 40) status = 'avoid';
  else if (score < 65) status = 'caution';
  else if (score < 85) status = 'good';

  const reasonText = reasons.length > 0 
    ? `Caution due to ${reasons.join(' and ')}.`
    : 'Conditions are favorable!';

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    icon,
    status,
    score,
    reason: reasonText,
  };
}
