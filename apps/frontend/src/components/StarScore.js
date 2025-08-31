import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function StarScore({ value, outOf = 5, size = 'md', animated = true, showLabel = true, }) {
    const sizeClass = {
        sm: 'text-lg gap-0.5',
        md: 'text-2xl gap-1',
        lg: 'text-3xl gap-2'
    };
    const starClass = (isFilled) => isFilled ? 'text-yellow-500' : 'text-slate-300';
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `flex ${sizeClass[size]}`, role: "img", "aria-label": `${showLabel ? 'Stars ' : ''}${value} out of ${outOf}`, children: Array.from({ length: outOf }).map((_, i) => (_jsx("span", { className: `transition-all duration-300 ${animated ? 'transform hover:scale-110' : ''} ${starClass(i < value)}`, style: {
                        animationDelay: animated ? `${i * 100}ms` : '0ms',
                        animation: animated && i < value ? 'starPop 0.6s ease-out' : 'none'
                    }, children: i < value ? '★' : '☆' }, i))) }), showLabel && (_jsxs("div", { className: "text-sm text-gray-600 mt-2", children: [value, " of ", outOf, " stars"] }))] }));
}
