import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tone?: 'sky' | 'banana' | 'coral' | 'neutral';
  arrow?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
};

export function SpeechBubble({ 
  tone = 'neutral', 
  arrow = 'bottom', 
  className = '', 
  children, 
  ...rest 
}: Props) {
  const toneClass =
    tone === 'sky'
      ? 'bg-skybrand-100 text-sky-800 border-skybrand'
      : tone === 'banana'
        ? 'bg-banana-100 text-yellow-800 border-banana'
        : tone === 'coral'
          ? 'bg-coral-100 text-rose-800 border-coral'
          : 'bg-slate-100 text-slate-700 border-slate-300';

  const arrowClass = {
    top: 'after:border-t-slate-100 after:border-l-transparent after:border-r-transparent after:border-b-transparent',
    bottom: 'after:border-b-slate-100 after:border-l-transparent after:border-r-transparent after:border-t-transparent',
    left: 'after:border-l-slate-100 after:border-t-transparent after:border-b-transparent after:border-r-transparent',
    right: 'after:border-r-slate-100 after:border-t-transparent after:border-b-transparent after:border-l-transparent',
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-4 shadow-lg ${toneClass} ${className}`}
      role="dialog"
      aria-label="Character speech bubble"
      {...rest}
    >
      {children}
      {/* Arrow */}
      <div
        className={`absolute after:border-4 after:border-transparent ${
          arrow === 'top' ? 'bottom-full left-1/2 -translate-x-1/2' :
          arrow === 'bottom' ? 'top-full left-1/2 -translate-x-1/2' :
          arrow === 'left' ? 'right-full top-1/2 -translate-y-1/2' :
          'left-full top-1/2 -translate-y-1/2'
        } ${arrowClass[arrow]}`}
        aria-hidden="true"
      />
    </div>
  );
}



