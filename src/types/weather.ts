export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
  weathercode: number[];
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  timezone: string;
}

export type TempUnit = 'C' | 'F';

export interface WeatherCondition {
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
}

export interface PlanningRecommendation {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  text: string;
  category: 'clothing' | 'activity' | 'travel' | 'safety';
  icon: string;
}

export interface ActivitySuitability {
  id: string;
  name: string;
  icon: string;
  status: 'excellent' | 'good' | 'caution' | 'avoid';
  score: number; // 0 - 100
  reason: string;
}
