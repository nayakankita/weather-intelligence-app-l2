import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Info, Shirt, ShieldAlert, Compass } from 'lucide-react';
import { DailyForecast, TempUnit, CurrentWeather } from '../types/weather';
import { generatePlanningRecommendations, formatDayName, formatTemp } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface RecommendationsPanelProps {
  current: CurrentWeather;
  daily: DailyForecast;
  unit: TempUnit;
  selectedDayIndex: number;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  current,
  daily,
  unit,
  selectedDayIndex,
}) => {
  const isToday = selectedDayIndex === 0;
  const timeStr = daily.time[selectedDayIndex] || daily.time[0];
  const { dayName, shortDate } = formatDayName(timeStr, isToday);

  // Use day max/min or current temp
  const maxTemp = daily.temperature_2m_max[selectedDayIndex] ?? current.temperature;
  const minTemp = daily.temperature_2m_min[selectedDayIndex] ?? current.temperature;
  const precip = daily.precipitation_sum[selectedDayIndex] ?? 0;
  const wind = daily.windspeed_10m_max[selectedDayIndex] ?? current.windspeed;
  const weatherCode = daily.weathercode[selectedDayIndex] ?? current.weathercode;

  const { recommendations, activities } = generatePlanningRecommendations(
    maxTemp,
    minTemp,
    precip,
    wind,
    weatherCode
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Planning & Smart Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              Weather insights tailored for <span className="text-cyan-300 font-semibold">{dayName} ({shortDate})</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-slate-200">
            {formatTemp(maxTemp, unit)} / {formatTemp(minTemp, unit)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Precip: {precip.toFixed(1)}mm
          </div>
        </div>
      </div>

      {/* Rule-based Smart Recommendation Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 mr-1" /> Weather Directives
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => {
            let bgClass = 'bg-slate-800/60 border-slate-700/80 text-slate-200';
            let iconColor = 'text-cyan-400';

            if (rec.type === 'danger') {
              bgClass = 'bg-rose-950/40 border-rose-800/60 text-rose-100';
              iconColor = 'text-rose-400';
            } else if (rec.type === 'warning') {
              bgClass = 'bg-amber-950/40 border-amber-800/60 text-amber-100';
              iconColor = 'text-amber-400';
            } else if (rec.type === 'success') {
              bgClass = 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100';
              iconColor = 'text-emerald-400';
            }

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border ${bgClass} transition-all flex items-start space-x-3 shadow-sm`}
              >
                <div className={`p-2 rounded-lg bg-slate-900/60 shrink-0 ${iconColor}`}>
                  <WeatherIcon name={rec.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold tracking-tight mb-1">{rec.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Suitability Matrix */}
      <div className="pt-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
          <Compass className="w-3.5 h-3.5 text-cyan-400 mr-1.5" /> Outdoor Activity Suitability
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {activities.map((act) => {
            let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            let label = 'Excellent';

            if (act.status === 'good') {
              badgeStyle = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
              label = 'Good';
            } else if (act.status === 'caution') {
              badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              label = 'Caution';
            } else if (act.status === 'avoid') {
              badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
              label = 'Not Ideal';
            }

            return (
              <div
                key={act.id}
                className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl flex flex-col justify-between space-y-2 hover:bg-slate-800/80 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                    <WeatherIcon name={act.icon} className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle}`}>
                    {label}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200">{act.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{act.reason}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
