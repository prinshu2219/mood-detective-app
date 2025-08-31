import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setupAllMocks } from '../../test-utils';
import Game from '../Game';

// Mock the sentiment-core module
vi.mock('sentiment-core', () => ({
  analyze: vi.fn((sentence: string) => ({
    label: 'HAPPY',
    score: 2,
    highlights: [{ token: 'love', weight: 2 }],
  })),
}));

describe('Game page', () => {
  beforeEach(() => {
    setupAllMocks();
  });

  it('renders game interface with round counter', () => {
    renderWithProviders(<Game />);
    
    expect(screen.getByText(/Round 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
  });

  it('displays a sentence for analysis', () => {
    renderWithProviders(<Game />);
    
    // Should display a sentence (content varies)
    expect(screen.getByText(/[A-Z].*[.!?]$/)).toBeInTheDocument();
  });

  it('shows three mood choice buttons', () => {
    renderWithProviders(<Game />);
    
    expect(screen.getByRole('button', { name: /happy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sad/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /angry/i })).toBeInTheDocument();
  });

  it('handles mood choice selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Game />);
    
    const happyButton = screen.getByRole('button', { name: /happy/i });
    await user.click(happyButton);
    
    // Should show feedback after choice
    await waitFor(() => {
      expect(screen.getByText(/Correct!/i) || screen.getByText(/Incorrect!/i)).toBeInTheDocument();
    });
  });

  it('advances to next round after choice', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Game />);
    
    const happyButton = screen.getByRole('button', { name: /happy/i });
    await user.click(happyButton);
    
    // Wait for round advancement
    await waitFor(() => {
      expect(screen.getByText(/Round 2 of 5/i) || screen.getByText(/Game Complete!/i)).toBeInTheDocument();
    });
  });

  it('shows game completion after 5 rounds', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Game />);
    
    // Complete all 5 rounds
    for (let i = 0; i < 5; i++) {
      const happyButton = screen.getByRole('button', { name: /happy/i });
      await user.click(happyButton);
      
      // Wait for round advancement or completion
      await waitFor(() => {
        const roundText = screen.queryByText(/Round \d+ of 5/i);
        const completionText = screen.queryByText(/Game Complete!/i);
        if (!roundText && !completionText) {
          // Still processing, wait a bit more
          return;
        }
      }, { timeout: 2000 });
    }
    
    // Should show completion screen
    await waitFor(() => {
      expect(screen.getByText(/Game Complete!/i)).toBeInTheDocument();
    });
  });

  it('displays final score and stars', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Game />);
    
    // Complete all 5 rounds
    for (let i = 0; i < 5; i++) {
      const happyButton = screen.getByRole('button', { name: /happy/i });
      await user.click(happyButton);
      await waitFor(() => {
        const roundText = screen.queryByText(/Round \d+ of 5/i);
        const completionText = screen.queryByText(/Game Complete!/i);
        if (!roundText && !completionText) return;
      }, { timeout: 2000 });
    }
    
    // Should show final score
    await waitFor(() => {
      expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
      expect(screen.getByText(/Stars earned:/i)).toBeInTheDocument();
    });
  });

  it('provides navigation to certificate after completion', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Game />);
    
    // Complete all 5 rounds
    for (let i = 0; i < 5; i++) {
      const happyButton = screen.getByRole('button', { name: /happy/i });
      await user.click(happyButton);
      await waitFor(() => {
        const roundText = screen.queryByText(/Round \d+ of 5/i);
        const completionText = screen.queryByText(/Game Complete!/i);
        if (!roundText && !completionText) return;
      }, { timeout: 2000 });
    }
    
    // Should show certificate button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Get Certificate/i })).toBeInTheDocument();
    });
  });
});
