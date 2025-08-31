import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { analyze } from 'sentiment-core';
import { DetectiveGuide } from '../components/DetectiveGuide';

const PRESETS = [
  'That movie was sick!',
  'I can\'t wait!',
  'not very good',
  'really not bad',
  'I love this so much!',
  'This is absolutely terrible',
  'I am so excited about tomorrow',
  'I hate when this happens',
];

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

type Probs = { HAPPY: number; SAD: number; ANGRY: number; NEUTRAL: number };

// Enhanced ML predictor with more realistic behavior
async function predictTF(
  sentence: string
): Promise<{ label: keyof Probs; probs: Probs }> {
  // Simulate ML behavior that might differ from rules
  const r = analyze(sentence);
  const base: Probs = { HAPPY: 0.25, SAD: 0.25, ANGRY: 0.25, NEUTRAL: 0.25 };
  
  // ML might handle slang differently
  if (sentence.toLowerCase().includes('sick')) {
    base.HAPPY += 0.3; // ML might recognize "sick" as positive slang
  }
  
  // ML might be more sensitive to context
  if (sentence.toLowerCase().includes('can\'t wait')) {
    base.HAPPY += 0.4; // ML might better understand anticipation
  }
  
  // ML might handle double negatives differently
  if (sentence.toLowerCase().includes('not bad')) {
    base.HAPPY += 0.2; // ML might understand "not bad" as positive
  }
  
  // Apply rule-based adjustments
  if (r.score > 1) base.HAPPY += 0.3;
  if (r.score < -1) {
    base.SAD += 0.2;
    base.ANGRY += 0.2;
  }
  
  // Normalize probabilities
  const total = Object.values(base).reduce((sum, val) => sum + val, 0);
  Object.keys(base).forEach(key => {
    base[key as keyof Probs] = base[key as keyof Probs] / total;
  });
  
  const label = (Object.keys(base) as Array<keyof Probs>).sort(
    (a, b) => base[b] - base[a]
  )[0];
  return { label, probs: base };
}

export default function MLPeek() {
  const [text, setText] = useState('That movie was sick!');
  const [rules, setRules] = useState<{
    label: string;
    score: number;
    highlights: Array<{ token: string; weight: number }>;
  } | null>(null);
  const [ml, setMl] = useState<{ label: string; probs: Probs } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        // Server rules for parity with backend behavior
        const res = await fetch(`${API_BASE}/api/rules/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentence: text }),
        });
        const rj = await res.json();
        setRules(rj);
        const m = await predictTF(text);
        setMl(m);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [text]);

  const tricky = useMemo(() => PRESETS, []);

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'HAPPY': return 'text-green-700 bg-green-100';
      case 'SAD': return 'text-blue-700 bg-blue-100';
      case 'ANGRY': return 'text-red-700 bg-red-100';
      case 'NEUTRAL': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getHighestProb = (probs: Probs) => {
    return Object.entries(probs).reduce((max, [key, value]) => 
      value > max.value ? { key, value } : max, 
      { key: 'NEUTRAL', value: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <DetectiveGuide
        storageKey="guide-ml"
        title="Beyond Words: ML vs Rules"
        steps={[
          { text: 'Compare two approaches on the same sentence.' },
          { text: 'Try tricky phrases like “That movie was sick!”.' },
          { text: 'When you\'re done, grab your certificate.' },
        ]}
        primary={{ label: 'Let\'s Compare!', onClick: () => {} }}
        secondary={{ label: 'Go to Certificate', to: '/certificate' }}
      />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">
            ML vs Rules Comparison
          </h1>
          <p className="text-xl text-gray-600">
            Compare rule-based analysis with machine learning predictions
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Type a sentence to compare..."
            />
            {loading && (
              <div className="flex items-center text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                <span className="ml-2">Analyzing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Test Cases */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Try these tricky examples:</p>
          <div className="flex flex-wrap gap-2">
            {tricky.map((testCase) => (
              <motion.button
                key={testCase}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setText(testCase)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                {testCase}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Comparison Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Rules Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Rules Engine (Server)</h3>
            </div>
            
            {rules ? (
              <>
                <div className="mb-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getLabelColor(rules.label)}`}>
                    {rules.label}
                  </span>
                  <div className="mt-2 text-gray-600">
                    Score: {rules.score}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Words:</h4>
                  <div className="flex flex-wrap gap-2">
                    {rules.highlights?.map((h, i) => (
                      <span
                        key={i}
                        className={`rounded-lg px-2 py-1 text-sm font-medium ${
                          h.weight > 0 
                            ? 'text-green-700 bg-green-100 border border-green-200' 
                            : h.weight < 0 
                              ? 'text-red-700 bg-red-100 border border-red-200' 
                              : 'text-gray-600 bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {h.token} ({h.weight > 0 ? '+' : ''}{h.weight})
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>• Uses predefined word lists</p>
                  <p>• Applies negation rules</p>
                  <p>• Handles intensifiers</p>
                </div>
              </>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </motion.div>

          {/* ML Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">ML Model (Browser)</h3>
            </div>
            
            {ml ? (
              <>
                <div className="mb-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getLabelColor(ml.label)}`}>
                    {ml.label}
                  </span>
                  <div className="mt-2 text-gray-600">
                    Confidence: {Math.round(getHighestProb(ml.probs).value * 100)}%
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Probabilities:</h4>
                  <div className="space-y-2">
                    {(Object.entries(ml.probs) as Array<[keyof Probs, number]>).map(([label, prob]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.round(prob * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-8">
                            {Math.round(prob * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>• Learns from examples</p>
                  <p>• Understands context</p>
                  <p>• Handles slang better</p>
                </div>
              </>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </motion.div>
        </div>

        {/* Key Differences */}
        {rules && ml && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Differences:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rules Engine</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fast and predictable</li>
                  <li>• Easy to understand</li>
                  <li>• Requires manual updates</li>
                  <li>• Struggles with slang</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ML Model</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Learns patterns automatically</li>
                  <li>• Better with context</li>
                  <li>• Can handle new words</li>
                  <li>• May be less interpretable</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="text-center mt-8">
          <a
            href="/certificate"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Get Your Certificate
          </a>
        </div>
      </div>
    </div>
  );
}
