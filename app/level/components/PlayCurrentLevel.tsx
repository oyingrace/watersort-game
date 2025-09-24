"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";


export default function PlayCurrentLevel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // Replace this with your real user progress fetch (e.g., Farcaster / backend)
  const fetchUserCurrentLevel = useMemo(
    () => async (): Promise<number> => {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("currentLevel");
        const parsed = stored ? Number(stored) : NaN;
        if (!Number.isNaN(parsed) && parsed > 0) return parsed;
      }
      return 1; // fallback
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const level = await fetchUserCurrentLevel();
      if (!mounted) return;
      setCurrentLevel(level);
      setIsOpen(true);
    })();
    return () => {
      mounted = false;
    };
  }, [fetchUserCurrentLevel]);

  const handlePlay = () => {
    setIsOpen(false);
    router.push(`/level/${currentLevel}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]" onClick={() => setIsOpen(false)}>
      <div className="absolute inset-0 flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 -right-3 bg-yellow-400 rounded-xl p-2 hover:bg-yellow-500 transition-colors shadow-md"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
          <Card className="w-full max-w-lg mx-auto rounded-2xl p-6 bg-white border-primary-purple shadow-2xl">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">Play</h2>
              <Button onClick={handlePlay} className="text-base font-semibold bg-yellow-400 text-gray-800">
              Level {currentLevel}
              </Button>  
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


