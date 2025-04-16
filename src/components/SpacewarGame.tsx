
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { useSpacewarGame } from '../hooks/useSpacewarGame';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { 
  drawShip, drawBeam, drawChargeIndicator, 
  drawScores, drawSun, drawDebugInfo 
} from '../utils/spacewarRendering';
import { 
  applySunGravity, normalizeAngle, checkBeamHit, 
  handleSunCollision, handleBorderCollision, applyFriction
} from '../utils/spacewarUtils';
import { createBeam, fireBeamProjectile } from '../utils/spacewarWeapons';
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
    playerBeam,
    setPlayerBeam,
    cpuBeam,
    setCpuBeam,
    resetGame,
    handleFirePlayerBeam,
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
        case ' ': // Spacebar for beam
        case 'b': // B key also for beam
        case 'B':
          handleFirePlayerBeam();
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
    let cpuBeamTimer = 0;
    
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
      
      // Handle beam cooldown for player
      if (updatedPlayer.beamCooldown > 0) {
        updatedPlayer.beamCooldown--;
        if (updatedPlayer.beamCooldown <= 0) {
          updatedPlayer.beamActive = false;
        }
      }
      
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
      
      // Handle beam cooldown for CPU
      if (updatedCpu.beamCooldown > 0) {
        updatedCpu.beamCooldown--;
        if (updatedCpu.beamCooldown <= 0) {
          updatedCpu.beamActive = false;
        }
      }
      
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
      
      // CPU beam firing logic
      cpuBeamTimer++;
      
      // Calculate distance and angle to player for weapon targeting
      const distanceToPlayer = Math.sqrt(
        Math.pow(player.x - cpu.x, 2) + Math.pow(player.y - cpu.y, 2)
      );
      
      const angleToPlayer = Math.atan2(player.y - cpu.y, player.x - cpu.x);
      const angleToPlayerDiff = Math.abs(normalizeAngle(angleToPlayer - updatedCpu.rotation));
      
      // Fire beam when player is in good position
      const playerInFrontAndClose = distanceToPlayer < 200 && angleToPlayerDiff < 0.5;
      
      if (updatedCpu.beamCooldown <= 0 && 
          (playerInFrontAndClose || cpuBeamTimer > 120)) {
        cpuBeamTimer = 0;
        
        // Create CPU beam
        const newBeam = createBeam('cpu', {
          ...updatedCpu,
          beamLength: constants.BEAM_LENGTH
        });
        setCpuBeam(newBeam);
        
        updatedCpu.beamActive = true;
        updatedCpu.beamCooldown = constants.BEAM_COOLDOWN;
        
        // After a short delay, fire the projectile
        setTimeout(() => {
          if (cpuBeam) {
            const beamWithProjectile = fireBeamProjectile(
              cpuBeam,
              constants.BEAM_PROJECTILE_SPEED,
              constants.BEAM_PROJECTILE_LIFESPAN
            );
            setCpuBeam(beamWithProjectile);
          }
        }, 200);
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
      
      // Handle sun collision for CPU
      if (cpuGravity.hitSun) {
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
      
      // Update player beam
      if (playerBeam) {
        // Update beam position to follow the ship
        if (player.beamActive) {
          const shipTipX = player.x + Math.cos(player.rotation) * (player.size + 2);
          const shipTipY = player.y + Math.sin(player.rotation) * (player.size + 2);
          const beamEndX = player.x + Math.cos(player.rotation) * constants.BEAM_LENGTH;
          const beamEndY = player.y + Math.sin(player.rotation) * constants.BEAM_LENGTH;
          
          setPlayerBeam({
            ...playerBeam,
            startX: shipTipX,
            startY: shipTipY,
            endX: beamEndX,
            endY: beamEndY,
            rotation: player.rotation,
            intensity: playerBeam.intensity * 0.95 // Gradually fade
          });
        } else {
          // Turn off beam if ship is no longer beaming
          setPlayerBeam({
            ...playerBeam,
            active: false
          });
        }
        
        // Update player beam projectile if active
        if (playerBeam.projectileActive) {
          const updatedPlayerBeam = { ...playerBeam };
          
          // Update projectile lifespan
          updatedPlayerBeam.projectileLifespan--;
          
          if (updatedPlayerBeam.projectileLifespan <= 0) {
            updatedPlayerBeam.projectileActive = false;
          } else {
            // Move projectile
            updatedPlayerBeam.projectileX += updatedPlayerBeam.projectileVelocity.x;
            updatedPlayerBeam.projectileY += updatedPlayerBeam.projectileVelocity.y;
            
            // Apply sun gravity to projectile
            const projectileGravity = applySunGravity(
              updatedPlayerBeam.projectileX,
              updatedPlayerBeam.projectileY,
              constants.CANVAS_WIDTH / 2,
              constants.CANVAS_HEIGHT / 2,
              constants.GRAVITY_STRENGTH,
              constants.SUN_RADIUS,
              updatedPlayerBeam.projectileVelocity.x,
              updatedPlayerBeam.projectileVelocity.y
            );
            
            // Handle projectile-sun collision
            if (projectileGravity.hitSun) {
              updatedPlayerBeam.projectileActive = false;
            } else {
              // Update projectile velocity with gravity
              updatedPlayerBeam.projectileVelocity.x = projectileGravity.x;
              updatedPlayerBeam.projectileVelocity.y = projectileGravity.y;
              
              // Handle border collisions (deactivate projectile if it hits the border)
              const projectileBorderCollision = handleBorderCollision(
                updatedPlayerBeam.projectileX,
                updatedPlayerBeam.projectileY,
                updatedPlayerBeam.projectileVelocity,
                2, // Small collision radius for projectiles
                constants.CANVAS_WIDTH,
                constants.CANVAS_HEIGHT,
                constants.BOUNCE_DAMPENING
              );
              
              if (projectileBorderCollision.collision) {
                updatedPlayerBeam.projectileActive = false;
              } else {
                updatedPlayerBeam.projectileX = projectileBorderCollision.position.x;
                updatedPlayerBeam.projectileY = projectileBorderCollision.position.y;
                
                // Check for collision with CPU
                if (checkBeamHit(updatedPlayerBeam, cpu)) {
                  updatedPlayerBeam.projectileActive = false;
                  
                  setPlayer(prevPlayer => {
                    const newScore = prevPlayer.score + 1;
                    
                    // Check for win
                    if (newScore >= constants.WINNING_SCORE) {
                      setGameOver(true);
                      setGameWon(true);
                    }
                    
                    return { ...prevPlayer, score: newScore };
                  });
                }
              }
            }
          }
          
          setPlayerBeam(updatedPlayerBeam);
        }
      }
      
      // Update CPU beam
      if (cpuBeam) {
        // Update beam position to follow the CPU ship
        if (cpu.beamActive) {
          const shipTipX = cpu.x + Math.cos(cpu.rotation) * (cpu.size + 2);
          const shipTipY = cpu.y + Math.sin(cpu.rotation) * (cpu.size + 2);
          const beamEndX = cpu.x + Math.cos(cpu.rotation) * constants.BEAM_LENGTH;
          const beamEndY = cpu.y + Math.sin(cpu.rotation) * constants.BEAM_LENGTH;
          
          setCpuBeam({
            ...cpuBeam,
            startX: shipTipX,
            startY: shipTipY,
            endX: beamEndX,
            endY: beamEndY,
            rotation: cpu.rotation,
            intensity: cpuBeam.intensity * 0.95 // Gradually fade
          });
        } else {
          // Turn off beam if CPU ship is no longer beaming
          setCpuBeam({
            ...cpuBeam,
            active: false
          });
        }
        
        // Update CPU beam projectile if active
        if (cpuBeam.projectileActive) {
          const updatedCpuBeam = { ...cpuBeam };
          
          // Update projectile lifespan
          updatedCpuBeam.projectileLifespan--;
          
          if (updatedCpuBeam.projectileLifespan <= 0) {
            updatedCpuBeam.projectileActive = false;
          } else {
            // Move projectile
            updatedCpuBeam.projectileX += updatedCpuBeam.projectileVelocity.x;
            updatedCpuBeam.projectileY += updatedCpuBeam.projectileVelocity.y;
            
            // Apply sun gravity to projectile
            const projectileGravity = applySunGravity(
              updatedCpuBeam.projectileX,
              updatedCpuBeam.projectileY,
              constants.CANVAS_WIDTH / 2,
              constants.CANVAS_HEIGHT / 2,
              constants.GRAVITY_STRENGTH,
              constants.SUN_RADIUS,
              updatedCpuBeam.projectileVelocity.x,
              updatedCpuBeam.projectileVelocity.y
            );
            
            // Handle projectile-sun collision
            if (projectileGravity.hitSun) {
              updatedCpuBeam.projectileActive = false;
            } else {
              // Update projectile velocity with gravity
              updatedCpuBeam.projectileVelocity.x = projectileGravity.x;
              updatedCpuBeam.projectileVelocity.y = projectileGravity.y;
              
              // Handle border collisions (deactivate projectile if it hits the border)
              const projectileBorderCollision = handleBorderCollision(
                updatedCpuBeam.projectileX,
                updatedCpuBeam.projectileY,
                updatedCpuBeam.projectileVelocity,
                2, // Small collision radius for projectiles
                constants.CANVAS_WIDTH,
                constants.CANVAS_HEIGHT,
                constants.BOUNCE_DAMPENING
              );
              
              if (projectileBorderCollision.collision) {
                updatedCpuBeam.projectileActive = false;
              } else {
                updatedCpuBeam.projectileX = projectileBorderCollision.position.x;
                updatedCpuBeam.projectileY = projectileBorderCollision.position.y;
                
                // Check for collision with player
                if (checkBeamHit(updatedCpuBeam, player)) {
                  updatedCpuBeam.projectileActive = false;
                  
                  setCpu(prevCpu => {
                    const newScore = prevCpu.score + 1;
                    
                    // Check for game over
                    if (newScore >= constants.WINNING_SCORE) {
                      setGameOver(true);
                      setGameWon(false);
                    }
                    
                    return { ...prevCpu, score: newScore };
                  });
                }
              }
            }
          }
          
          setCpuBeam(updatedCpuBeam);
        }
      }
      
      // Draw player ship
      drawShip(ctx, player);
      
      // Draw CPU ship
      drawShip(ctx, cpu);
      
      // Draw beams
      if (playerBeam) drawBeam(ctx, playerBeam);
      if (cpuBeam) drawBeam(ctx, cpuBeam);
      
      // Draw beam cooldown indicators
      const playerBeamCharge = player.beamCooldown > 0 
        ? 100 - (player.beamCooldown / constants.BEAM_COOLDOWN * 100) 
        : 100;
      drawChargeIndicator(ctx, playerBeamCharge, 20, 40, '#00aaff', 'BEAM');
      
      const cpuBeamCharge = cpu.beamCooldown > 0 
        ? 100 - (cpu.beamCooldown / constants.BEAM_COOLDOWN * 100) 
        : 100;
      drawChargeIndicator(ctx, cpuBeamCharge, constants.CANVAS_WIDTH - 120, 40, '#00aaff', 'BEAM');
      
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
  }, [gameStarted, gameOver, player, cpu, playerBeam, cpuBeam, constants]);
  
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
          height={constants.CANVAS_HEIGHT}
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
            onTouchStart={handleFirePlayerBeam}
            className={`${player.beamCooldown <= 0 ? 'bg-blue-500' : 'bg-gray-500'} text-black p-3 rounded-full font-bold mb-4`}
          >
            BEAM
          </button>
          
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
        {!isMobile ? "Controls: Arrow Keys to move, SPACE or B to fire beam" : "Use on-screen buttons to control your ship"}
      </div>
    </div>
  );
};

export default SpacewarGame;
