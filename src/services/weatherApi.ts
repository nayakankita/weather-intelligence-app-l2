import { GeoLocationResult, ForecastData } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for cities matching the search query using Open-Meteo Geocoding API.
 */
export async function searchCities(cityQuery: string): Promise<GeoLocationResult[]> {
  const trimmed = cityQuery.trim();
  if (!trimmed) return [];

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=5`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding API request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results as GeoLocationResult[];
}

/**
 * Fetch current weather and 7-day daily forecast for specified latitude and longitude.
 */
export async function getForecast(latitude: number, longitude: number): Promise<ForecastData> {
  const url = `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast API request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.current_weather || !data.daily) {
    throw new Error('Malformed forecast data received from Open-Meteo API');
  }

  return data as ForecastData;
}
