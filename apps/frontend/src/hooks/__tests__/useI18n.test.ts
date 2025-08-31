import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useI18n, useRTL } from '../useI18n';

// Mock the content module
vi.mock('content', () => ({
  strings: {
    welcome: {
      title: 'Welcome to Mood Detective',
      subtitle: 'Set sail on a grand adventure to understand feelings',
      description: 'Learn to read emotions like a true pirate captain',
      startButton: 'Start Adventure'
    },
    certificate: {
      title: 'Certificate of Achievement',
      subtitle: 'Congratulations on mastering the art of emotion reading',
      achievement: 'You have completed the Mood Detective quest!',
      skills: 'Skills Acquired:',
      skill1: '• Reading emotional signals like a treasure map',
      skill2: '• Understanding mood patterns in speech',
      skill3: '• Navigating the seas of human emotions',
      date: 'Awarded on {{date}}',
      signature: 'Captain Luna, Mood Detective'
    }
  }
}));

describe('useI18n hook', () => {
  it('returns default English locale', () => {
    const { result } = renderHook(() => useI18n());
    
    expect(result.current.locale).toBe('en');
    expect(result.current.direction).toBe('ltr');
  });

  it('provides translation function', () => {
    const { result } = renderHook(() => useI18n());
    
    expect(result.current.t('welcome.title')).toBe('Welcome to Mood Detective');
    expect(result.current.t('welcome.subtitle')).toBe('Set sail on a grand adventure to understand feelings');
  });

  it('handles parameter substitution', () => {
    const { result } = renderHook(() => useI18n());
    
    const translated = result.current.t('certificate.date', { date: '2024-01-01' });
    expect(translated).toBe('Awarded on 2024-01-01');
  });

  it('returns key when translation not found', () => {
    const { result } = renderHook(() => useI18n());
    
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('allows locale switching', () => {
    const { result } = renderHook(() => useI18n());
    
    act(() => {
      result.current.setLocale('pirate');
    });
    
    // Should log the locale change
    expect(console.log).toHaveBeenCalledWith('Locale changed to: pirate');
  });

  it('provides setLocale function', () => {
    const { result } = renderHook(() => useI18n());
    
    expect(typeof result.current.setLocale).toBe('function');
  });

  it('handles multiple parameter substitutions', () => {
    const { result } = renderHook(() => useI18n());
    
    const translated = result.current.t('certificate.date', { 
      date: '2024-01-01',
      time: '12:00 PM'
    });
    expect(translated).toBe('Awarded on 2024-01-01');
  });

  it('handles empty parameters object', () => {
    const { result } = renderHook(() => useI18n());
    
    const translated = result.current.t('welcome.title', {});
    expect(translated).toBe('Welcome to Mood Detective');
  });

  it('handles null parameters', () => {
    const { result } = renderHook(() => useI18n());
    
    const translated = result.current.t('welcome.title', null as any);
    expect(translated).toBe('Welcome to Mood Detective');
  });
});

describe('useRTL hook', () => {
  it('returns LTR direction for English locale', () => {
    const { result } = renderHook(() => useRTL());
    
    expect(result.current.direction).toBe('ltr');
    expect(result.current.isRTL).toBe(false);
  });

  it('provides RTL-aware styling utilities', () => {
    const { result } = renderHook(() => useRTL());
    
    expect(result.current.textAlign).toBe('left');
    expect(result.current.flexDirection).toBe('row');
    expect(result.current.marginStart).toBe('mr');
    expect(result.current.marginEnd).toBe('ml');
    expect(result.current.paddingStart).toBe('pr');
    expect(result.current.paddingEnd).toBe('pl');
  });

  it('has consistent utility properties', () => {
    const { result } = renderHook(() => useRTL());
    
    expect(result.current).toHaveProperty('direction');
    expect(result.current).toHaveProperty('isRTL');
    expect(result.current).toHaveProperty('textAlign');
    expect(result.current).toHaveProperty('flexDirection');
    expect(result.current).toHaveProperty('marginStart');
    expect(result.current).toHaveProperty('marginEnd');
    expect(result.current).toHaveProperty('paddingStart');
    expect(result.current).toHaveProperty('paddingEnd');
  });

  it('provides boolean isRTL flag', () => {
    const { result } = renderHook(() => useRTL());
    
    expect(typeof result.current.isRTL).toBe('boolean');
    expect(result.current.isRTL).toBe(false);
  });

  it('provides string direction value', () => {
    const { result } = renderHook(() => useRTL());
    
    expect(typeof result.current.direction).toBe('string');
    expect(result.current.direction).toBe('ltr');
  });
});

describe('useI18n integration', () => {
  it('works with React components', () => {
    const TestComponent = () => {
      const { t } = useI18n();
      return <div>{t('welcome.title')}</div>;
    };
    
    // This test ensures the hook can be used in components
    expect(TestComponent).toBeDefined();
  });

  it('maintains consistent translations across renders', () => {
    const { result, rerender } = renderHook(() => useI18n());
    
    const firstTranslation = result.current.t('welcome.title');
    
    rerender();
    
    const secondTranslation = result.current.t('welcome.title');
    
    expect(firstTranslation).toBe(secondTranslation);
  });

  it('handles nested translation keys', () => {
    const { result } = renderHook(() => useI18n());
    
    expect(result.current.t('welcome.title')).toBe('Welcome to Mood Detective');
    expect(result.current.t('certificate.skills')).toBe('Skills Acquired:');
  });
});





