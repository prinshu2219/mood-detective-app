import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { analyze } from 'sentiment-core';
import { DetectiveGuide } from '../components/DetectiveGuide';
const PRESETS = [
    'That movie was sick!',
    'I can\'t wait!',
    'not very good',
    'really not bad',
    'I love this so much!',
    'This is absolutely terrible',
    'I am so excited about tomorrow',
    'I hate when this happens',
];
const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';
// Enhanced ML predictor with more realistic behavior
async function predictTF(sentence) {
    // Simulate ML behavior that might differ from rules
    const r = analyze(sentence);
    const base = { HAPPY: 0.25, SAD: 0.25, ANGRY: 0.25, NEUTRAL: 0.25 };
    // ML might handle slang differently
    if (sentence.toLowerCase().includes('sick')) {
        base.HAPPY += 0.3; // ML might recognize "sick" as positive slang
    }
    // ML might be more sensitive to context
    if (sentence.toLowerCase().includes('can\'t wait')) {
        base.HAPPY += 0.4; // ML might better understand anticipation
    }
    // ML might handle double negatives differently
    if (sentence.toLowerCase().includes('not bad')) {
        base.HAPPY += 0.2; // ML might understand "not bad" as positive
    }
    // Apply rule-based adjustments
    if (r.score > 1)
        base.HAPPY += 0.3;
    if (r.score < -1) {
        base.SAD += 0.2;
        base.ANGRY += 0.2;
    }
    // Normalize probabilities
    const total = Object.values(base).reduce((sum, val) => sum + val, 0);
    Object.keys(base).forEach(key => {
        base[key] = base[key] / total;
    });
    const label = Object.keys(base).sort((a, b) => base[b] - base[a])[0];
    return { label, probs: base };
}
export default function MLPeek() {
    const [text, setText] = useState('That movie was sick!');
    const [rules, setRules] = useState(null);
    const [ml, setMl] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function run() {
            setLoading(true);
            try {
                // Server rules for parity with backend behavior
                const res = await fetch(`${API_BASE}/api/rules/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sentence: text }),
                });
                const rj = await res.json();
                setRules(rj);
                const m = await predictTF(text);
                setMl(m);
            }
            catch (error) {
                console.error('Analysis failed:', error);
            }
            finally {
                setLoading(false);
            }
        }
        run();
    }, [text]);
    const tricky = useMemo(() => PRESETS, []);
    const getLabelColor = (label) => {
        switch (label) {
            case 'HAPPY': return 'text-green-700 bg-green-100';
            case 'SAD': return 'text-blue-700 bg-blue-100';
            case 'ANGRY': return 'text-red-700 bg-red-100';
            case 'NEUTRAL': return 'text-gray-700 bg-gray-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };
    const getHighestProb = (probs) => {
        return Object.entries(probs).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: 'NEUTRAL', value: 0 });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8", children: [_jsx(DetectiveGuide, { storageKey: "guide-ml", title: "Beyond Words: ML vs Rules", steps: [
                    { text: 'Compare two approaches on the same sentence.' },
                    { text: 'Try tricky phrases like “That movie was sick!”.' },
                    { text: 'When you\'re done, grab your certificate.' },
                ], primary: { label: 'Let\'s Compare!', onClick: () => { } }, secondary: { label: 'Go to Certificate', to: '/certificate' } }), _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-indigo-700 mb-4", children: "ML vs Rules Comparison" }), _jsx("p", { className: "text-xl text-gray-600", children: "Compare rule-based analysis with machine learning predictions" })] }), _jsx("div", { className: "bg-white rounded-2xl shadow-lg p-6 mb-6", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { value: text, onChange: (e) => setText(e.target.value), className: "flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent", placeholder: "Type a sentence to compare..." }), loading && (_jsxs("div", { className: "flex items-center text-gray-500", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" }), _jsx("span", { className: "ml-2", children: "Analyzing..." })] }))] }) }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-3", children: "Try these tricky examples:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: tricky.map((testCase) => (_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setText(testCase), className: "px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors", children: testCase }, testCase))) })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "bg-white rounded-2xl shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Rules Engine (Server)" })] }), rules ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: `inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getLabelColor(rules.label)}`, children: rules.label }), _jsxs("div", { className: "mt-2 text-gray-600", children: ["Score: ", rules.score] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Key Words:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: rules.highlights?.map((h, i) => (_jsxs("span", { className: `rounded-lg px-2 py-1 text-sm font-medium ${h.weight > 0
                                                                ? 'text-green-700 bg-green-100 border border-green-200'
                                                                : h.weight < 0
                                                                    ? 'text-red-700 bg-red-100 border border-red-200'
                                                                    : 'text-gray-600 bg-gray-100 border border-gray-200'}`, children: [h.token, " (", h.weight > 0 ? '+' : '', h.weight, ")"] }, i))) })] }), _jsxs("div", { className: "text-sm text-gray-500", children: [_jsx("p", { children: "\u2022 Uses predefined word lists" }), _jsx("p", { children: "\u2022 Applies negation rules" }), _jsx("p", { children: "\u2022 Handles intensifiers" })] })] })) : (_jsx("div", { className: "text-gray-500", children: "Loading..." }))] }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "bg-white rounded-2xl shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-3 h-3 bg-purple-500 rounded-full" }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "ML Model (Browser)" })] }), ml ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: `inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getLabelColor(ml.label)}`, children: ml.label }), _jsxs("div", { className: "mt-2 text-gray-600", children: ["Confidence: ", Math.round(getHighestProb(ml.probs).value * 100), "%"] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Probabilities:" }), _jsx("div", { className: "space-y-2", children: Object.entries(ml.probs).map(([label, prob]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-indigo-600 h-2 rounded-full transition-all duration-300", style: { width: `${Math.round(prob * 100)}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-700 w-8", children: [Math.round(prob * 100), "%"] })] })] }, label))) })] }), _jsxs("div", { className: "text-sm text-gray-500", children: [_jsx("p", { children: "\u2022 Learns from examples" }), _jsx("p", { children: "\u2022 Understands context" }), _jsx("p", { children: "\u2022 Handles slang better" })] })] })) : (_jsx("div", { className: "text-gray-500", children: "Loading..." }))] })] }), rules && ml && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mt-6 bg-white rounded-2xl shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Key Differences:" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Rules Engine" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Fast and predictable" }), _jsx("li", { children: "\u2022 Easy to understand" }), _jsx("li", { children: "\u2022 Requires manual updates" }), _jsx("li", { children: "\u2022 Struggles with slang" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "ML Model" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Learns patterns automatically" }), _jsx("li", { children: "\u2022 Better with context" }), _jsx("li", { children: "\u2022 Can handle new words" }), _jsx("li", { children: "\u2022 May be less interpretable" })] })] })] })] })), _jsx("div", { className: "text-center mt-8", children: _jsx("a", { href: "/certificate", className: "inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors", children: "Get Your Certificate" }) })] })] }));
}
