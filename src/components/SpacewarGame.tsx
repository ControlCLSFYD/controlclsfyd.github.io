
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { useSpacewarGame } from '../hooks/useSpacewarGame';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { 
  drawShip, drawTorpedo, drawChargeIndicator, 
  drawScores, drawSun, drawDebugInfo 
} from '../utils/spacewarRendering';
import { 
  applySunGravity, wrapPosition, normalizeAngle, 
  checkTorpedoHit, handleSunCollision 
} from '../utils/spacewarUtils';
import { fireTorpedo } from '../utils/spacewarWeapons';

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
    torpedoes,
    setTorpedoes,
    lastPlayerFire,
    setLastPlayerFire,
    lastCpuFire,
    setLastCpuFire,
    resetGame,
    handleFireSpecialWeapon,
    handleFireStandardWeapon,
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
        case ' ': // Spacebar for standard weapon (rapid fire)
          handleFireStandardWeapon();
          break;
        case 'b': // B key for special weapon
        case 'B':
          handleFireSpecialWeapon();
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
    let cpuSpecialWeaponTimer = 0;
    let cpuStandardWeaponTimer = 0;
    
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
      
      // Recharge special weapon
      if (updatedPlayer.specialWeaponCharge < 100) {
        updatedPlayer.specialWeaponCharge = Math.min(100, updatedPlayer.specialWeaponCharge + 0.16); // Full recharge in 10 seconds
      }
      
      // Recharge standard weapon
      if (updatedPlayer.standardWeaponCharge < 100) {
        updatedPlayer.standardWeaponCharge = Math.min(100, updatedPlayer.standardWeaponCharge + 1.7); // Full recharge in 1 second (faster)
      }
      
      // Auto-fire normal weapon
      const now = Date.now();
      if (now - lastPlayerFire > constants.PLAYER_FIRE_RATE) {
        const newTorpedo = fireTorpedo(
          'player', 
          player, 
          constants.TORPEDO_SPEED, 
          constants.TORPEDO_LIFESPAN
        );
        setTorpedoes(prev => [...prev, newTorpedo]);
        setLastPlayerFire(now);
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
      
      // Wrap around edges
      const wrappedPosition = wrapPosition(
        updatedPlayer.x, 
        updatedPlayer.y, 
        constants.CANVAS_WIDTH, 
        constants.CANVAS_HEIGHT
      );
      updatedPlayer.x = wrappedPosition.x;
      updatedPlayer.y = wrappedPosition.y;
      
      setPlayer(updatedPlayer);
      
      // Update CPU ship with enhanced orbital AI
      const updatedCpu = { ...cpu };
      
      // Recharge CPU special weapon
      if (updatedCpu.specialWeaponCharge < 100) {
        updatedCpu.specialWeaponCharge = Math.min(100, updatedCpu.specialWeaponCharge + 0.16);
      }

      // Recharge CPU standard weapon
      if (updatedCpu.standardWeaponCharge < 100) {
        updatedCpu.standardWeaponCharge = Math.min(100, updatedCpu.standardWeaponCharge + 1.7);
      }
      
      // CPU auto-fire normal weapon
      if (now - lastCpuFire > constants.CPU_FIRE_RATE) {  // CPU fires slightly faster
        const newTorpedo = fireTorpedo(
          'cpu', 
          cpu, 
          constants.TORPEDO_SPEED, 
          constants.TORPEDO_LIFESPAN
        );
        setTorpedoes(prev => [...prev, newTorpedo]);
        setLastCpuFire(now);
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
      }
      
      // CPU standard weapon firing logic (rapid fire)
      cpuStandardWeaponTimer++;
      
      // Calculate distance and angle to player for weapon targeting
      const distanceToPlayer = Math.sqrt(
        Math.pow(player.x - cpu.x, 2) + Math.pow(player.y - cpu.y, 2)
      );
      
      const angleToPlayer = Math.atan2(player.y - cpu.y, player.x - cpu.x);
      const angleToPlayerDiff = Math.abs(normalizeAngle(angleToPlayer - updatedCpu.rotation));
      
      // CPU rapid fire logic
      if (updatedCpu.rapidFireCount > 0) {
        if (now - lastCpuFire >= constants.STANDARD_WEAPON_FIRE_RATE) {
          const newTorpedo = fireTorpedo(
            'cpu', 
            cpu, 
            constants.STANDARD_TORPEDO_SPEED, 
            constants.STANDARD_TORPEDO_LIFESPAN
          );
          setTorpedoes(prev => [...prev, newTorpedo]);
          setLastCpuFire(now);
          
          updatedCpu.rapidFireCount--;
          if (updatedCpu.rapidFireCount <= 0) {
            updatedCpu.firingStandard = false;
          }
        }
      } else if (updatedCpu.standardWeaponCharge >= 100 && 
          distanceToPlayer < 300 && angleToPlayerDiff < 0.6) {
        
        // Start a rapid fire sequence
        cpuStandardWeaponTimer = 0;
        updatedCpu.standardWeaponCharge = 0;
        updatedCpu.firingStandard = true;
        updatedCpu.rapidFireCount = constants.RAPID_FIRE_COUNT;
      }

      // CPU special weapon firing logic
      cpuSpecialWeaponTimer++;
      
      // Fire special weapon when player is in good position
      const playerInFrontAndClose = distanceToPlayer < 200 && angleToPlayerDiff < 0.5;
      
      if (updatedCpu.specialWeaponCharge >= 100 && 
          (playerInFrontAndClose || cpuSpecialWeaponTimer > 480)) {
        cpuSpecialWeaponTimer = 0;
        const newTorpedo = fireTorpedo(
          'cpu', 
          cpu, 
          constants.SPECIAL_TORPEDO_SPEED, 
          constants.SPECIAL_TORPEDO_LIFESPAN
        );
        setTorpedoes(prev => [...prev, newTorpedo]);
        updatedCpu.specialWeaponCharge = 0;
        updatedCpu.firingSpecial = true;
        setTimeout(() => {
          setCpu(prev => ({ ...prev, firingSpecial: false }));
        }, 500);
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
      
      // Wrap around edges for CPU
      const wrappedCpuPosition = wrapPosition(
        updatedCpu.x, 
        updatedCpu.y, 
        constants.CANVAS_WIDTH, 
        constants.CANVAS_HEIGHT
      );
      updatedCpu.x = wrappedCpuPosition.x;
      updatedCpu.y = wrappedCpuPosition.y;
      
      setCpu(updatedCpu);
      
      // Update torpedoes
      const updatedTorpedoes = torpedoes.map(torpedo => {
        if (!torpedo.alive) return torpedo;
        
        const newTorpedo = { ...torpedo };
        newTorpedo.lifespan--;
        
        if (newTorpedo.lifespan <= 0) {
          newTorpedo.alive = false;
          return newTorpedo;
        }
        
        // Move torpedo
        newTorpedo.x += newTorpedo.velocity.x;
        newTorpedo.y += newTorpedo.velocity.y;
        
        // Apply sun gravity to torpedo
        const torpedoGravity = applySunGravity(
          newTorpedo.x,
          newTorpedo.y,
          constants.CANVAS_WIDTH / 2,
          constants.CANVAS_HEIGHT / 2,
          constants.GRAVITY_STRENGTH,
          constants.SUN_RADIUS,
          newTorpedo.velocity.x,
          newTorpedo.velocity.y
        );
        
        // Handle torpedo-sun collision
        if (torpedoGravity.hitSun) {
          newTorpedo.alive = false;
          return newTorpedo;
        }
        
        // Update torpedo velocity with gravity
        newTorpedo.velocity.x = torpedoGravity.x;
        newTorpedo.velocity.y = torpedoGravity.y;
        
        // Wrap around edges
        const wrappedTorpPosition = wrapPosition(
          newTorpedo.x,
          newTorpedo.y,
          constants.CANVAS_WIDTH,
          constants.CANVAS_HEIGHT
        );
        newTorpedo.x = wrappedTorpPosition.x;
        newTorpedo.y = wrappedTorpPosition.y;
        
        // Check for collision with player
        if (newTorpedo.owner === 'cpu') {
          if (checkTorpedoHit(newTorpedo, player)) {
            newTorpedo.alive = false;
            
            // Different weapons deal different damage
            let pointsToAdd = 1; // Regular torpedo
            if (newTorpedo.isSpecial) pointsToAdd = 2; // Special weapon
            if (newTorpedo.isStandard) pointsToAdd = 1; // Standard weapon
            
            setCpu(prevCpu => {
              const newScore = prevCpu.score + pointsToAdd;
              
              // Check for game over
              if (newScore >= constants.WINNING_SCORE) {
                setGameOver(true);
                setGameWon(false);
              }
              
              return { ...prevCpu, score: newScore };
            });
          }
        }
        
        // Check for collision with CPU
        if (newTorpedo.owner === 'player') {
          if (checkTorpedoHit(newTorpedo, cpu)) {
            newTorpedo.alive = false;
            
            // Different weapons deal different damage
            let pointsToAdd = 1; // Regular torpedo
            if (newTorpedo.isSpecial) pointsToAdd = 2; // Special weapon
            if (newTorpedo.isStandard) pointsToAdd = 1; // Standard weapon
            
            setPlayer(prevPlayer => {
              const newScore = prevPlayer.score + pointsToAdd;
              
              // Check for win
              if (newScore >= constants.WINNING_SCORE) {
                setGameOver(true);
                setGameWon(true);
              }
              
              return { ...prevPlayer, score: newScore };
            });
          }
        }
        
        return newTorpedo;
      }).filter(torpedo => torpedo.alive);
      
      setTorpedoes(updatedTorpedoes);
      
      // Draw player ship and indicators
      drawShip(ctx, player);
      drawChargeIndicator(ctx, player.specialWeaponCharge, 20, 40, '#00aaff', 'SPECIAL');
      drawChargeIndicator(ctx, player.standardWeaponCharge, 20, 55, '#ffffff', 'RAPID FIRE');
      
      // Draw CPU ship and indicators
      drawShip(ctx, cpu);
      drawChargeIndicator(ctx, cpu.specialWeaponCharge, constants.CANVAS_WIDTH - 120, 40, '#00aaff', 'SPECIAL');
      drawChargeIndicator(ctx, cpu.standardWeaponCharge, constants.CANVAS_WIDTH - 120, 55, '#ffffff', 'RAPID FIRE');
      
      // Draw torpedoes
      torpedoes.forEach(torpedo => {
        drawTorpedo(ctx, torpedo);
      });
      
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
  }, [gameStarted, gameOver, player, cpu, torpedoes, lastPlayerFire, lastCpuFire, constants]);
  
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
          <div className="flex gap-8 mb-4">
            <button
              onTouchStart={handleFireStandardWeapon}
              className={`${player.standardWeaponCharge >= 100 ? 'bg-white' : 'bg-gray-500'} text-black p-3 rounded-full font-bold`}
            >
              RAPID FIRE
            </button>
            <button
              onTouchStart={handleFireSpecialWeapon}
              className={`${player.specialWeaponCharge >= 100 ? 'bg-blue-500' : 'bg-gray-500'} text-black p-3 rounded-full font-bold`}
            >
              SPECIAL
            </button>
          </div>
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
        {!isMobile ? "Controls: Arrow Keys to move, SPACE for rapid fire, B for special weapon" : "Use on-screen buttons to control your ship"}
      </div>
    </div>
  );
};

export default SpacewarGame;
