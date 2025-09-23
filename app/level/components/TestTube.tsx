"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './test-tube.module.css';
import { TUBE_DIMENSIONS } from '@/lib/gameConstants';

type LiquidSegment = { color: string; height: number };

export interface TestTubeViewModel {
  id: number;
  liquids: LiquidSegment[];
  leftPx: number;
  topPx: number;
  isSelected?: boolean;
  zIndex?: number;
  rotationDeg?: number;
}

interface Props {
  tube: TestTubeViewModel;
  onClick: (id: number) => void;
  drainOverlay?: { startTopPx: number; heightPx: number } | null;
  fillOverlay?: { startTopPx: number; heightPx: number; color: string } | null;
  isSelected?: boolean;
  isTransferring?: boolean;
}

const TestTube: React.FC<Props> = ({ tube, onClick, drainOverlay, fillOverlay, isSelected, isTransferring }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevLiquidsLength, setPrevLiquidsLength] = useState(tube.liquids.length);

  // Check if tube is completely filled with same color
  const isCompletelyFilled = tube.liquids.length === 4 && 
    tube.liquids.every(liquid => liquid.color === tube.liquids[0].color);

  // Trigger confetti when tube gets completely filled
  useEffect(() => {
    if (isCompletelyFilled && tube.liquids.length === 4 && prevLiquidsLength < 4) {
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setPrevLiquidsLength(tube.liquids.length);
  }, [tube.liquids.length, isCompletelyFilled, prevLiquidsLength]);

  return (
    <div
      className={styles.tube}
      style={{
        left: tube.leftPx,
        top: tube.topPx,
        zIndex: tube.zIndex ?? 0,
        transform: `rotate(${tube.rotationDeg ?? 0}deg) scale(${isSelected && !isTransferring ? 1.08 : 1})`,
        transition: `${isSelected && !isTransferring ? 'transform 200ms linear' : 'transform 1000ms linear'}, top 1000ms linear, left 1000ms linear`,
        backgroundColor: 'transparent'
      }}
      onClick={() => onClick(tube.id)}
    >
      <div className={styles.tubeBase} />
      <div className={styles.content}>
        {tube.liquids.map((liquid, idx) => {
          // bottom segment top = 100px, then 70px, 40px, 10px relative to tube
          const topPx = 100 - idx * 30; // mimics original CSS top values
          return (
            <div
              key={idx}
              className={styles.segment}
              style={{ backgroundColor: liquid.color, top: topPx }}
            />
          );
        })}
      </div>

      {drainOverlay && (
        <div
          className={styles.overlayDrain}
          style={{ top: Math.round(drainOverlay.startTopPx), height: Math.round(drainOverlay.heightPx) }}
        />
      )}

      {fillOverlay && (
        <div
          className={styles.overlayFill}
          style={{
            top: Math.round(fillOverlay.startTopPx),
            height: Math.round(fillOverlay.heightPx),
            background: fillOverlay.color,
          }}
        />
      )}

      {/* Confetti rope animation when tube is completely filled */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-b from-yellow-400 via-pink-400 to-blue-400 rounded-full"
              style={{
                left: '50%',
                top: '10px',
                transformOrigin: 'bottom center',
              }}
              initial={{
                x: -4,
                y: 0,
                rotate: (i - 4) * 15,
                scaleY: 0,
                opacity: 1,
              }}
              animate={{
                x: (i - 4) * 8,
                y: -60,
                rotate: (i - 4) * 25,
                scaleY: 1,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestTube;


