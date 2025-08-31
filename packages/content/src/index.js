import strings from './strings.en.json';
export * from './emojis';
export { strings };
// Helper function to get nested content with type safety
export function getContent(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], strings);
}
// Helper function to replace placeholders in strings
export function formatString(template, replacements) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return replacements[key]?.toString() || match;
    });
}
