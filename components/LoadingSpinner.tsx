
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
    <div className="relative w-12 h-12">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="text-sm font-medium text-slate-400 animate-pulse tracking-wide uppercase">Loading Component...</p>
  </div>
);

export default LoadingSpinner;
