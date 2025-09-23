"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateLevel, LevelConfig } from '@/lib/levelGenerator';
import GameBoard from '../components/GameBoard';

interface LevelPageProps {
  params: Promise<{ id: string }>;
}

const LevelPage: React.FC<LevelPageProps> = ({ params }) => {
  const router = useRouter();
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState(false);

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
    } catch (err) {
      setError('Failed to generate level');
      console.error('Level generation error:', err);
    } finally {
      setLoading(false);
    }
  }, [levelNumber]);

  const handleLevelComplete = () => {
    setGameWon(true);
    // You can add celebration animation, sound effects, etc.
    setTimeout(() => {
      // Auto-advance to next level after 2 seconds
      const nextLevel = levelNumber + 1;
      if (nextLevel <= 1000) {
        router.push(`/level/${nextLevel}`);
      }
    }, 2000);
  };

  const handleRestart = () => {
    if (levelConfig) {
      const newConfig = generateLevel({ levelNumber });
      setLevelConfig(newConfig);
      setGameWon(false);
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
    return (
      <div className="min-h-screen w-full bg-primary-purple flex items-center justify-center">
        <div className="text-white text-xl">Loading Level {levelNumber}...</div>
      </div>
    );
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

  return (
    <div className="min-h-screen w-full bg-primary-purple flex items-center justify-center">
      {/* Game Board */}
      <GameBoard 
        level={levelNumber}
        levelConfig={levelConfig}
        onLevelComplete={handleLevelComplete}
      />
    </div>
  );
};

export default LevelPage;
