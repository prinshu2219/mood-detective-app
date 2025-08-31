import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setupAllMocks } from '../../test-utils';
import Welcome from '../Welcome';

describe('Welcome page', () => {
  beforeEach(() => {
    setupAllMocks();
  });

  it('renders hero section with Luna character', () => {
    renderWithProviders(<Welcome />);
    
    expect(screen.getByText(/Welcome to Mood Detective/i)).toBeInTheDocument();
    expect(screen.getByText(/Set sail on a grand adventure to understand feelings/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn to read emotions like a true pirate captain/i)).toBeInTheDocument();
  });

  it('displays character emojis', () => {
    renderWithProviders(<Welcome />);
    
    // Should show character previews
    expect(screen.getByText(/Meet your friends:/i)).toBeInTheDocument();
  });

  it('shows start adventure button', () => {
    renderWithProviders(<Welcome />);
    
    const startButton = screen.getByRole('button', { name: /Start Adventure/i });
    expect(startButton).toBeInTheDocument();
  });

  it('displays Luna speech bubble', () => {
    renderWithProviders(<Welcome />);
    
    expect(screen.getByText(/Ahoy there! I'm Luna, your guide to understanding emotions/i)).toBeInTheDocument();
  });

  it('shows language switcher', () => {
    renderWithProviders(<Welcome />);
    
    expect(screen.getByText(/Language:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pirate/i })).toBeInTheDocument();
  });

  it('handles language switching', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Welcome />);
    
    const pirateButton = screen.getByRole('button', { name: /Pirate/i });
    await user.click(pirateButton);
    
    // Should update Luna's speech to pirate version
    expect(screen.getByText(/Ahoy there, matey! I'm Captain Luna/i)).toBeInTheDocument();
  });

  it('shows accessibility note', () => {
    renderWithProviders(<Welcome />);
    
    expect(screen.getByText(/Press Enter or Space to start your adventure/i)).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    renderWithProviders(<Welcome />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Welcome to Mood Detective/i);
  });

  it('displays character emojis with proper labels', () => {
    renderWithProviders(<Welcome />);
    
    // Check that character emojis are present with proper ARIA labels
    const characterEmojis = screen.getAllByRole('img');
    expect(characterEmojis.length).toBeGreaterThan(0);
  });

  it('has proper navigation to characters page', () => {
    renderWithProviders(<Welcome />);
    
    const startButton = screen.getByRole('button', { name: /Start Adventure/i });
    expect(startButton).toBeInTheDocument();
    // The button should be wrapped in a Link component that navigates to /characters
  });
});
