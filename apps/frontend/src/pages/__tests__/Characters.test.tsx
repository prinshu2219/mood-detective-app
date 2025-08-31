import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils';
import Characters from '../Characters';

describe('Characters drag-drop', () => {
  it('renders characters and baskets, allows focusing draggable', async () => {
    renderWithProviders(<Characters />);
    
    // Check that character cards are rendered
    expect(screen.getByText(/Meet the Characters/)).toBeInTheDocument();
    
    // Check that mood baskets are rendered
    expect(screen.getByText(/Happy/)).toBeInTheDocument();
    expect(screen.getByText(/Sad/)).toBeInTheDocument();
    expect(screen.getByText(/Angry/)).toBeInTheDocument();
    
    // Check that character names are present
    expect(screen.getByText('Detective Luna')).toBeInTheDocument();
    expect(screen.getByText('Tom')).toBeInTheDocument();
    expect(screen.getByText('Maya')).toBeInTheDocument();
    expect(screen.getByText('Rex')).toBeInTheDocument();
  });

  it('shows drag and drop instructions', () => {
    renderWithProviders(<Characters />);
    
    // Check for drag and drop instructions
    expect(screen.getByText(/Drag or keyboard-move characters into the mood baskets below/)).toBeInTheDocument();
    expect(screen.getByText(/Keyboard: Focus a card, press Enter to pick up, Tab to a basket, Enter to drop/)).toBeInTheDocument();
  });

  it('has accessible basket labels', () => {
    renderWithProviders(<Characters />);
    
    // Check that baskets have proper ARIA labels
    expect(screen.getByLabelText(/Happy 😊 basket/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sad 😢 basket/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Angry 😠 basket/i)).toBeInTheDocument();
  });

  it('has navigation to demo page', () => {
    renderWithProviders(<Characters />);
    
    // Check that there's a link to continue to the demo
    expect(screen.getByRole('link', { name: /Continue to Demo/i })).toBeInTheDocument();
  });
});
