import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SnakeGameProps {
  onGameComplete: () => void;
}

// Game constants
const CELL_SIZE = 20; // Increased from 15
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 1600; // Updated to 1600ms as requested
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

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameComplete }) => {
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

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00AA00' : '#00FF00';
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      // Draw snake eye (on head only)
      if (index === 0) {
        ctx.fillStyle = 'black';
        let eyeOffsetX = 4;
        let eyeOffsetY = 4;
        
        switch (direction) {
          case 'RIGHT':
            eyeOffsetX = CELL_SIZE * 0.7;
            eyeOffsetY = CELL_SIZE * 0.2;
            break;
          case 'LEFT':
            eyeOffsetX = CELL_SIZE * 0.2;
            eyeOffsetY = CELL_SIZE * 0.2;
            break;
          case 'UP':
            eyeOffsetX = CELL_SIZE * 0.2;
            eyeOffsetY = CELL_SIZE * 0.2;
            break;
          case 'DOWN':
            eyeOffsetX = CELL_SIZE * 0.2;
            eyeOffsetY = CELL_SIZE * 0.7;
            break;
        }
        
        ctx.fillRect(
          segment.x * CELL_SIZE + eyeOffsetX,
          segment.y * CELL_SIZE + eyeOffsetY,
          CELL_SIZE * 0.25,
          CELL_SIZE * 0.25
        );
      }
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw grid (subtle borders)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= GRID_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }

    // Draw border
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);

    // Draw game over or win message
    if (gameOver) {
      ctx.fillStyle = '#00FF00';
      ctx.font = '30px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'GAME OVER',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2
      );
      ctx.font = '20px VT323, monospace';
      ctx.fillText(
        'Press ENTER to restart',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2 + 30
      );
    } else if (gameWon) {
      ctx.fillStyle = '#00FF00';
      ctx.font = '30px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'YOU WIN!',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2
      );
      ctx.font = '20px VT323, monospace';
      ctx.fillText(
        'Continuing to next level...',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2 + 30
      );
    } else if (!gameStarted) {
      ctx.fillStyle = '#00FF00';
      ctx.font = '24px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'SNAKE',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2 - 40
      );
      ctx.font = '20px VT323, monospace';
      ctx.fillText(
        'Use arrow keys or WASD to move',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2
      );
      ctx.fillText(
        'Collect 3 apples to win',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2 + 30
      );
      ctx.fillText(
        'Press any movement key to start',
        (GRID_WIDTH * CELL_SIZE) / 2,
        (GRID_HEIGHT * CELL_SIZE) / 2 + 60
      );
    }
  }, [snake, food, gameOver, gameWon, gameStarted, direction, score]);

  // Animation frame loop - with significantly reduced speed
  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime >= GAME_SPEED) { // Using the much slower GAME_SPEED constant (800ms)
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
  }, [snake, food, direction, nextDirection, gameOver, gameStarted, gameWon, score]);

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
        
        {isMobile && (
          <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[320px]">
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
