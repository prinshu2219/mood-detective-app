import { happy, sad, angry, negations, intensifiers, emojis } from './lexicons';

export type Label = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';
export interface Highlight { 
  token: string; 
  weight: number; 
  reason?: 'happy' | 'sad' | 'angry' | 'emoji' | 'negated' | 'intensified' | 'neutral';
}
export interface ScoreResult { 
  label: Label; 
  score: number; 
  highlights: Highlight[];
  confidence: number; // 0-1 confidence score
}

// Enhanced tokenization that handles contractions and punctuation better
function tokenize(text: string): string[] {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return [];

  // Match words, contractions (including n't), and emojis
  const tokenPattern = /([a-z]+(?:'[a-z]+)?|n't|[\u{1F300}-\u{1FAFF}])/gu;
  const tokens = Array.from(normalized.matchAll(tokenPattern)).map(match => match[0]);
  
  return tokens.filter(token => token.length > 0);
}

// Enhanced word weight calculation with better categorization
function getWordWeight(word: string): { weight: number; category: 'happy' | 'sad' | 'angry' | 'emoji' | 'neutral' } {
  // Check emojis first
  if (word in emojis) {
    return { weight: emojis[word as keyof typeof emojis], category: 'emoji' };
  }

  // Check sentiment categories
  if (happy.includes(word)) {
    return { weight: 2, category: 'happy' };
  }
  if (sad.includes(word)) {
    return { weight: -2, category: 'sad' };
  }
  if (angry.includes(word)) {
    return { weight: -2, category: 'angry' };
  }

  return { weight: 0, category: 'neutral' };
}

// Calculate confidence based on score magnitude and highlight count
function calculateConfidence(score: number, highlights: Highlight[]): number {
  const absScore = Math.abs(score);
  const highlightCount = highlights.length;
  
  // Base confidence on score magnitude
  let confidence = Math.min(absScore / 4, 1); // Max confidence at score of 4
  
  // Boost confidence if we have multiple highlights
  if (highlightCount > 1) {
    confidence = Math.min(confidence + (highlightCount * 0.1), 1);
  }
  
  // Reduce confidence for very low scores
  if (absScore < 1) {
    confidence *= 0.5;
  }
  
  return Math.round(confidence * 100) / 100; // Round to 2 decimal places
}

export function analyze(sentence: string): ScoreResult {
  const raw = sentence.trim();
  if (!raw) {
    return { 
      label: 'NEUTRAL', 
      score: 0, 
      highlights: [],
      confidence: 0
    };
  }

  const tokens = tokenize(raw);
  let score = 0;
  const highlights: Highlight[] = [];
  let negateWindow = 0; // counts down on every subsequent token
  let boost = 1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Handle negations
    if (negations.includes(token)) {
      negateWindow = 3; // flip next 3 tokens
      continue;
    }

    // Handle intensifiers
    if (intensifiers.includes(token)) {
      boost = 1.5;
    }

    // Get word weight and category
    const { weight, category } = getWordWeight(token);
    
    if (weight !== 0) {
      let finalWeight = weight;
      let reason: Highlight['reason'] = category;
      
      // Apply negation (counts regardless of sentiment)
      const isNegated = negateWindow > 0;
      if (isNegated) {
        finalWeight = -finalWeight;
      }

      // Apply intensifier multiplier if allowed
      const nextToken = tokens[i + 1];
      const allowBoost = boost > 1 && (!isNegated || (isNegated && ['this','that','it'].includes(nextToken)));
      if (allowBoost) {
        finalWeight = Math.sign(finalWeight) * Math.ceil(Math.abs(finalWeight) * boost);
      }

      // Reason: if negated, keep 'negated' even if intensified; else if boosted use 'intensified'; else category
      reason = isNegated ? 'negated' : (allowBoost ? 'intensified' : category);

      // Reset boost after use if we encountered a sentiment word
      if (boost > 1) boost = 1;
      
      highlights.push({ 
        token, 
        weight: finalWeight,
        reason
      });
      score += finalWeight;
    } else {
      // No sentiment weight; reset boost unless this token is an intensifier or a negation token itself
      if (!intensifiers.includes(token) && !negations.includes(token)) {
        boost = 1;
      }
    }

    // Decrement negation window for every token after encountering a negation
    if (negateWindow > 0) {
      negateWindow--;
    }
  }

  // Determine label based on score and highlights
  let label: Label = 'NEUTRAL';
  
  if (score >= 1) {
    label = 'HAPPY';
  } else if (score <= -1) {
    // Check for angry words specifically
    const hasAngryWords = highlights.some(h => 
      h.weight <= -2 && angry.includes(h.token)
    );
    label = hasAngryWords ? 'ANGRY' : 'SAD';
  } else if (score < -2) {
    label = 'ANGRY';
  }

  // Calculate confidence
  const confidence = calculateConfidence(score, highlights);

  return { 
    label, 
    score, 
    highlights,
    confidence
  };
}

// Utility function to get detailed analysis
export function analyzeDetailed(sentence: string): ScoreResult & {
  tokens: string[];
  processingSteps: Array<{
    token: string;
    weight: number;
    negated: boolean;
    intensified: boolean;
  }>;
} {
  const result = analyze(sentence);
  const tokens = tokenize(sentence);
  
  const processingSteps = tokens.map(token => {
    const { weight } = getWordWeight(token);
    return {
      token,
      weight,
      negated: negations.includes(token),
      intensified: intensifiers.includes(token)
    };
  });

  return {
    ...result,
    tokens,
    processingSteps
  };
}
