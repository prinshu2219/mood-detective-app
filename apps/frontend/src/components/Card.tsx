import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tone?: 'sky' | 'banana' | 'coral' | 'neutral';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
};

export function Card({ 
  tone = 'neutral', 
  padding = 'md', 
  interactive = false,
  className = '', 
  ...rest 
}: Props) {
  const toneClass = {
    sky: 'bg-skybrand-50 border-skybrand-100',
    banana: 'bg-banana-50 border-banana-100',
    coral: 'bg-coral-50 border-coral-100',
    neutral: 'bg-white border-slate-200'
  };

  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveClass = interactive 
    ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer' 
    : '';

  return (
    <div
      className={`rounded-2xl border shadow-lg ${toneClass[tone]} ${paddingClass[padding]} ${interactiveClass} ${className}`}
      {...rest}
    />
  );
}
