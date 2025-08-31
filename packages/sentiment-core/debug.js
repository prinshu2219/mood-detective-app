import { analyze } from './dist/src/index.js';

// Debug tokenization
function tokenize(text) {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return [];

  const tokenPattern = /([a-z]+(?:'[a-z]+)?|n't|[\u{1F300}-\u{1FAFF}])/gu;
  const tokens = Array.from(normalized.matchAll(tokenPattern)).map(
    match => match[0]
  );

  return tokens.filter(token => token.length > 0);
}

const tokens = tokenize('I do not really want to love ice cream');
console.log('Tokens:', tokens);

const result = analyze('I do not really want to love ice cream');
console.log('Result:', JSON.stringify(result, null, 2));
