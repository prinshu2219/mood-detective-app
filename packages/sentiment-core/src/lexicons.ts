export const happy = [
  'love',
  'great',
  'awesome',
  'fantastic',
  'joy',
  'fun',
  'good',
  'glad',
  'smile',
  'yay',
];
export const sad = [
  'sad',
  'bad',
  'cry',
  'lost',
  'miss',
  'upset',
  'unhappy',
  'worst',
  'angry',
  'mad',
];
export const angry = [
  'angry',
  'furious',
  'annoyed',
  'hate',
  'grr',
  'rage',
  'yell',
  'bother',
  'irritated',
];
export const negations = [
  'not',
  'never',
  'no',
  "can't",
  'dont',
  "don't",
  "isn't",
  "wasn't",
  "won't",
];
export const intensifiers = ['very', 'super', 'really', 'so', 'extremely'];
export const emojis: Record<string, number> = {
  '😀': 2,
  '🙂': 1,
  '😊': 1,
  '😁': 2,
  '😍': 3,
  '😭': -3,
  '😢': -2,
  '😠': -2,
  '😡': -3,
  '😐': 0,
};

// Helper function to get sentiment score for a word
export function getWordSentiment(word: string): number {
  const lowerWord = word.toLowerCase();

  if (happy.includes(lowerWord)) return 2;
  if (sad.includes(lowerWord)) return -2;
  if (angry.includes(lowerWord)) return -2;

  return 0;
}

// Helper function to check if a word is a negation
export function isNegation(word: string): boolean {
  return negations.includes(word.toLowerCase());
}

// Helper function to check if a word is an intensifier
export function isIntensifier(word: string): boolean {
  return intensifiers.includes(word.toLowerCase());
}
