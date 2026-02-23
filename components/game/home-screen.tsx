"use client"

import type { PlayerProgress } from "@/lib/game-types"
import { WORLDS } from "@/lib/game-data"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Brain,
  Layers,
  Zap,
  Award,
  GitBranch,
  Repeat,
  Puzzle,
  Workflow,
  Bug,
  Star,
  Trophy,
  Flame,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const FEATURE_CARDS = [
  {
    icon: Brain,
    title: "Logic First",
    description: "Build thinking skills through visual puzzles, no syntax memorization required.",
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Layers,
    title: "Drag & Drop",
    description: "Assemble logic pieces by dragging them into slots. Intuitive and tactile.",
    accent: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "Level Up",
    description: "Earn XP, unlock new worlds, and collect badges as you grow stronger.",
    accent: "text-[oklch(0.7_0.16_145)]",
    bg: "bg-[oklch(0.7_0.16_145/0.1)]",
  },
  {
    icon: Award,
    title: "Real Skills",
    description: "Master sequences, conditionals, loops, patterns, and debugging fundamentals.",
    accent: "text-[oklch(0.65_0.18_310)]",
    bg: "bg-[oklch(0.65_0.18_310/0.1)]",
  },
]

const WORLD_ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  GitBranch,
  Repeat,
  Puzzle,
  Workflow,
  Bug,
}

const WORLD_ACCENTS: Record<string, string> = {
  sequential: "text-[oklch(0.8_0.14_195)]",
  conditional: "text-[oklch(0.85_0.12_65)]",
  loops: "text-[oklch(0.8_0.12_145)]",
  patterns: "text-[oklch(0.78_0.16_25)]",
  "data-flow": "text-[oklch(0.78_0.14_310)]",
  debugging: "text-[oklch(0.78_0.16_25)]",
}

interface HomeScreenProps {
  progress: PlayerProgress
  onStartPlaying: () => void
}

export function HomeScreen({ progress, onStartPlaying }: HomeScreenProps) {
  const totalPuzzles = WORLDS.reduce((sum, w) => sum + w.puzzles.length, 0)
  const completedPuzzles = progress.completedPuzzles.length

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LogicFlow</span>
          </div>
          {completedPuzzles > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm">
                <Star className="h-3.5 w-3.5 text-accent" />
                <span className="font-semibold text-foreground">Lv {progress.level}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm">
                <Flame className="h-3.5 w-3.5 text-destructive" />
                <span className="font-semibold text-foreground">{progress.currentStreak}</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.18_195/0.08)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center lg:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              Logic puzzles for aspiring programmers
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Think Like a
              <br />
              <span className="text-primary">Programmer</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Master logical reasoning by assembling visual logic pieces. No coding
              syntax required -- just pure problem-solving through engaging puzzles.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                onClick={onStartPlaying}
                size="lg"
                className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                {completedPuzzles > 0 ? "Continue Playing" : "Start Playing"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              {completedPuzzles > 0 && (
                <span className="text-sm text-muted-foreground">
                  {completedPuzzles}/{totalPuzzles} puzzles completed
                </span>
              )}
            </div>
          </div>

          {/* Floating pieces preview */}
          <div className="mt-16 flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: "IF", type: "condition" as const, delay: "0s" },
              { label: "LOOP", type: "loop" as const, delay: "0.5s" },
              { label: "RUN", type: "action" as const, delay: "1s" },
              { label: "x + 1", type: "operator" as const, delay: "1.5s" },
              { label: "TRUE", type: "value" as const, delay: "2s" },
            ].map((item) => (
              <div
                key={item.label}
                className="animate-float rounded-xl border border-border bg-card px-5 py-3 text-sm font-mono font-semibold text-foreground shadow-lg"
                style={{ animationDelay: item.delay }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Drag and drop logic pieces to solve puzzles that teach real programming concepts.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.accent)} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World Preview */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Six Worlds to Explore
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Each world focuses on a core concept of logical thinking. Progress through them all to become a logic master.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORLDS.map((world, i) => {
              const IconComp = WORLD_ICONS[world.icon] || Puzzle
              return (
                <div
                  key={world.id}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <IconComp className={cn("h-5 w-5", WORLD_ACCENTS[world.id])} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        World {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-0.5 text-sm font-bold text-foreground">
                      {world.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {world.description}
                    </p>
                    <span className="mt-2 inline-block text-[10px] font-medium text-muted-foreground">
                      {world.puzzles.length} puzzles
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-primary">{totalPuzzles}</p>
              <p className="mt-1 text-sm text-muted-foreground">Logic Puzzles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">{WORLDS.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">Unique Worlds</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[oklch(0.7_0.16_145)]">6</p>
              <p className="mt-1 text-sm text-muted-foreground">Core Concepts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Trophy className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Ready to Think Like a Pro?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Start solving puzzles, earn badges, and build the logical foundation every programmer needs.
          </p>
          <Button
            onClick={onStartPlaying}
            size="lg"
            className="mt-6 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            {completedPuzzles > 0 ? "Keep Going" : "Begin Your Journey"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">LogicFlow</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Learn logic. Think clearly. Code confidently.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
