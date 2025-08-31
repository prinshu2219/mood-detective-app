import React from 'react';

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'sky' | 'banana' | 'coral' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
};

export function Badge({ 
  tone = 'neutral', 
  size = 'md', 
  className = '', 
  ...rest 
}: Props) {
  const toneClass =
    tone === 'sky'
      ? 'bg-skybrand-100 text-sky-800 border border-skybrand'
      : tone === 'banana'
        ? 'bg-banana-100 text-yellow-800 border border-banana'
        : tone === 'coral'
          ? 'bg-coral-100 text-rose-800 border border-coral'
          : 'bg-slate-100 text-slate-700 border border-slate-300';

  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${toneClass} ${sizeClass[size]} ${className}`}
      role="status"
      {...rest}
    />
  );
}
