"use client";

import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { LevelConfig, TestTube } from '@/lib/levelGenerator';
import TestTubeView, { TestTubeViewModel } from './TestTube';
import { BOARD_LAYOUT, TUBE_DIMENSIONS, GAME_ANIM } from '@/lib/gameConstants';
import { isValidPour, countPourableSegments } from '@/lib/gameHelpers';

export interface GameBoardHandle {
  undoLastMove: () => void;
  performHintMove: () => boolean; // returns true if a move was made
}

interface GameBoardProps {
  level: number;
  levelConfig: LevelConfig;
  onLevelComplete?: () => void;
  onMove?: () => void;
}

const GameBoard = forwardRef<GameBoardHandle, GameBoardProps>(({ level, levelConfig, onLevelComplete, onMove }, ref) => {
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [tubes, setTubes] = useState<TestTube[]>(levelConfig.tubes);
  const [history, setHistory] = useState<TestTube[][]>([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [overrides, setOverrides] = useState<Record<number, Partial<TestTubeViewModel>>>({});
  const [drainOverlays, setDrainOverlays] = useState<Record<number, { startTopPx: number; heightPx: number } | null>>({});
  const [fillOverlays, setFillOverlays] = useState<Record<number, { startTopPx: number; heightPx: number; color: string } | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPouringRef = useRef(false);
  const lastPourIdRef = useRef<string | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 720, height: 420 });

  // Update tubes when level config changes
  React.useEffect(() => {
    setTubes(levelConfig.tubes);
    setSelectedTube(null);
    setHistory([]);
  }, [levelConfig]);

  // Observe container size for responsiveness
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setContainerSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);
    // Initial set
    setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Expose APIs
  useImperativeHandle(ref, () => ({
    undoLastMove: () => {
      setHistory(prev => {
        if (prev.length === 0) return prev;
        const nextHistory = [...prev];
        const last = nextHistory.pop() as TestTube[];
        setTubes(last.map(t => ({ id: t.id, liquids: t.liquids.map(l => ({ color: l.color, height: l.height })) })));
        setSelectedTube(null);
        setOverrides({});
        setDrainOverlays({});
        setFillOverlays({});
        return nextHistory;
      });
    },
    performHintMove: () => {
      // Find all valid pours and score them
      const candidates: { fromId: number; toId: number; score: number }[] = [];
      for (const from of tubes) {
        if (from.liquids.length === 0) continue;
        for (const to of tubes) {
          if (from.id === to.id) continue;
          if (!isValidPour(from, to)) continue;
          // Evaluate heuristic
          const fromTopColor = from.liquids[from.liquids.length - 1].color;
          const toTopColor = to.liquids[to.liquids.length - 1]?.color;
          const toCount = to.liquids.length;
          const available = TUBE_DIMENSIONS.segmentCount - toCount;
          const contiguousFrom = countPourableSegments(from);
          const willPour = Math.min(contiguousFrom, available);

          // Clone destination to simulate
          const destLiquids = to.liquids.map(l => ({ ...l }));
          for (let i = 0; i < willPour; i++) destLiquids.push({ color: fromTopColor, height: 25 });

          const completesTube = destLiquids.length === TUBE_DIMENSIONS.segmentCount && destLiquids.every(l => l.color === fromTopColor);
          const increasesRun = (() => {
            let run = 1;
            for (let i = destLiquids.length - 1; i > 0; i--) {
              if (destLiquids[i].color === destLiquids[i - 1].color) run++;
              else break;
            }
            return run;
          })();
          const toWasEmpty = toCount === 0;

          let score = 0;
          if (completesTube) score += 1000;
          score += increasesRun * 10;
          if (toWasEmpty) score += 5;
          // Prefer moves that pour more segments (progress) but cap weight
          score += Math.min(willPour, 4);

          candidates.push({ fromId: from.id, toId: to.id, score });
        }
      }

      if (candidates.length === 0) return false;
      candidates.sort((a, b) => b.score - a.score);
      const best = candidates[0];
      pourLiquid(best.fromId, best.toId);
      return true;
    }
  }), []);

  const computeTubePositions = (
    count: number,
    cols: number,
    gapX: number,
    gapY: number,
  ): { leftPx: number; topPx: number; boardWidth: number; boardHeight: number }[] & { boardWidth: number; boardHeight: number } => {
    const width = TUBE_DIMENSIONS.widthPx;
    const height = TUBE_DIMENSIONS.heightPx;
    const rows = Math.ceil(count / cols);

    const rowCounts = Array.from({ length: rows }, (_, r) => Math.min(cols, count - r * cols));
    const maxCols = Math.max(...rowCounts);
    const boardWidth = maxCols * width + (maxCols - 1) * gapX;
    const boardHeight = rows * height + (rows - 1) * gapY;

    const positions: { leftPx: number; topPx: number }[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const colsInRow = rowCounts[r];
      const rowWidth = colsInRow * width + (colsInRow - 1) * gapX;
      const rowLeftOffset = (boardWidth - rowWidth) / 2;

      const left = rowLeftOffset + c * (width + gapX);
      const top = r * (height + gapY);
      positions.push({ leftPx: left, topPx: top });
    }
    (positions as any).boardWidth = boardWidth;
    (positions as any).boardHeight = boardHeight;
    return positions as any;
  };

  const handleTubeClick = (tubeId: number) => {
    console.log('=== TUBE CLICK DEBUG ===');
    console.log('Clicked tube ID:', tubeId);
    console.log('isTransferring:', isTransferring);
    console.log('selectedTube:', selectedTube);
    console.log('=== END TUBE CLICK DEBUG ===');
    
    if (isTransferring) return;
    if (selectedTube === null) {
      // Select tube if it has liquids
      const tube = tubes.find(t => t.id === tubeId);
      if (tube && tube.liquids.length > 0) {
        setSelectedTube(tubeId);
      }
    } else {
      // Try to pour liquid
      pourLiquid(selectedTube, tubeId);
      setSelectedTube(null);
    }
  };

  const pourLiquid = (fromTubeId: number, toTubeId: number) => {
    if (fromTubeId === toTubeId) return;

    // Get current tube data
    const fromTube = tubes.find(t => t.id === fromTubeId);
    const toTube = tubes.find(t => t.id === toTubeId);

    if (!fromTube || !toTube) return;

    const canPour = isValidPour(fromTube, toTube);
    if (!canPour) return;

    const contentHeight = TUBE_DIMENSIONS.heightPx - TUBE_DIMENSIONS.baseHeightPx;
    const segmentHeight = contentHeight / TUBE_DIMENSIONS.segmentCount;
    const fromCount = fromTube.liquids.length;
    const toCount = toTube.liquids.length;
    const availableSpace = TUBE_DIMENSIONS.segmentCount - toCount;
    const contiguous = countPourableSegments(fromTube);
    const pourCount = Math.min(contiguous, availableSpace);
    // Capture the exact color string before any mutation
    const color = fromTube.liquids[fromTube.liquids.length - 1].color;

    // compute positions for animation (use current responsive layout rules)
    const isNarrowLocal = containerSize.width < 400;
    const isVeryNarrowLocal = containerSize.width < 330;
    const colsLocal = isVeryNarrowLocal ? 4 : isNarrowLocal ? 5 : BOARD_LAYOUT.columns;
    const gapXLocal = isNarrowLocal ? 16 : BOARD_LAYOUT.horizontalGapPx;
    const gapYLocal = isNarrowLocal ? 20 : BOARD_LAYOUT.verticalGapPx;
    const positions = computeTubePositions(tubes.length, colsLocal, gapXLocal, gapYLocal) as any;
    const fromIdx = tubes.findIndex(t => t.id === fromTubeId);
    const toIdx = tubes.findIndex(t => t.id === toTubeId);
    const fromPos = positions[fromIdx];
    const toPos = positions[toIdx];

    // Create unique pour ID to prevent double execution
    const pourId = `${fromTubeId}-${toTubeId}-${Date.now()}`;
    console.log('Creating pour ID:', pourId);

    // Debug: Log what we're about to do
    console.log('=== POUR DEBUG ===');
    console.log('Pouring from tube:', fromTubeId, 'to tube:', toTubeId);
    console.log('Pour count:', pourCount);
    console.log('Color being poured:', color);
    
    // Check if this pour has already been processed
    if (isPouringRef.current) {
      console.log('Pour already in progress, skipping');
      return;
    }
    isPouringRef.current = true;

    setIsTransferring(true);

    // Precompute per-segment intermediate states for fine-grained undo
    const baseState: TestTube[] = tubes.map(t => ({ id: t.id, liquids: t.liquids.map(l => ({ color: l.color, height: l.height })) }));
    const intermediateStates: TestTube[][] = [];
    if (pourCount > 0) {
      let working: TestTube[] = baseState.map(t => ({ id: t.id, liquids: t.liquids.map(l => ({ color: l.color, height: l.height })) }));
      const fromIdxWorking = working.findIndex(t => t.id === fromTubeId);
      const toIdxWorking = working.findIndex(t => t.id === toTubeId);
      for (let i = 0; i < pourCount; i++) {
        const fromW = working[fromIdxWorking];
        const toW = working[toIdxWorking];
        const seg = fromW.liquids.pop();
        if (seg) {
          toW.liquids.push({ color: seg.color, height: seg.height });
        }
        // push a deep clone snapshot for this step
        intermediateStates.push(
          working.map(t => ({ id: t.id, liquids: t.liquids.map(l => ({ color: l.color, height: l.height })) }))
        );
      }
      // Append snapshots so the last-in stack item is the immediate previous state (after k-1),
      // followed by earlier steps and finally the original base state popped last.
      setHistory(prev => [
        ...prev,
        baseState, // original state before the pour (popped last if multiple undos)
        ...intermediateStates.slice(0, -1), // after step 1, after step 2, ..., after step k-1
      ]);
    }

    // Phase 1: move source near destination and tilt
    const nearLeft = toPos.leftPx - TUBE_DIMENSIONS.widthPx + 12;
    const nearTop = toPos.topPx - 90;
    setOverrides(prev => ({
      ...prev,
      [fromTubeId]: { leftPx: nearLeft, topPx: nearTop, rotationDeg: 75, zIndex: 20 },
    }));

    // After move duration, rotate more and show overlays
    window.setTimeout(() => {
      setOverrides(prev => ({ ...prev, [fromTubeId]: { ...(prev[fromTubeId] || {}), rotationDeg: 90 } }));

      // Set initial overlays (height 0)
      // Drain should start from the top of the liquid being poured (topmost segments)
      // Use the same coordinate system as TestTube: segments start at 100px and go up by 30px each
      // Top segment of the liquid being poured is at: 100 - (fromCount - pourCount) * 30
      const drainStartTop = 100 - (fromCount - pourCount) * 30;
      // Match watersortpuzzle: start fill at the bottom edge of the destination's next empty slot
      const fillBottomPosition = TUBE_DIMENSIONS.baseHeightPx + (TUBE_DIMENSIONS.segmentCount - toCount) * segmentHeight;

      setDrainOverlays(prev => ({ ...prev, [fromTubeId]: { startTopPx: drainStartTop, heightPx: 0 } }));
      setFillOverlays(prev => ({ ...prev, [toTubeId]: { startTopPx: fillBottomPosition, heightPx: 0, color } }));

      // Animate overlays to target heights
      window.setTimeout(() => {
        setDrainOverlays(prev => ({ ...prev, [fromTubeId]: { startTopPx: drainStartTop, heightPx: pourCount * 30 } }));
        // Fill overlay grows upward from the bottom - start at bottom and grow up
        setFillOverlays(prev => ({ ...prev, [toTubeId]: { startTopPx: fillBottomPosition - pourCount * segmentHeight, heightPx: pourCount * segmentHeight, color } }));
      }, 50);

      // After drain/fill duration, clear overlays and update state
      window.setTimeout(() => {
        // Clear overlays first to avoid visual conflicts
        setDrainOverlays(prev => ({ ...prev, [fromTubeId]: null }));
        setFillOverlays(prev => ({ ...prev, [toTubeId]: null }));

        // NOW update the state after animation completes
        setTubes(prevTubes => {
          console.log('=== ANIMATION COMPLETE - UPDATING STATE ===');
          const newTubes = [...prevTubes];
          
          // Find tubes by ID
          const fromTube = newTubes.find(t => t.id === fromTubeId);
          const toTube = newTubes.find(t => t.id === toTubeId);
          
          if (!fromTube || !toTube) {
            console.error('Tubes not found!');
            return prevTubes;
          }
          
          console.log('Before state update:');
          console.log('From tube', fromTubeId, ':', fromTube.liquids.map(l => l.color));
          console.log('To tube', toTubeId, ':', toTube.liquids.map(l => l.color));
          
          // Check if source tube has the expected number of liquids
          if (fromTube.liquids.length !== fromCount) {
            console.log('Source tube already modified, skipping state update');
            return prevTubes;
          }
          
          // Remove from source
          for (let i = 0; i < pourCount; i++) {
            fromTube.liquids.pop();
          }
          
          // Add to destination
          for (let i = 0; i < pourCount; i++) {
            toTube.liquids.push({ color, height: 25 });
          }
          
          console.log('After state update:');
          console.log('From tube', fromTubeId, ':', fromTube.liquids.map(l => l.color));
          console.log('To tube', toTubeId, ':', toTube.liquids.map(l => l.color));
          console.log('=== END STATE UPDATE ===');
          
          return newTubes;
        });

        // Move back and upright
        setOverrides(prev => ({ ...prev, [fromTubeId]: { leftPx: fromPos.leftPx, topPx: fromPos.topPx, rotationDeg: 0, zIndex: 0 } }));

        // After return, finish
        window.setTimeout(() => {
          setOverrides(prev => {
            const { [fromTubeId]: _, ...rest } = prev;
            return rest;
          });
          if (onMove) onMove();
          checkWinCondition();
          setIsTransferring(false);
          // Reset pouring guard for next pour
          isPouringRef.current = false;
          // Clear the pour ID after completion
          lastPourIdRef.current = null;
        }, GAME_ANIM.returnDurationMs);
      }, GAME_ANIM.drainFillDurationMs);
    }, GAME_ANIM.moveDurationMs);
  };

  const checkWinCondition = () => {
    const isComplete = tubes.every(tube => {
      if (tube.liquids.length === 0) return true; // Empty tube is valid
      if (tube.liquids.length !== 4) return false; // Must be full
      return tube.liquids.every(liquid => liquid.color === tube.liquids[0].color);
    });

    if (isComplete && onLevelComplete) {
      onLevelComplete();
    }
  };

  // Responsive layout decisions
  const isNarrow = containerSize.width < 400;
  const isVeryNarrow = containerSize.width < 330;
  const cols = isVeryNarrow ? 4 : isNarrow ? 5 : BOARD_LAYOUT.columns;
  const gapX = isNarrow ? 16 : BOARD_LAYOUT.horizontalGapPx;
  const gapY = isNarrow ? 20 : BOARD_LAYOUT.verticalGapPx;
  const positions = computeTubePositions(tubes.length, cols, gapX, gapY) as any;
  const boardWidth = positions.boardWidth as number;
  const boardHeight = positions.boardHeight as number;
  // Fit to width on small screens to avoid horizontal clipping
  const scale = Math.min(1, containerSize.width / Math.max(boardWidth, 1));
  // Center vertically within container accounting for scale
  const scaledBoardHeight = boardHeight * scale;
  const verticalOffset = Math.max(0, (containerSize.height - scaledBoardHeight) / 2);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">

      <div ref={containerRef} className="relative w-full" style={{ height: 420, maxWidth: 720 }}>
        <div className="absolute left-1/2" style={{ width: boardWidth, height: boardHeight, top: verticalOffset, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>
          <div className="relative" style={{ height: boardHeight, width: boardWidth }}>
            {tubes.map((tube, idx) => {
              const vm: TestTubeViewModel = {
                id: tube.id,
                liquids: tube.liquids,
                leftPx: overrides[tube.id]?.leftPx ?? positions[idx].leftPx,
                topPx: overrides[tube.id]?.topPx ?? positions[idx].topPx,
                isSelected: selectedTube === tube.id,
                zIndex: overrides[tube.id]?.zIndex ?? (selectedTube === tube.id ? 10 : 0),
                rotationDeg: overrides[tube.id]?.rotationDeg ?? 0,
              };
              return (
                <TestTubeView
                  key={tube.id}
                  tube={vm}
                  onClick={handleTubeClick}
                  drainOverlay={drainOverlays[tube.id] ?? null}
                  fillOverlay={fillOverlays[tube.id] ?? null}
                  isSelected={selectedTube === tube.id}
                  isTransferring={isTransferring}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default GameBoard;
