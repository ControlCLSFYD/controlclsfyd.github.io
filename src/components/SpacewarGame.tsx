import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { useSpacewarGame } from '../hooks/useSpacewarGame';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { 
  drawShip, drawScores, drawSun, drawDebugInfo 
} from '../utils/spacewarRendering';
import { 
  applySunGravity, normalizeAngle,
  handleSunCollision, handleBorderCollision, applyFriction,
  checkSunCollision
} from '../utils/spacewarUtils';
import GameInfo from './GameInfo';

const SpacewarGame: React.FC<BaseGameProps> = ({
  onGameComplete,
  onPlayAgain,
  difficulty = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();
  const aiStateRef = useRef(createInitialAIState());
  
  const {
    constants,
    gameStarted,
    gameOver,
    gameWon,
    player,
    setPlayer,
    cpu,
    setCpu,
    resetGame,
    updatePlayerControls,
    setGameOver,
    setGameWon
  } = useSpacewarGame(difficulty, () => {});
  
  // Setup keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          updatePlayerControls('thrust', true);
          break;
        case 'ArrowLeft':
          updatePlayerControls('rotateLeft', true);
          break;
        case 'ArrowRight':
          updatePlayerControls('rotateRight', true);
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          updatePlayerControls('thrust', false);
          break;
        case 'ArrowLeft':
          updatePlayerControls('rotateLeft', false);
          break;
        case 'ArrowRight':
          updatePlayerControls('rotateRight', false);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current || !gameStarted || gameOver) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      // Cap the frame rate
      if (timestamp - lastTime < 16) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = timestamp;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      
      // Draw sun
      drawSun(ctx, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2, constants.SUN_RADIUS);
      
      // Update player ship
      const updatedPlayer = { ...player };
      
      // Apply rotation to player
      if (player.rotateLeft) {
        updatedPlayer.rotation -= constants.ROTATION_SPEED;
      }
      if (player.rotateRight) {
        updatedPlayer.rotation += constants.ROTATION_SPEED;
      }
      
      // Apply thrust to player
      if (player.thrust) {
        updatedPlayer.velocity.x += Math.cos(player.rotation) * constants.THRUST_POWER;
        updatedPlayer.velocity.y += Math.sin(player.rotation) * constants.THRUST_POWER;
      } else {
        // Apply friction when not thrusting
        updatedPlayer.velocity = applyFriction(updatedPlayer.velocity, constants.FRICTION);
      }
      
      // Apply sun gravity to player
      const playerGravity = applySunGravity(
        player.x, 
        player.y, 
        constants.CANVAS_WIDTH / 2, 
        constants.CANVAS_HEIGHT / 2, 
        constants.GRAVITY_STRENGTH, 
        constants.SUN_RADIUS, 
        updatedPlayer.velocity.x, 
        updatedPlayer.velocity.y
      );
      updatedPlayer.velocity.x = playerGravity.x;
      updatedPlayer.velocity.y = playerGravity.y;
      
      // Handle sun collision
      if (playerGravity.hitSun) {
        const respawn = handleSunCollision(
          player.x, 
          player.y, 
          constants.CANVAS_WIDTH / 2, 
          constants.CANVAS_HEIGHT / 2
        );
        updatedPlayer.x = respawn.x;
        updatedPlayer.y = respawn.y;
        updatedPlayer.velocity = respawn.velocity;
      } else {
        // Update player position if no collision
        updatedPlayer.x += updatedPlayer.velocity.x;
        updatedPlayer.y += updatedPlayer.velocity.y;
      }
      
      // Handle border collisions (solid edges)
      const playerBorderCollision = handleBorderCollision(
        updatedPlayer.x,
        updatedPlayer.y,
        updatedPlayer.velocity,
        updatedPlayer.size,
        constants.CANVAS_WIDTH,
        constants.CANVAS_HEIGHT,
        constants.BOUNCE_DAMPENING
      );
      
      updatedPlayer.x = playerBorderCollision.position.x;
      updatedPlayer.y = playerBorderCollision.position.y;
      updatedPlayer.velocity = playerBorderCollision.velocity;
      
      setPlayer(updatedPlayer);
      
      // Update CPU ship with enhanced orbital AI
      const updatedCpu = { ...cpu };
      
      // CPU AI logic
      const aiResult = updateCpuAI(
        updatedCpu, 
        player, 
        constants.CANVAS_WIDTH, 
        constants.CANVAS_HEIGHT, 
        constants.SUN_RADIUS,
        aiStateRef.current,
        difficulty
      );
      
      // Update AI state
      aiStateRef.current = aiResult.aiState;
      
      // Get the updated CPU with AI decisions
      const aiCpu = aiResult.updatedCpu;
      
      // Apply rotation based on AI decisions
      if (aiCpu.rotateLeft) {
        updatedCpu.rotation -= constants.ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      if (aiCpu.rotateRight) {
        updatedCpu.rotation += constants.ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      
      // Apply thrust based on AI decisions
      updatedCpu.thrust = aiCpu.thrust;
      if (updatedCpu.thrust) {
        updatedCpu.velocity.x += Math.cos(updatedCpu.rotation) * constants.THRUST_POWER * (0.9 + difficulty * 0.08);
        updatedCpu.velocity.y += Math.sin(updatedCpu.rotation) * constants.THRUST_POWER * (0.9 + difficulty * 0.08);
      } else {
        // Apply friction when not thrusting
        updatedCpu.velocity = applyFriction(updatedCpu.velocity, constants.FRICTION);
      }
      
      // Apply sun gravity to CPU
      const cpuGravity = applySunGravity(
        cpu.x, 
        cpu.y, 
        constants.CANVAS_WIDTH / 2, 
        constants.CANVAS_HEIGHT / 2, 
        constants.GRAVITY_STRENGTH, 
        constants.SUN_RADIUS, 
        updatedCpu.velocity.x, 
        updatedCpu.velocity.y
      );
      updatedCpu.velocity.x = cpuGravity.x;
      updatedCpu.velocity.y = cpuGravity.y;
      
      // Handle sun collision for CPU and award points to player
      if (cpuGravity.hitSun) {
        // Award a point to the player
        setPlayer(prevPlayer => {
          const newScore = prevPlayer.score + 1;
          
          // Check for win
          if (newScore >= constants.WINNING_SCORE) {
            setGameOver(true);
            setGameWon(true);
          }
          
          return { ...prevPlayer, score: newScore };
        });
        
        // Respawn CPU
        const respawn = handleSunCollision(
          cpu.x, 
          cpu.y, 
          constants.CANVAS_WIDTH / 2, 
          constants.CANVAS_HEIGHT / 2
        );
        updatedCpu.x = respawn.x;
        updatedCpu.y = respawn.y;
        updatedCpu.velocity = respawn.velocity;
      } else {
        // Update CPU position if no collision
        updatedCpu.x += updatedCpu.velocity.x;
        updatedCpu.y += updatedCpu.velocity.y;
      }
      
      // Handle border collisions for CPU (solid edges)
      const cpuBorderCollision = handleBorderCollision(
        updatedCpu.x,
        updatedCpu.y,
        updatedCpu.velocity,
        updatedCpu.size,
        constants.CANVAS_WIDTH,
        constants.CANVAS_HEIGHT,
        constants.BOUNCE_DAMPENING
      );
      
      updatedCpu.x = cpuBorderCollision.position.x;
      updatedCpu.y = cpuBorderCollision.position.y;
      updatedCpu.velocity = cpuBorderCollision.velocity;
      
      setCpu(updatedCpu);
      
      // Draw player ship
      drawShip(ctx, player);
      
      // Draw CPU ship
      drawShip(ctx, cpu);
      
      // Draw scores
      drawScores(ctx, player.score, cpu.score, constants.CANVAS_WIDTH);
      
      // Draw debug info (orbit behavior)
      drawDebugInfo(ctx, aiStateRef.current.isOrbiting, constants.CANVAS_WIDTH);
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, player, cpu, constants]);
  
  const handleContinue = () => {
    onGameComplete();
  };
  
  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain(gameWon);
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-black">
      <h2 className="text-terminal-green text-xl mb-2 font-mono">SPACEWAR!</h2>
      
      <GameInfo 
        showInstructions={true}
        winningScore={constants.WINNING_SCORE}
        userScore={player.score}
        computerScore={cpu.score}
        difficulty={difficulty}
      />
      
      <div className="border-2 border-terminal-green relative">
        <canvas 
          ref={canvasRef} 
          width={constants.CANVAS_WIDTH} 
          height={400} // Now 400px
          className="bg-black"
        />
        
        {gameOver && (
          <GameResult
            gameWon={gameWon}
            onContinue={handleContinue}
            onPlayAgain={handlePlayAgain}
            alwaysShowContinue={gameWon}
          />
        )}
      </div>
      
      {isMobile && !gameOver && (
        <div className="mt-4 flex flex-col items-center">
          <button
            onTouchStart={() => updatePlayerControls('thrust', true)}
            onTouchEnd={() => updatePlayerControls('thrust', false)}
            className="bg-terminal-green text-black p-3 rounded-full mb-2 font-bold"
          >
            THRUST
          </button>
          <div className="flex gap-8">
            <button
              onTouchStart={() => updatePlayerControls('rotateLeft', true)}
              onTouchEnd={() => updatePlayerControls('rotateLeft', false)}
              className="bg-terminal-green text-black p-3 rounded-full font-bold"
            >
              ← TURN
            </button>
            <button
              onTouchStart={() => updatePlayerControls('rotateRight', true)}
              onTouchEnd={() => updatePlayerControls('rotateRight', false)}
              className="bg-terminal-green text-black p-3 rounded-full font-bold"
            >
              TURN →
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-terminal-green">
        {!isMobile ? "Controls: Arrow Keys to move. Score points when CPU flies into the sun!" : "Use on-screen buttons to control your ship"}
      </div>
    </div>
  );
};

export default SpacewarGame;
