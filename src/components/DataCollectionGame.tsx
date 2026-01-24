'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Block {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  points: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

const COLORS = [
  { hex: '#683EF3', name: 'purple', basePoints: 50 },
  { hex: '#E5E5E5', name: 'cloud', basePoints: 10 },
  { hex: '#A5C5F2', name: 'sky', basePoints: 20 },
  { hex: '#CACEF2', name: 'powder', basePoints: 15 },
  { hex: '#5F1390', name: 'deep-purple', basePoints: 75 },
  { hex: '#4575EC', name: 'blue', basePoints: 40 },
  { hex: '#F4614A', name: 'orange', basePoints: 60 },
  { hex: '#F7CD68', name: 'yellow', basePoints: 30 },
  { hex: '#D5C09D', name: 'sand', basePoints: 25 },
];

const SIZES = [
  { size: 30, multiplier: 0.5 },
  { size: 40, multiplier: 1 },
  { size: 50, multiplier: 1.5 },
  { size: 60, multiplier: 2 },
];

const GAME_DURATION = 60; // 60 seconds

export default function DataCollectionGame({ onClose }: { onClose: () => void }) {
  const [score, setScore] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [basketX, setBasketX] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'ended'>('countdown');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const blockIdCounter = useRef(0);
  const lastSpawnTime = useRef(Date.now());

  const BASKET_WIDTH = 200;
  const BASKET_HEIGHT = 80;

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dataGameLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Save leaderboard to localStorage
  const saveLeaderboard = (newLeaderboard: LeaderboardEntry[]) => {
    localStorage.setItem('dataGameLeaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
  };

  // Get high score
  const highScore = leaderboard.length > 0 ? leaderboard[0] : null;

  // Countdown timer before game starts
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setGameActive(true);
    }
  }, [countdown, gameState]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameState]);

  // End game
  const endGame = () => {
    setGameActive(false);
    setGameState('ended');
    
    // Check if score makes top 5
    const isTopFive = leaderboard.length < 5 || score > leaderboard[leaderboard.length - 1].score;
    setShowNameInput(isTopFive);
    
    if (!isTopFive) {
      setShowPlayAgain(true);
    }
  };

  // Handle name submission
  const handleNameSubmit = () => {
    if (playerName.length !== 4) return;
    
    const newEntry: LeaderboardEntry = {
      name: playerName.toUpperCase(),
      score: score,
    };
    
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    saveLeaderboard(newLeaderboard);
    setShowNameInput(false);
    setShowPlayAgain(true);
  };

  // Reset game
  const resetGame = () => {
    setScore(0);
    setBlocks([]);
    setTimeLeft(GAME_DURATION);
    setCountdown(3);
    setGameState('countdown');
    setGameActive(false);
    setPlayerName('');
    setShowNameInput(false);
    setShowPlayAgain(false);
    blockIdCounter.current = 0;
  };

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gameRef.current && gameActive) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - BASKET_WIDTH / 2;
      const maxX = rect.width - BASKET_WIDTH;
      setBasketX(Math.max(0, Math.min(x, maxX)));
    }
  }, [gameActive]);

  // Spawn new blocks
  const spawnBlock = useCallback(() => {
    if (!gameRef.current) return;

    const now = Date.now();
    if (now - lastSpawnTime.current < 800) return; // Spawn every 800ms

    lastSpawnTime.current = now;

    const rect = gameRef.current.getBoundingClientRect();
    const colorData = COLORS[Math.floor(Math.random() * COLORS.length)];
    const sizeData = SIZES[Math.floor(Math.random() * SIZES.length)];

    const newBlock: Block = {
      id: blockIdCounter.current++,
      x: Math.random() * (rect.width - sizeData.size),
      y: -sizeData.size,
      color: colorData.hex,
      size: sizeData.size,
      speed: 1 + Math.random() * 2, // Random speed between 1-3
      points: Math.round(colorData.basePoints * sizeData.multiplier),
    };

    setBlocks((prev) => [...prev, newBlock]);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameActive || !gameRef.current) return;

    const rect = gameRef.current.getBoundingClientRect();
    const basketY = rect.height - BASKET_HEIGHT - 20;

    setBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks
        .map((block) => ({
          ...block,
          y: block.y + block.speed,
        }))
        .filter((block) => {
          // Check collision with basket
          const blockCenterX = block.x + block.size / 2;
          const blockBottom = block.y + block.size;

          const basketLeft = basketX;
          const basketRight = basketX + BASKET_WIDTH;
          const basketTop = basketY;

          // Check if block is caught
          if (
            blockBottom >= basketTop &&
            blockBottom <= basketTop + 30 &&
            blockCenterX >= basketLeft &&
            blockCenterX <= basketRight
          ) {
            setScore((prev) => prev + block.points);
            return false; // Remove caught block
          }

          // Remove blocks that fell off screen
          return block.y < rect.height;
        });

      return updatedBlocks;
    });

    spawnBlock();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, basketX, spawnBlock]);

  // Start game loop
  useEffect(() => {
    if (gameActive) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameActive, gameLoop]);

  // Add mouse move listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleClose = () => {
    setGameActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay with transparency */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Game container */}
      <div
        ref={gameRef}
        className="relative w-full h-full"
        style={{ cursor: gameActive ? 'none' : 'default' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 left-6 z-10 w-10 h-10 flex items-center justify-center border border-white/40 bg-black/40 text-white hover:bg-white/20 transition-colors font-mono text-xl"
          aria-label="Close game"
        >
          ×
        </button>

        {/* Countdown display */}
        {gameState === 'countdown' && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="font-mono text-9xl text-white font-bold animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Game HUD */}
        {gameState === 'playing' && (
          <>
            {/* Timer */}
            <div className="absolute top-6 right-6 z-10 bg-black/60 border border-white/40 px-6 py-3">
              <div className="font-mono text-xs uppercase tracking-wide text-white/60">
                Time
              </div>
              <div className="font-mono text-2xl text-red-500">{timeLeft}s</div>
            </div>

            {/* Score display */}
            <div className="absolute top-24 right-6 z-10 bg-black/60 border border-white/40 px-6 py-3">
              <div className="font-mono text-xs uppercase tracking-wide text-white/60">
                Score
              </div>
              <div className="font-mono text-2xl text-white">{score}</div>
            </div>

            {/* High Score */}
            {highScore && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-black/60 border border-white/40 px-6 py-3">
                <div className="font-mono text-xs uppercase tracking-wide text-white/60 text-center">
                  High Score
                </div>
                <div className="font-mono text-xl text-white text-center">
                  {highScore.name}: {highScore.score}
                </div>
              </div>
            )}
          </>
        )}

        {/* Falling blocks */}
        {gameState === 'playing' && blocks.map((block) => (
          <div
            key={block.id}
            className="absolute rounded transition-none"
            style={{
              left: `${block.x}px`,
              top: `${block.y}px`,
              width: `${block.size}px`,
              height: `${block.size}px`,
              backgroundColor: block.color,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          />
        ))}

        {/* U-shaped basket */}
        {gameState === 'playing' && (
          <div
            className="absolute transition-none"
            style={{
              left: `${basketX}px`,
              bottom: '20px',
              width: `${BASKET_WIDTH}px`,
              height: `${BASKET_HEIGHT}px`,
            }}
          >
            {/* Left side */}
            <div
              className="absolute left-0 bottom-0 bg-white/90 border-2 border-white"
              style={{
                width: '20px',
                height: '100%',
              }}
            />
            {/* Bottom */}
            <div
              className="absolute left-0 bottom-0 bg-white/90 border-2 border-white"
              style={{
                width: '100%',
                height: '20px',
              }}
            />
            {/* Right side */}
            <div
              className="absolute right-0 bottom-0 bg-white/90 border-2 border-white"
              style={{
                width: '20px',
                height: '100%',
              }}
            />
          </div>
        )}

        {/* Name Input Modal */}
        {gameState === 'ended' && showNameInput && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-black/90 border-2 border-white p-8 max-w-md w-full mx-4">
              <h2 className="font-mono text-2xl text-white mb-4 text-center">
                TOP 5 SCORE!
              </h2>
              <p className="font-mono text-sm text-white/60 mb-6 text-center">
                Your Score: {score}
              </p>
              <p className="font-mono text-sm text-white mb-4 text-center">
                Enter your 4-character name:
              </p>
              <input
                type="text"
                maxLength={4}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                className="w-full bg-black/60 border border-white/40 px-4 py-3 font-mono text-2xl text-white text-center uppercase tracking-widest focus:outline-none focus:border-white"
                placeholder="ABCD"
                autoFocus
              />
              <button
                onClick={handleNameSubmit}
                disabled={playerName.length !== 4}
                className="w-full mt-4 border border-white bg-white px-6 py-3 font-mono text-sm uppercase tracking-wide text-black hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Play Again Modal */}
        {gameState === 'ended' && showPlayAgain && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-black/90 border-2 border-white p-8 max-w-md w-full mx-4">
              <h2 className="font-mono text-2xl text-white mb-6 text-center">
                GAME OVER
              </h2>
              <p className="font-mono text-xl text-white mb-8 text-center">
                Your Score: {score}
              </p>
              
              {/* Leaderboard */}
              <div className="mb-8">
                <h3 className="font-mono text-sm uppercase tracking-wide text-white/60 mb-4 text-center">
                  Leaderboard
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border border-white/20 px-4 py-2"
                    >
                      <span className="font-mono text-sm text-white">
                        {index + 1}. {entry.name}
                      </span>
                      <span className="font-mono text-sm text-white">
                        {entry.score}
                      </span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <p className="font-mono text-sm text-white/40 text-center py-4">
                      No scores yet
                    </p>
                  )}
                </div>
              </div>

              <p className="font-mono text-sm text-white mb-4 text-center">
                Play again?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm uppercase tracking-wide text-black hover:bg-white/90 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 border border-white/40 px-6 py-3 font-mono text-sm uppercase tracking-wide text-white hover:border-white transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
