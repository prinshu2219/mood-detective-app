import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { analyze } from 'sentiment-core';
import { track } from '../lib/analytics';
import { DetectiveGuide } from '../components/DetectiveGuide';
export default function Demo() {
    const [text, setText] = useState('I love ice cream!');
    const result = useMemo(() => analyze(text), [text]);
    const [analysisCount, setAnalysisCount] = useState(0);
    const [showCompletionGuide, setShowCompletionGuide] = useState(false);
    // Lightweight tokenizer to align with scorer.ts behavior
    const tokens = useMemo(() => {
        const normalized = text.toLowerCase().trim();
        if (!normalized)
            return [];
        const tokenPattern = /([a-z]+(?:'[a-z]+)?|n't|[\u{1F300}-\u{1FAFF}])/gu;
        return Array.from(normalized.matchAll(tokenPattern)).map(m => m[0]);
    }, [text]);
    const highlightMap = useMemo(() => {
        const map = new Map();
        result.highlights.forEach(h => {
            map.set(h.token + '|' + (map.get(h.token) ?? 0), h.weight);
            map.set(h.token, (map.get(h.token) ?? 0) + 1);
        });
        return map;
    }, [result.highlights]);
    function tokenColor(token, index) {
        // Disambiguate duplicates by consuming counts in highlightMap
        const seenKey = token;
        const seen = (highlightMap.get(seenKey) ?? 0);
        const weight = highlightMap.get(token + '|' + (seen - 1));
        if (typeof weight === 'number') {
            return weight > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100';
        }
        return 'text-slate-600 bg-slate-100';
    }
    const pos = Math.max(result.score, 0);
    const neg = Math.max(-result.score, 0);
    const total = pos + neg || 1;
    const posPct = Math.round((pos / total) * 100);
    const negPct = 100 - posPct;
    return (_jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12", children: [_jsx(DetectiveGuide, { storageKey: "guide-demo", title: "How Computers Do It", steps: [
                    { text: 'Type a short sentence and press Analyze.' },
                    { text: 'Green words add happy points; red words add sad/angry points.' },
                    { text: 'Try 3 sentences, then continue to the game!' },
                ], primary: { label: 'Let\'s Try!', onClick: () => { } }, secondary: { label: 'Go to Game', to: '/game' } }), _jsx("h2", { className: "text-3xl font-bold text-indigo-700", children: "Rule Demo: Word Highlighting" }), _jsx("p", { className: "mt-2 text-slate-700", children: "Type a sentence to see how the rule engine scores each token." }), _jsxs("div", { className: "mt-6 flex gap-2", children: [_jsx("input", { value: text, onChange: e => setText(e.target.value), className: "flex-1 rounded-xl border border-slate-300 px-4 py-3", "aria-label": "Sentence to analyze" }), _jsx("button", { onClick: () => { track('analyze_clicked'); setText(text); setAnalysisCount(c => c + 1); if (analysisCount + 1 >= 3)
                            setShowCompletionGuide(true); }, className: "rounded-xl bg-indigo-600 text-white px-6 py-3", "aria-label": "Analyze sentence", children: "Analyze" })] }), _jsx(DetectiveGuide, { storageKey: "guide-demo-complete", title: "Great exploring!", steps: [
                    { text: 'You tried at least 3 sentences.' },
                    { text: 'You saw how words turn into scores and labels.' },
                    { text: 'Ready for a 5-round challenge?' },
                ], primary: { label: 'Play the Game', to: '/game' }, secondary: { label: 'Keep Exploring', onClick: () => { } }, visible: showCompletionGuide, onClose: () => setShowCompletionGuide(false), persistDismissal: true }), _jsxs("section", { className: "mt-6 rounded-2xl bg-white p-6 shadow", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${result.label === 'HAPPY' ? 'bg-green-100 text-green-700' :
                                    result.label === 'ANGRY' || result.label === 'SAD' ? 'bg-red-100 text-red-700' :
                                        'bg-slate-100 text-slate-700'}`, children: result.label }), _jsxs("span", { className: "text-slate-600", children: ["Score: ", result.score] })] }), _jsxs("div", { className: "mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200", "aria-hidden": "true", children: [_jsx("div", { className: "h-full bg-green-500", style: { width: `${posPct}%` } }), _jsx("div", { className: "h-full bg-red-500", style: { width: `${negPct}%` } })] }), _jsx("div", { className: "mt-5 flex flex-wrap gap-2", "aria-live": "polite", children: tokens.map((t, i) => (_jsx("span", { className: `rounded-lg px-2 py-1 text-sm ${tokenColor(t, i)}`, children: t }, i))) })] }), analysisCount >= 3 && (_jsx("div", { className: "mt-8 text-center", children: _jsx("a", { href: "/game", className: "inline-block rounded-2xl bg-green-600 text-white px-6 py-3 text-lg shadow hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors", children: "Bored of the rule demo? Let\\'s play a game" }) }))] }));
}
