import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { strings, characterEmojis } from 'content';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useDraggable,
  useSensors,
  useSensor,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState, useEffect } from 'react';
import { track } from '../lib/analytics';
import { DetectiveGuide } from '../components/DetectiveGuide';

const characters = [
  { key: 'luna', emoji: characterEmojis.luna },
  { key: 'tom', emoji: "😃" },
  { key: 'maya', emoji: "😔" },
  { key: 'rex', emoji: "😡" },
] as const;

type Mood = 'happy' | 'sad' | 'angry';

// Mapping for expected moods used for the drag-drop correctness
const characterMood: Record<(typeof characters)[number]['key'], Mood> = {
  luna: 'happy',
  tom: 'happy',
  maya: 'sad',
  rex: 'angry',
};

function DroppableBasket({
  id,
  label,
  pickedId,
  onKeyboardDrop,
}: {
  id: Mood;
  label: string;
  pickedId: string | null;
  onKeyboardDrop: (charId: string, target: Mood) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      role="button"
      aria-label={`${label} basket`}
      tabIndex={0}
      className={`rounded-2xl border-2 border-dashed p-6 text-center select-none transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
        isOver ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-300'
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && pickedId) {
          onKeyboardDrop(pickedId, id);
        }
      }}
    >
      <div className="text-sm font-medium text-slate-700">{label}</div>
    </div>
  );
}

function DraggableCard({
  id,
  emoji,
  label,
  onClick,
  isPicked,
  onPickToggle,
}: {
  id: string;
  emoji: string;
  label: string;
  onClick?: () => void;
  isPicked: boolean;
  onPickToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style as React.CSSProperties}
      className={`w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow outline-none ${
        isPicked ? 'ring-4 ring-emerald-400' : 'focus:ring-4 focus:ring-indigo-300'
      } ${isDragging ? 'opacity-70' : ''}`}
      aria-label={`Character ${label}. Press Enter to pick up, Tab to basket, Enter to drop.`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onPickToggle();
        }
      }}
    >
      <div className="text-4xl mb-2 text-center" aria-hidden>
        {emoji}
      </div>
      <div className="text-lg font-bold text-indigo-700 text-center">
        {label}
      </div>
    </button>
  );
}

export default function Characters() {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const [toast, setToast] = useState<null | { ok: boolean; text: string }>(
    null
  );
  const [streak, setStreak] = useState(0);
  const [burst, setBurst] = useState(0); // increments to show confetti bursts
  const [showPostStreakGuide, setShowPostStreakGuide] = useState(false);
  const [postStreakTimer, setPostStreakTimer] = useState<number | null>(null);
  const [selected, setSelected] = useState<null | { name: string; mood: Mood }>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const evaluateDrop = (charId: string, target: Mood) => {
    const expected = characterMood[charId as keyof typeof characterMood];
    const ok = expected === target;
    setToast({ ok, text: ok ? 'Great match!' : 'Try again!' });
    if (ok) track('drag_drop_complete', { character: charId, mood: target });
    if (ok) {
      setStreak(s => {
        const next = s + 1;
        if (next % 3 === 0) {
          setBurst(b => Math.min(b + 1, 3));
          if (postStreakTimer) window.clearTimeout(postStreakTimer);
          const t = window.setTimeout(() => setShowPostStreakGuide(true), 2000);
          setPostStreakTimer(t);
        }
        return next;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => setToast(null), 1200);
  };

  const handleEnd = (event: DragEndEvent) => {
    const charId = event.active?.id as string | undefined;
    const target = event.over?.id as Mood | undefined;
    if (!charId || !target) return;
    evaluateDrop(charId, target);
  };

  const baskets = useMemo(
    () => [
      { id: 'happy' as Mood, label: 'Happy 😊' },
      { id: 'sad' as Mood, label: 'Sad 😢' },
      { id: 'angry' as Mood, label: 'Angry 😠' },
    ],
    []
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <DetectiveGuide
        storageKey="guide-characters"
        title="Meet the Characters"
        steps={[
          { text: 'These friends say sentences with different feelings.' },
          { text: 'Try dragging a character into the matching mood basket.' },
          { text: 'Tip: You can also pick with Enter, Tab to a basket, Enter to drop.' },
        ]}
        primary={{ label: 'Okay!', onClick: () => {} }}
      />
      <DetectiveGuide
        storageKey="guide-characters-complete"
        title="Awesome streak! What did we learn?"
        steps={[
          { text: 'You matched 3 in a row—great job!' },
          { text: 'We grouped sentences by feelings: Happy, Sad, Angry.' },
          { text: 'Computers look for feeling words (like love, cry, angry).' },
          { text: 'Next, let\'s see how a computer does this automatically.' },
        ]}
        primary={{ label: 'Continue to Demo', to: '/demo' }}
        secondary={{ label: 'Keep Practicing', onClick: () => {} }}
        visible={showPostStreakGuide}
        onClose={() => setShowPostStreakGuide(false)}
        persistDismissal={false}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">
          Meet the Characters
        </h2>
        <p className="text-lg text-slate-700 mb-6">
          Drag or keyboard-move characters into the mood baskets below.
        </p>
        <div className="text-sm text-slate-500 mb-8">
          Keyboard: Focus a card, press Enter to pick up, Tab to a basket, Enter
          to drop.
        </div>
      </motion.div>

      <DndContext sensors={sensors} onDragEnd={handleEnd}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characters.map((char, index) => {
            const character = strings.characters[char.key];
            return (
              <motion.div
                key={char.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <DraggableCard
                  id={char.key}
                  emoji={char.emoji}
                  label={character.name}
                  onClick={() =>
                    setSelected({
                      name: character.name,
                      mood: characterMood[char.key as keyof typeof characterMood],
                    })
                  }
                  isPicked={pickedId === char.key}
                  onPickToggle={() => setPickedId(p => (p === char.key ? null : char.key))}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {baskets.map(b => (
            <DroppableBasket
              key={b.id}
              id={b.id}
              label={b.label}
              pickedId={pickedId}
              onKeyboardDrop={(charId, target) => {
                evaluateDrop(charId, target);
                setPickedId(null);
              }}
            />
          ))}
        </div>
      </DndContext>

      {/* Example sentences for the selected character */}
      {selected && (
        <section
          className={`mt-8 rounded-2xl border p-6 ${
            selected.mood === 'happy'
              ? 'border-emerald-300 bg-emerald-50'
              : selected.mood === 'sad'
              ? 'border-sky-300 bg-sky-50'
              : 'border-rose-300 bg-rose-50'
          }`}
          role="region"
          aria-label={`${selected.name} example sentences`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700">
              {selected.name}'s example sentences ({selected.mood})
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="text-xs underline text-slate-500"
              aria-label="Hide examples"
            >
              hide
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {(selected.mood === 'happy'
              ? strings.sentences.happy
              : selected.mood === 'sad'
              ? strings.sentences.sad
              : strings.sentences.angry
            ).slice(0, 3).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 py-3 shadow-lg ${
            toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.text} {streak > 1 && `(streak: ${streak})`}
        </div>
      )}

      {/* Simple confetti burst using emoji */}
      {Array.from({ length: burst }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none fixed inset-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-ping">
            🎉🎉🎉
          </div>
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-12"
      >
        <Link
          to="/demo"
          className="inline-block rounded-2xl bg-indigo-600 text-white px-8 py-4 text-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
        >
          Continue to Demo
        </Link>
        {streak >= 3 && (
          <div className="mt-2 text-sm text-emerald-700">{"Great! Now let's move to Demo."}</div>
        )}
      </motion.div>
    </main>
  );
}
