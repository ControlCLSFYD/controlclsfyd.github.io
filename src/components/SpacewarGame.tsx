import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { useSpacewarGame } from '../hooks/useSpacewarGame';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { drawShip, drawSun, drawDebugInfo, drawProjectile } from '../utils/spacewarRendering';
import { 
  applySunGravity, handleSunCollision, 
  handleBorderCollision, applyFriction, checkSunCollision 
} from '../utils/spacewarUtils';
import { 
  createProjectile, processProjectiles, manageAutofire
} from '../systems/projectileSystem';
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
    scoreState,
    player,
    setPlayer,
    cpu,
    setCpu,
    projectiles,
    addProjectile,
    updateProjectiles,
    resetGame,
    updatePlayerControls,
    updatePlayerScore,
    updateCpuScore,
    autofireManagerRef
  } = useSpacewarGame(difficulty, onGameComplete);
  
  const handleShipHit = (ship: Ship) => {
    ship.hitAnimationTime = Date.now();
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scoreState.gameOver) return;
      
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
        case ' ': // Spacebar for special projectile
          // This is now handled by autofire, but could be kept for manual special shots
          const specialProjectile = createProjectile(
            'player', 
            player, 
            constants.SPECIAL_PROJECTILE_SPEED * 2,
            constants.SPECIAL_PROJECTILE_SIZE,
            true,
            constants.SPECIAL_PROJECTILE_COLOR
          );
          addProjectile(specialProjectile);
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
  }, [scoreState.gameOver, player, constants]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!canvasRef.current) return;
      
      if (timestamp - lastTime < 16) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      
      drawSun(ctx, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2, constants.SUN_RADIUS);
      
      autofireManagerRef.current = manageAutofire(
        timestamp, 
        autofireManagerRef.current,
        constants.PROJECTILE_INTERVAL,
        250 // Special cooldown (ms)
      );
      
      if (autofireManagerRef.current.canPlayerFire) {
        const playerProjectile = createProjectile(
          'player', 
          player, 
          constants.SPECIAL_PROJECTILE_SPEED * 2,
          constants.SPECIAL_PROJECTILE_SIZE,
          true,
          constants.SPECIAL_PROJECTILE_COLOR
        );
        addProjectile(playerProjectile);
      }
      
      if (autofireManagerRef.current.canCpuFire) {
        const cpuProjectile = createProjectile(
          'cpu', 
          cpu, 
          constants.SPECIAL_PROJECTILE_SPEED * 2,
          constants.SPECIAL_PROJECTILE_SIZE,
          true,
          constants.SPECIAL_PROJECTILE_COLOR
        );
        addProjectile(cpuProjectile);
      }
      
      const updatedProjectiles = processProjectiles(
        projectiles, 
        player, 
        cpu, 
        constants,
        (points) => {
          updatePlayerScore(points);
          handleShipHit(cpu);
        },
        (points) => {
          updateCpuScore(points);
          handleShipHit(player);
        }
      );
      
      updateProjectiles(updatedProjectiles);
      
      updatedProjectiles.forEach(projectile => {
        drawProjectile(ctx, projectile);
      });
      
      if (scoreState.gameOver) {
        drawShip(ctx, player);
        drawShip(ctx, cpu);
        
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      
      const updatedPlayer = { ...player };
      
      if (player.rotateLeft) {
        updatedPlayer.rotation -= constants.ROTATION_SPEED;
      }
      if (player.rotateRight) {
        updatedPlayer.rotation += constants.ROTATION_SPEED;
      }
      
      if (player.thrust) {
        updatedPlayer.velocity.x += Math.cos(player.rotation) * constants.THRUST_POWER;
        updatedPlayer.velocity.y += Math.sin(player.rotation) * constants.THRUST_POWER;
      } else {
        updatedPlayer.velocity = applyFriction(updatedPlayer.velocity, constants.FRICTION);
      }
      
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
      
      if (playerGravity.hitSun) {
        console.log("Player crashed into sun! CPU +1 point");
        updateCpuScore(1);
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
        updatedPlayer.x += updatedPlayer.velocity.x;
        updatedPlayer.y += updatedPlayer.velocity.y;
      }
      
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
      
      const updatedCpu = { ...cpu };
      
      const aiResult = updateCpuAI(
        updatedCpu, 
        player, 
        constants.CANVAS_WIDTH, 
        constants.CANVAS_HEIGHT, 
        constants.SUN_RADIUS,
        aiStateRef.current,
        difficulty
      );
      
      aiStateRef.current = aiResult.aiState;
      
      const aiCpu = aiResult.updatedCpu;
      
      if (aiCpu.rotateLeft) {
        updatedCpu.rotation -= constants.ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      if (aiCpu.rotateRight) {
        updatedCpu.rotation += constants.ROTATION_SPEED * (0.8 + difficulty * 0.08);
      }
      
      updatedCpu.thrust = aiCpu.thrust;
      if (updatedCpu.thrust) {
        updatedCpu.velocity.x += Math.cos(updatedCpu.rotation) * constants.THRUST_POWER * (0.9 + difficulty * 0.08);
        updatedCpu.velocity.y += Math.sin(updatedCpu.rotation) * constants.THRUST_POWER * (0.9 + difficulty * 0.08);
      } else {
        updatedCpu.velocity = applyFriction(updatedCpu.velocity, constants.FRICTION);
      }
      
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
      
      if (cpuGravity.hitSun) {
        console.log("CPU crashed into sun! Player +1 point");
        updatePlayerScore(1);
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
        updatedCpu.x += updatedCpu.velocity.x;
        updatedCpu.y += updatedCpu.velocity.y;
      }
      
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
      
      drawShip(ctx, player);
      drawShip(ctx, cpu);
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, player, cpu, projectiles, constants, scoreState]);
  
  const handleContinue = () => {
    onGameComplete();
  };
  
  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain(scoreState.playerWon);
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-black">
      <h2 className="text-terminal-green text-xl mb-2 font-mono">SPACEWAR!</h2>
      
      <GameInfo 
        showInstructions={true}
        winningScore={constants.WINNING_SCORE}
        userScore={scoreState.playerScore}
        computerScore={scoreState.cpuScore}
        difficulty={difficulty}
      />
      
      <div className="border-2 border-terminal-green relative">
        <canvas 
          ref={canvasRef} 
          width={constants.CANVAS_WIDTH} 
          height={constants.CANVAS_HEIGHT}
          className="bg-black"
        />
        
        {scoreState.gameOver && (
          <GameResult
            gameWon={scoreState.playerWon}
            onContinue={handleContinue}
            onPlayAgain={handlePlayAgain}
            alwaysShowContinue={scoreState.playerWon}
          />
        )}
      </div>
      
      {isMobile && !scoreState.gameOver && (
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
          <div className="mt-4">
            <button
              onTouchStart={() => {
                const specialProjectile = createProjectile(
                  'player', 
                  player, 
                  constants.SPECIAL_PROJECTILE_SPEED * 2,
                  constants.SPECIAL_PROJECTILE_SIZE,
                  true,
                  constants.SPECIAL_PROJECTILE_COLOR
                );
                addProjectile(specialProjectile);
              }}
              className="bg-yellow-500 text-black p-3 rounded-full font-bold"
            >
              FIRE SPECIAL
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-terminal-green">
        {!isMobile 
          ? "Controls: Arrow Keys to move, SPACE to fire. Score points when CPU flies into the sun or your projectiles hit it!" 
          : "Use on-screen buttons to control your ship and fire special projectiles"}
      </div>
    </div>
  );
};

export default SpacewarGame;
