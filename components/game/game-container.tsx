"use client"

import { useGameState } from "@/lib/use-game-state"
import { WORLDS } from "@/lib/game-data"
import { PuzzleBoard } from "./puzzle-board"
import { WorldSelect } from "./world-select"
import { ResultScreen } from "./result-screen"
import { HomeScreen } from "./home-screen"

export function GameContainer() {
  const {
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
  } = useGameState()

  if (state.screen === "home") {
    return (
      <HomeScreen
        progress={state.progress}
        onStartPlaying={navigateToWorldSelect}
      />
    )
  }

  if (state.screen === "world-select") {
    return (
      <WorldSelect
        progress={state.progress}
        selectedWorld={state.currentWorld}
        onSelectWorld={selectWorld}
        onStartPuzzle={startPuzzle}
        onBack={navigateHome}
      />
    )
  }

  if (state.screen === "result") {
    const puzzle = getCurrentPuzzle()
    const currentWorld = getCurrentWorld()

    const handleNextPuzzle = () => {
      if (currentWorld && puzzle) {
        const idx = currentWorld.puzzles.findIndex((p) => p.id === puzzle.id)
        if (idx < currentWorld.puzzles.length - 1) {
          startPuzzle(currentWorld.puzzles[idx + 1].id)
        } else {
          navigateToWorldSelect()
        }
      }
    }

    if (!puzzle) return null
    return (
      <ResultScreen
        puzzle={puzzle}
        progress={state.progress}
        onNextPuzzle={handleNextPuzzle}
        onBackToWorld={navigateToWorldSelect}
        onHome={navigateHome}
      />
    )
  }

  if (state.screen === "puzzle") {
    const puzzle = getCurrentPuzzle()
    if (!puzzle) return null

    return (
      <PuzzleBoard
        puzzle={puzzle}
        placedPieces={state.placedPieces}
        isCorrect={state.isCorrect}
        showHint={state.showHint}
        hintIndex={state.hintIndex}
        onPlacePiece={placePiece}
        onRemovePiece={removePiece}
        onCheckSolution={checkSolution}
        onToggleHint={toggleHint}
        onNextHint={nextHint}
        onReset={resetPuzzle}
        onBack={navigateToWorldSelect}
      />
    )
  }

  return null
}
