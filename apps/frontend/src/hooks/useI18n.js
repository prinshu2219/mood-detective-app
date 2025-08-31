import { useMemo, useState } from 'react';
import { strings } from 'content';
// Pirate English translations (for testing)
const pirateStrings = {
    welcome: {
        title: "Ahoy, Matey! Welcome to Mood Detective!",
        subtitle: "Set sail on a grand adventure to understand feelings!",
        description: "Learn to read emotions like a true pirate captain!",
        startButton: "Hoist the Sails!"
    },
    certificate: {
        title: "Pirate's Certificate of Achievement",
        subtitle: "Ye have completed the Mood Detective quest!",
        achievement: "Congratulations on mastering the art of emotion reading!",
        skills: "Skills Acquired:",
        skill1: "• Reading emotional signals like a treasure map",
        skill2: "• Understanding mood patterns in speech",
        skill3: "• Navigating the seas of human emotions",
        date: "Awarded on {{date}}",
        signature: "Captain Luna, Mood Detective"
    }
};
// RTL language support
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
export function useI18n() {
    // Use state for locale so it can be changed
    const [locale, setLocaleState] = useState('en');
    const direction = useMemo(() => {
        // Check if current locale is RTL
        if (rtlLanguages.includes(locale)) {
            return 'rtl';
        }
        return 'ltr';
    }, [locale]);
    const t = useMemo(() => {
        return (key, params) => {
            let translation;
            // Get translation based on locale
            if (locale === 'pirate') {
                translation = getNestedValue(pirateStrings, key) || getNestedValue(strings, key) || key;
            }
            else {
                translation = getNestedValue(strings, key) || key;
            }
            // Replace parameters
            if (params) {
                Object.entries(params).forEach(([param, value]) => {
                    translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
                });
            }
            return translation;
        };
    }, [locale]);
    const setLocale = (newLocale) => {
        setLocaleState(newLocale);
        console.log(`Locale changed to: ${newLocale}`);
    };
    return {
        locale,
        direction,
        t,
        setLocale
    };
}
// Helper function to get nested object values
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
// Hook for RTL-aware styling
export function useRTL() {
    const { direction } = useI18n();
    return {
        direction,
        isRTL: direction === 'rtl',
        textAlign: direction === 'rtl' ? 'right' : 'left',
        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
        marginStart: direction === 'rtl' ? 'ml' : 'mr',
        marginEnd: direction === 'rtl' ? 'mr' : 'ml',
        paddingStart: direction === 'rtl' ? 'pl' : 'pr',
        paddingEnd: direction === 'rtl' ? 'pr' : 'pl'
    };
}
