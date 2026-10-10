'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArcadeEngine, type GameState } from '@/lib/arcade/engine'
import { Reward } from './Reward'

export function Game() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<ArcadeEngine | null>(null)

  const [gameState, setGameState] = useState<GameState>('boot')
  const [finalScore, setFinalScore] = useState<number>(0)

  const handleExit = useCallback(() => {
    router.push('/')
  }, [router])

  const handleRestart = useCallback(() => {
    engineRef.current?.startLevel(0)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new ArcadeEngine(canvas, {
      onStateChange: (state) => setGameState(state),
      onReward: (score) => {
        setFinalScore(score)
        setGameState('reward')
      },
      onExit: handleExit,
    })

    engineRef.current = engine

    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [handleExit])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#070708]">
      {/* Scaled 16:9 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain max-w-full max-h-full [image-rendering:pixelated] [image-rendering:crisp-edges]"
        tabIndex={0}
        aria-label="Arcade mini-game canvas"
      />

      {/* Reward screen overlay once boss 3 is defeated */}
      {gameState === 'reward' && (
        <Reward score={finalScore} onRestart={handleRestart} />
      )}
    </div>
  )
}
