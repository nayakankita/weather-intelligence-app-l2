import React from 'react';
import { TrendingUp, Thermometer } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyForecast, TempUnit } from '../types/weather';
import { formatDayName, celsiusToFahrenheit, getWeatherCondition } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface TemperatureChartProps {
  daily: DailyForecast;
  unit: TempUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit: TempUnit;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const condition = getWeatherCondition(data.weatherCode, 1);

    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-2 z-50 min-w-[140px]">
        <div className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{data.fullDayName}</span>
          <span className="text-slate-400 font-normal">{data.dateStr}</span>
        </div>

        <div className="flex items-center space-x-2 text-cyan-300">
          <WeatherIcon name={condition.iconName} className="w-4 h-4" />
          <span className="font-semibold">{condition.label}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-medium">Max Temp:</span>
            <span className="font-bold text-white">
              {data.maxTemp}°{unit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-medium">Min Temp:</span>
            <span className="font-bold text-white">
              {data.minTemp}°{unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Precipitation:</span>
            <span>{data.precip} mm</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  daily,
  unit,
  selectedDayIndex,
  onSelectDay,
}) => {
  const chartData = daily.time.map((timeStr, idx) => {
    const { dayName, shortDate } = formatDayName(timeStr, idx === 0);
    const rawMax = daily.temperature_2m_max[idx] ?? 0;
    const rawMin = daily.temperature_2m_min[idx] ?? 0;

    const maxTemp = unit === 'F' ? celsiusToFahrenheit(rawMax) : Math.round(rawMax);
    const minTemp = unit === 'F' ? celsiusToFahrenheit(rawMin) : Math.round(rawMin);

    return {
      index: idx,
      day: dayName,
      dateStr: shortDate,
      fullDayName: dayName,
      maxTemp,
      minTemp,
      precip: daily.precipitation_sum[idx] ?? 0,
      weatherCode: daily.weathercode[idx] ?? 0,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            7-Day Temperature Trend
          </h3>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm" />
            <span className="text-slate-300">Max Temp (°{unit})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm" />
            <span className="text-slate-300">Min Temp (°{unit})</span>
          </div>
        </div>
      </div>

      {/* Recharts Responsive Area Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                onSelectDay(e.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              unit={`°`}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />

            <Area
              type="monotone"
              dataKey="maxTemp"
              name="Max Temp"
              stroke="#f59e0b"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#maxTempGrad)"
              activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="minTemp"
              name="Min Temp"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#minTempGrad)"
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
