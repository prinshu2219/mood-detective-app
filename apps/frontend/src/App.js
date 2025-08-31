import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
const Welcome = lazy(() => import('./pages/Welcome'));
const Characters = lazy(() => import('./pages/Characters'));
const Demo = lazy(() => import('./pages/Demo'));
const Game = lazy(() => import('./pages/Game'));
const MLPeek = lazy(() => import('./pages/MLPeek'));
const Certificate = lazy(() => import('./pages/Certificate'));
export default function App() {
    // Prefetch likely next screens after mount
    useEffect(() => {
        import('./pages/Characters');
        import('./pages/Demo');
    }, []);
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("nav", { className: "mx-auto max-w-5xl px-4 py-4 flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "font-bold text-xl text-indigo-700", children: "\uD83D\uDD75\uFE0F\u200D\u2640\uFE0F Mood Detective" }), _jsxs("div", { className: "text-sm text-indigo-600 space-x-4", children: [_jsx(Link, { to: "/characters", children: "Characters" }), _jsx(Link, { to: "/demo", children: "Demo" }), _jsx(Link, { to: "/game", children: "Game" }), _jsx(Link, { to: "/ml-peek", children: "ML Peek" }), _jsx(Link, { to: "/certificate", children: "Certificate" }), _jsx("button", { className: "ml-3 underline", onClick: () => {
                                    Object.keys(localStorage)
                                        .filter(k => k.startsWith('guide-'))
                                        .forEach(k => localStorage.removeItem(k));
                                    window.location.href = '/characters';
                                }, title: "Show tutorial again", "aria-label": "Show tutorial again", children: "Show Tutorial" })] })] }), _jsxs("footer", { className: "mx-auto max-w-5xl px-4 pb-6 text-xs text-slate-500", children: ["Privacy: No PII collected beyond optional first name on certificate. Session-only analytics.", _jsx("button", { className: "ml-2 underline", onClick: () => { localStorage.setItem('mdNoAnalytics', '1'); }, "aria-label": "Disable analytics", title: "Disable analytics", children: "Disable analytics" }), _jsx("span", { className: "ml-2", children: "(or add ?no-analytics to URL)" })] }), _jsx(Suspense, { fallback: _jsx("div", { className: "px-4 py-8 text-slate-600", children: "Loading\u2026" }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Welcome, {}) }), _jsx(Route, { path: "/characters", element: _jsx(Characters, {}) }), _jsx(Route, { path: "/demo", element: _jsx(Demo, {}) }), _jsx(Route, { path: "/game", element: _jsx(Game, {}) }), _jsx(Route, { path: "/ml-peek", element: _jsx(MLPeek, {}) }), _jsx(Route, { path: "/certificate", element: _jsx(Certificate, {}) })] }) })] }));
}
