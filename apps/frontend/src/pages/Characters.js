import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { strings, characterEmojis } from 'content';
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useDroppable, useDraggable, useSensors, useSensor, } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { track } from '../lib/analytics';
import { DetectiveGuide } from '../components/DetectiveGuide';
const characters = [
    { key: 'luna', emoji: characterEmojis.luna },
    { key: 'tom', emoji: "😃" },
    { key: 'maya', emoji: "😔" },
    { key: 'rex', emoji: "😡" },
];
// Mapping for expected moods used for the drag-drop correctness
const characterMood = {
    luna: 'happy',
    tom: 'happy',
    maya: 'sad',
    rex: 'angry',
};
function DroppableBasket({ id, label, pickedId, onKeyboardDrop, }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (_jsx("div", { ref: setNodeRef, role: "button", "aria-label": `${label} basket`, tabIndex: 0, className: `rounded-2xl border-2 border-dashed p-6 text-center select-none transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isOver ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-300'}`, onKeyDown: (e) => {
            if (e.key === 'Enter' && pickedId) {
                onKeyboardDrop(pickedId, id);
            }
        }, children: _jsx("div", { className: "text-sm font-medium text-slate-700", children: label }) }));
}
function DraggableCard({ id, emoji, label, onClick, isPicked, onPickToggle, }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
    };
    return (_jsxs("button", { ref: setNodeRef, ...listeners, ...attributes, style: style, className: `w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow outline-none ${isPicked ? 'ring-4 ring-emerald-400' : 'focus:ring-4 focus:ring-indigo-300'} ${isDragging ? 'opacity-70' : ''}`, "aria-label": `Character ${label}. Press Enter to pick up, Tab to basket, Enter to drop.`, onClick: onClick, onKeyDown: (e) => {
            if (e.key === 'Enter') {
                onPickToggle();
            }
        }, children: [_jsx("div", { className: "text-4xl mb-2 text-center", "aria-hidden": true, children: emoji }), _jsx("div", { className: "text-lg font-bold text-indigo-700 text-center", children: label })] }));
}
export default function Characters() {
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));
    const [toast, setToast] = useState(null);
    const [streak, setStreak] = useState(0);
    const [burst, setBurst] = useState(0); // increments to show confetti bursts
    const [showPostStreakGuide, setShowPostStreakGuide] = useState(false);
    const [postStreakTimer, setPostStreakTimer] = useState(null);
    const [selected, setSelected] = useState(null);
    const [pickedId, setPickedId] = useState(null);
    const evaluateDrop = (charId, target) => {
        const expected = characterMood[charId];
        const ok = expected === target;
        setToast({ ok, text: ok ? 'Great match!' : 'Try again!' });
        if (ok)
            track('drag_drop_complete', { character: charId, mood: target });
        if (ok) {
            setStreak(s => {
                const next = s + 1;
                if (next % 3 === 0) {
                    setBurst(b => Math.min(b + 1, 3));
                    if (postStreakTimer)
                        window.clearTimeout(postStreakTimer);
                    const t = window.setTimeout(() => setShowPostStreakGuide(true), 2000);
                    setPostStreakTimer(t);
                }
                return next;
            });
        }
        else {
            setStreak(0);
        }
        setTimeout(() => setToast(null), 1200);
    };
    const handleEnd = (event) => {
        const charId = event.active?.id;
        const target = event.over?.id;
        if (!charId || !target)
            return;
        evaluateDrop(charId, target);
    };
    const baskets = useMemo(() => [
        { id: 'happy', label: 'Happy 😊' },
        { id: 'sad', label: 'Sad 😢' },
        { id: 'angry', label: 'Angry 😠' },
    ], []);
    return (_jsxs("main", { className: "mx-auto max-w-5xl px-4 py-12", children: [_jsx(DetectiveGuide, { storageKey: "guide-characters", title: "Meet the Characters", steps: [
                    { text: 'These friends say sentences with different feelings.' },
                    { text: 'Try dragging a character into the matching mood basket.' },
                    { text: 'Tip: You can also pick with Enter, Tab to a basket, Enter to drop.' },
                ], primary: { label: 'Okay!', onClick: () => { } } }), _jsx(DetectiveGuide, { storageKey: "guide-characters-complete", title: "Awesome streak! What did we learn?", steps: [
                    { text: 'You matched 3 in a row—great job!' },
                    { text: 'We grouped sentences by feelings: Happy, Sad, Angry.' },
                    { text: 'Computers look for feeling words (like love, cry, angry).' },
                    { text: 'Next, let\'s see how a computer does this automatically.' },
                ], primary: { label: 'Continue to Demo', to: '/demo' }, secondary: { label: 'Keep Practicing', onClick: () => { } }, visible: showPostStreakGuide, onClose: () => setShowPostStreakGuide(false), persistDismissal: false }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("h2", { className: "text-3xl font-bold text-indigo-700 mb-2", children: "Meet the Characters" }), _jsx("p", { className: "text-lg text-slate-700 mb-6", children: "Drag or keyboard-move characters into the mood baskets below." }), _jsx("div", { className: "text-sm text-slate-500 mb-8", children: "Keyboard: Focus a card, press Enter to pick up, Tab to a basket, Enter to drop." })] }), _jsxs(DndContext, { sensors: sensors, onDragEnd: handleEnd, children: [_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12", children: characters.map((char, index) => {
                            const character = strings.characters[char.key];
                            return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.05 }, children: _jsx(DraggableCard, { id: char.key, emoji: char.emoji, label: character.name, onClick: () => setSelected({
                                        name: character.name,
                                        mood: characterMood[char.key],
                                    }), isPicked: pickedId === char.key, onPickToggle: () => setPickedId(p => (p === char.key ? null : char.key)) }) }, char.key));
                        }) }), _jsx("div", { className: "grid md:grid-cols-3 gap-6", children: baskets.map(b => (_jsx(DroppableBasket, { id: b.id, label: b.label, pickedId: pickedId, onKeyboardDrop: (charId, target) => {
                                evaluateDrop(charId, target);
                                setPickedId(null);
                            } }, b.id))) })] }), selected && (_jsxs("section", { className: `mt-8 rounded-2xl border p-6 ${selected.mood === 'happy'
                    ? 'border-emerald-300 bg-emerald-50'
                    : selected.mood === 'sad'
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-rose-300 bg-rose-50'}`, role: "region", "aria-label": `${selected.name} example sentences`, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "font-semibold text-slate-700", children: [selected.name, "'s example sentences (", selected.mood, ")"] }), _jsx("button", { onClick: () => setSelected(null), className: "text-xs underline text-slate-500", "aria-label": "Hide examples", children: "hide" })] }), _jsx("ul", { className: "list-disc pl-5 space-y-1 text-slate-700", children: (selected.mood === 'happy'
                            ? strings.sentences.happy
                            : selected.mood === 'sad'
                                ? strings.sentences.sad
                                : strings.sentences.angry).slice(0, 3).map((s, i) => (_jsx("li", { children: s }, i))) })] })), toast && (_jsxs("div", { role: "status", "aria-live": "polite", className: `fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-3 shadow-lg ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`, children: [toast.text, " ", streak > 1 && `(streak: ${streak})`] })), Array.from({ length: burst }).map((_, i) => (_jsx("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: _jsx("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-ping", children: "\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89" }) }, i))), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.4 }, className: "text-center mt-12", children: [_jsx(Link, { to: "/demo", className: "inline-block rounded-2xl bg-indigo-600 text-white px-8 py-4 text-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors", children: "Continue to Demo" }), streak >= 3 && (_jsx("div", { className: "mt-2 text-sm text-emerald-700", children: "Great! Now let's move to Demo." }))] })] }));
}
