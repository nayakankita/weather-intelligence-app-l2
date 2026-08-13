import React from 'react';
import { Wind, Thermometer, MapPin, Star, Compass, ArrowUp, ArrowDown } from 'lucide-react';
import { CurrentWeather, GeoLocationResult, TempUnit, DailyForecast } from '../types/weather';
import { getWeatherCondition, formatTemp, formatSpeed, getWindDirectionLabel } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  city: GeoLocationResult;
  daily: DailyForecast;
  unit: TempUnit;
  isFavorite: boolean;
  onToggleFavorite: (city: GeoLocationResult) => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  city,
  daily,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const condition = getWeatherCondition(current.weathercode, current.is_day);
  const windDir = getWindDirectionLabel(current.winddirection);

  // Today's max/min
  const todayMax = daily.temperature_2m_max[0] ?? current.temperature;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature;
  const todayPrecip = daily.precipitation_sum[0] ?? 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      
      {/* Subtle atmospheric gradient orb */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: City Name, Country & Favorite Button */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Current Weather</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
            <span>{city.name}</span>
            {city.country && (
              <span className="text-slate-400 text-lg font-normal">
                , {city.country}
              </span>
            )}
          </h2>
          {city.admin1 && (
            <p className="text-xs text-slate-400 font-medium">{city.admin1}</p>
          )}
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={() => onToggleFavorite(city)}
          className={`p-2.5 rounded-xl border transition-all ${
            isFavorite
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-slate-600'
          }`}
          title={isFavorite ? 'Remove from saved locations' : 'Save location'}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Main Weather Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800/80 relative z-10 items-center">
        
        {/* Left: Temperature & Big Icon */}
        <div className="flex items-center space-x-5">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-cyan-400 shadow-inner">
            <WeatherIcon name={condition.iconName} className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {formatTemp(current.temperature, unit)}
            </div>
            <div className="text-base font-semibold text-cyan-300 mt-1">
              {condition.label}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 max-w-xs">
              {condition.description}
            </div>
          </div>
        </div>

        {/* Right: Key Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          
          {/* Wind Metric */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Wind Speed</div>
              <div className="text-xs font-bold text-slate-200">
                {formatSpeed(current.windspeed, unit)} ({windDir})
              </div>
            </div>
          </div>

          {/* Today's High / Low */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">High / Low</div>
              <div className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                <span className="text-amber-400">{formatTemp(todayMax, unit)}</span>
                <span className="text-slate-500">/</span>
                <span className="text-cyan-400">{formatTemp(todayMin, unit)}</span>
              </div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <WeatherIcon name="CloudDrizzle" className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Precipitation</div>
              <div className="text-xs font-bold text-slate-200">
                {todayPrecip.toFixed(1)} mm
              </div>
            </div>
          </div>

          {/* Wind Direction */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Direction</div>
              <div className="text-xs font-bold text-slate-200">
                {current.winddirection}° {windDir}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
