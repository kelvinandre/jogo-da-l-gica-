"use client"

import { cn } from "@/lib/utils"
import type { World, PlayerProgress } from "@/lib/game-types"
import { WORLDS } from "@/lib/game-data"
import {
  ArrowRight,
  GitBranch,
  Repeat,
  Puzzle,
  Workflow,
  Bug,
  Lock,
  CheckCircle,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"

const WORLD_ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  GitBranch,
  Repeat,
  Puzzle,
  Workflow,
  Bug,
}

const WORLD_GRADIENTS: Record<string, string> = {
  sequential: "from-[oklch(0.7_0.18_195/0.2)] to-[oklch(0.7_0.18_195/0.05)]",
  conditional: "from-[oklch(0.75_0.16_65/0.2)] to-[oklch(0.75_0.16_65/0.05)]",
  loops: "from-[oklch(0.7_0.16_145/0.2)] to-[oklch(0.7_0.16_145/0.05)]",
  patterns: "from-[oklch(0.65_0.22_25/0.2)] to-[oklch(0.65_0.22_25/0.05)]",
  "data-flow": "from-[oklch(0.65_0.18_310/0.2)] to-[oklch(0.65_0.18_310/0.05)]",
  debugging: "from-[oklch(0.65_0.22_25/0.2)] to-[oklch(0.65_0.22_25/0.05)]",
}

const WORLD_ACCENT: Record<string, string> = {
  sequential: "text-[oklch(0.8_0.14_195)]",
  conditional: "text-[oklch(0.85_0.12_65)]",
  loops: "text-[oklch(0.8_0.12_145)]",
  patterns: "text-[oklch(0.78_0.16_25)]",
  "data-flow": "text-[oklch(0.78_0.14_310)]",
  debugging: "text-[oklch(0.78_0.16_25)]",
}

const WORLD_BORDER: Record<string, string> = {
  sequential: "border-[oklch(0.7_0.18_195/0.3)]",
  conditional: "border-[oklch(0.75_0.16_65/0.3)]",
  loops: "border-[oklch(0.7_0.16_145/0.3)]",
  patterns: "border-[oklch(0.65_0.22_25/0.3)]",
  "data-flow": "border-[oklch(0.65_0.18_310/0.3)]",
  debugging: "border-[oklch(0.65_0.22_25/0.3)]",
}

interface WorldSelectProps {
  progress: PlayerProgress
  selectedWorld: string | null
  onSelectWorld: (worldId: string) => void
  onStartPuzzle: (puzzleId: string) => void
  onBack: () => void
}

export function WorldSelect({
  progress,
  selectedWorld,
  onSelectWorld,
  onStartPuzzle,
  onBack,
}: WorldSelectProps) {
  const selected = selectedWorld
    ? WORLDS.find((w) => w.id === selectedWorld)
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Level</span>
              <span className="text-sm font-bold text-primary">
                {progress.level}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
              <span className="text-xs text-muted-foreground">XP</span>
              <span className="text-sm font-bold text-accent">
                {progress.xp}/{progress.xpToNextLevel}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">Choose Your World</h1>
        <p className="mt-2 text-muted-foreground">
          Each world teaches a different logical concept. Complete puzzles to earn XP and unlock new worlds.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((world) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id)
            const IconComp = WORLD_ICONS[world.icon] || Puzzle
            const completedCount = world.puzzles.filter((p) =>
              progress.completedPuzzles.includes(p.id)
            ).length
            const totalCount = world.puzzles.length
            const isAllDone = completedCount === totalCount

            return (
              <button
                key={world.id}
                onClick={() => isUnlocked && onSelectWorld(world.id)}
                disabled={!isUnlocked}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-left transition-all duration-200",
                  isUnlocked
                    ? cn(
                        WORLD_GRADIENTS[world.id],
                        WORLD_BORDER[world.id],
                        "hover:scale-[1.02] hover:shadow-lg",
                        selectedWorld === world.id && "ring-2 ring-primary"
                      )
                    : "border-border bg-secondary/30 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      isUnlocked ? "bg-card/50" : "bg-secondary"
                    )}
                  >
                    {isUnlocked ? (
                      <IconComp className={cn("h-6 w-6", WORLD_ACCENT[world.id])} />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  {isAllDone && (
                    <CheckCircle className="h-5 w-5 text-[oklch(0.7_0.16_145)]" />
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {world.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {world.description}
                </p>

                {isUnlocked && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {completedCount}/{totalCount} completed
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {!isUnlocked && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Requires Level {world.requiredLevel}
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected World - Puzzle List */}
        {selected && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground">
              {selected.name} Puzzles
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selected.puzzles.map((puzzle) => {
                const isCompleted = progress.completedPuzzles.includes(puzzle.id)
                return (
                  <button
                    key={puzzle.id}
                    onClick={() => onStartPuzzle(puzzle.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:bg-secondary/50",
                      isCompleted
                        ? "border-[oklch(0.7_0.16_145/0.3)] bg-[oklch(0.7_0.16_145/0.05)]"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-[oklch(0.7_0.16_145)]" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {puzzle.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {puzzle.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          puzzle.difficulty === "beginner" &&
                            "bg-[oklch(0.7_0.16_145/0.15)] text-[oklch(0.8_0.12_145)]",
                          puzzle.difficulty === "intermediate" &&
                            "bg-[oklch(0.75_0.16_65/0.15)] text-[oklch(0.85_0.12_65)]",
                          puzzle.difficulty === "advanced" &&
                            "bg-[oklch(0.65_0.22_25/0.15)] text-[oklch(0.78_0.16_25)]"
                        )}
                      >
                        {puzzle.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        +{puzzle.xpReward} XP
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
