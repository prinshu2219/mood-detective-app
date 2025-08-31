import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import Demo from '../Demo';

describe('Demo page', () => {
  it('renders analyze button and updates tokens', async () => {
    renderWithProviders(<Demo />);
    
    const input = screen.getByLabelText('Sentence to analyze') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'Analyze sentence' });
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    
    // Type a sentence and analyze
    await userEvent.clear(input);
    await userEvent.type(input, 'I really love this');
    await userEvent.click(button);
    
    // Check that tokens are displayed
    expect(screen.getAllByText(/i|really|love|this/i).length).toBeGreaterThan(0);
  });

  it('shows test cases for quick testing', () => {
    renderWithProviders(<Demo />);
    
    // Check that test cases are displayed
    expect(screen.getByText('Try these examples:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'I love ice cream!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'not very good' })).toBeInTheDocument();
  });

  it('displays analysis results with highlighting', async () => {
    renderWithProviders(<Demo />);
    
    const input = screen.getByLabelText('Sentence to analyze') as HTMLInputElement;
    const button = screen.getByRole('button', { name: 'Analyze sentence' });
    
    await userEvent.type(input, 'I am happy');
    await userEvent.click(button);
    
    // Check that results are displayed - use getAllByText to handle multiple matches
    const resultLabels = screen.getAllByText(/HAPPY|SAD|ANGRY|NEUTRAL/i);
    expect(resultLabels.length).toBeGreaterThan(0);
    expect(screen.getByText(/Score:/i)).toBeInTheDocument();
  });

  it('has navigation to game page', () => {
    renderWithProviders(<Demo />);
    
    // Check that there's a link to continue to the game
    expect(screen.getByRole('link', { name: /Continue to Game/i })).toBeInTheDocument();
  });
});
