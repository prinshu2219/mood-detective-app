import { jsx as _jsx } from "react/jsx-runtime";
export function Button({ variant = 'primary', size = 'md', className = '', ...rest }) {
    const base = 'rounded-2xl font-semibold focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95';
    const sizeClass = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };
    const variantClass = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 border border-slate-300',
        sky: 'bg-skybrand text-white hover:bg-skybrand-600 focus:ring-skybrand-300',
        banana: 'bg-banana text-yellow-900 hover:bg-banana-600 focus:ring-banana-300',
        coral: 'bg-coral text-white hover:bg-coral-600 focus:ring-coral-300'
    };
    return (_jsx("button", { className: `${base} ${sizeClass[size]} ${variantClass[variant]} ${className}`, ...rest }));
}
