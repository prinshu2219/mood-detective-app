import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '../hooks/useI18n';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Confetti } from '../components/Confetti';
import { DetectiveGuide } from '../components/DetectiveGuide';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getSessionId } from '../session';
const certificateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
});
const feedbackSchema = z.object({
    emojiRating: z.number().min(1).max(5),
    comment: z.string().max(1000).optional(),
    category: z.enum(['game', 'ui', 'content', 'general']).default('general'),
    helpful: z.boolean().default(true),
});
export default function Certificate() {
    const { t, direction } = useI18n();
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { register: registerCertificate, handleSubmit: handleCertificateSubmit, formState: { errors: certificateErrors }, } = useForm({
        resolver: zodResolver(certificateSchema),
    });
    const { register: registerFeedback, handleSubmit: handleFeedbackSubmit, formState: { errors: feedbackErrors }, } = useForm({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            emojiRating: 5,
            category: 'general',
            helpful: true,
        },
    });
    const downloadCertificate = async (data) => {
        const element = document.getElementById('certificate');
        if (!element)
            return;
        // Show confetti celebration
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        try {
            // PDF only
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
            });
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 48;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const marginTop = (pageHeight - imgHeight) / 2;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 24, Math.max(24, marginTop), imgWidth, imgHeight);
            pdf.save(`mood-detective-certificate-${data.name}.pdf`);
        }
        catch (error) {
            console.error('Failed to generate certificate:', error);
            alert('Failed to generate certificate. Please try again.');
        }
    };
    const submitFeedback = async (data) => {
        try {
            const sessionId = getSessionId();
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId,
                },
                body: JSON.stringify({
                    sessionId,
                    ...data,
                }),
            });
            if (response.ok) {
                setFeedbackSubmitted(true);
                setShowFeedback(false);
            }
            else {
                console.error('Failed to submit feedback');
            }
        }
        catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8", dir: direction, children: [_jsx(Confetti, { isActive: showConfetti }), _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsx(DetectiveGuide, { storageKey: "guide-certificate", title: "Great Job, Junior Mood Detective!", steps: [
                            { text: 'Enter your name and download your certificate.' },
                            { text: 'You can save PNG or PDF (good for printing).' },
                            { text: 'Want to play more? Go back to the game!' },
                        ], primary: { label: 'Okay!', onClick: () => { } }, secondary: { label: 'Play Again', to: '/game' } }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-indigo-700 mb-4", children: t('certificate.title') }), _jsx("p", { className: "text-gray-600", children: t('certificate.subtitle') })] }), _jsx("form", { onSubmit: handleCertificateSubmit(downloadCertificate), className: "mb-8", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Name" }), _jsx("input", { ...registerCertificate('name'), type: "text", id: "name", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent", placeholder: "Enter your name" }), certificateErrors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: certificateErrors.name.message })), _jsx(Button, { type: "submit", variant: "sky", size: "lg", className: "w-full mt-4", children: "Download Certificate" })] }) }), _jsx("div", { id: "certificate", className: "bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mb-8", style: { aspectRatio: '1.414' }, children: _jsxs("div", { className: "text-center h-full flex flex-col justify-center", children: [_jsx("h2", { className: "text-4xl font-bold text-indigo-700 mb-4", children: t('certificate.title') }), _jsx("p", { className: "text-xl text-gray-600 mb-8", children: t('certificate.achievement') }), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: t('certificate.skills') }), _jsxs("ul", { className: "text-left space-y-2 text-gray-700", children: [_jsx("li", { children: t('certificate.skill1') }), _jsx("li", { children: t('certificate.skill2') }), _jsx("li", { children: t('certificate.skill3') })] })] }), _jsxs("div", { className: "mt-auto", children: [_jsx("p", { className: "text-gray-600 mb-4", children: t('certificate.date', { date: new Date().toLocaleDateString() }) }), _jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDD75\uFE0F\u200D\u2640\uFE0F" }), _jsx("span", { className: "text-lg font-semibold text-indigo-700", children: t('certificate.signature') })] })] })] }) }), _jsx(Card, { tone: "neutral", padding: "lg", className: "max-w-2xl mx-auto", children: !feedbackSubmitted ? (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4 text-center", children: "How was your Mood Detective experience?" }), !showFeedback ? (_jsx("div", { className: "text-center", children: _jsx(Button, { variant: "success", size: "md", onClick: () => setShowFeedback(true), children: "Share Your Feedback" }) })) : (_jsxs("form", { onSubmit: handleFeedbackSubmit(submitFeedback), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Rate your experience:" }), _jsx("div", { className: "flex justify-center gap-2", children: [1, 2, 3, 4, 5].map((rating) => (_jsxs("label", { className: "cursor-pointer", children: [_jsx("input", { type: "radio", value: rating, ...registerFeedback('emojiRating', { valueAsNumber: true }), className: "sr-only" }), _jsx("span", { className: "text-3xl hover:scale-110 transition-transform", children: rating <= 2 ? '😢' : rating <= 3 ? '😐' : rating <= 4 ? '😊' : '😍' })] }, rating))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category:" }), _jsxs("select", { ...registerFeedback('category'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent", children: [_jsx("option", { value: "general", children: "General" }), _jsx("option", { value: "game", children: "Game" }), _jsx("option", { value: "ui", children: "User Interface" }), _jsx("option", { value: "content", children: "Content" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Comments (optional):" }), _jsx("textarea", { ...registerFeedback('comment'), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent", placeholder: "Tell us what you think..." })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", ...registerFeedback('helpful'), className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" }), _jsx("label", { className: "text-sm text-gray-700", children: "This feedback is helpful" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { type: "submit", variant: "sky", className: "flex-1", children: "Submit Feedback" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowFeedback(false), children: "Cancel" })] })] }))] })) : (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83C\uDF89" }), _jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Thank you for your feedback!" }), _jsx("p", { className: "text-gray-600", children: "Your input helps us make Mood Detective even better." })] })) })] })] }));
}
