import { TUBE_DIMENSIONS } from './gameConstants';
import type { TestTube } from '@/lib/levelGenerator';

export function isValidPour(from: TestTube, to: TestTube): boolean {
  if (!from.liquids.length) return false;
  if (to.liquids.length >= TUBE_DIMENSIONS.segmentCount) return false;
  const fromTop = from.liquids[from.liquids.length - 1];
  if (!fromTop) return false;
  if (to.liquids.length === 0) return true;
  const toTop = to.liquids[to.liquids.length - 1];
  return toTop.color === fromTop.color;
}

export function countPourableSegments(from: TestTube): number {
  if (!from.liquids.length) return 0;
  const topColor = from.liquids[from.liquids.length - 1].color;
  let count = 0;
  
  console.log('=== countPourableSegments DEBUG ===');
  console.log('Tube liquids (bottom to top):', from.liquids.map(l => l.color));
  console.log('Top color:', topColor);
  
  for (let i = from.liquids.length - 1; i >= 0; i--) {
    console.log(`Checking index ${i}: color="${from.liquids[i].color}" === "${topColor}"?`, from.liquids[i].color === topColor);
    if (from.liquids[i].color !== topColor) break;
    count++;
  }
  
  console.log('Contiguous segments of same color:', count);
  console.log('=== END countPourableSegments DEBUG ===');
  
  return count;
}

export function getSegmentTopPx(segmentIndexFromBottom: number): number {
  // bottom segment index 0 → top offset inside tube content area
  const contentHeight = TUBE_DIMENSIONS.heightPx - TUBE_DIMENSIONS.baseHeightPx;
  const segmentHeight = contentHeight / TUBE_DIMENSIONS.segmentCount;
  return TUBE_DIMENSIONS.baseHeightPx + segmentIndexFromBottom * segmentHeight;
}


