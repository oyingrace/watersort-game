"use client";

import React from 'react';
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
    </div>
  );
};

export default TestTube;


