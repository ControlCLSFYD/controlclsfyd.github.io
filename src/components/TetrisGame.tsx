import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface TetrisGameProps {
  onGameComplete: () => void;
}

// Game constants
const CELL_SIZE = 25;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const GAME_SPEED = 800; // Base falling speed in ms
const MOBILE_GAME_SPEED = 3200; // 4x slower on mobile
const POINTS_TO_WIN = 250; // Changed from 1000 to 250

// Tetromino shapes
const SHAPES = [
  // I shape
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // O shape
  [
    [1, 1],
    [1, 1]
  ],
  // T shape
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // L shape
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // J shape
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // S shape
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  // Z shape
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
];

// Colors for tetrominoes
const COLORS = [
  "#00FFFF", // Cyan - I
  "#FFFF00", // Yellow - O
  "#800080", // Purple - T
  "#FFA500", // Orange - L
  "#0000FF", // Blue - J
  "#00FF00", // Green - S
  "#FF0000"  // Red - Z
];

const TetrisGame: React.FC<TetrisGameProps> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [grid, setGrid] = useState<number[][]>(
    Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0))
  );
  const [currentTetromino, setCurrentTetromino] = useState({
    shape: SHAPES[0],
    color: COLORS[0],
    position: { x: 3, y: 0 },
    rotation: 0
  });
  const [nextTetromino, setNextTetromino] = useState({
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color: COLORS[Math.floor(Math.random() * SHAPES.length)],
    position: { x: 3, y: 0 },
    rotation: 0
  });
  const requestRef = useRef<number>();
  const lastDropTime = useRef<number>(0);
  const gameSpeed = useRef<number>(isMobile ? MOBILE_GAME_SPEED : GAME_SPEED);
  
  // Generate a random tetromino
  const generateTetromino = () => {
    const index = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[index],
      color: COLORS[index],
      position: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
      rotation: 0
    };
  };

  // Start the game
  const startGame = () => {
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0)));
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    setCurrentTetromino(generateTetromino());
    setNextTetromino(generateTetromino());
    lastDropTime.current = 0;
  };

  // Rotate the tetromino
  const rotateTetromino = () => {
    if (!gameStarted || gameOver || gameWon) return;

    const tetromino = { ...currentTetromino };
    const newShape = tetromino.shape[0].map((_, index) => 
      tetromino.shape.map(row => row[index]).reverse()
    );

    // Check if rotation is valid
    if (!checkCollision({ ...tetromino, shape: newShape })) {
      setCurrentTetromino({ ...tetromino, shape: newShape });
    }
  };

  // Check for collisions
  const checkCollision = (tetromino: any) => {
    const { shape, position } = tetromino;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          // Check boundaries
          if (
            newX < 0 || 
            newX >= GRID_WIDTH || 
            newY >= GRID_HEIGHT ||
            // Check existing blocks in the grid
            (newY >= 0 && grid[newY] && grid[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Move tetromino
  const moveTetromino = (direction: 'LEFT' | 'RIGHT' | 'DOWN') => {
    if (!gameStarted || gameOver || gameWon) return;
    
    const position = { ...currentTetromino.position };
    
    switch (direction) {
      case 'LEFT':
        position.x -= 1;
        break;
      case 'RIGHT':
        position.x += 1;
        break;
      case 'DOWN':
        position.y += 1;
        break;
    }
    
    if (!checkCollision({ ...currentTetromino, position })) {
      setCurrentTetromino({ ...currentTetromino, position });
    } else if (direction === 'DOWN') {
      // If can't move down, place tetromino and generate new one
      placeTetromino();
    }
  };
  
  // Place the tetromino on the grid
  const placeTetromino = () => {
    const newGrid = [...grid];
    const { shape, position, color } = currentTetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const gridY = position.y + y;
          
          // Game over if tetromino is placed at the top
          if (gridY <= 0) {
            setGameOver(true);
            return;
          }
          
          const gridX = position.x + x;
          if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
            const colorIndex = COLORS.indexOf(color) + 1; // Store color index + 1 (0 is empty)
            newGrid[gridY][gridX] = colorIndex;
          }
        }
      }
    }
    
    setGrid(newGrid);
    setCurrentTetromino(nextTetromino);
    setNextTetromino(generateTetromino());
    
    // Check for completed rows
    checkRows(newGrid);
  };
  
  // Check for completed rows and clear them
  const checkRows = (currentGrid: number[][]) => {
    const newGrid = [...currentGrid];
    let rowsCleared = 0;
    
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== 0)) {
        // Clear this row
        rowsCleared++;
        
        // Move all rows above down
        for (let row = y; row > 0; row--) {
          newGrid[row] = [...newGrid[row - 1]];
        }
        
        // Add empty row at top
        newGrid[0] = Array(GRID_WIDTH).fill(0);
        
        // Since the rows have shifted, we need to check this row again
        y++;
      }
    }
    
    if (rowsCleared > 0) {
      // Score points based on rows cleared
      const points = [40, 100, 300, 1200][rowsCleared - 1] || 0;
      const newScore = score + points;
      setScore(newScore);
      
      setGrid(newGrid);
      
      // Check win condition
      if (newScore >= POINTS_TO_WIN) {
        setGameWon(true);
      }
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) {
        startGame();
        return;
      }

      if (!gameStarted) {
        startGame();
        return;
      }

      switch (e.key.toLowerCase()) {
        // Support arrow keys
        case 'arrowleft':
        case 'a':
          moveTetromino('LEFT');
          break;
        case 'arrowright':
        case 'd':
          moveTetromino('RIGHT');
          break;
        case 'arrowdown':
        case 's':
          moveTetromino('DOWN');
          break;
        case 'arrowup':
        case 'w':
          rotateTetromino();
          break;
        case ' ': // Space for hard drop
          // Quick drop to bottom
          let newPosition = { ...currentTetromino.position };
          while (!checkCollision({ ...currentTetromino, position: { ...newPosition, y: newPosition.y + 1 } })) {
            newPosition.y += 1;
          }
          setCurrentTetromino({ ...currentTetromino, position: newPosition });
          placeTetromino();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, gameWon, currentTetromino, grid]);

  // Animation frame loop
  useEffect(() => {
    const animate = (time: number) => {
      if (gameStarted && !gameOver && !gameWon) {
        // Apply gravity based on game speed
        if (time - lastDropTime.current >= gameSpeed.current) {
          moveTetromino('DOWN');
          lastDropTime.current = time;
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWon, currentTetromino, grid]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
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

    // Draw placed blocks
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (grid[y][x] !== 0) {
          const colorIndex = grid[y][x] - 1;
          ctx.fillStyle = COLORS[colorIndex] || '#FFFFFF';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          
          // Draw block outline
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
    
    // Draw current tetromino
    if (gameStarted && !gameOver && !gameWon) {
      const { shape, position, color } = currentTetromino;
      ctx.fillStyle = color;
      
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const drawX = (position.x + x) * CELL_SIZE;
            const drawY = (position.y + y) * CELL_SIZE;
            
            ctx.fillRect(drawX, drawY, CELL_SIZE, CELL_SIZE);
            
            // Draw block outline
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(drawX, drawY, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }
    
    // Draw game over or game won message
    if (gameOver || gameWon || !gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00FF00';
      ctx.font = '24px VT323, monospace';
      ctx.textAlign = 'center';
      
      if (gameOver) {
        ctx.fillText(
          'GAME OVER',
          canvas.width / 2,
          canvas.height / 2 - 20
        );
        ctx.font = '16px VT323, monospace';
        ctx.fillText(
          'Press any key to restart',
          canvas.width / 2,
          canvas.height / 2 + 20
        );
      } else if (gameWon) {
        ctx.fillText(
          'YOU WIN!',
          canvas.width / 2,
          canvas.height / 2 - 40
        );
      } else if (!gameStarted) {
        ctx.fillText(
          'TETRIS',
          canvas.width / 2,
          canvas.height / 2 - 40
        );
        ctx.font = '16px VT323, monospace';
        ctx.fillText(
          'Use arrow keys or WASD to move',
          canvas.width / 2,
          canvas.height / 2
        );
        ctx.fillText(
          'Space to drop, Up/W to rotate',
          canvas.width / 2,
          canvas.height / 2 + 20
        );
        ctx.fillText(
          'Score ' + POINTS_TO_WIN + ' points to win',
          canvas.width / 2,
          canvas.height / 2 + 40
        );
        ctx.fillText(
          'Press any key to start',
          canvas.width / 2,
          canvas.height / 2 + 60
        );
      }
    }
    
    // Draw border
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [grid, currentTetromino, gameOver, gameStarted, gameWon]);

  // Handle mobile button presses
  const handleMobileButtonPress = (action: 'LEFT' | 'RIGHT' | 'DOWN' | 'ROTATE') => {
    if (gameOver || gameWon) {
      startGame();
      return;
    }
    
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (action === 'ROTATE') {
      rotateTetromino();
    } else {
      moveTetromino(action);
    }
  };

  // Handle continuing to next level or playing again
  const handleContinue = () => {
    onGameComplete();
  };

  const handlePlayAgain = () => {
    startGame();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-terminal-black">
      <div className="mb-4 flex items-center gap-4">
        <span className="text-terminal-green text-2xl font-mono">TETRIS</span>
        <span className="text-terminal-green text-xl font-mono">Score: {score}/{POINTS_TO_WIN}</span>
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={GRID_WIDTH * CELL_SIZE} 
          height={GRID_HEIGHT * CELL_SIZE}
          className="border border-terminal-green"
        />
        
        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-terminal-green text-2xl font-mono mb-6">YOU WIN!</h2>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleContinue}
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
              >
                Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePlayAgain}
                className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[300px] mx-auto">
            <div className="col-start-2 col-span-1">
              <button 
                className="w-full h-[80px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('ROTATE')}
                onClick={() => handleMobileButtonPress('ROTATE')}
              >
                <ArrowUp size={40} />
              </button>
            </div>
            <div className="col-start-1 col-span-1 row-start-2">
              <button 
                className="w-full h-[80px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('LEFT')}
                onClick={() => handleMobileButtonPress('LEFT')}
              >
                <ArrowLeft size={40} />
              </button>
            </div>
            <div className="col-start-3 col-span-1 row-start-2">
              <button 
                className="w-full h-[80px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('RIGHT')}
                onClick={() => handleMobileButtonPress('RIGHT')}
              >
                <ArrowRight size={40} />
              </button>
            </div>
            <div className="col-start-2 row-start-3">
              <button 
                className="w-full h-[80px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => handleMobileButtonPress('DOWN')}
                onClick={() => handleMobileButtonPress('DOWN')}
              >
                <ArrowDown size={40} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;
