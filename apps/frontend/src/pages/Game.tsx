import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { analyze } from 'sentiment-core';
import { track } from '../lib/analytics';
import { strings } from 'content';
import { DetectiveGuide } from '../components/DetectiveGuide';

// Enhanced sentence bank with more variety
const SENTENCES = [
  'I love ice cream!',
  "I don't like broccoli",
  'This is fantastic and awesome',
  'I am sad about the game',
  'That makes me so angry',
  'Today is okay',
  'I am really happy today',
  'I lost my toy and feel bad',
  'This puppy is the best',
  "I can't stand this",
  'The movie was amazing!',
  'I miss my friend',
  'I am so excited!',
  'This is really annoying',
  'I feel great today',
];

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

function getSessionId() {
  let id = localStorage.getItem('mdSessionId');
  if (!id) {
    id =
      'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('mdSessionId', id);
  }
  return id;
}

type Choice = 'HAPPY' | 'SAD' | 'ANGRY';

type Attempt = {
  round: number;
  sentence: string;
  student: Choice;
  ai: Choice;
  correct: boolean;
};

type GameState = {
  round: number;
  score: number;
  attempts: Attempt[];
  sentence: string;
  startedAt: number;
  nextSentence: () => void;
  choose: (c: Choice) => void;
  reset: () => void;
};

const pickRandom = () =>
  SENTENCES[Math.floor(Math.random() * SENTENCES.length)];

const useGame = create<GameState>((set, get) => ({
  round: 1,
  score: 0,
  attempts: [],
  sentence: pickRandom(),
  startedAt: Date.now(),
  nextSentence: () => set({ sentence: pickRandom() }),
  reset: () =>
    set({
      round: 1,
      score: 0,
      attempts: [],
      sentence: pickRandom(),
      startedAt: Date.now(),
    }),
  choose: async c => {
    const { round, attempts, sentence, score } = get();
    const aiResult = analyze(sentence);
    const ai: Choice =
      aiResult.label === 'HAPPY'
        ? 'HAPPY'
        : aiResult.label === 'ANGRY'
          ? 'ANGRY'
          : 'SAD';
    const correct = ai === c;
    const nextAttempts: Attempt[] = [
      ...attempts,
      { round, sentence, student: c, ai, correct },
    ];
    const nextScore = correct ? score + 1 : score;

    // POST attempt (non-blocking)
    const sessionId = getSessionId();
    fetch(`${API_BASE}/api/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        sessionId,
        round,
        sentence,
        student: c,
        ai,
        correct,
      }),
    }).catch(() => {});

    set({ attempts: nextAttempts, score: nextScore, round: round + 1 });
    if (round < 5) {
      setTimeout(() => get().nextSentence(), 200);
    } else {
      // After finishing round 5, POST score
      const timeSpentSec = Math.max(
        0,
        Math.round((Date.now() - get().startedAt) / 1000)
      );
      track('game_finished', {
        correct: nextScore,
        total: 5,
        timeSpent: timeSpentSec,
      });
      fetch(`${API_BASE}/api/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          sessionId,
          total: 5,
          correct: nextScore,
          timeSpent: timeSpentSec,
        }),
      }).catch(() => {});
    }
  },
}));

export default function Game() {
  const { round, score, sentence, choose, attempts, reset } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const done = round > 5;
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);

  useEffect(() => {
    // Reset result display when sentence changes
    setShowResult(false);
    setLastChoice(null);
    setLastCorrect(null);
  }, [sentence]);

  const handleChoice = (choice: Choice) => {
    setLastChoice(choice);
    const aiResult = analyze(sentence);
    const ai: Choice =
      aiResult.label === 'HAPPY'
        ? 'HAPPY'
        : aiResult.label === 'ANGRY'
          ? 'ANGRY'
          : 'SAD';
    const correct = ai === choice;
    setLastCorrect(correct);
    setShowResult(true);
    
    // Delay the actual choice to show result
    setTimeout(() => {
      choose(choice);
    }, 1500);
  };

  const stars = useMemo(
    () => Array.from({ length: 5 }).map((_, i) => i < score),
    [score]
  );

  const getChoiceEmoji = (choice: Choice) => {
    switch (choice) {
      case 'HAPPY': return '😊';
      case 'SAD': return '😢';
      case 'ANGRY': return '😠';
      default: return '😐';
    }
  };

  const getChoiceColor = (choice: Choice) => {
    switch (choice) {
      case 'HAPPY': return 'bg-green-600 hover:bg-green-700';
      case 'SAD': return 'bg-indigo-600 hover:bg-indigo-700';
      case 'ANGRY': return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <DetectiveGuide
        storageKey="guide-game"
        title="Challenge Round"
        steps={[
          { text: 'Read the sentence and choose HAPPY, SAD, or ANGRY.' },
          { text: 'We compare your pick with our Mood Detective.' },
          { text: 'Finish 5 rounds to see your stars and get a certificate!' },
        ]}
        primary={{ label: 'Start Game', onClick: () => {} }}
      />
      <DetectiveGuide
        storageKey="guide-game-complete"
        title="Fantastic! You finished the game."
        steps={[
          { text: `You scored ${score} stars.` },
          { text: 'Let\'s get your certificate to celebrate!' },
        ]}
        primary={{ label: 'Get Certificate', to: '/certificate' }}
        secondary={{ label: 'Play Again', onClick: () => reset() }}
        visible={done}
        persistDismissal={false}
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">
            Challenge Game
          </h1>
          <p className="text-xl text-gray-600">
            Read each sentence and guess the mood!
          </p>
        </div>

        {!done && (
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Progress */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold text-gray-700">
                Round {round} of 5
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < round - 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Score */}
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-indigo-700">
                Score: {score}
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {stars.map((on, i) => (
                  <span key={i} className="text-2xl">
                    {on ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>

            {/* Sentence */}
            <div className="text-center mb-8">
              <div className="text-sm text-gray-600 mb-2">Read this sentence:</div>
              <div className="text-2xl font-semibold text-gray-800 bg-gray-50 rounded-xl p-6">
                "{sentence}"
              </div>
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {showResult && lastChoice && lastCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center mb-6 p-4 rounded-xl bg-gray-50"
                >
                  <div className="text-2xl mb-2">
                    {lastCorrect ? '✅ Correct!' : '❌ Try again!'}
                  </div>
                  <div className="text-gray-600">
                    You chose: {getChoiceEmoji(lastChoice)} {lastChoice}
                  </div>
                  <div className="text-gray-600">
                    AI thinks: {getChoiceEmoji(lastCorrect ? lastChoice : 'SAD')} {lastCorrect ? lastChoice : 'SAD'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Choice Buttons */}
            {!showResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['HAPPY', 'SAD', 'ANGRY'] as Choice[]).map((choice) => (
                  <motion.button
                    key={choice}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(choice)}
                    className={`${getChoiceColor(choice)} text-white py-6 px-4 rounded-xl text-xl font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300`}
                  >
                    <div className="text-4xl mb-2">{getChoiceEmoji(choice)}</div>
                    <div>{choice}</div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Game Complete */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              Game Complete!
            </h2>
            
            <div className="mb-6">
              <div className="text-lg text-gray-600 mb-4">
                You got {score} out of 5 correct!
              </div>
              <div className="flex justify-center gap-2 text-4xl">
                {stars.map((on, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {on ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-2xl font-semibold text-gray-700 mb-2">
                {score === 5 ? 'Perfect! 🎉' : 
                 score >= 4 ? 'Great job! 👏' : 
                 score >= 3 ? 'Good work! 👍' : 
                 'Keep practicing! 💪'}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
              >
                Play Again
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/certificate"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors"
              >
                Get Certificate
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
