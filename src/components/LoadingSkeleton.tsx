import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Current Weather Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-8 w-48 bg-slate-800 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <div className="h-10 w-28 bg-slate-800 rounded" />
              <div className="h-4 w-36 bg-slate-800 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
            <div className="h-14 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="h-6 w-36 bg-slate-800 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-800/50 rounded-xl border border-slate-800" />
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="h-64 bg-slate-800/40 rounded-xl flex items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      </div>

    </div>
  );
};
