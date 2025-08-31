import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setupAllMocks } from '../../test-utils';
import Certificate from '../Certificate';

// Mock the html-to-image and html2canvas modules
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock')),
}));

vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  })),
}));

// Mock the session module
vi.mock('../session', () => ({
  getSessionId: vi.fn(() => 'test-session-id'),
}));

describe('Certificate page', () => {
  beforeEach(() => {
    setupAllMocks();
  });

  it('renders certificate form and download button', async () => {
    renderWithProviders(<Certificate />);
    
    const input = screen.getByLabelText('Your Name') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Download Certificate/i });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    
    // Type a name
    await userEvent.type(input, 'Test User');
    expect(input.value).toBe('Test User');
  });

  it('shows certificate preview with proper content', () => {
    renderWithProviders(<Certificate />);
    
    // Check that certificate content is displayed
    expect(screen.getByText(/Certificate of Achievement/i)).toBeInTheDocument();
    expect(screen.getByText(/Congratulations on mastering the art of emotion reading/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills Acquired:/i)).toBeInTheDocument();
    
    // Check for specific skills
    expect(screen.getByText(/• Reading emotional signals like a treasure map/i)).toBeInTheDocument();
    expect(screen.getByText(/• Understanding mood patterns in speech/i)).toBeInTheDocument();
    expect(screen.getByText(/• Navigating the seas of human emotions/i)).toBeInTheDocument();
  });

  it('shows feedback section', () => {
    renderWithProviders(<Certificate />);
    
    expect(screen.getByText(/How was your Mood Detective experience/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share Your Feedback/i })).toBeInTheDocument();
  });

  it('handles feedback submission form display', async () => {
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await userEvent.click(feedbackButton);
    
    // Should show feedback form
    expect(screen.getByText(/Rate your experience:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeInTheDocument();
  });

  it('shows emoji rating options', async () => {
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await userEvent.click(feedbackButton);
    
    // Should show emoji rating options
    expect(screen.getByText(/Rate your experience:/i)).toBeInTheDocument();
    // Check for emoji buttons (1-5 rating)
    for (let i = 1; i <= 5; i++) {
      const emoji = screen.getByDisplayValue(i.toString());
      expect(emoji).toBeInTheDocument();
    }
  });

  it('displays category selection in feedback form', async () => {
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await userEvent.click(feedbackButton);
    
    // Should show category dropdown
    expect(screen.getByText(/Category:/i)).toBeInTheDocument();
    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();
  });

  it('shows comment field in feedback form', async () => {
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await userEvent.click(feedbackButton);
    
    // Should show comment field
    expect(screen.getByText(/Comments \(optional\):/i)).toBeInTheDocument();
    const commentField = screen.getByPlaceholderText(/Tell us what you think.../i);
    expect(commentField).toBeInTheDocument();
  });

  it('displays helpful checkbox in feedback form', async () => {
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await userEvent.click(feedbackButton);
    
    // Should show helpful checkbox
    const helpfulCheckbox = screen.getByRole('checkbox', { name: /This feedback is helpful/i });
    expect(helpfulCheckbox).toBeInTheDocument();
    expect(helpfulCheckbox).toBeChecked(); // Should be checked by default
  });

  it('handles feedback form submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await user.click(feedbackButton);
    
    // Fill out the form
    const commentField = screen.getByPlaceholderText(/Tell us what you think.../i);
    await user.type(commentField, 'This is a great game!');
    
    const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
    await user.click(submitButton);
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your feedback/i)).toBeInTheDocument();
    });
  });

  it('allows canceling feedback form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Certificate />);
    
    const feedbackButton = screen.getByRole('button', { name: /Share Your Feedback/i });
    await user.click(feedbackButton);
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);
    
    // Should hide feedback form
    expect(screen.queryByText(/Rate your experience:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share Your Feedback/i })).toBeInTheDocument();
  });

  it('shows certificate with current date', () => {
    renderWithProviders(<Certificate />);
    
    const currentDate = new Date().toLocaleDateString();
    expect(screen.getByText(new RegExp(currentDate))).toBeInTheDocument();
  });

  it('displays signature section', () => {
    renderWithProviders(<Certificate />);
    
    expect(screen.getByText(/Captain Luna, Mood Detective/i)).toBeInTheDocument();
  });
});
