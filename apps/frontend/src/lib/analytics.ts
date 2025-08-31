type AnalyticsEvent =
  | 'drag_drop_complete'
  | 'analyze_clicked'
  | 'game_finished'
  | 'certificate_downloaded';

function shouldDisable(): boolean {
  const url = new URL(window.location.href);
  if (url.searchParams.has('no-analytics')) {
    localStorage.setItem('mdNoAnalytics', '1');
    // Clean param from URL (no reload)
    url.searchParams.delete('no-analytics');
    window.history.replaceState({}, '', url.toString());
  }
  return localStorage.getItem('mdNoAnalytics') === '1';
}

function getPlausible(): any | null {
  // If Plausible is loaded globally
  // @ts-expect-error - plausible may exist
  return typeof window !== 'undefined' && (window.plausible || null);
}

export function track(event: AnalyticsEvent, props?: Record<string, any>) {
  try {
    if (shouldDisable()) return;
    const plausible = getPlausible();
    if (plausible) {
      plausible(event, { props });
    }
    // Fallback: no-op
  } catch {}
}

export function initAnalytics() {
  // For Plausible: optionally inject script if site is configured via env
  const domain = (import.meta as any).env?.VITE_PLAUSIBLE_DOMAIN;
  if (!domain || shouldDisable()) return;
  if (document.querySelector('script[data-analytics="plausible"]')) return;
  const s = document.createElement('script');
  s.setAttribute('data-analytics', 'plausible');
  s.defer = true;
  s.src = 'https://plausible.io/js/script.js';
  s.setAttribute('data-domain', domain);
  document.head.appendChild(s);
}
