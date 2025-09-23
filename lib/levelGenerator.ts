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

// Difficulty progression configuration - simplified like watersortpuzzle
const DIFFICULTY_CONFIG = {
  easy: { colors: 3, emptyTubes: 2, moves: 20 },
  medium: { colors: 4, emptyTubes: 2, moves: 25 },
  hard: { colors: 5, emptyTubes: 2, moves: 30 },
  'very-hard': { colors: 6, emptyTubes: 2, moves: 35 },
  expert: { colors: 8, emptyTubes: 2, moves: 40 },
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
 * Determine difficulty level based on level number - mixed progression
 */
function getDifficultyLevel(levelNumber: number): keyof typeof DIFFICULTY_CONFIG {
  // Create a mixed progression where each group of 10 levels has all difficulties
  
  // Use level number as seed for consistent difficulty assignment
  const seed = levelNumber;
  const random = new SeededRandom(seed);
  
  // Define difficulty weights for different level ranges
  if (levelNumber <= 10) {
    // Levels 1-10: Mostly easy, some medium, 1 hard
    const weights = [70, 25, 5, 0]; // [easy, medium, hard, very-hard]
    return selectDifficultyByWeight(weights, random);
  } else if (levelNumber <= 20) {
    // Levels 11-20: Mix of easy and medium, some hard
    const weights = [40, 40, 20, 0];
    return selectDifficultyByWeight(weights, random);
  } else if (levelNumber <= 30) {
    // Levels 21-30: Mix of medium and hard, some easy
    const weights = [20, 40, 40, 0];
    return selectDifficultyByWeight(weights, random);
  } else if (levelNumber <= 40) {
    // Levels 31-40: Mix of all difficulties, mostly medium/hard
    const weights = [15, 35, 35, 15];
    return selectDifficultyByWeight(weights, random);
  } else if (levelNumber <= 50) {
    // Levels 41-50: Mix of all difficulties, more hard/very-hard
    const weights = [10, 25, 40, 25];
    return selectDifficultyByWeight(weights, random);
  } else {
    // Levels 51+: Mix of all difficulties, more very-hard/expert
    const weights = [5, 20, 35, 40];
    const difficulty = selectDifficultyByWeight(weights, random);
    // For very high levels, sometimes promote to expert
    if (difficulty === 'very-hard' && random.next() > 0.7) {
      return 'expert';
    }
    return difficulty;
  }
}

/**
 * Select difficulty based on weighted random selection
 */
function selectDifficultyByWeight(weights: number[], random: SeededRandom): keyof typeof DIFFICULTY_CONFIG {
  const difficulties: (keyof typeof DIFFICULTY_CONFIG)[] = ['easy', 'medium', 'hard', 'very-hard'];
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = random.next() * totalWeight;
  
  let currentWeight = 0;
  for (let i = 0; i < weights.length; i++) {
    currentWeight += weights[i];
    if (randomValue <= currentWeight) {
      return difficulties[i];
    }
  }
  
  return 'easy'; // fallback
}

/**
 * Get colors and empty tubes based on level number - simplified like watersortpuzzle
 */
function getLevelConfig(levelNumber: number): { colors: number; emptyTubes: number } {
  // Like watersortpuzzle: x + 3 filled tubes + 2 empty tubes = x + 5 total tubes
  // But we'll map this to our difficulty system
  const difficulty = getDifficultyLevel(levelNumber);
  const config = DIFFICULTY_CONFIG[difficulty];
  
  // For early levels, use a more linear progression like watersortpuzzle
  if (levelNumber <= 8) {
    const colors = Math.min(levelNumber + 2, 8); // Start with 3 colors, add 1 per level
    return { colors, emptyTubes: 2 };
  }
  
  return { colors: config.colors, emptyTubes: config.emptyTubes };
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
  const levelConfig = getLevelConfig(levelNumber);
  
  // Use custom parameters or defaults
  const colors = customColors || COLOR_PALETTE.slice(0, levelConfig.colors);
  const emptyTubes = customEmptyTubes ?? levelConfig.emptyTubes;
  
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
    moves: DIFFICULTY_CONFIG[difficulty].moves,
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
