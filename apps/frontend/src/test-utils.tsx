import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Custom render function that wraps components with necessary providers
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock for window.matchMedia (used by Confetti component)
export function setupMatchMediaMock() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock for requestAnimationFrame (used by Confetti component)
export function setupRequestAnimationFrameMock() {
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: vi.fn().mockImplementation((callback) => {
      setTimeout(callback, 0);
      return 1;
    }),
  });
}

// Mock for fetch API
export function setupFetchMock() {
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve('OK'),
    })
  );
}

// Mock for console.log to capture locale changes
export function setupConsoleMock() {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  return consoleSpy;
}

// Setup all mocks for testing
export function setupAllMocks() {
  setupMatchMediaMock();
  setupRequestAnimationFrameMock();
  setupFetchMock();
  return setupConsoleMock();
}
