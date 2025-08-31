import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setupAllMocks } from '../../test-utils';
import MLPeek from '../MLPeek';

// Mock the sentiment-core module
vi.mock('sentiment-core', () => ({
  analyze: vi.fn((sentence: string) => ({
    label: 'HAPPY',
    score: 2,
    highlights: [{ token: 'love', weight: 2 }],
  })),
}));

describe('MLPeek page', () => {
  beforeEach(() => {
    setupAllMocks();
  });

  it('renders ML vs Rules comparison interface', () => {
    renderWithProviders(<MLPeek />);
    
    expect(screen.getByText(/ML vs Rules/i)).toBeInTheDocument();
    expect(screen.getByText(/Compare how different approaches analyze emotions/i)).toBeInTheDocument();
  });

  it('displays test case buttons', () => {
    renderWithProviders(<MLPeek />);
    
    // Should show preset test cases
    expect(screen.getByRole('button', { name: /That movie was sick!/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /I can't wait!/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /This is not very good/i })).toBeInTheDocument();
  });

  it('shows input field for custom sentences', () => {
    renderWithProviders(<MLPeek />);
    
    const input = screen.getByPlaceholderText(/Enter a sentence to analyze.../i);
    expect(input).toBeInTheDocument();
  });

  it('handles custom sentence input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const input = screen.getByPlaceholderText(/Enter a sentence to analyze.../i);
    await user.type(input, 'I love this game!');
    
    expect(input).toHaveValue('I love this game!');
  });

  it('shows analyze button for custom input', () => {
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    expect(analyzeButton).toBeInTheDocument();
  });

  it('displays results after analysis', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    await user.click(analyzeButton);
    
    // Should show results
    await waitFor(() => {
      expect(screen.getByText(/Rules Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/ML Prediction/i)).toBeInTheDocument();
    });
  });

  it('shows key differences between approaches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    await user.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Key Differences/i)).toBeInTheDocument();
    });
  });

  it('handles preset test case selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const presetButton = screen.getByRole('button', { name: /That movie was sick!/i });
    await user.click(presetButton);
    
    // Should populate input with preset text
    const input = screen.getByPlaceholderText(/Enter a sentence to analyze.../i);
    expect(input).toHaveValue('That movie was sick!');
  });

  it('shows loading state during analysis', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    await user.click(analyzeButton);
    
    // Should show loading indicator briefly
    await waitFor(() => {
      expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
    });
  });

  it('displays confidence scores for both approaches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    await user.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Confidence:/i)).toBeInTheDocument();
    });
  });

  it('provides navigation to certificate', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MLPeek />);
    
    const analyzeButton = screen.getByRole('button', { name: /Analyze/i });
    await user.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Get Certificate/i })).toBeInTheDocument();
    });
  });
});
