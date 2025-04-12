
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { Button } from './ui/button';
import GameResult from './GameResult';

interface SnakeGameProps extends BaseGameProps {}

// Game constants
const CELL_SIZE = 20;
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 1600;
const MOBILE_GAME_SPEED = 6400;

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
  
  // Adjust cell size for mobile
  const actualCellSize = isMobile ? Math.min(15, window.innerWidth / (GRID_WIDTH + 2)) : CELL_SIZE;

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

  // Animation frame loop
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      const currentGameSpeed = isMobile ? MOBILE_GAME_SPEED : GAME_SPEED;
      if (time - lastTime >= currentGameSpeed) {
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

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (lighter)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= GRID_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * actualCellSize, 0);
      ctx.lineTo(x * actualCellSize, GRID_HEIGHT * actualCellSize);
      ctx.stroke();
    }
    
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * actualCellSize);
      ctx.lineTo(GRID_WIDTH * actualCellSize, y * actualCellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(
      food.x * actualCellSize + actualCellSize / 2,
      food.y * actualCellSize + actualCellSize / 2,
      actualCellSize / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw snake
    ctx.fillStyle = '#00FF00';
    snake.forEach((segment, index) => {
      // Draw rounded segments for head, square for body
      if (index === 0) {
        // Head
        ctx.fillRect(
          segment.x * actualCellSize,
          segment.y * actualCellSize,
          actualCellSize,
          actualCellSize
        );
        
        // Eyes
        ctx.fillStyle = '#000';
        const eyeSize = actualCellSize / 5;
        let eyeX1, eyeY1, eyeX2, eyeY2;
        
        switch (direction) {
          case 'RIGHT':
            eyeX1 = segment.x * actualCellSize + actualCellSize - eyeSize * 2;
            eyeY1 = segment.y * actualCellSize + eyeSize;
            eyeX2 = segment.x * actualCellSize + actualCellSize - eyeSize * 2;
            eyeY2 = segment.y * actualCellSize + actualCellSize - eyeSize * 2;
            break;
          case 'LEFT':
            eyeX1 = segment.x * actualCellSize + eyeSize;
            eyeY1 = segment.y * actualCellSize + eyeSize;
            eyeX2 = segment.x * actualCellSize + eyeSize;
            eyeY2 = segment.y * actualCellSize + actualCellSize - eyeSize * 2;
            break;
          case 'UP':
            eyeX1 = segment.x * actualCellSize + eyeSize;
            eyeY1 = segment.y * actualCellSize + eyeSize;
            eyeX2 = segment.x * actualCellSize + actualCellSize - eyeSize * 2;
            eyeY2 = segment.y * actualCellSize + eyeSize;
            break;
          case 'DOWN':
            eyeX1 = segment.x * actualCellSize + eyeSize;
            eyeY1 = segment.y * actualCellSize + actualCellSize - eyeSize * 2;
            eyeX2 = segment.x * actualCellSize + actualCellSize - eyeSize * 2;
            eyeY2 = segment.y * actualCellSize + actualCellSize - eyeSize * 2;
            break;
        }
        
        ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
        ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
        
        ctx.fillStyle = '#00FF00';
      } else {
        // Body segments slightly smaller
        const padding = actualCellSize * 0.05;
        ctx.fillRect(
          segment.x * actualCellSize + padding,
          segment.y * actualCellSize + padding,
          actualCellSize - padding * 2,
          actualCellSize - padding * 2
        );
      }
    });
    
    // Draw border around game
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw text overlays if game not started or game over
    if (!gameStarted || gameOver || gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00FF00';
      ctx.font = isMobile ? '16px VT323, monospace' : '24px VT323, monospace';
      ctx.textAlign = 'center';
      
      if (!gameStarted) {
        ctx.fillText(
          'Press any key to start',
          canvas.width / 2,
          canvas.height / 2
        );
      }
    }
  }, [snake, food, direction, gameOver, gameStarted, gameWon, actualCellSize, isMobile]);

  // Reset the game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
  };

  // Handle mobile button presses
  const handleMobileButtonPress = (newDirection: Direction) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (OPPOSITE_DIRECTIONS[newDirection] !== direction) {
      setNextDirection(newDirection);
    }
  };

  // Handle continue button press
  const handleContinue = () => {
    onGameComplete();
  };

  // Handle play again button press
  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
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
          width={GRID_WIDTH * actualCellSize} 
          height={GRID_HEIGHT * actualCellSize}
          className="border border-terminal-green"
        />
        
        {/* Game results UI */}
        {(gameOver || gameWon) && (
          <GameResult
            gameWon={gameWon}
            onContinue={handleContinue}
            onPlayAgain={handlePlayAgain}
          />
        )}
        
        {isMobile && (
          <div className="mt-4 grid grid-cols-3 gap-2 w-full mx-auto" style={{ maxWidth: GRID_WIDTH * actualCellSize }}>
            <div className="col-start-2">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('UP')}
              >
                <ArrowUp size={30} />
              </button>
            </div>
            <div className="col-start-1 col-span-1 row-start-2">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('LEFT')}
              >
                <ArrowLeft size={30} />
              </button>
            </div>
            <div className="col-start-3 col-span-1 row-start-2">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('RIGHT')}
              >
                <ArrowRight size={30} />
              </button>
            </div>
            <div className="col-start-2 row-start-3">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('DOWN')}
              >
                <ArrowDown size={30} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
