import strings from './strings.en.json';
export * from './emojis';

export { strings };
export type { Strings } from './types';

// Helper function to get nested content with type safety
export function getContent(path: string): any {
  return path.split('.').reduce((obj: any, key) => obj?.[key], strings);
}

// Helper function to replace placeholders in strings
export function formatString(
  template: string,
  replacements: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return replacements[key]?.toString() || match;
  });
}
