"use client"

import { cn } from "@/lib/utils"
import type { LogicPiece, PieceCategory } from "@/lib/game-types"
import {
  ArrowRight,
  GitBranch,
  Repeat,
  Star,
  Hash,
  Plus,
  Sun,
  Sparkles,
  Briefcase,
  Layers,
  Leaf,
  Rocket,
  Timer,
  Flame,
  CheckCircle,
  CloudRain,
  Umbrella,
  Filter,
  ArrowUp,
  Monitor,
  MessageSquare,
  Eye,
  Award,
  Trophy,
  ThumbsUp,
  Square,
  Check,
  X,
  List,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  ArrowRight,
  GitBranch,
  Repeat,
  Star,
  Hash,
  Plus,
  Sun,
  Sparkles,
  Briefcase,
  Layers,
  Leaf,
  Rocket,
  Timer,
  Flame,
  CheckCircle,
  CloudRain,
  Umbrella,
  Filter,
  ArrowUp,
  Monitor,
  MessageSquare,
  Eye,
  Award,
  Trophy,
  ThumbsUp,
  Square,
  Check,
  X,
  List,
  UtensilsCrossed,
  Fuel: Rocket,
}

const TYPE_COLORS: Record<PieceCategory, { bg: string; border: string; text: string }> = {
  sequence: {
    bg: "bg-[oklch(0.7_0.18_195/0.15)]",
    border: "border-[oklch(0.7_0.18_195/0.5)]",
    text: "text-[oklch(0.8_0.14_195)]",
  },
  condition: {
    bg: "bg-[oklch(0.75_0.16_65/0.15)]",
    border: "border-[oklch(0.75_0.16_65/0.5)]",
    text: "text-[oklch(0.85_0.12_65)]",
  },
  loop: {
    bg: "bg-[oklch(0.7_0.16_145/0.15)]",
    border: "border-[oklch(0.7_0.16_145/0.5)]",
    text: "text-[oklch(0.8_0.12_145)]",
  },
  operator: {
    bg: "bg-[oklch(0.65_0.18_310/0.15)]",
    border: "border-[oklch(0.65_0.18_310/0.5)]",
    text: "text-[oklch(0.78_0.14_310)]",
  },
  value: {
    bg: "bg-[oklch(0.65_0.22_25/0.15)]",
    border: "border-[oklch(0.65_0.22_25/0.5)]",
    text: "text-[oklch(0.78_0.16_25)]",
  },
  action: {
    bg: "bg-[oklch(0.7_0.18_195/0.15)]",
    border: "border-[oklch(0.7_0.18_195/0.5)]",
    text: "text-[oklch(0.8_0.14_195)]",
  },
}

const TYPE_LABELS: Record<PieceCategory, string> = {
  sequence: "SEQ",
  condition: "IF",
  loop: "LOOP",
  operator: "OP",
  value: "VAL",
  action: "ACT",
}

interface LogicPieceCardProps {
  piece: LogicPiece
  isPlaced?: boolean
  isDragging?: boolean
  isInSlot?: boolean
  onClick?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export function LogicPieceCard({
  piece,
  isPlaced = false,
  isDragging = false,
  isInSlot = false,
  onClick,
  onDragStart,
  onDragEnd,
}: LogicPieceCardProps) {
  const colors = TYPE_COLORS[piece.type]
  const IconComponent = ICON_MAP[piece.icon] || Star

  return (
    <div
      draggable={!isPlaced || isInSlot}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-200",
        colors.bg,
        colors.border,
        isPlaced && !isInSlot && "pointer-events-none opacity-40",
        isDragging && "scale-105 opacity-70 shadow-lg",
        !isPlaced && "cursor-grab hover:scale-[1.03] hover:shadow-md active:cursor-grabbing active:scale-[0.98]",
        isInSlot && "cursor-grab hover:scale-[1.02]"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          colors.bg,
          colors.text
        )}
      >
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", colors.text)}>
            {TYPE_LABELS[piece.type]}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {piece.label}
          </span>
        </div>
        <span className="truncate text-xs text-muted-foreground">{piece.description}</span>
      </div>
    </div>
  )
}

export { ICON_MAP, TYPE_COLORS }
