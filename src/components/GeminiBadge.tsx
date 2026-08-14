import React from 'react';
import { Sparkles } from 'lucide-react';

interface GeminiBadgeProps {
  label?: string;
  variant?: 'subtle' | 'gradient' | 'pill';
  className?: string;
}

export const GeminiBadge: React.FC<GeminiBadgeProps> = ({
  label = 'Powered by Gemini 3.5',
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'gradient') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-xs ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
        <span>{label}</span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-slate-500 ${className}`}>
        <Sparkles className="w-3 h-3 text-indigo-500" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100 ${className}`}
    >
      <Sparkles className="w-3 h-3 text-indigo-600" />
      <span>{label}</span>
    </div>
  );
};
