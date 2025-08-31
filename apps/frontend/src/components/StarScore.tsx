import React from 'react';

type Props = {
  value: number;
  outOf?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
};

export function StarScore({
  value,
  outOf = 5,
  size = 'md',
  animated = true,
  showLabel = true,
}: Props) {
  const sizeClass = {
    sm: 'text-lg gap-0.5',
    md: 'text-2xl gap-1',
    lg: 'text-3xl gap-2'
  };

  const starClass = (isFilled: boolean) => 
    isFilled ? 'text-yellow-500' : 'text-slate-300';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex ${sizeClass[size]}`}
        role="img"
        aria-label={`${showLabel ? 'Stars ' : ''}${value} out of ${outOf}`}
      >
        {Array.from({ length: outOf }).map((_, i) => (
          <span
            key={i}
            className={`transition-all duration-300 ${
              animated ? 'transform hover:scale-110' : ''
            } ${starClass(i < value)}`}
            style={{
              animationDelay: animated ? `${i * 100}ms` : '0ms',
              animation: animated && i < value ? 'starPop 0.6s ease-out' : 'none'
            }}
          >
            {i < value ? '★' : '☆'}
          </span>
        ))}
      </div>
      
      {showLabel && (
        <div className="text-sm text-gray-600 mt-2">
          {value} of {outOf} stars
        </div>
      )}
    </div>
  );
}
