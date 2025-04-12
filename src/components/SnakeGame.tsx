import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { Button } from './ui/button';

interface SnakeGameProps extends BaseGameProps {}

// Game constants
const CELL_SIZE = 20; // Increased from 15
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 1600; // Updated to 1600ms as requested
const MOBILE_GAME_SPEED = 6400; // 4x slower on mobile
const MOBILE_BUTTON_SIZE = 80; // Increased from 60

// Direction vectors
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Opposite directions (to prevent 180° turns)
const OPPOSITE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameComplete, onPlayAgain, difficulty = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const requestRef = useRef<number>();

  // Win condition - reduced to 3 apples
  const WIN_SCORE = 3;

  // Generate random food position
  const generateFood = (snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  };

  // Check collision with walls or self
  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    // Check wall collision
    if (
      head.x < 0 || 
      head.x >= GRID_WIDTH || 
      head.y < 0 || 
      head.y >= GRID_HEIGHT
    ) {
      return true;
    }

    // Check self collision (skip checking against the head itself)
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }

    return false;
  };

  // Game loop
  const gameLoop = () => {
    if (!gameStarted || gameOver || gameWon) return;

    // Update direction
    const currentDirection = nextDirection;
    
    // Move snake
    const head = { ...snake[0] };
    const directionVector = DIRECTIONS[currentDirection];
    const newHead = {
      x: head.x + directionVector.x,
      y: head.y + directionVector.y,
    };

    // Check collision
    if (checkCollision(newHead, snake)) {
      setGameOver(true);
      return;
    }

    // Create new snake body
    const newSnake = [newHead, ...snake];
    
    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
      // Increase score
      const newScore = score + 1;
      setScore(newScore);
      
      // Generate new food
      setFood(generateFood(newSnake));
      
      // Check win condition
      if (newScore >= WIN_SCORE) {
        setGameWon(true);
        setTimeout(onGameComplete, 2000); // Give player time to see they won
        return;
      }
    } else {
      // Remove tail if no food was eaten
      newSnake.pop();
    }

    setSnake(newSnake);
    setDirection(currentDirection);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
      }

      let newDirection: Direction | null = null;

      switch (e.key.toLowerCase()) {
        // Support arrow keys
        case 'arrowup':
          if (direction !== 'DOWN') newDirection = 'UP';
          break;
        case 'arrowdown':
          if (direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'arrowleft':
          if (direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'arrowright':
          if (direction !== 'LEFT') newDirection = 'RIGHT';
          break;
        
        // Support WASD keys
        case 'w':
          if (direction !== 'DOWN') newDirection = 'UP';
          break;
        case 'a':
          if (direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 's':
          if (direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'd':
          if (direction !== 'LEFT') newDirection = 'RIGHT';
          break;
      }

      if (newDirection) {
        setNextDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, direction]);

  // Animation frame loop - with significantly reduced speed
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      const currentGameSpeed = isMobile ? MOBILE_GAME_SPEED : GAME_SPEED;
      if (time - lastTime >= currentGameSpeed) { // Use appropriate game speed based on device
        gameLoop();
        lastTime = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [snake, food, direction, nextDirection, gameOver, gameStarted, gameWon, score, isMobile]);

  // Restart game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key === 'Enter') {
        setSnake(INITIAL_SNAKE);
        setFood(generateFood(INITIAL_SNAKE));
        setDirection(INITIAL_DIRECTION);
        setNextDirection(INITIAL_DIRECTION);
        setGameOver(false);
        setScore(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Handle mobile button presses
  const handleMobileButtonPress = (newDirection: Direction) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (OPPOSITE_DIRECTIONS[newDirection] !== direction) {
      setNextDirection(newDirection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-terminal-black">
      <div className="mb-4 flex items-center gap-4">
        <span className="text-terminal-green text-2xl font-mono">SNAKE</span>
        <span className="text-terminal-green text-xl font-mono">Score: {score}/{WIN_SCORE}</span>
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={GRID_WIDTH * CELL_SIZE} 
          height={GRID_HEIGHT * CELL_SIZE}
          className="border border-terminal-green"
        />
        
        {/* Game results UI */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            {gameWon && (
              <div className="text-terminal-green text-2xl mb-4">You Won!</div>
            )}
            {gameOver && !gameWon && (
              <div className="text-terminal-green text-2xl mb-4">Game Over!</div>
            )}
            
            <div className="flex gap-4">
              {gameWon && (
                <Button 
                  variant="outline" 
                  onClick={onGameComplete}
                  className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
                >
                  Continue
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSnake(INITIAL_SNAKE);
                  setFood(generateFood(INITIAL_SNAKE));
                  setDirection(INITIAL_DIRECTION);
                  setNextDirection(INITIAL_DIRECTION);
                  setGameOver(false);
                  setGameWon(false);
                  setScore(0);
                  setGameStarted(false);
                  onPlayAgain();
                }}
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[320px] mx-auto">
            <div className="col-start-2">
              <button 
                className="w-full h-[150px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('UP')}
              >
                <ArrowUp size={60} />
              </button>
            </div>
            <div className="col-start-1 col-span-1 row-start-2">
              <button 
                className="w-full h-[150px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('LEFT')}
              >
                <ArrowLeft size={60} />
              </button>
            </div>
            <div className="col-start-3 col-span-1 row-start-2">
              <button 
                className="w-full h-[150px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('RIGHT')}
              >
                <ArrowRight size={60} />
              </button>
            </div>
            <div className="col-start-2 row-start-3">
              <button 
                className="w-full h-[150px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('DOWN')}
              >
                <ArrowDown size={60} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
