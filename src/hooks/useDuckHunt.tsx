
import { useState, useEffect, useCallback, useRef } from 'react';

interface Duck {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  active: boolean;
  hit: boolean;
  hitAnimation: number;
}

interface DuckHuntGameState {
  ducks: Duck[];
  score: number;
  ducksGenerated: number;
  gameOver: boolean;
  gameWon: boolean;
}

interface UseDuckHuntProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onGameComplete: () => void;
  difficulty: number;
}

export const useDuckHunt = ({ canvasRef, onGameComplete, difficulty }: UseDuckHuntProps) => {
  const [gameState, setGameState] = useState<DuckHuntGameState>({
    ducks: [],
    score: 0,
    ducksGenerated: 0,
    gameOver: false,
    gameWon: false
  });
  
  const generateRandomDuck = useCallback(() => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const size = 30;
    const x = -size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    
    // Speed increases with difficulty
    const baseSpeed = 1 + difficulty * 0.5;
    const speedX = baseSpeed + Math.random() * difficulty;
    const speedVariation = Math.random() > 0.5 ? -1 : 1;
    const speedY = (Math.random() * 0.5 * difficulty) * speedVariation;
    
    return {
      x,
      y,
      speedX,
      speedY,
      size,
      active: true,
      hit: false,
      hitAnimation: 0
    };
  }, [canvasRef, difficulty]);
  
  const duckTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Start generating ducks when the game starts
    if (duckTimerRef.current === null) {
      duckTimerRef.current = window.setInterval(() => {
        if (gameState.ducksGenerated >= 10) {
          // Stop generating ducks after 10
          if (duckTimerRef.current !== null) {
            clearInterval(duckTimerRef.current);
            duckTimerRef.current = null;
          }
          
          // Check if all ducks are processed (either hit or offscreen)
          const activeDucks = gameState.ducks.filter(duck => duck.active && !duck.hit);
          if (activeDucks.length === 0) {
            // Game is over when all ducks are processed
            setGameState(prev => ({
              ...prev,
              gameOver: true,
              gameWon: prev.score >= 5 // Win if at least half ducks are hit
            }));
            
            // Notify parent component
            onGameComplete();
          }
          
          return;
        }
        
        const newDuck = generateRandomDuck();
        if (newDuck) {
          setGameState(prev => ({
            ...prev,
            ducks: [...prev.ducks, newDuck],
            ducksGenerated: prev.ducksGenerated + 1
          }));
        }
      }, 1500 / difficulty); // Faster duck generation with higher difficulty
    }
    
    return () => {
      if (duckTimerRef.current !== null) {
        clearInterval(duckTimerRef.current);
        duckTimerRef.current = null;
      }
    };
  }, [gameState.ducks, gameState.ducksGenerated, generateRandomDuck, difficulty, onGameComplete]);
  
  const resetGame = useCallback(() => {
    // Clear any existing timers
    if (duckTimerRef.current !== null) {
      clearInterval(duckTimerRef.current);
      duckTimerRef.current = null;
    }
    
    setGameState({
      ducks: [],
      score: 0,
      ducksGenerated: 0,
      gameOver: false,
      gameWon: false
    });
    
    // The timer will be restarted by the useEffect
  }, []);
  
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.nativeEvent.offsetX) * scaleX;
    const clickY = (event.nativeEvent.offsetY) * scaleY;
    
    let hit = false;
    
    setGameState(prev => {
      const updatedDucks = prev.ducks.map(duck => {
        // Skip already hit ducks
        if (duck.hit || !duck.active) return duck;
        
        // Check if click is within duck area
        const distance = Math.sqrt(
          Math.pow(duck.x - clickX, 2) + Math.pow(duck.y - clickY, 2)
        );
        
        if (distance < duck.size) {
          hit = true;
          return { ...duck, hit: true, hitAnimation: 0 };
        }
        
        return duck;
      });
      
      return {
        ...prev,
        ducks: updatedDucks,
        score: hit ? prev.score + 1 : prev.score
      };
    });
  }, [canvasRef]);
  
  const handleAnimationFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setGameState(prev => {
      // Update duck positions and handle offscreen ducks
      const updatedDucks = prev.ducks.map(duck => {
        if (!duck.active) return duck;
        
        if (duck.hit) {
          // Handle hit animation
          const updatedAnimation = duck.hitAnimation + 1;
          
          if (updatedAnimation >= 20) { // Animation length
            return { ...duck, active: false };
          }
          
          return { ...duck, hitAnimation: updatedAnimation };
        }
        
        // Move the duck
        const newX = duck.x + duck.speedX;
        const newY = duck.y + duck.speedY;
        
        // Check if duck is offscreen
        if (newX > canvas.width + duck.size || 
            newY < -duck.size || 
            newY > canvas.height + duck.size) {
          return { ...duck, active: false };
        }
        
        return { ...duck, x: newX, y: newY };
      });
      
      return {
        ...prev,
        ducks: updatedDucks
      };
    });
    
    // Draw ducks
    gameState.ducks.forEach(duck => {
      if (!duck.active) return;
      
      if (duck.hit) {
        // Draw hit animation (falling duck)
        ctx.fillStyle = 'rgba(255, 0, 0, ' + (1 - duck.hitAnimation / 20) + ')';
        ctx.beginPath();
        ctx.arc(duck.x, duck.y + duck.hitAnimation * 2, duck.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw normal duck
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(duck.x, duck.y, duck.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(duck.x + duck.size, duck.y);
        ctx.lineTo(duck.x + duck.size + 10, duck.y - 5);
        ctx.lineTo(duck.x + duck.size + 10, duck.y + 5);
        ctx.fill();
      }
    });
    
  }, [canvasRef, gameState.ducks]);
  
  return {
    gameState,
    handleCanvasClick,
    resetGame,
    handleAnimationFrame
  };
};
