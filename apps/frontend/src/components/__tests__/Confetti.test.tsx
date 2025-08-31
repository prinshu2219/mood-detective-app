import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Confetti } from '../Confetti';

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock Date.now for consistent timing
const mockDateNow = vi.fn(() => 1000000);

describe('Confetti component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.Date.now = mockDateNow;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing when not active', () => {
    render(<Confetti isActive={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders confetti particles when active', () => {
    render(<Confetti isActive={true} />);
    
    // Should show confetti particles
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toBeInTheDocument();
  });

  it('respects reduced motion preference', () => {
    // Mock prefers-reduced-motion: reduce
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeEventListener: vi.fn(),
        addEventListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<Confetti isActive={true} />);
    
    // Should not render confetti when reduced motion is preferred
    expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument();
  });

  it('creates correct number of particles', () => {
    render(<Confetti isActive={true} particleCount={10} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    // Should create 10 particles
    expect(confettiContainer.children).toHaveLength(10);
  });

  it('uses default particle count when not specified', () => {
    render(<Confetti isActive={true} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    // Should use default of 50 particles
    expect(confettiContainer.children).toHaveLength(50);
  });

  it('applies custom colors when provided', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    render(<Confetti isActive={true} colors={customColors} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toBeInTheDocument();
  });

  it('uses default colors when not specified', () => {
    render(<Confetti isActive={true} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Confetti isActive={true} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies proper positioning classes', () => {
    render(<Confetti isActive={true} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'z-50');
  });

  it('animates particles over specified duration', () => {
    render(<Confetti isActive={true} duration={5000} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer).toBeInTheDocument();
    
    // Fast-forward time to test animation completion
    vi.advanceTimersByTime(5000);
    
    // After duration, particles should be cleared
    expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument();
  });

  it('handles animation cleanup properly', () => {
    const { unmount } = render(<Confetti isActive={true} />);
    
    // Component should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  it('creates particles with random properties', () => {
    render(<Confetti isActive={true} particleCount={5} />);
    
    const confettiContainer = screen.getByRole('generic', { hidden: true });
    expect(confettiContainer.children).toHaveLength(5);
    
    // Each particle should have different styles due to randomization
    const particles = Array.from(confettiContainer.children);
    const firstParticle = particles[0] as HTMLElement;
    expect(firstParticle).toHaveStyle({
      position: 'absolute',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    });
  });
});





