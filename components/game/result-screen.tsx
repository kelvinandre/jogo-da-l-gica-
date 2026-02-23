"use client"

import type { Puzzle, PlayerProgress } from "@/lib/game-types"
import { Trophy, Star, ArrowRight, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultScreenProps {
  puzzle: Puzzle
  progress: PlayerProgress
  onNextPuzzle: () => void
  onBackToWorld: () => void
  onHome: () => void
}

export function ResultScreen({
  puzzle,
  progress,
  onNextPuzzle,
  onBackToWorld,
  onHome,
}: ResultScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="rounded-3xl border border-primary/20 bg-card p-8 text-center">
          {/* Trophy */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
            <Trophy className="h-10 w-10 text-primary" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Puzzle Solved!
          </h1>
          <p className="mt-2 text-muted-foreground">
            You mastered: {puzzle.conceptTaught}
          </p>

          {/* Rewards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-secondary p-3">
              <Star className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-1.5 text-lg font-bold text-foreground">
                +{puzzle.xpReward}
              </p>
              <p className="text-[10px] text-muted-foreground">XP Earned</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <Zap className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1.5 text-lg font-bold text-foreground">
                {progress.currentStreak}
              </p>
              <p className="text-[10px] text-muted-foreground">Streak</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <Sparkles className="mx-auto h-5 w-5 text-[oklch(0.7_0.16_145)]" />
              <p className="mt-1.5 text-lg font-bold text-foreground">
                Lv {progress.level}
              </p>
              <p className="text-[10px] text-muted-foreground">Level</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Level {progress.level}</span>
              <span>
                {progress.xp}/{progress.xpToNextLevel} XP
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${(progress.xp / progress.xpToNextLevel) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* New Badges */}
          {progress.badges.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Badges Earned
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {progress.badges.slice(-3).map((badge) => (
                  <span
                    key={badge.id}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={onNextPuzzle}
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Next Puzzle
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={onBackToWorld}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                World Map
              </Button>
              <Button
                onClick={onHome}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
