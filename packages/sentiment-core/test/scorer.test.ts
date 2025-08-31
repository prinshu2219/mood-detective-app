import { describe, it, expect } from 'vitest';
import { analyze, analyzeDetailed, type ScoreResult } from '../src/scorer';

describe('Sentiment Analysis Engine', () => {
  describe('Basic Sentiment Detection', () => {
    it('should detect happy sentiment', () => {
      const result = analyze('I love ice cream!');
      expect(result.label).toBe('HAPPY');
      expect(result.score).toBeGreaterThan(0);
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'love', weight: 2 })
      );
    });

    it('should detect sad sentiment', () => {
      const result = analyze('I am feeling sad today');
      expect(result.label).toBe('SAD');
      expect(result.score).toBeLessThan(0);
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'sad', weight: -2 })
      );
    });

    it('should detect angry sentiment', () => {
      const result = analyze('I am so angry right now!');
      expect(result.label).toBe('ANGRY');
      expect(result.score).toBeLessThan(0);
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'angry',
          weight: -3,
          reason: 'intensified',
        })
      );
    });

    it('should detect neutral sentiment', () => {
      const result = analyze('The sky is blue');
      expect(result.label).toBe('NEUTRAL');
      expect(result.score).toBe(0);
      expect(result.highlights).toHaveLength(0);
    });
  });

  describe('Negation Handling', () => {
    it('should handle simple negation', () => {
      const result = analyze('I do not love this');
      expect(result.label).toBe('SAD');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: -2,
          reason: 'negated',
        })
      );
    });

    it('should handle negation window of 3 tokens', () => {
      const result = analyze('I do not really love ice cream');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: -2,
          reason: 'negated',
        })
      );
    });

    it('should reset negation after 3 tokens', () => {
      const result = analyze('I do not really want to love ice cream');
      // 'love' should not be negated as it's beyond the 3-token window
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'love', weight: 2, reason: 'happy' })
      );
    });

    it('should handle multiple negations', () => {
      const result = analyze('I do not hate this, I love it');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'hate', weight: 2, reason: 'negated' })
      );
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'love', weight: 2, reason: 'happy' })
      );
    });
  });

  describe('Intensifier Handling', () => {
    it('should handle intensifiers', () => {
      const result = analyze('I really love this');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: 3,
          reason: 'intensified',
        })
      );
    });

    it('should handle very strong intensifiers', () => {
      const result = analyze('I super love this');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: 3,
          reason: 'intensified',
        })
      );
    });

    it('should reset intensifier after use', () => {
      const result = analyze('I really love this and hate that');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: 3,
          reason: 'intensified',
        })
      );
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'hate', weight: -2, reason: 'angry' })
      );
    });
  });

  describe('Emoji Handling', () => {
    it('should detect happy emojis', () => {
      const result = analyze('I am happy 😊');
      expect(result.label).toBe('HAPPY');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: '😊', weight: 1, reason: 'emoji' })
      );
    });

    it('should detect sad emojis', () => {
      const result = analyze('I am sad 😢');
      expect(result.label).toBe('SAD');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: '😢', weight: -2, reason: 'emoji' })
      );
    });

    it('should detect angry emojis', () => {
      const result = analyze('I am angry 😠');
      expect(result.label).toBe('ANGRY');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: '😠', weight: -2, reason: 'emoji' })
      );
    });
  });

  describe('Complex Combinations', () => {
    it('should handle negation + intensifier', () => {
      const result = analyze('I do not really love this');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: -3,
          reason: 'negated',
        })
      );
    });

    it('should handle multiple sentiment words', () => {
      const result = analyze('I love this but hate that');
      expect(result.score).toBe(0); // +2 - 2 = 0
      expect(result.highlights).toHaveLength(2);
    });

    it('should handle complex sentence with mixed emotions', () => {
      const result = analyze(
        'I really love ice cream but I am sad about the weather'
      );
      expect(result.label).toBe('HAPPY'); // +3 - 2 = +1
      expect(result.highlights).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = analyze('');
      expect(result.label).toBe('NEUTRAL');
      expect(result.score).toBe(0);
      expect(result.confidence).toBe(0);
    });

    it('should handle whitespace only', () => {
      const result = analyze('   ');
      expect(result.label).toBe('NEUTRAL');
      expect(result.score).toBe(0);
      expect(result.confidence).toBe(0);
    });

    it('should handle punctuation', () => {
      const result = analyze('I love this!!!');
      expect(result.label).toBe('HAPPY');
      expect(result.highlights).toContainEqual(
        expect.objectContaining({ token: 'love', weight: 2 })
      );
    });

    it('should handle contractions', () => {
      const result = analyze("I don't love this");
      expect(result.highlights).toContainEqual(
        expect.objectContaining({
          token: 'love',
          weight: -2,
          reason: 'negated',
        })
      );
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate high confidence for strong sentiment', () => {
      const result = analyze('I really love this fantastic thing');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should calculate low confidence for weak sentiment', () => {
      const result = analyze('I like this');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should calculate medium confidence for moderate sentiment', () => {
      const result = analyze('I love this');
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.confidence).toBeLessThan(0.7);
    });
  });

  describe('Detailed Analysis', () => {
    it('should provide detailed analysis', () => {
      const result = analyzeDetailed('I do not really love this');

      expect(result.tokens).toContain('i');
      expect(result.tokens).toContain('do');
      expect(result.tokens).toContain('not');
      expect(result.tokens).toContain('really');
      expect(result.tokens).toContain('love');
      expect(result.tokens).toContain('this');

      expect(result.processingSteps).toHaveLength(6);
      expect(result.processingSteps).toContainEqual(
        expect.objectContaining({
          token: 'not',
          negated: true,
          intensified: false,
        })
      );
      expect(result.processingSteps).toContainEqual(
        expect.objectContaining({
          token: 'really',
          negated: false,
          intensified: true,
        })
      );
    });
  });

  describe('Snapshot Tests for Top Examples', () => {
    it('should match snapshot for happy examples', () => {
      const examples = [
        'I love ice cream!',
        'This is the best day ever!',
        'I am so excited about the party!',
        'My new puppy is awesome!',
        'I got an A on my test!',
      ];

      const results = examples.map(example => ({
        sentence: example,
        result: analyze(example),
      }));

      expect(results).toMatchSnapshot();
    });

    it('should match snapshot for sad examples', () => {
      const examples = [
        'I lost my favorite toy.',
        'My friend moved away.',
        'I am feeling sad today.',
        'I miss my grandma.',
        'The movie made me cry.',
      ];

      const results = examples.map(example => ({
        sentence: example,
        result: analyze(example),
      }));

      expect(results).toMatchSnapshot();
    });

    it('should match snapshot for angry examples', () => {
      const examples = [
        'I am so angry right now!',
        'That is not fair!',
        'I hate when this happens!',
        'I am furious about this!',
        'This is really annoying!',
      ];

      const results = examples.map(example => ({
        sentence: example,
        result: analyze(example),
      }));

      expect(results).toMatchSnapshot();
    });

    it('should match snapshot for neutral examples', () => {
      const examples = [
        'The sky is blue.',
        'I have a red backpack.',
        'The book is on the table.',
        'It is raining outside.',
        'I live in a house.',
      ];

      const results = examples.map(example => ({
        sentence: example,
        result: analyze(example),
      }));

      expect(results).toMatchSnapshot();
    });
  });
});
