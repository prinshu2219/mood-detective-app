import { Routes, Route, Link } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
const Welcome = lazy(() => import('./pages/Welcome'))
const Characters = lazy(() => import('./pages/Characters'))
const Demo = lazy(() => import('./pages/Demo'))
const Game = lazy(() => import('./pages/Game'))
const MLPeek = lazy(() => import('./pages/MLPeek'))
const Certificate = lazy(() => import('./pages/Certificate'))

export default function App() {
  // Prefetch likely next screens after mount
  useEffect(() => {
    import('./pages/Characters');
    import('./pages/Demo');
  }, [])
  return (
    <div className="min-h-screen">
      <nav className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-indigo-700">🕵️‍♀️ Mood Detective</Link>
        <div className="text-sm text-indigo-600 space-x-4">
          <Link to="/characters">Characters</Link>
          <Link to="/demo">Demo</Link>
          <Link to="/game">Game</Link>
          <Link to="/ml-peek">ML Peek</Link>
          <Link to="/certificate">Certificate</Link>
          <button
            className="ml-3 underline"
            onClick={() => {
              Object.keys(localStorage)
                .filter(k => k.startsWith('guide-'))
                .forEach(k => localStorage.removeItem(k));
              window.location.href = '/characters';
            }}
            title="Show tutorial again"
            aria-label="Show tutorial again"
          >
            Show Tutorial
          </button>
        </div>
      </nav>
      <footer className="mx-auto max-w-5xl px-4 pb-6 text-xs text-slate-500">
        Privacy: No PII collected beyond optional first name on certificate. Session-only analytics.
        <button
          className="ml-2 underline"
          onClick={() => { localStorage.setItem('mdNoAnalytics','1') }}
          aria-label="Disable analytics"
          title="Disable analytics"
        >
          Disable analytics
        </button>
        <span className="ml-2">(or add ?no-analytics to URL)</span>
      </footer>
      <Suspense fallback={<div className="px-4 py-8 text-slate-600">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/game" element={<Game />} />
          <Route path="/ml-peek" element={<MLPeek />} />
          <Route path="/certificate" element={<Certificate />} />
        </Routes>
      </Suspense>
    </div>
  )
}
