import React, { useState, useEffect } from 'react';
import { CloudSun, Clock, Sparkles } from 'lucide-react';
import { TempUnit } from '../types/weather';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: (unit: TempUnit) => void;
}

export const Header: React.FC<HeaderProps> = ({ unit, onToggleUnit }) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <CloudSun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
              Weather Intelligence App
            </h1>
            <p className="hidden sm:block text-xs text-slate-400 font-medium">
              Real-time forecasts & smart weather recommendations
            </p>
          </div>
        </div>

        {/* Right Controls: Clock & Unit Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {timeString && (
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timeString}</span>
            </div>
          )}

          {/* Unit Switcher Button Group */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center space-x-1">
            <button
              onClick={() => onToggleUnit('C')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                unit === 'C'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Celsius (°C, km/h)"
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('F')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                unit === 'F'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title="Fahrenheit (°F, mph)"
            >
              °F
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
