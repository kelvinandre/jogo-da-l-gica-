"use client"

import { cn } from "@/lib/utils"
import type { PuzzleSlot, LogicPiece, PieceCategory } from "@/lib/game-types"
import { LogicPieceCard } from "./logic-piece-card"
import { TYPE_COLORS } from "./logic-piece-card"

interface PuzzleSlotProps {
  slot: PuzzleSlot
  placedPiece: LogicPiece | null
  isCorrect: boolean | null
  slotNumber: number
  totalSlots: number
  onDrop: (slotId: string, pieceId: string) => void
  onRemove: (slotId: string) => void
  onPieceDragStart: (e: React.DragEvent, pieceId: string) => void
}

function getAcceptsLabel(types: PieceCategory[]): string {
  const map: Record<string, string> = {
    sequence: "Sequence",
    condition: "Condition",
    loop: "Loop",
    operator: "Operator",
    value: "Value",
    action: "Action",
  }
  return types.map((t) => map[t] || t).join(" / ")
}

export function PuzzleSlotComponent({
  slot,
  placedPiece,
  isCorrect,
  slotNumber,
  totalSlots,
  onDrop,
  onRemove,
  onPieceDragStart,
}: PuzzleSlotProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const pieceId = e.dataTransfer.getData("pieceId")
    if (pieceId) {
      onDrop(slot.id, pieceId)
    }
  }

  const primaryType = slot.acceptsType[0]
  const colors = TYPE_COLORS[primaryType]

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
            placedPiece
              ? isCorrect === false
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
              : "bg-secondary text-muted-foreground"
          )}
        >
          {slotNumber}
        </div>
        {slotNumber < totalSlots && (
          <div className="h-6 w-0.5 bg-border" />
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex-1 rounded-xl border-2 border-dashed p-1 transition-all duration-200",
          placedPiece
            ? isCorrect === false
              ? "border-destructive/50 bg-destructive/5"
              : "border-primary/30 bg-card"
            : cn("animate-slot-highlight", colors.bg, "hover:bg-secondary")
        )}
      >
        {placedPiece ? (
          <div className="relative">
            <LogicPieceCard
              piece={placedPiece}
              isInSlot
              onDragStart={(e) => {
                onRemove(slot.id)
                onPieceDragStart(e, placedPiece.id)
              }}
              onClick={() => onRemove(slot.id)}
            />
            <button
              onClick={() => onRemove(slot.id)}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
              aria-label="Remove piece"
            >
              <span className="text-xs font-bold">x</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-5 px-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className={cn("text-xs font-semibold", colors.text)}>
                {getAcceptsLabel(slot.acceptsType)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Drop a piece here
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
