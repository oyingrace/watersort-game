"use client";

import { motion } from 'framer-motion';
import React from 'react';
import ShareButton from '@/app/components/ShareButton';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';

interface LevelWinProps {
  onShare?: () => void;
  onNext?: () => void;
  className?: string;
}

const MESSAGES = [
  'Bravo',
  'Victory!',
  'Champion!',
  'Winner!',
  'Excellent!',
  'Nice!',
  'Well Done!',
  'Fantastic!',
  'Superb!',
  'You Rock!',
  'Amazing!',
  'Congrats!',
  'Awesome!',
  'Genius!',
  'Perfect!',
  'Outstanding!',
  'Great Job!',
  'You Did It!',
  'Unstoppable!',
  'Master!'
];

export default function LevelWin({ onShare, onNext, className = '' }: LevelWinProps) {
  const [message] = React.useState<string>(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  const [size, setSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = React.useState<boolean>(true);
  const [confettiPieces, setConfettiPieces] = React.useState<number>(200);

  React.useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Subtly taper off confetti after a few seconds
  React.useEffect(() => {
    if (!showConfetti) return;
    // Start taper after initial burst duration
    const startTaperTimer = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        setConfettiPieces(prev => {
          const next = Math.max(prev - 40, 0);
          if (next === 0) {
            window.clearInterval(interval);
            // Small delay to allow last pieces to fall off-screen
            window.setTimeout(() => setShowConfetti(false), 200);
          }
          return next;
        });
      }, 100);
    }, 2200);
    return () => window.clearTimeout(startTaperTimer);
  }, [showConfetti]);
  return (
    <div className={`min-h-screen w-full bg-purple-100 flex items-center justify-center relative overflow-hidden ${className}`}>
      {showConfetti && size.width > 0 && size.height > 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: confettiPieces / 200 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Left burst moving towards center */}
          <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={confettiPieces}
            recycle={false}
            gravity={0.2}
            wind={0.5}
            confettiSource={{ x: 0, y: 0, w: 20, h: size.height }}
          />
          {/* Right burst moving towards center */}
          <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={confettiPieces}
            recycle={false}
            gravity={0.2}
            wind={-0.5}
            confettiSource={{ x: Math.max(size.width - 20, 0), y: 0, w: 20, h: size.height }}
          />
        </motion.div>
      )}
      <div className="flex flex-col items-center gap-6">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-4xl md:text-5xl font-extrabold text-primary-purple text-center"
        >
          {message}
        </motion.h1>
        <div className="flex items-center gap-3">
          <ShareButton onClick={onShare} />
          <Button type="button" onClick={onNext} className="bg-yellow-400 text-gray-800 font-bold">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
