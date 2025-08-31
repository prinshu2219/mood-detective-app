import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { strings, characterEmojis } from 'content';
export default function Welcome() {
    const navigate = useNavigate();
    useEffect(() => {
        const firstVisit = localStorage.getItem('firstVisitDone');
        if (!firstVisit) {
            localStorage.setItem('firstVisitDone', '1');
            // Ensure any previous guide dismissals are cleared for true first-time
            Object.keys(localStorage)
                .filter(k => k.startsWith('guide-'))
                .forEach(k => localStorage.removeItem(k));
            navigate('/characters');
        }
    }, [navigate]);
    return (_jsxs("div", { className: "mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h1", { className: "text-4xl md:text-5xl font-extrabold text-indigo-700 drop-shadow-sm", children: strings.welcome.title }), _jsx("p", { className: "mt-4 text-lg text-slate-700", children: strings.welcome.subtitle }), _jsx(Link, { to: "/characters", className: "inline-block mt-8 rounded-2xl bg-indigo-600 text-white px-6 py-3 text-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors", "aria-label": "Start Adventure: go to character selection", title: "Start Adventure", children: strings.welcome.startButton })] }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6 }, className: "rounded-3xl bg-white/70 p-8 shadow", children: [_jsxs("div", { className: "text-[7rem] md:text-[8rem] leading-none", children: [characterEmojis.luna, "\uD83D\uDD0D", characterEmojis.tom, characterEmojis.maya, characterEmojis.rex] }), _jsx("p", { className: "mt-4 text-slate-600", children: strings.welcome.description })] })] }));
}
