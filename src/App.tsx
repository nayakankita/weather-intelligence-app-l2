/**
 * Weather Intelligence App
 * Built with React, Vite, Tailwind CSS, Recharts, and Open-Meteo Free APIs.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { TemperatureChart } from './components/TemperatureChart';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';

import { GeoLocationResult, ForecastData, TempUnit } from './types/weather';
import { searchCities, getForecast } from './services/weatherApi';

const DEFAULT_CITY: GeoLocationResult = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  latitude: 51.5074,
  longitude: -0.1278,
};

const FAVORITES_STORAGE_KEY = 'weather_app_favorites';

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoLocationResult>(DEFAULT_CITY);
  const [searchResults, setSearchResults] = useState<GeoLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(true);
  const [error, setError] = useState<{ type: 'not_found' | 'network' | 'generic'; message?: string } | null>(null);

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<GeoLocationResult[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Load saved favorites from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    }
  }, []);

  // Save favorites to LocalStorage
  const saveFavorites = (updated: GeoLocationResult[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  };

  const handleToggleFavorite = (cityToToggle: GeoLocationResult) => {
    const exists = favorites.some((f) => f.latitude === cityToToggle.latitude && f.longitude === cityToToggle.longitude);
    if (exists) {
      const filtered = favorites.filter((f) => !(f.latitude === cityToToggle.latitude && f.longitude === cityToToggle.longitude));
      saveFavorites(filtered);
    } else {
      saveFavorites([...favorites, cityToToggle]);
    }
  };

  const isCurrentFavorite = favorites.some(
    (f) => f.latitude === currentCity.latitude && f.longitude === currentCity.longitude
  );

  // Helper to update ?city in browser URL without reloading
  const updateCityInUrl = (cityName: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (cityName && cityName.trim()) {
      url.searchParams.set('city', cityName.trim());
    } else {
      url.searchParams.delete('city');
    }
    const newRelativePath = url.pathname + (url.search ? url.search : '') + url.hash;
    const currentRelativePath = window.location.pathname + (window.location.search ? window.location.search : '') + window.location.hash;
    if (newRelativePath !== currentRelativePath) {
      window.history.pushState({ city: cityName }, '', newRelativePath);
    }
  };

  // Fetch Forecast Data function
  const fetchWeatherForLocation = useCallback(async (city: GeoLocationResult) => {
    setIsLoadingForecast(true);
    setError(null);
    setSelectedDayIndex(0);

    try {
      const data = await getForecast(city.latitude, city.longitude);
      setForecastData(data);
      setCurrentCity(city);
    } catch (err: any) {
      console.error('Forecast fetch error:', err);
      setError({
        type: 'network',
        message: 'Unable to fetch weather forecast right now. Please check your connection and retry.',
      });
    } finally {
      setIsLoadingForecast(false);
    }
  }, []);

  // Initial load: check for ?city query parameter via URLSearchParams
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');

    if (cityParam && cityParam.trim()) {
      const runInitialCitySearch = async (query: string) => {
        setIsLoadingForecast(true);
        setError(null);
        setSearchResults([]);

        try {
          const results = await searchCities(query);
          if (!results || results.length === 0) {
            setForecastData(null);
            setError({
              type: 'not_found',
              message: `City "${query}" not found. Please try another search.`,
            });
            setIsLoadingForecast(false);
          } else {
            const matchedCity = results[0];
            await fetchWeatherForLocation(matchedCity);
          }
        } catch (err: any) {
          console.error('Initial search error:', err);
          setForecastData(null);
          setError({
            type: 'network',
            message: 'Search service failed. Please check network and try again.',
          });
          setIsLoadingForecast(false);
        }
      };

      runInitialCitySearch(cityParam.trim());
    } else {
      fetchWeatherForLocation(DEFAULT_CITY);
    }
  }, [fetchWeatherForLocation]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = async () => {
      const params = new URLSearchParams(window.location.search);
      const cityParam = params.get('city');

      if (cityParam && cityParam.trim()) {
        setIsLoadingForecast(true);
        setError(null);
        setSearchResults([]);
        try {
          const results = await searchCities(cityParam.trim());
          if (!results || results.length === 0) {
            setForecastData(null);
            setError({
              type: 'not_found',
              message: `City "${cityParam.trim()}" not found. Please try another search.`,
            });
            setIsLoadingForecast(false);
          } else {
            await fetchWeatherForLocation(results[0]);
          }
        } catch (err) {
          console.error('Popstate search error:', err);
          setForecastData(null);
          setError({
            type: 'network',
            message: 'Unable to fetch weather forecast right now.',
          });
          setIsLoadingForecast(false);
        }
      } else {
        fetchWeatherForLocation(DEFAULT_CITY);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fetchWeatherForLocation]);

  // Handle Search submit
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await searchCities(query);
      if (!results || results.length === 0) {
        setError({
          type: 'not_found',
          message: `City "${query}" not found. Please try another search.`,
        });
        setSearchResults([]);
      } else if (results.length === 1) {
        // Single match found: directly select & fetch forecast, update URL
        setSearchResults([]);
        await fetchWeatherForLocation(results[0]);
        updateCityInUrl(results[0].name);
      } else {
        // Multiple matches found: present to user in SearchBar dropdown
        setSearchResults(results);
      }
    } catch (err: any) {
      console.error('Search geocoding error:', err);
      setError({
        type: 'network',
        message: 'Search service failed. Please check network and try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle manual city selection from matches dropdown or quick pills
  const handleSelectCity = async (city: GeoLocationResult) => {
    setSearchResults([]);
    setError(null);
    await fetchWeatherForLocation(city);
    updateCityInUrl(city.name);
  };

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchResults([]);
    updateCityInUrl(null);
  };

  // Handle Current Location GPS
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError({
        type: 'generic',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const myCity: GeoLocationResult = {
          id: 999999,
          name: 'My Location',
          country: 'GPS Location',
          latitude,
          longitude,
        };
        setIsLocating(false);
        updateCityInUrl(null);
        fetchWeatherForLocation(myCity);
      },
      (err) => {
        setIsLocating(false);
        console.error('Geolocation error:', err);
        setError({
          type: 'generic',
          message: 'Unable to retrieve your current location. Please check browser permissions or search manually.',
        });
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navigation Header */}
      <Header unit={tempUnit} onToggleUnit={setTempUnit} />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* City Search Bar & Location Selector */}
        <SearchBar
          onSearch={handleSearch}
          onSelectCity={handleSelectCity}
          searchResults={searchResults}
          isSearching={isSearching}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          favorites={favorites}
          currentCity={currentCity}
          onClear={handleClearSearch}
        />

        {/* Error Notification View */}
        {error && (
          <ErrorState
            type={error.type}
            message={error.message}
            onRetry={() => fetchWeatherForLocation(currentCity)}
          />
        )}

        {/* Loading Skeletons */}
        {isLoadingForecast && !error && <LoadingSkeleton />}

        {/* Main Weather Dashboard View */}
        {!isLoadingForecast && !error && forecastData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Current Weather Banner */}
            <CurrentWeatherCard
              current={forecastData.current_weather}
              city={currentCity}
              daily={forecastData.daily}
              unit={tempUnit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 7-Day Interactive Forecast Cards */}
            <ForecastGrid
              daily={forecastData.daily}
              unit={tempUnit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />

            {/* Recommendations & Temperature Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <RecommendationsPanel
                current={forecastData.current_weather}
                daily={forecastData.daily}
                unit={tempUnit}
                selectedDayIndex={selectedDayIndex}
              />

              <TemperatureChart
                daily={forecastData.daily}
                unit={tempUnit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
              />
            </div>

          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Weather Intelligence App &copy; {new Date().getFullYear()} — Powered by Open-Meteo Public Weather API
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Metric (°C, km/h) & Imperial (°F, mph) Support</span>
            <span>•</span>
            <span>Client-side Fetch</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
