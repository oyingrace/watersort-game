export const GAME_ANIM = {
  moveDurationMs: 1000,
  drainFillDurationMs: 1000,
  returnDurationMs: 1000,
} as const;

export const TUBE_DIMENSIONS = {
  widthPx: 40,
  heightPx: 130,
  baseHeightPx: 10, // top padding before first liquid segment
  segmentCount: 4,
} as const;

export const BOARD_LAYOUT = {
  horizontalGapPx: 24,
  verticalGapPx: 28,
  columns: 6,
} as const;


