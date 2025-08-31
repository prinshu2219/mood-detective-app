import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { strings, characterEmojis } from 'content';

export default function Welcome() {
  const navigate = useNavigate();
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisitDone');
    if (!firstVisit) {
      localStorage.setItem('firstVisitDone', '1');
      // Ensure any previous guide dismissals are cleared for true first-time
      Object.keys(localStorage)
        .filter(k => k.startsWith('guide-'))
        .forEach(k => localStorage.removeItem(k));
      navigate('/characters');
    }
  }, [navigate]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 drop-shadow-sm">
          {strings.welcome.title}
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          {strings.welcome.subtitle}
        </p>
        <Link 
          to="/characters" 
          className="inline-block mt-8 rounded-2xl bg-indigo-600 text-white px-6 py-3 text-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
          aria-label="Start Adventure: go to character selection"
          title="Start Adventure"
        >
          {strings.welcome.startButton}
        </Link>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }} 
        className="rounded-3xl bg-white/70 p-8 shadow"
      >
        <div className="text-[7rem] md:text-[8rem] leading-none">
          {characterEmojis.luna}🔍{characterEmojis.tom}{characterEmojis.maya}{characterEmojis.rex}
        </div>
        <p className="mt-4 text-slate-600">{strings.welcome.description}</p>
      </motion.div>
    </div>
  );
}
