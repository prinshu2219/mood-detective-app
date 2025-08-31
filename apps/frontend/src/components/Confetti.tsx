import React, { useEffect, useState } from 'react';

type Props = {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
};

export function Confetti({ 
  isActive, 
  duration = 3000, 
  particleCount = 50,
  colors = ['#fbbf24', '#60a5fa', '#fb7185', '#34d399', '#a78bfa', '#f59e0b']
}: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference (with fallback for testing)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isActive || reducedMotion) return;

    // Create particles
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4
    }));

    setParticles(newParticles);

    // Animate particles
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        setParticles(prev => prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          rotation: p.rotation + p.rotationSpeed,
          vy: p.vy + 0.1 // gravity
        })));
        requestAnimationFrame(animate);
      } else {
        setParticles([]);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, duration, particleCount, colors, reducedMotion]);

  if (reducedMotion || !isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 1
          }}
        />
      ))}
    </div>
  );
}
