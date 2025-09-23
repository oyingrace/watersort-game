"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LevelMap = ({ currentLevel = 1 }: { currentLevel?: number }) => {
  const router = useRouter();
  
  // Generate array of numbers 1-100
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleLevelClick = (level: number) => {
    router.push(`/level/${level}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 pt-[max(80px,calc(env(safe-area-inset-top)+60px))] pb-[max(80px,calc(env(safe-area-inset-bottom)+60px))]">
      <Card className="w-[400px] max-w-[90vw] max-h-[80vh] bg-gradient-to-b from-yellow-200 to-yellow-300 border-4 border-yellow-400 shadow-2xl">
        <CardHeader className="pb-4 relative flex justify-center items-center">
          <h2 className="bg-primary-purple text-white text-xl py-2 px-3 rounded-lg shadow-lg text-center border-2 border-primary-purple w-fit">
            Level Select
          </h2>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className="max-h-[500px] overflow-y-auto bg-yellow-100 rounded-lg p-4 border-2 border-yellow-400 scrollbar-hide">
            <div className="grid grid-cols-5 gap-3 gap-y-4">
              {levels.map((level) => (
                <Button
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`
                    h-10 w-10 text-lg font-bold rounded-lg border-2 transition-all duration-200 
                    ${currentLevel === level 
                      ? 'bg-green-500 hover:bg-green-600 border-green-600 text-white shadow-lg scale-105' 
                      : 'bg-yellow-200 hover:bg-yellow-300 border-yellow-400 text-yellow-800 shadow-md hover:shadow-lg hover:scale-102'
                    }
                  `}
                  variant="outline"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelMap;