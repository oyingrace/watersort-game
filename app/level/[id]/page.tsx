"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateLevel, LevelConfig } from '@/lib/levelGenerator';
import GameBoard, { GameBoardHandle } from '../components/GameBoard';
import QuitLevelPopup from '../components/QuitLevelPopup';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Reset from '../components/Reset';
import UndoMove from '../components/UndoMove';
import Hint from '../components/Hint';
import Loader from '@/app/components/Loader';
import LevelWin from '../components/LevelWin';

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

const LevelPage: React.FC<LevelPageProps> = ({ params }) => {
  const router = useRouter();
  const boardRef = React.useRef<GameBoardHandle | null>(null);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [showQuit, setShowQuit] = useState(false);
  const [hintsLeft, setHintsLeft] = useState<number>(5);
  const [undosLeft, setUndosLeft] = useState<number>(5);

  // unwrap params (Next.js: params is now a Promise)
  const unwrappedParams = React.use(params);
  const levelNumber = parseInt(unwrappedParams.id);

  useEffect(() => {
    if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 1000) {
      setError('Invalid level number');
      setLoading(false);
      return;
    }

    try {
      const config = generateLevel({ levelNumber });
      setLevelConfig(config);
      setGameWon(false);
      setUndosLeft(5);
    } catch (err) {
      setError('Failed to generate level');
      console.error('Level generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [levelNumber]);

  // Load global hints from localStorage
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('globalHintsLeft') : null;
      const parsed = stored ? parseInt(stored) : 5;
      setHintsLeft(Number.isNaN(parsed) ? 5 : parsed);
    } catch (_) {}
  }, []);

  const handleUseHint = () => {
    if (hintsLeft <= 0) return;
    const moved = boardRef.current?.performHintMove() ?? false;
    if (!moved) return;
    const next = hintsLeft - 1;
    setHintsLeft(next);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('globalHintsLeft', String(next));
      }
    } catch (_) {}
  };

  const handleUndo = () => {
    if (undosLeft <= 0) return;
    const didUndo = boardRef.current?.undoLastMove() ?? false;
    if (!didUndo) return;
    setUndosLeft(prev => prev - 1);
  };

  const handleLevelComplete = () => {
    setGameWon(true);
    // Level completed - no automatic progression
    // You can add celebration animation, sound effects, etc.
    try {
      if (typeof window !== 'undefined') {
        const storageKey = 'highestUnlockedLevel';
        const stored = window.localStorage.getItem(storageKey);
        const highestUnlocked = stored ? parseInt(stored) : 1;
        const nextLevelToUnlock = Math.min(levelNumber + 1, 1000);
        if (!Number.isNaN(nextLevelToUnlock) && nextLevelToUnlock > highestUnlocked) {
          window.localStorage.setItem(storageKey, String(nextLevelToUnlock));
        }
      }
    } catch (_) {
      // ignore storage errors (private mode, etc.)
    }
  };

  const handleRestart = () => {
    if (levelConfig) {
      const newConfig = generateLevel({ levelNumber });
      setLevelConfig(newConfig);
      setGameWon(false);
      setUndosLeft(5);
    }
  };

  const handlePreviousLevel = () => {
    if (levelNumber > 1) {
      router.push(`/level/${levelNumber - 1}`);
    }
  };

  const handleNextLevel = () => {
    if (levelNumber < 1000) {
      router.push(`/level/${levelNumber + 1}`);
    }
  };

  const handleBackToLevelSelect = () => {
    router.push('/level');
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !levelConfig) {
    return (
      <div className="min-h-screen w-full bg-primary-purple flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">Error: {error}</div>
        <button
          onClick={handleBackToLevelSelect}
          className="bg-white text-primary-purple px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Back to Level Select
        </button>
      </div>
    );
  }

  if (gameWon) {
    return (
      <LevelWin
        onShare={() => {}}
        onNext={handleNextLevel}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center relative">
      {/* Top-left Quit (X) button */}
      <div className="absolute top-4 left-4 z-40">
        <Button
          type="button"
          onClick={() => setShowQuit(true)}
          className="h-10 w-10 p-0 font-bold rounded-xl bg-yellow-400 text-gray-800"
          variant="outline"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <UndoMove onClick={handleUndo} disabled={undosLeft <= 0} remaining={undosLeft} />
        <Reset onClick={handleRestart} />
        <Hint onClick={handleUseHint} disabled={hintsLeft <= 0} remaining={hintsLeft} />
      </div>

      {/* Game Board */}
      <GameBoard 
        ref={boardRef}
        level={levelNumber}
        levelConfig={levelConfig}
        onLevelComplete={handleLevelComplete}
      />

      {/* Quit Popup */}
      <QuitLevelPopup
        open={showQuit}
        onPlayOn={() => setShowQuit(false)}
        onQuit={() => router.push('/level')}
        onClose={() => setShowQuit(false)}
      />
    </div>
  );
};

export default LevelPage;
