"use client"

import { useState, useCallback } from "react"
import type { GameState, PlayerProgress, Badge } from "./game-types"
import { WORLDS, INITIAL_PROGRESS, BADGES } from "./game-data"

function getStoredProgress(): PlayerProgress {
  return { ...INITIAL_PROGRESS }
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    currentWorld: null,
    currentPuzzle: null,
    screen: "home",
    progress: getStoredProgress(),
    placedPieces: {},
    isCorrect: null,
    showHint: false,
    hintIndex: 0,
  })

  const navigateHome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: "home",
      currentWorld: null,
      currentPuzzle: null,
      placedPieces: {},
      isCorrect: null,
      showHint: false,
      hintIndex: 0,
    }))
  }, [])

  const navigateToWorldSelect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: "world-select",
      currentPuzzle: null,
      placedPieces: {},
      isCorrect: null,
    }))
  }, [])

  const selectWorld = useCallback((worldId: string) => {
    setState((prev) => ({
      ...prev,
      currentWorld: worldId,
      screen: "world-select",
    }))
  }, [])

  const startPuzzle = useCallback((puzzleId: string) => {
    setState((prev) => ({
      ...prev,
      currentPuzzle: puzzleId,
      screen: "puzzle",
      placedPieces: {},
      isCorrect: null,
      showHint: false,
      hintIndex: 0,
    }))
  }, [])

  const placePiece = useCallback((slotId: string, pieceId: string | null) => {
    setState((prev) => {
      const newPlaced = { ...prev.placedPieces }

      // Remove the piece from any other slot it might be in
      if (pieceId) {
        for (const key of Object.keys(newPlaced)) {
          if (newPlaced[key] === pieceId) {
            newPlaced[key] = null
          }
        }
      }

      newPlaced[slotId] = pieceId
      return { ...prev, placedPieces: newPlaced, isCorrect: null }
    })
  }, [])

  const removePiece = useCallback((slotId: string) => {
    setState((prev) => {
      const newPlaced = { ...prev.placedPieces }
      newPlaced[slotId] = null
      return { ...prev, placedPieces: newPlaced, isCorrect: null }
    })
  }, [])

  const checkSolution = useCallback(() => {
    const world = WORLDS.find((w) => w.id === state.currentWorld)
    if (!world) return

    const puzzle = world.puzzles.find((p) => p.id === state.currentPuzzle)
    if (!puzzle) return

    const allCorrect = puzzle.slots.every(
      (slot) => state.placedPieces[slot.id] === slot.correctPieceId
    )

    if (allCorrect) {
      setState((prev) => {
        const newProgress = { ...prev.progress }
        const puzzleId = prev.currentPuzzle!

        if (!newProgress.completedPuzzles.includes(puzzleId)) {
          newProgress.completedPuzzles = [...newProgress.completedPuzzles, puzzleId]
          newProgress.xp += puzzle.xpReward
          newProgress.currentStreak += 1

          if (newProgress.currentStreak > newProgress.bestStreak) {
            newProgress.bestStreak = newProgress.currentStreak
          }

          // Level up check
          while (newProgress.xp >= newProgress.xpToNextLevel) {
            newProgress.xp -= newProgress.xpToNextLevel
            newProgress.level += 1
            newProgress.xpToNextLevel = Math.floor(newProgress.xpToNextLevel * 1.3)
          }

          // Unlock worlds based on level
          const worldsToUnlock = WORLDS.filter(
            (w) =>
              w.requiredLevel <= newProgress.level &&
              !newProgress.unlockedWorlds.includes(w.id)
          )
          for (const w of worldsToUnlock) {
            newProgress.unlockedWorlds = [...newProgress.unlockedWorlds, w.id]
          }

          // Check badges
          const earnedBadges = checkBadges(newProgress)
          newProgress.badges = earnedBadges
        }

        return {
          ...prev,
          isCorrect: true,
          screen: "result",
          progress: newProgress,
        }
      })
    } else {
      setState((prev) => ({ ...prev, isCorrect: false }))
    }
  }, [state.currentWorld, state.currentPuzzle, state.placedPieces])

  const toggleHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showHint: !prev.showHint,
    }))
  }, [])

  const nextHint = useCallback(() => {
    setState((prev) => {
      const world = WORLDS.find((w) => w.id === prev.currentWorld)
      const puzzle = world?.puzzles.find((p) => p.id === prev.currentPuzzle)
      if (!puzzle) return prev

      return {
        ...prev,
        hintIndex: Math.min(prev.hintIndex + 1, puzzle.hints.length - 1),
      }
    })
  }, [])

  const resetPuzzle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      placedPieces: {},
      isCorrect: null,
      showHint: false,
      hintIndex: 0,
    }))
  }, [])

  const getCurrentPuzzle = useCallback(() => {
    if (!state.currentWorld || !state.currentPuzzle) return null
    const world = WORLDS.find((w) => w.id === state.currentWorld)
    return world?.puzzles.find((p) => p.id === state.currentPuzzle) ?? null
  }, [state.currentWorld, state.currentPuzzle])

  const getCurrentWorld = useCallback(() => {
    if (!state.currentWorld) return null
    return WORLDS.find((w) => w.id === state.currentWorld) ?? null
  }, [state.currentWorld])

  return {
    state,
    navigateHome,
    navigateToWorldSelect,
    selectWorld,
    startPuzzle,
    placePiece,
    removePiece,
    checkSolution,
    toggleHint,
    nextHint,
    resetPuzzle,
    getCurrentPuzzle,
    getCurrentWorld,
  }
}

function checkBadges(progress: PlayerProgress): Badge[] {
  const badges: Badge[] = [...progress.badges]
  const earnedIds = new Set(badges.map((b) => b.id))

  const possibleBadges: { check: () => boolean; id: string }[] = [
    { id: "first-solve", check: () => progress.completedPuzzles.length >= 1 },
    { id: "streak-3", check: () => progress.currentStreak >= 3 },
    { id: "streak-5", check: () => progress.currentStreak >= 5 },
    {
      id: "seq-master",
      check: () => {
        const seqWorld = WORLDS.find((w) => w.id === "sequential")
        return seqWorld?.puzzles.every((p) => progress.completedPuzzles.includes(p.id)) ?? false
      },
    },
    {
      id: "cond-master",
      check: () => {
        const condWorld = WORLDS.find((w) => w.id === "conditional")
        return condWorld?.puzzles.every((p) => progress.completedPuzzles.includes(p.id)) ?? false
      },
    },
    {
      id: "loop-master",
      check: () => {
        const loopWorld = WORLDS.find((w) => w.id === "loops")
        return loopWorld?.puzzles.every((p) => progress.completedPuzzles.includes(p.id)) ?? false
      },
    },
    {
      id: "bug-hunter",
      check: () => progress.completedPuzzles.some((id) => id.startsWith("debug")),
    },
    { id: "level-5", check: () => progress.level >= 5 },
    { id: "all-worlds", check: () => progress.unlockedWorlds.length >= WORLDS.length },
  ]

  for (const possible of possibleBadges) {
    if (!earnedIds.has(possible.id) && possible.check()) {
      const badgeDef = BADGES.find((b) => b.id === possible.id)
      if (badgeDef) {
        badges.push({ ...badgeDef, unlockedAt: new Date() })
      }
    }
  }

  return badges
}
