import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
export function DetectiveGuide({ storageKey, title, steps, primary, secondary, visible = true, onClose, persistDismissal = true, }) {
    const [open, setOpen] = React.useState(() => {
        if (!persistDismissal)
            return visible;
        const persisted = localStorage.getItem(storageKey);
        return visible && persisted !== 'dismissed';
    });
    // Sync open state when `visible` prop changes
    React.useEffect(() => {
        if (!persistDismissal) {
            setOpen(visible);
            return;
        }
        const persisted = localStorage.getItem(storageKey);
        const shouldOpen = visible && persisted !== 'dismissed';
        setOpen(shouldOpen);
    }, [visible, persistDismissal, storageKey]);
    function close() {
        if (persistDismissal) {
            localStorage.setItem(storageKey, 'dismissed');
        }
        setOpen(false);
        onClose?.();
    }
    return (_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/30", role: "dialog", "aria-label": "Detective guidance", children: _jsx(motion.div, { initial: { y: 20, scale: 0.98, opacity: 0 }, animate: { y: 0, scale: 1, opacity: 1 }, exit: { y: 10, opacity: 0 }, transition: { duration: 0.2 }, className: "m-4 w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-3xl", "aria-hidden": true, children: "\uD83D\uDD75\uFE0F\u200D\u2640\uFE0F" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-indigo-700 mb-2", children: title }), _jsx("ul", { className: "list-disc pl-5 text-slate-700 space-y-1", children: steps.map((s, i) => (_jsx("li", { children: s.text }, i))) }), _jsxs("div", { className: "mt-4 flex gap-3", children: [primary && primary.to && (_jsx(Link, { to: primary.to, className: "inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400", onClick: close, children: primary.label })), primary && primary.onClick && (_jsx("button", { onClick: () => {
                                                primary.onClick?.();
                                                close();
                                            }, className: "inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400", children: primary.label })), secondary && secondary.to && (_jsx(Link, { to: secondary.to, className: "inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400", onClick: close, children: secondary.label })), secondary && secondary.onClick && (_jsx("button", { onClick: () => {
                                                secondary.onClick?.();
                                                close();
                                            }, className: "inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400", children: secondary.label })), !primary && !secondary && (_jsx("button", { onClick: close, className: "inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400", children: "Got it" }))] })] })] }) }) })) }));
}
