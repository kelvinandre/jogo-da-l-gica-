export type PieceCategory = "sequence" | "condition" | "loop" | "operator" | "value" | "action"

export interface LogicPiece {
  id: string
  type: PieceCategory
  label: string
  description: string
  color: string
  icon: string
}

export interface PuzzleSlot {
  id: string
  position: number
  acceptsType: PieceCategory[]
  correctPieceId: string
  placedPieceId: string | null
  hint?: string
}

export interface Puzzle {
  id: string
  title: string
  description: string
  story: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: PuzzleCategory
  slots: PuzzleSlot[]
  availablePieces: LogicPiece[]
  expectedOutput: string
  hints: string[]
  xpReward: number
  conceptTaught: string
}

export type PuzzleCategory =
  | "sequential"
  | "conditional"
  | "loops"
  | "patterns"
  | "data-flow"
  | "debugging"

export interface PlayerProgress {
  level: number
  xp: number
  xpToNextLevel: number
  completedPuzzles: string[]
  currentStreak: number
  bestStreak: number
  badges: Badge[]
  unlockedWorlds: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
}

export interface World {
  id: string
  name: string
  description: string
  color: string
  icon: string
  requiredLevel: number
  puzzles: Puzzle[]
  category: PuzzleCategory
}

export interface GameState {
  currentWorld: string | null
  currentPuzzle: string | null
  screen: "home" | "world-select" | "puzzle" | "result"
  progress: PlayerProgress
  placedPieces: Record<string, string | null>
  isCorrect: boolean | null
  showHint: boolean
  hintIndex: number
}

export const PIECE_COLORS: Record<PieceCategory, string> = {
  sequence: "bg-chart-1 text-primary-foreground",
  condition: "bg-accent text-accent-foreground",
  loop: "bg-chart-4 text-primary-foreground",
  operator: "bg-chart-5 text-foreground",
  value: "bg-chart-3 text-foreground",
  action: "bg-primary text-primary-foreground",
}

export const CATEGORY_INFO: Record<PuzzleCategory, { name: string; icon: string; description: string }> = {
  sequential: {
    name: "Sequence Island",
    icon: "ArrowRight",
    description: "Learn to arrange instructions in the correct order",
  },
  conditional: {
    name: "Decision Forest",
    icon: "GitBranch",
    description: "Master if-then-else logic and branching paths",
  },
  loops: {
    name: "Loop Canyon",
    icon: "Repeat",
    description: "Discover the power of repeating patterns",
  },
  patterns: {
    name: "Pattern Peaks",
    icon: "Puzzle",
    description: "Recognize and complete logical patterns",
  },
  "data-flow": {
    name: "Data Stream",
    icon: "Workflow",
    description: "Understand how data transforms as it flows",
  },
  debugging: {
    name: "Bug Swamp",
    icon: "Bug",
    description: "Find and fix errors in broken logic",
  },
}
