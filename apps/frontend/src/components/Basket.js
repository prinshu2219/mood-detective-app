import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Basket({ mood, isActive = false, isOver = false, className = '', children, ...rest }) {
    const moodConfig = {
        happy: {
            bg: 'bg-banana-100',
            border: 'border-banana',
            text: 'text-yellow-800',
            icon: '😊',
            label: 'Happy Mood Basket'
        },
        sad: {
            bg: 'bg-skybrand-100',
            border: 'border-skybrand',
            text: 'text-sky-800',
            icon: '😢',
            label: 'Sad Mood Basket'
        },
        angry: {
            bg: 'bg-coral-100',
            border: 'border-coral',
            text: 'text-rose-800',
            icon: '😠',
            label: 'Angry Mood Basket'
        }
    };
    const config = moodConfig[mood];
    const baseClasses = `relative rounded-2xl border-2 p-6 min-h-[120px] flex flex-col items-center justify-center transition-all duration-200 ${config.bg} ${config.border} ${config.text}`;
    const stateClasses = isActive
        ? 'ring-4 ring-offset-2 ring-offset-white ring-blue-500 scale-105'
        : isOver
            ? 'ring-2 ring-offset-2 ring-offset-white ring-blue-400 scale-102'
            : '';
    return (_jsxs("div", { className: `${baseClasses} ${stateClasses} ${className}`, role: "region", "aria-label": config.label, "data-mood": mood, ...rest, children: [_jsx("div", { className: "text-4xl mb-2", role: "img", "aria-label": `${mood} mood`, children: config.icon }), _jsx("div", { className: "text-lg font-semibold capitalize mb-2", children: mood }), children && (_jsx("div", { className: "text-sm text-center opacity-75", children: children })), _jsx("div", { className: "absolute inset-0 border-2 border-dashed border-current opacity-20 rounded-2xl" })] }));
}
