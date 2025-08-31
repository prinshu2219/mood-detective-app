import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpeechBubble } from '../SpeechBubble';

describe('SpeechBubble component', () => {
  it('renders with default props', () => {
    render(<SpeechBubble>Hello there!</SpeechBubble>);
    
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Character speech bubble')).toBeInTheDocument();
  });

  it('applies sky tone styling', () => {
    render(<SpeechBubble tone="sky">Sky message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveClass('bg-skybrand-100', 'text-sky-800', 'border-skybrand');
  });

  it('applies banana tone styling', () => {
    render(<SpeechBubble tone="banana">Banana message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveClass('bg-banana-100', 'text-yellow-800', 'border-banana');
  });

  it('applies coral tone styling', () => {
    render(<SpeechBubble tone="coral">Coral message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveClass('bg-coral-100', 'text-rose-800', 'border-coral');
  });

  it('applies neutral tone styling by default', () => {
    render(<SpeechBubble>Neutral message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveClass('bg-slate-100', 'text-slate-700', 'border-slate-300');
  });

  it('renders with bottom arrow by default', () => {
    render(<SpeechBubble>Message with bottom arrow</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    const arrow = bubble.querySelector('.absolute');
    expect(arrow).toHaveClass('top-full', 'left-1/2', '-translate-x-1/2');
  });

  it('renders with top arrow', () => {
    render(<SpeechBubble arrow="top">Message with top arrow</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    const arrow = bubble.querySelector('.absolute');
    expect(arrow).toHaveClass('bottom-full', 'left-1/2', '-translate-x-1/2');
  });

  it('renders with left arrow', () => {
    render(<SpeechBubble arrow="left">Message with left arrow</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    const arrow = bubble.querySelector('.absolute');
    expect(arrow).toHaveClass('right-full', 'top-1/2', '-translate-y-1/2');
  });

  it('renders with right arrow', () => {
    render(<SpeechBubble arrow="right">Message with right arrow</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    const arrow = bubble.querySelector('.absolute');
    expect(arrow).toHaveClass('left-full', 'top-1/2', '-translate-y-1/2');
  });

  it('applies custom className', () => {
    render(<SpeechBubble className="custom-class">Custom styled message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<SpeechBubble>Accessible message</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    expect(bubble).toHaveAttribute('aria-label', 'Character speech bubble');
  });

  it('renders arrow with proper accessibility', () => {
    render(<SpeechBubble>Message with arrow</SpeechBubble>);
    
    const bubble = screen.getByRole('dialog');
    const arrow = bubble.querySelector('.absolute');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });
});
