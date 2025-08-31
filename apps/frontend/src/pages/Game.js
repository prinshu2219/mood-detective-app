import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { analyze } from 'sentiment-core';
import { track } from '../lib/analytics';
import { DetectiveGuide } from '../components/DetectiveGuide';
// Enhanced sentence bank with more variety
const SENTENCES = [
    'I love ice cream!',
    "I don't like broccoli",
    'This is fantastic and awesome',
    'I am sad about the game',
    'That makes me so angry',
    'Today is okay',
    'I am really happy today',
    'I lost my toy and feel bad',
    'This puppy is the best',
    "I can't stand this",
    'The movie was amazing!',
    'I miss my friend',
    'I am so excited!',
    'This is really annoying',
    'I feel great today',
];
const API_BASE = import.meta.env?.VITE_API_BASE_URL || '';
function getSessionId() {
    let id = localStorage.getItem('mdSessionId');
    if (!id) {
        id =
            'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('mdSessionId', id);
    }
    return id;
}
const pickRandom = () => SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
const useGame = create((set, get) => ({
    round: 1,
    score: 0,
    attempts: [],
    sentence: pickRandom(),
    startedAt: Date.now(),
    nextSentence: () => set({ sentence: pickRandom() }),
    reset: () => set({
        round: 1,
        score: 0,
        attempts: [],
        sentence: pickRandom(),
        startedAt: Date.now(),
    }),
    choose: async (c) => {
        const { round, attempts, sentence, score } = get();
        const aiResult = analyze(sentence);
        const ai = aiResult.label === 'HAPPY'
            ? 'HAPPY'
            : aiResult.label === 'ANGRY'
                ? 'ANGRY'
                : 'SAD';
        const correct = ai === c;
        const nextAttempts = [
            ...attempts,
            { round, sentence, student: c, ai, correct },
        ];
        const nextScore = correct ? score + 1 : score;
        // POST attempt (non-blocking)
        const sessionId = getSessionId();
        fetch(`${API_BASE}/api/attempts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': sessionId,
            },
            body: JSON.stringify({
                sessionId,
                round,
                sentence,
                student: c,
                ai,
                correct,
            }),
        }).catch(() => { });
        set({ attempts: nextAttempts, score: nextScore, round: round + 1 });
        if (round < 5) {
            setTimeout(() => get().nextSentence(), 200);
        }
        else {
            // After finishing round 5, POST score
            const timeSpentSec = Math.max(0, Math.round((Date.now() - get().startedAt) / 1000));
            track('game_finished', {
                correct: nextScore,
                total: 5,
                timeSpent: timeSpentSec,
            });
            fetch(`${API_BASE}/api/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    sessionId,
                    total: 5,
                    correct: nextScore,
                    timeSpent: timeSpentSec,
                }),
            }).catch(() => { });
        }
    },
}));
export default function Game() {
    const { round, score, sentence, choose, attempts, reset } = useGame();
    const [showResult, setShowResult] = useState(false);
    const [lastChoice, setLastChoice] = useState(null);
    const [lastCorrect, setLastCorrect] = useState(null);
    const done = round > 5;
    const [showCompletionGuide, setShowCompletionGuide] = useState(false);
    useEffect(() => {
        // Reset result display when sentence changes
        setShowResult(false);
        setLastChoice(null);
        setLastCorrect(null);
    }, [sentence]);
    const handleChoice = (choice) => {
        setLastChoice(choice);
        const aiResult = analyze(sentence);
        const ai = aiResult.label === 'HAPPY'
            ? 'HAPPY'
            : aiResult.label === 'ANGRY'
                ? 'ANGRY'
                : 'SAD';
        const correct = ai === choice;
        setLastCorrect(correct);
        setShowResult(true);
        // Delay the actual choice to show result
        setTimeout(() => {
            choose(choice);
        }, 1500);
    };
    const stars = useMemo(() => Array.from({ length: 5 }).map((_, i) => i < score), [score]);
    const getChoiceEmoji = (choice) => {
        switch (choice) {
            case 'HAPPY': return '😊';
            case 'SAD': return '😢';
            case 'ANGRY': return '😠';
            default: return '😐';
        }
    };
    const getChoiceColor = (choice) => {
        switch (choice) {
            case 'HAPPY': return 'bg-green-600 hover:bg-green-700';
            case 'SAD': return 'bg-indigo-600 hover:bg-indigo-700';
            case 'ANGRY': return 'bg-red-600 hover:bg-red-700';
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8", children: [_jsx(DetectiveGuide, { storageKey: "guide-game", title: "Challenge Round", steps: [
                    { text: 'Read the sentence and choose HAPPY, SAD, or ANGRY.' },
                    { text: 'We compare your pick with our Mood Detective.' },
                    { text: 'Finish 5 rounds to see your stars and get a certificate!' },
                ], primary: { label: 'Start Game', onClick: () => { } } }), _jsx(DetectiveGuide, { storageKey: "guide-game-complete", title: "Fantastic! You finished the game.", steps: [
                    { text: `You scored ${score} stars.` },
                    { text: 'Let\'s get your certificate to celebrate!' },
                ], primary: { label: 'Get Certificate', to: '/certificate' }, secondary: { label: 'Play Again', onClick: () => reset() }, visible: done, persistDismissal: false }), _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-indigo-700 mb-4", children: "Challenge Game" }), _jsx("p", { className: "text-xl text-gray-600", children: "Read each sentence and guess the mood!" })] }), !done && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white rounded-2xl shadow-lg p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "text-lg font-semibold text-gray-700", children: ["Round ", round, " of 5"] }), _jsx("div", { className: "flex gap-1", children: Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: `w-3 h-3 rounded-full ${i < round - 1 ? 'bg-green-500' : 'bg-gray-300'}` }, i))) })] }), _jsxs("div", { className: "text-center mb-6", children: [_jsxs("div", { className: "text-2xl font-bold text-indigo-700", children: ["Score: ", score] }), _jsx("div", { className: "flex justify-center gap-1 mt-2", children: stars.map((on, i) => (_jsx("span", { className: "text-2xl", children: on ? '⭐' : '☆' }, i))) })] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-sm text-gray-600 mb-2", children: "Read this sentence:" }), _jsxs("div", { className: "text-2xl font-semibold text-gray-800 bg-gray-50 rounded-xl p-6", children: ["\"", sentence, "\""] })] }), _jsx(AnimatePresence, { children: showResult && lastChoice && lastCorrect !== null && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "text-center mb-6 p-4 rounded-xl bg-gray-50", children: [_jsx("div", { className: "text-2xl mb-2", children: lastCorrect ? '✅ Correct!' : '❌ Try again!' }), _jsxs("div", { className: "text-gray-600", children: ["You chose: ", getChoiceEmoji(lastChoice), " ", lastChoice] }), _jsxs("div", { className: "text-gray-600", children: ["AI thinks: ", getChoiceEmoji(lastCorrect ? lastChoice : 'SAD'), " ", lastCorrect ? lastChoice : 'SAD'] })] })) }), !showResult && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: ['HAPPY', 'SAD', 'ANGRY'].map((choice) => (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => handleChoice(choice), className: `${getChoiceColor(choice)} text-white py-6 px-4 rounded-xl text-xl font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300`, children: [_jsx("div", { className: "text-4xl mb-2", children: getChoiceEmoji(choice) }), _jsx("div", { children: choice })] }, choice))) }))] }, round)), done && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-2xl shadow-lg p-8 text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-indigo-700 mb-4", children: "Game Complete!" }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "text-lg text-gray-600 mb-4", children: ["You got ", score, " out of 5 correct!"] }), _jsx("div", { className: "flex justify-center gap-2 text-4xl", children: stars.map((on, i) => (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: i * 0.1 }, children: on ? '⭐' : '☆' }, i))) })] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "text-2xl font-semibold text-gray-700 mb-2", children: score === 5 ? 'Perfect! 🎉' :
                                        score >= 4 ? 'Great job! 👏' :
                                            score >= 3 ? 'Good work! 👍' :
                                                'Keep practicing! 💪' }) }), _jsxs("div", { className: "flex gap-4 justify-center", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: reset, className: "bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors", children: "Play Again" }), _jsx(motion.a, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, href: "/certificate", className: "bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors", children: "Get Certificate" })] })] }))] })] }));
}
