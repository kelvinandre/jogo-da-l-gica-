"use client"

import { cn } from "@/lib/utils"
import type { Puzzle } from "@/lib/game-types"
import { PuzzleSlotComponent } from "./puzzle-slot"
import { LogicPieceCard } from "./logic-piece-card"
import {
  Lightbulb,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PuzzleBoardProps {
  puzzle: Puzzle
  placedPieces: Record<string, string | null>
  isCorrect: boolean | null
  showHint: boolean
  hintIndex: number
  onPlacePiece: (slotId: string, pieceId: string) => void
  onRemovePiece: (slotId: string) => void
  onCheckSolution: () => void
  onToggleHint: () => void
  onNextHint: () => void
  onReset: () => void
  onBack: () => void
}

export function PuzzleBoard({
  puzzle,
  placedPieces,
  isCorrect,
  showHint,
  hintIndex,
  onPlacePiece,
  onRemovePiece,
  onCheckSolution,
  onToggleHint,
  onNextHint,
  onReset,
  onBack,
}: PuzzleBoardProps) {
  const placedPieceIds = new Set(
    Object.values(placedPieces).filter(Boolean) as string[]
  )

  const availablePieces = puzzle.availablePieces.filter(
    (p) => !placedPieceIds.has(p.id)
  )

  const allSlotsFilled = puzzle.slots.every(
    (slot) => placedPieces[slot.id] != null
  )

  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    e.dataTransfer.setData("pieceId", pieceId)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
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
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Left: Puzzle Info + Slots */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Story Card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {puzzle.title}
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {puzzle.story}
                </p>
              </div>
            </div>
          </div>

          {/* Puzzle Board */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Solution Board
              </h2>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {puzzle.slots.map((slot, i) => {
                const placedPieceId = placedPieces[slot.id]
                const placedPiece = placedPieceId
                  ? puzzle.availablePieces.find((p) => p.id === placedPieceId) || null
                  : null

                return (
                  <PuzzleSlotComponent
                    key={slot.id}
                    slot={slot}
                    placedPiece={placedPiece}
                    isCorrect={isCorrect}
                    slotNumber={i + 1}
                    totalSlots={puzzle.slots.length}
                    onDrop={onPlacePiece}
                    onRemove={onRemovePiece}
                    onPieceDragStart={handleDragStart}
                  />
                )
              })}
            </div>

            {/* Expected Output */}
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Expected Flow
              </p>
              <p className="mt-1 font-mono text-xs text-foreground/80">
                {puzzle.expectedOutput}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onCheckSolution}
              disabled={!allSlotsFilled}
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <CheckCircle className="h-4 w-4" />
              Check Solution
            </Button>
            <Button
              onClick={onToggleHint}
              variant="outline"
              size="lg"
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              <Lightbulb className="h-4 w-4" />
              Hint
            </Button>
          </div>

          {/* Result feedback */}
          {isCorrect === false && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                Not quite right. Check the order and try again!
              </p>
            </div>
          )}

          {/* Hints */}
          {showHint && (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm text-foreground">
                    {puzzle.hints[hintIndex]}
                  </p>
                  {hintIndex < puzzle.hints.length - 1 && (
                    <button
                      onClick={onNextHint}
                      className="mt-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      Need another hint? ({hintIndex + 1}/{puzzle.hints.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Available Pieces */}
        <div className="w-full lg:w-80">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Available Pieces
            </h2>
            <div className="flex flex-col gap-2">
              {puzzle.availablePieces.map((piece) => {
                const isPlacedElsewhere = placedPieceIds.has(piece.id)
                return (
                  <LogicPieceCard
                    key={piece.id}
                    piece={piece}
                    isPlaced={isPlacedElsewhere}
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                  />
                )
              })}
            </div>
            {availablePieces.length === 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                All pieces placed! Check your solution.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
