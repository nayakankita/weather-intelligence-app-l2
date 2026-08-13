import React from 'react';
import { AlertCircle, RefreshCw, SearchX, Globe } from 'lucide-react';

interface ErrorStateProps {
  type: 'not_found' | 'network' | 'generic';
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ type, message, onRetry }) => {
  if (type === 'not_found') {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto shadow-xl my-8 space-y-4">
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
          <SearchX className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">City Not Found</h3>
          <p className="text-sm text-slate-400 mt-1">
            {message || 'City not found. Please try another search or check spelling.'}
          </p>
        </div>
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-center space-x-1">
          <Globe className="w-3.5 h-3.5" />
          <span>Tip: Try searching with country name, e.g., "Paris, France"</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl p-8 text-center max-w-md mx-auto shadow-xl my-8 space-y-4">
      <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">Weather Data Unavailable</h3>
        <p className="text-sm text-slate-400 mt-1">
          {message || 'Unable to fetch weather forecast right now due to a network connection issue.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
