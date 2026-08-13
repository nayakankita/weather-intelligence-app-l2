import React from 'react';
import { Calendar, Umbrella, Wind, ChevronRight } from 'lucide-react';
import { DailyForecast, TempUnit } from '../types/weather';
import { getWeatherCondition, formatTemp, formatSpeed, formatDayName } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface ForecastGridProps {
  daily: DailyForecast;
  unit: TempUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">7-Day Forecast</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Click a day for detailed insights</span>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {daily.time.map((timeStr, idx) => {
          const { dayName, shortDate } = formatDayName(timeStr, idx === 0);
          const maxTemp = daily.temperature_2m_max[idx] ?? 0;
          const minTemp = daily.temperature_2m_min[idx] ?? 0;
          const prec = daily.precipitation_sum[idx] ?? 0;
          const wind = daily.windspeed_10m_max[idx] ?? 0;
          const code = daily.weathercode[idx] ?? 0;
          const condition = getWeatherCondition(code, 1);
          const isSelected = selectedDayIndex === idx;

          return (
            <button
              key={timeStr}
              onClick={() => onSelectDay(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Active selection dot */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80" />
              )}

              {/* Day & Date */}
              <div>
                <div className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {dayName}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{shortDate}</div>
              </div>

              {/* Weather Icon & Label */}
              <div className="my-3 flex flex-col items-center text-center">
                <div className={`p-2 rounded-xl mb-1.5 ${isSelected ? 'text-cyan-300' : 'text-slate-300 group-hover:text-cyan-400'}`}>
                  <WeatherIcon name={condition.iconName} className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 line-clamp-1">
                  {condition.label}
                </span>
              </div>

              {/* Min / Max Temperature Bar */}
              <div className="mt-auto space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-400">{formatTemp(maxTemp, unit)}</span>
                  <span className="text-cyan-400">{formatTemp(minTemp, unit)}</span>
                </div>

                {/* Subtle visual temp line indicator */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-gradient-to-r from-cyan-500 to-amber-500 h-full w-full rounded-full" />
                </div>

                {/* Extra Stats: Precip & Wind */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Umbrella className="w-2.5 h-2.5 text-cyan-400" />
                    {prec.toFixed(0)}mm
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5 text-blue-400" />
                    {Math.round(wind)}
                  </span>
                </div>
              </div>

            </button>
          );
        })}
      </div>

    </div>
  );
};
