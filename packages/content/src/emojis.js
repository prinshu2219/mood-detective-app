export const moodEmojis = {
    happy: {
        primary: '😊',
        variants: ['😀', '😁', '😄', '😃', '🙂', '😍', '🥰', '😋', '🤗', '😎'],
    },
    sad: {
        primary: '😢',
        variants: ['😭', '😔', '😞', '😥', '😪', '🥺', '😿', '😢', '😰', '😨'],
    },
    angry: {
        primary: '😠',
        variants: ['😡', '🤬', '😤', '😾', '💢', '😠', '😣', '😖', '😫', '😩'],
    },
    neutral: {
        primary: '😐',
        variants: ['😑', '😶', '🤔', '🤨', '😐', '😯', '😦', '😧', '😮', '😲'],
    },
};
export const characterEmojis = {
    luna: '🕵️‍♀️',
    tom: '😊',
    maya: '😢',
    rex: '😠',
};
export const gameEmojis = {
    star: '⭐',
    trophy: '🏆',
    medal: '🥇',
    sparkle: '✨',
    check: '✅',
    cross: '❌',
    arrow: '➡️',
    heart: '❤️',
};
export const backgroundEmojis = {
    cloud: '☁️',
    sun: '☀️',
    rainbow: '🌈',
    star: '⭐',
    sparkle: '✨',
    flower: '🌸',
    leaf: '🍃',
};
// Helper function to get random emoji from a category
export function getRandomEmoji(category) {
    const emojis = moodEmojis[category];
    const allEmojis = [emojis.primary, ...emojis.variants];
    return allEmojis[Math.floor(Math.random() * allEmojis.length)];
}
// Helper function to get emoji for mood label
export function getMoodEmoji(mood) {
    const moodKey = mood.toLowerCase();
    return moodEmojis[moodKey]?.primary || '😐';
}
