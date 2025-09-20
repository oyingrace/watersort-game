"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LevelMap = ({ onLevelSelect, currentLevel = 1 }: { onLevelSelect?: (level: number) => void; currentLevel?: number }) => {
  // Generate array of numbers 1-100
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleLevelClick = (level: number) => {
    if (onLevelSelect) {
      onLevelSelect(level);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[500px] max-w-[90vw] max-h-[80vh] bg-gradient-to-b from-yellow-200 to-yellow-300 border-4 border-yellow-400 shadow-2xl">
        <CardHeader className="pb-4 relative">
          <div className="bg-green-500 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-lg text-center border-2 border-green-600">
            Level Select
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className="max-h-[500px] overflow-y-auto bg-yellow-100 rounded-lg p-4 border-2 border-yellow-400">
            <div className="grid grid-cols-5 gap-3">
              {levels.map((level) => (
                <Button
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`
                    h-16 w-12 text-lg font-bold rounded-lg border-2 transition-all duration-200 
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