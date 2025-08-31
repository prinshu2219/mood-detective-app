import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Basket } from '../Basket';

describe('Basket component', () => {
  it('renders with happy mood', () => {
    render(<Basket mood="happy">Drop happy sentences here</Basket>);
    
    expect(screen.getByText('happy')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('Drop happy sentences here')).toBeInTheDocument();
    expect(screen.getByLabelText('Happy Mood Basket')).toBeInTheDocument();
  });

  it('renders with sad mood', () => {
    render(<Basket mood="sad">Drop sad sentences here</Basket>);
    
    expect(screen.getByText('sad')).toBeInTheDocument();
    expect(screen.getByText('😢')).toBeInTheDocument();
    expect(screen.getByText('Drop sad sentences here')).toBeInTheDocument();
    expect(screen.getByLabelText('Sad Mood Basket')).toBeInTheDocument();
  });

  it('renders with angry mood', () => {
    render(<Basket mood="angry">Drop angry sentences here</Basket>);
    
    expect(screen.getByText('angry')).toBeInTheDocument();
    expect(screen.getByText('😠')).toBeInTheDocument();
    expect(screen.getByText('Drop angry sentences here')).toBeInTheDocument();
    expect(screen.getByLabelText('Angry Mood Basket')).toBeInTheDocument();
  });

  it('applies happy mood styling', () => {
    render(<Basket mood="happy">Happy content</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('bg-banana-100', 'border-banana', 'text-yellow-800');
  });

  it('applies sad mood styling', () => {
    render(<Basket mood="sad">Sad content</Basket>);
    
    const basket = screen.getByLabelText('Sad Mood Basket');
    expect(basket).toHaveClass('bg-skybrand-100', 'border-skybrand', 'text-sky-800');
  });

  it('applies angry mood styling', () => {
    render(<Basket mood="angry">Angry content</Basket>);
    
    const basket = screen.getByLabelText('Angry Mood Basket');
    expect(basket).toHaveClass('bg-coral-100', 'border-coral', 'text-rose-800');
  });

  it('shows active state styling when isActive is true', () => {
    render(<Basket mood="happy" isActive={true}>Active basket</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('ring-4', 'ring-offset-2', 'ring-offset-white', 'ring-blue-500', 'scale-105');
  });

  it('shows over state styling when isOver is true', () => {
    render(<Basket mood="happy" isOver={true}>Over basket</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('ring-2', 'ring-offset-2', 'ring-offset-white', 'ring-blue-400', 'scale-102');
  });

  it('applies both active and over states', () => {
    render(<Basket mood="happy" isActive={true} isOver={true}>Both states</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('ring-4', 'scale-105'); // Active takes precedence
  });

  it('has proper accessibility attributes', () => {
    render(<Basket mood="happy">Accessible basket</Basket>);
    
    const basket = screen.getByRole('region');
    expect(basket).toHaveAttribute('aria-label', 'Happy Mood Basket');
    expect(basket).toHaveAttribute('data-mood', 'happy');
  });

  it('renders emoji with proper accessibility', () => {
    render(<Basket mood="happy">Happy content</Basket>);
    
    const emoji = screen.getByText('😊');
    expect(emoji).toHaveAttribute('role', 'img');
    expect(emoji).toHaveAttribute('aria-label', 'happy mood');
  });

  it('applies custom className', () => {
    render(<Basket mood="happy" className="custom-basket">Custom basket</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('custom-basket');
  });

  it('renders drop zone indicator', () => {
    render(<Basket mood="happy">Drop zone</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    // The drop zone indicator should be present as a child element
    expect(basket.querySelector('.absolute.inset-0.border-2.border-dashed')).toBeInTheDocument();
  });

  it('has minimum height for proper drop target', () => {
    render(<Basket mood="happy">Minimum height</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('min-h-[120px]');
  });

  it('applies transition effects', () => {
    render(<Basket mood="happy">Transition effects</Basket>);
    
    const basket = screen.getByLabelText('Happy Mood Basket');
    expect(basket).toHaveClass('transition-all', 'duration-200');
  });
});





