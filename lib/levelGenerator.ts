export interface LiquidSegment {
  color: string;
  height: number;
}

export interface TestTube {
  id: number;
  liquids: LiquidSegment[];
}

export interface LevelConfig {
  levelNumber: number;
  colors: string[];
  tubes: TestTube[];
  emptyTubes: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'expert';
  moves: number;
  description: string;
}

export interface LevelGenerationParams {
  levelNumber: number;
  customColors?: string[];
  customEmptyTubes?: number;
  seed?: number;
}

// Color palette with simple color names like watersortpuzzle
const COLOR_PALETTE = [
  'red',
  'blue', 
  'yellow',
  'green',
  'purple',
  'lightgreen',
  'lightblue',
  'orange',
  'brown',
  'pink',
  'cyan',
  'magenta'
];

// Difficulty progression configuration
const DIFFICULTY_CONFIG = {
  easy: { colors: 3, emptyTubes: 3, moves: 20 },
  medium: { colors: 4, emptyTubes: 2, moves: 25 },
  hard: { colors: 5, emptyTubes: 2, moves: 30 },
  'very-hard': { colors: 6, emptyTubes: 1, moves: 35 },
  expert: { colors: 8, emptyTubes: 1, moves: 40 },
};

/**
 * Generate a random seed for consistent level generation
 */
function generateSeed(levelNumber: number, customSeed?: number): number {
  if (customSeed !== undefined) return customSeed;
  return levelNumber * 12345 + 67890;
}

/**
 * Simple pseudo-random number generator for consistent results
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Determine difficulty level based on level number with subtle spikes
 */
function getDifficultyLevel(levelNumber: number): keyof typeof DIFFICULTY_CONFIG {
  // Check for difficulty spikes first
  if (isDifficultySpike(levelNumber)) {
    return getSpikeDifficulty(levelNumber);
  }
  
  // Base difficulty tiers
  if (levelNumber <= 10) return 'easy';
  if (levelNumber <= 25) return 'medium';
  if (levelNumber <= 50) return 'hard';
  if (levelNumber <= 100) return 'very-hard';
  return 'expert';
}

/**
 * Check if a level is a difficulty spike
 */
function isDifficultySpike(levelNumber: number): boolean {
  // Every 3rd level starting from 4, 7, 10, etc.
  return levelNumber % 3 === 1 && levelNumber >= 4;
}

/**
 * Get the spike difficulty for a level
 */
function getSpikeDifficulty(levelNumber: number): keyof typeof DIFFICULTY_CONFIG {
  if (levelNumber <= 10) {
    // Levels 4, 7, 10 in easy tier get medium difficulty
    return 'medium';
  } else if (levelNumber <= 25) {
    // Levels 13, 16, 19, 22, 25 in medium tier get hard difficulty
    return 'hard';
  } else if (levelNumber <= 50) {
    // Levels 28, 31, 34, 37, 40, 43, 46, 49 in hard tier get very-hard difficulty
    return 'very-hard';
  } else if (levelNumber <= 100) {
    // Levels 52, 55, 58, etc. in very-hard tier get expert difficulty
    return 'expert';
  } else {
    // Beyond level 100, spikes get expert+ (same as expert but with more complexity)
    return 'expert';
  }
}

/**
 * Generate liquid segments for a level
 */
function generateLiquids(
  colors: string[], 
  random: SeededRandom
): LiquidSegment[] {
  const liquids: LiquidSegment[] = [];
  
  colors.forEach(color => {
    // Each color gets 4 segments (fills one tube)
    for (let i = 0; i < 4; i++) {
      liquids.push({
        color,
        height: 25 // 25% height each (4 segments = 100%)
      });
    }
  });

  return random.shuffle(liquids);
}

/**
 * Distribute liquids into tubes with strategic placement
 */
function distributeLiquids(
  liquids: LiquidSegment[],
  emptyTubes: number,
  random: SeededRandom
): TestTube[] {
  const tubes: TestTube[] = [];
  const totalTubes = Math.ceil(liquids.length / 4) + emptyTubes;
  
  // Create tubes with liquids
  let liquidIndex = 0;
  const tubesWithLiquids = Math.ceil(liquids.length / 4);
  
  for (let i = 0; i < tubesWithLiquids; i++) {
    const tubeLiquids: LiquidSegment[] = [];
    const segmentsInTube = Math.min(4, liquids.length - liquidIndex);
    
    for (let j = 0; j < segmentsInTube; j++) {
      if (liquidIndex < liquids.length) {
        tubeLiquids.push(liquids[liquidIndex]);
        liquidIndex++;
      }
    }
    
    tubes.push({
      id: i,
      liquids: tubeLiquids
    });
  }
  
  // Add empty tubes
  for (let i = 0; i < emptyTubes; i++) {
    tubes.push({
      id: tubesWithLiquids + i,
      liquids: []
    });
  }
  
  return random.shuffle(tubes);
}

/**
 * Validate that a level is solvable
 */
function isLevelSolvable(tubes: TestTube[]): boolean {
  // Simple validation: check if we can make progress
  // A level is solvable if we can pour at least one liquid
  for (let i = 0; i < tubes.length; i++) {
    const sourceTube = tubes[i];
    if (sourceTube.liquids.length === 0) continue;
    
    const topLiquid = sourceTube.liquids[sourceTube.liquids.length - 1];
    
    for (let j = 0; j < tubes.length; j++) {
      if (i === j) continue;
      
      const destTube = tubes[j];
      
      // Can pour if destination is empty or top color matches
      if (destTube.liquids.length === 0 || 
          (destTube.liquids.length < 4 && 
           destTube.liquids[destTube.liquids.length - 1].color === topLiquid.color)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Optimize level layout for better gameplay
 */
function optimizeLevel(tubes: TestTube[], random: SeededRandom): TestTube[] {
  // Try to create some strategic positioning
  // Move tubes with same top colors away from each other
  const optimizedTubes = [...tubes];
  
  for (let i = 0; i < optimizedTubes.length; i++) {
    const tube = optimizedTubes[i];
    if (tube.liquids.length === 0) continue;
    
    const topColor = tube.liquids[tube.liquids.length - 1].color;
    
    // Find tubes with same top color
    const sameColorTubes = optimizedTubes.filter((t, index) => 
      index !== i && 
      t.liquids.length > 0 && 
      t.liquids[t.liquids.length - 1].color === topColor
    );
    
    // If we have too many same-color tubes adjacent, shuffle
    if (sameColorTubes.length > 1) {
      return random.shuffle(optimizedTubes);
    }
  }
  
  return optimizedTubes;
}

/**
 * Generate a complete level configuration
 */
export function generateLevel(params: LevelGenerationParams): LevelConfig {
  const { levelNumber, customColors, customEmptyTubes, seed } = params;
  
  const random = new SeededRandom(generateSeed(levelNumber, seed));
  const difficulty = getDifficultyLevel(levelNumber);
  const config = DIFFICULTY_CONFIG[difficulty];
  
  // Use custom parameters or defaults
  const colors = customColors || COLOR_PALETTE.slice(0, config.colors);
  const emptyTubes = customEmptyTubes ?? config.emptyTubes;
  
  // Generate liquids and distribute them
  let liquids = generateLiquids(colors, random);
  let tubes = distributeLiquids(liquids, emptyTubes, random);
  
  // Ensure level is solvable
  let attempts = 0;
  while (!isLevelSolvable(tubes) && attempts < 10) {
    liquids = generateLiquids(colors, random);
    tubes = distributeLiquids(liquids, emptyTubes, random);
    attempts++;
  }
  
  // Optimize layout
  tubes = optimizeLevel(tubes, random);
  
  // Generate description
  const description = generateLevelDescription(levelNumber, difficulty, colors.length);
  
  return {
    levelNumber,
    colors,
    tubes,
    emptyTubes,
    difficulty,
    moves: config.moves,
    description
  };
}

/**
 * Generate a human-readable level description
 */
function generateLevelDescription(
  levelNumber: number, 
  difficulty: keyof typeof DIFFICULTY_CONFIG, 
  colorCount: number
): string {
  const difficultyNames = {
    easy: 'Beginner',
    medium: 'Intermediate', 
    hard: 'Advanced',
    'very-hard': 'Expert',
    expert: 'Master'
  };
  
  return `Level ${levelNumber} - ${difficultyNames[difficulty]} Challenge. Sort ${colorCount} different colored liquids into matching tubes.`;
}

/**
 * Generate multiple levels at once
 */
export function generateLevelBatch(startLevel: number, count: number): LevelConfig[] {
  const levels: LevelConfig[] = [];
  
  for (let i = 0; i < count; i++) {
    levels.push(generateLevel({ levelNumber: startLevel + i }));
  }
  
  return levels;
}

/**
 * Validate a level configuration
 */
export function validateLevel(level: LevelConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if all tubes have valid liquid counts
  level.tubes.forEach((tube, index) => {
    if (tube.liquids.length > 4) {
      errors.push(`Tube ${index} has too many liquids (${tube.liquids.length})`);
    }
    
    tube.liquids.forEach((liquid, liquidIndex) => {
      if (!level.colors.includes(liquid.color)) {
        errors.push(`Tube ${index}, liquid ${liquidIndex} has invalid color: ${liquid.color}`);
      }
      
      if (liquid.height <= 0 || liquid.height > 100) {
        errors.push(`Tube ${index}, liquid ${liquidIndex} has invalid height: ${liquid.height}`);
      }
    });
  });
  
  // Check if level is solvable
  if (!isLevelSolvable(level.tubes)) {
    errors.push('Level is not solvable');
  }
  
  // Check color distribution
  const totalLiquids = level.tubes.reduce((sum, tube) => sum + tube.liquids.length, 0);
  const expectedLiquids = level.colors.length * 4;
  
  if (totalLiquids !== expectedLiquids) {
    errors.push(`Expected ${expectedLiquids} liquids, got ${totalLiquids}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get level statistics
 */
export function getLevelStats(level: LevelConfig): {
  totalTubes: number;
  filledTubes: number;
  emptyTubes: number;
  colorDistribution: Record<string, number>;
  difficultyScore: number;
} {
  const filledTubes = level.tubes.filter(tube => tube.liquids.length > 0).length;
  const emptyTubes = level.tubes.length - filledTubes;
  
  const colorDistribution: Record<string, number> = {};
  level.tubes.forEach(tube => {
    tube.liquids.forEach(liquid => {
      colorDistribution[liquid.color] = (colorDistribution[liquid.color] || 0) + 1;
    });
  });
  
  // Calculate difficulty score (0-100)
  const colorComplexity = level.colors.length * 10;
  const tubeComplexity = (level.tubes.length - level.emptyTubes) * 5;
  const emptyTubePenalty = level.emptyTubes * 15;
  const difficultyScore = Math.min(100, colorComplexity + tubeComplexity - emptyTubePenalty);
  
  return {
    totalTubes: level.tubes.length,
    filledTubes,
    emptyTubes,
    colorDistribution,
    difficultyScore
  };
}
