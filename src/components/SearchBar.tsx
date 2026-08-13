import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Star, ChevronRight, Building2, Globe } from 'lucide-react';
import { GeoLocationResult } from '../types/weather';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectCity: (city: GeoLocationResult) => void;
  searchResults: GeoLocationResult[];
  isSearching: boolean;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  favorites: GeoLocationResult[];
  currentCity?: GeoLocationResult;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSelectCity,
  searchResults,
  isSearching,
  onUseCurrentLocation,
  isLocating,
  favorites,
  currentCity,
}) => {
  const [query, setQuery] = useState('');
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when searchResults update
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setShowResultsDropdown(true);
    }
  }, [searchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    setShowResultsDropdown(false);
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ''}`);
  };

  const handlePopularClick = (item: { name: string; country: string; lat: number; lon: number }) => {
    const geoItem: GeoLocationResult = {
      id: Math.floor(Math.random() * 100000),
      name: item.name,
      country: item.country,
      latitude: item.lat,
      longitude: item.lon,
    };
    onSelectCity(geoItem);
    setQuery(`${item.name}, ${item.country}`);
    setShowResultsDropdown(false);
  };

  return (
    <div className="w-full relative z-20 space-y-3" ref={containerRef}>
      
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city name (e.g., London, Tokyo, San Francisco)..."
            className="w-full pl-10 pr-10 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-md"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowResultsDropdown(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Buttons: Search & GPS Location */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50 shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use current GPS location"
            className="px-3.5 py-3 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <MapPin className="w-4 h-4 text-cyan-400" />
            )}
            <span className="hidden md:inline">My Location</span>
          </button>
        </div>
      </form>

      {/* Multiple City Matches Dropdown Modal */}
      {showResultsDropdown && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-14 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 bg-slate-800/60 text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span>Select exact location match ({searchResults.length}):</span>
            <span className="text-slate-400 text-[10px] lowercase">Click to select</span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                      {city.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-1">
                      {city.admin1 && <span>{city.admin1}, </span>}
                      <span className="font-medium text-slate-300">{city.country}</span>
                      <span className="text-slate-500 text-[10px]">({city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°)</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Pills: Popular Cities & Favorites */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium flex items-center mr-1">
          <Globe className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Popular:
        </span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => handlePopularClick(c)}
            className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-all text-xs"
          >
            {c.name}
          </button>
        ))}

        {favorites.length > 0 && (
          <div className="flex items-center space-x-1 ml-2 border-l border-slate-700/80 pl-2">
            <span className="text-amber-400 font-medium flex items-center mr-1">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" /> Saved:
            </span>
            {favorites.slice(0, 3).map((fav) => (
              <button
                key={`fav-${fav.id}`}
                onClick={() => handleSelect(fav)}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 transition-all text-xs"
              >
                {fav.name}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
