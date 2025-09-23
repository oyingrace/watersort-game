"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const LevelMap = ({ currentLevel = 1 }: { currentLevel?: number }) => {
  const router = useRouter();
  
  // Generate array of numbers 1-100
  const levels = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

  const [highestUnlocked, setHighestUnlocked] = useState<number>(1);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('highestUnlockedLevel');
        const parsed = stored ? parseInt(stored) : 1;
        setHighestUnlocked(Number.isNaN(parsed) ? 1 : Math.max(1, parsed));
      }
    } catch (_) {
      setHighestUnlocked(1);
    }
  }, []);

  const handleLevelClick = (level: number) => {
    router.push(`/level/${level}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pt-[max(80px,calc(env(safe-area-inset-top)+60px))] pb-[max(80px,calc(env(safe-area-inset-bottom)+60px))]">
      <Card className="w-[400px] max-w-[90vw] max-h-[80vh] bg-secondary-purple shadow-2xl">
        <CardHeader className="pb-4 relative flex justify-center items-center">
          <h2 className="bg-primary-purple text-white text-xl py-2 px-3 rounded-lg shadow-lg text-center border-2 border-primary-purple w-fit">
            Level Select
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className="max-h-[500px] overflow-y-auto bg-secondary-purple rounded-lg p-4 border-2 border-primary-yellow scrollbar-hide">
            <div className="grid grid-cols-5 gap-3 gap-y-4">
              {levels.map((level) => {
                const isUnlocked = level <= highestUnlocked;
                return (
                  <div key={level} className="relative">
                    <Button
                      onClick={() => isUnlocked && handleLevelClick(level)}
                      disabled={!isUnlocked}
                      className={`
                        h-10 w-10 text-lg font-bold rounded-lg border-2 transition-all duration-200 relative 
                        ${isUnlocked
                          ? 'bg-yellow-400 text-dark-brown shadow-md hover:shadow-lg hover:scale-102'
                          : 'bg-yellow-400 text-gray-800 cursor-not-allowed'
                        }
                      `}
                      variant="outline"
                    >
                      {isUnlocked ? level : ''}
                      {!isUnlocked && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <Lock className="text-gray-800" size={18} />
                        </div>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelMap;