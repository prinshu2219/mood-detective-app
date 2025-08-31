declare module 'sentiment-core' {
  export type Label = 'HAPPY' | 'SAD' | 'ANGRY' | 'NEUTRAL';
  export interface Highlight {
    token: string;
    weight: number;
    reason?: string;
  }
  export interface ScoreResult {
    label: Label;
    score: number;
    highlights: Highlight[];
  }
  export function analyze(sentence: string): ScoreResult;
}
