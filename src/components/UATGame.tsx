
import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface UATGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
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

const UATGame: React.FC<UATGameProps> = ({ onGameComplete, onPlayAgain, difficulty = 1 }) => {
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
  const [winAchieved, setWinAchieved] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const requestRef = useRef<number>();
  const lastDropTime = useRef<number>(0);
  const gameSpeed = useRef<number>(isMobile ? MOBILE_GAME_SPEED : GAME_SPEED);
  const [buttonCooldown, setButtonCooldown] = useState(false);
  const cooldownDuration = 150; // ms
  const [secretKeyCount, setSecretKeyCount] = useState(0);

  // Enhanced mobile scaling
  const mobileScaleFactor = isMobile ? Math.min(window.innerWidth / (GRID_WIDTH * CELL_SIZE * 1.2), 1) : 1;
  const actualCellSize = isMobile ? CELL_SIZE * mobileScaleFactor : CELL_SIZE;

  useEffect(() => {
    const speedMultiplier = Math.max(0.7, 1 - (difficulty * 0.1)); // 0.9, 0.8, 0.7... lower is faster
    gameSpeed.current = isMobile 
      ? MOBILE_GAME_SPEED * speedMultiplier
      : GAME_SPEED * speedMultiplier;
  }, [difficulty, isMobile]);

  // Secret key mechanic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for "W" key press
      if (e.key.toLowerCase() === "w") {
        setSecretKeyCount(prev => {
          const newCount = prev + 1;
          
          // If W is pressed 33 times, trigger win
          if (newCount >= 33) {
            setGameWon(true);
            setShowWinMessage(true);
          }
          
          return newCount;
        });
      } else {
        // Any other key resets count
        setSecretKeyCount(0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generateTetromino = () => {
    const index = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[index],
      color: COLORS[index],
      position: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
      rotation: 0
    };
  };

  const startGame = () => {
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0)));
    setScore(0);
    setGameOver(false);
    setShowWinMessage(false);
    setGameStarted(true);
    setCurrentTetromino(generateTetromino());
    setNextTetromino(generateTetromino());
    lastDropTime.current = 0;
  };

  const rotateTetromino = () => {
    if (!gameStarted || gameOver || gameWon) return;

    const tetromino = { ...currentTetromino };
    const newShape = tetromino.shape[0].map((_, index) => 
      tetromino.shape.map(row => row[index]).reverse()
    );

    if (!checkCollision({ ...tetromino, shape: newShape })) {
      setCurrentTetromino({ ...tetromino, shape: newShape });
    }
  };

  const checkCollision = (tetromino: any) => {
    const { shape, position } = tetromino;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (
            newX < 0 || 
            newX >= GRID_WIDTH || 
            newY >= GRID_HEIGHT ||
            (newY >= 0 && grid[newY] && grid[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

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
      placeTetromino();
    }
  };

  const placeTetromino = () => {
    const newGrid = [...grid];
    const { shape, position, color } = currentTetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const gridY = position.y + y;
          
          if (gridY <= 0) {
            setGameOver(true);
            return;
          }
          
          const gridX = position.x + x;
          if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
            const colorIndex = COLORS.indexOf(color) + 1;
            newGrid[gridY][gridX] = colorIndex;
          }
        }
      }
    }
    
    setGrid(newGrid);
    setCurrentTetromino(nextTetromino);
    setNextTetromino(generateTetromino());
    
    checkRows(newGrid);
  };

  const checkRows = (currentGrid: number[][]) => {
    const newGrid = [...currentGrid];
    let rowsCleared = 0;
    
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== 0)) {
        rowsCleared++;
        
        for (let row = y; row > 0; row--) {
          newGrid[row] = [...newGrid[row - 1]];
        }
        
        newGrid[0] = Array(GRID_WIDTH).fill(0);
        
        y++;
      }
    }
    
    if (rowsCleared > 0) {
      const points = [40, 100, 300, 1200][rowsCleared - 1] || 0;
      const newScore = score + points;
      setScore(newScore);
      
      setGrid(newGrid);
      
      if (newScore >= POINTS_TO_WIN && !winAchieved) {
        setWinAchieved(true);
        setShowWinMessage(true);
        setTimeout(() => {
          setShowWinMessage(false);
        }, 5000);
      }
    }
  };

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

  useEffect(() => {
    const animate = (time: number) => {
      if (gameStarted && !gameOver && !gameWon) {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas dimensions for mobile
    if (isMobile) {
      canvas.width = GRID_WIDTH * actualCellSize;
      canvas.height = GRID_HEIGHT * actualCellSize;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#333';
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

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (grid[y][x] !== 0) {
          const colorIndex = grid[y][x] - 1;
          ctx.fillStyle = COLORS[colorIndex] || '#FFFFFF';
          ctx.fillRect(x * actualCellSize, y * actualCellSize, actualCellSize, actualCellSize);
          
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * actualCellSize, y * actualCellSize, actualCellSize, actualCellSize);
        }
      }
    }
    
    if (gameStarted && !gameOver && !gameWon) {
      const { shape, position, color } = currentTetromino;
      ctx.fillStyle = color;
      
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] !== 0) {
            const drawX = (position.x + x) * actualCellSize;
            const drawY = (position.y + y) * actualCellSize;
            
            ctx.fillRect(drawX, drawY, actualCellSize, actualCellSize);
            
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(drawX, drawY, actualCellSize, actualCellSize);
          }
        }
      }
    }
    
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
          'UAT',
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
    
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [grid, currentTetromino, gameOver, gameStarted, gameWon, isMobile, actualCellSize]);

  const handleMobileButtonPress = (action: 'LEFT' | 'RIGHT' | 'DOWN' | 'ROTATE') => {
    if (buttonCooldown) return;
    
    if (gameOver) {
      startGame();
      return;
    }
    
    if (!gameStarted) {
      startGame();
      return;
    }
    
    setButtonCooldown(true);
    setTimeout(() => setButtonCooldown(false), cooldownDuration);
    
    if (action === 'ROTATE') {
      rotateTetromino();
    } else {
      moveTetromino(action);
    }
  };

  const handleContinue = () => {
    setShowWinMessage(false);
    onGameComplete();
  };

  const handleContinuePlaying = () => {
    setShowWinMessage(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-terminal-black">
      <div className="mb-4 flex items-center gap-4">
        <span className="text-terminal-green text-2xl font-mono">UAT</span>
        <span className="text-terminal-green text-xl font-mono">Score: {score}/{POINTS_TO_WIN}</span>
        {winAchieved && (
          <Button 
            variant="outline" 
            onClick={handleContinue}
            className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black px-3 py-1 h-8 uppercase font-mono text-xs tracking-wider"
          >
            Next Question
          </Button>
        )}
        
        {secretKeyCount > 0 && (
          <div className="text-xs text-terminal-green ml-4">
            W count: {secretKeyCount}/33
          </div>
        )}
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={GRID_WIDTH * (isMobile ? actualCellSize : CELL_SIZE)} 
          height={GRID_HEIGHT * (isMobile ? actualCellSize : CELL_SIZE)}
          className="border border-terminal-green"
        />
        
        {showWinMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-terminal-green text-2xl font-mono mb-6">YOU WIN!</h2>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleContinue}
                className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black uppercase font-mono text-sm tracking-wider px-3 py-1"
              >
                Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={handleContinuePlaying}
                className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black uppercase font-mono text-sm tracking-wider px-3 py-1"
              >
                Continue Playing
              </Button>
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h2 className="text-terminal-green text-2xl font-mono mb-6">GAME OVER</h2>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={startGame}
                className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black uppercase font-mono text-sm tracking-wider px-3 py-1"
              >
                New Game
              </Button>
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[280px] mx-auto">
            <div className="col-start-2 col-span-1">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => !buttonCooldown && handleMobileButtonPress('ROTATE')}
                onClick={() => !buttonCooldown && handleMobileButtonPress('ROTATE')}
              >
                <ArrowUp size={30} />
              </button>
            </div>
            <div className="col-start-1 col-span-1 row-start-2">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => !buttonCooldown && handleMobileButtonPress('LEFT')}
                onClick={() => !buttonCooldown && handleMobileButtonPress('LEFT')}
              >
                <ArrowLeft size={30} />
              </button>
            </div>
            <div className="col-start-3 col-span-1 row-start-2">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => !buttonCooldown && handleMobileButtonPress('RIGHT')}
                onClick={() => !buttonCooldown && handleMobileButtonPress('RIGHT')}
              >
                <ArrowRight size={30} />
              </button>
            </div>
            <div className="col-start-2 row-start-3">
              <button 
                className="w-full h-[60px] flex items-center justify-center bg-terminal-black border-2 border-terminal-green text-terminal-green rounded-md active:bg-terminal-green active:bg-opacity-30"
                onTouchStart={() => !buttonCooldown && handleMobileButtonPress('DOWN')}
                onClick={() => !buttonCooldown && handleMobileButtonPress('DOWN')}
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

export default UATGame;
