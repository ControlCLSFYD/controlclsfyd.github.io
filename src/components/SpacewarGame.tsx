
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import GameResult from './GameResult';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import { useSpacewarGame } from '../hooks/useSpacewarGame';
import { createInitialAIState, updateCpuAI } from '../utils/spacewarCpuAI';
import { 
  drawShip, drawSun, drawDebugInfo, drawProjectile 
} from '../utils/spacewarRendering';
import { 
  applySunGravity, normalizeAngle,
  handleSunCollision, handleBorderCollision, applyFriction,
  checkSunCollision
} from '../utils/spacewarUtils';
import { createProjectile, updateProjectile, checkProjectileHit, checkProjectileBorder } from '../utils/spacewarWeapons';
import GameInfo from './GameInfo';
import { Projectile } from '../interfaces/SpacewarInterfaces';

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
    projectiles,
    addProjectile,
    updateProjectiles,
    resetGame,
    updatePlayerControls,
    setGameOver,
    setGameWon
  } = useSpacewarGame(difficulty, () => {});

  const lastFireTimeRef = useRef({ player: 0, cpu: 0 });
  const FIRE_INTERVAL = 250; // milliseconds

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

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (timestamp: number) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      drawSun(ctx, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2, constants.SUN_RADIUS);

      const shouldFire = (lastFireTime: number) => timestamp - lastFireTime > FIRE_INTERVAL;

      if (!gameOver) {
        if (shouldFire(lastFireTimeRef.current.player)) {
          lastFireTimeRef.current.player = timestamp;
          const projectile = createProjectile('player', player, constants.SPECIAL_PROJECTILE_SPEED, constants.SPECIAL_PROJECTILE_SIZE, true, constants.SPECIAL_PROJECTILE_COLOR);
          addProjectile(projectile);
        }
        if (shouldFire(lastFireTimeRef.current.cpu)) {
          lastFireTimeRef.current.cpu = timestamp;
          const projectile = createProjectile('cpu', cpu, constants.SPECIAL_PROJECTILE_SPEED, constants.SPECIAL_PROJECTILE_SIZE, true, constants.SPECIAL_PROJECTILE_COLOR);
          addProjectile(projectile);
        }
      }

      let updatedProjectiles = projectiles.map(updateProjectile).filter(p => {
        const hitCpu = p.owner === 'player' && checkProjectileHit(p, cpu);
        const hitPlayer = p.owner === 'cpu' && checkProjectileHit(p, player);
        const hitBorder = checkProjectileBorder(p, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

        if (hitCpu) {
          setPlayer(prev => {
            const newScore = prev.score + 1;
            if (newScore >= constants.WINNING_SCORE) {
              setGameOver(true);
              setGameWon(true);
            }
            return { ...prev, score: newScore };
          });
          return false;
        }

        if (hitPlayer) {
          setCpu(prev => {
            const newScore = prev.score + 1;
            if (newScore >= constants.WINNING_SCORE) {
              setGameOver(true);
              setGameWon(false);
            }
            return { ...prev, score: newScore };
          });
          return false;
        }

        return !hitBorder;
      });

      updateProjectiles(updatedProjectiles);
      updatedProjectiles.forEach(p => drawProjectile(ctx, p));

      const updateShip = (ship: any, aiResult?: any) => {
        const s = { ...ship };
        if (s.thrust) {
          s.velocity.x += Math.cos(s.rotation) * constants.THRUST_POWER;
          s.velocity.y += Math.sin(s.rotation) * constants.THRUST_POWER;
        } else {
          s.velocity = applyFriction(s.velocity, constants.FRICTION);
        }
        if (s.rotateLeft) s.rotation -= constants.ROTATION_SPEED;
        if (s.rotateRight) s.rotation += constants.ROTATION_SPEED;

        const gravity = applySunGravity(s.x, s.y, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2, constants.GRAVITY_STRENGTH, constants.SUN_RADIUS, s.velocity.x, s.velocity.y);
        s.velocity.x = gravity.x;
        s.velocity.y = gravity.y;

        if (gravity.hitSun) {
          const scorer = s === player ? setCpu : setPlayer;
          scorer(prev => {
            const newScore = prev.score + 1;
            if (newScore >= constants.WINNING_SCORE) {
              setGameOver(true);
              setGameWon(s === player ? false : true);
            }
            return { ...prev, score: newScore };
          });
          const respawn = handleSunCollision(s.x, s.y, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2);
          s.x = respawn.x;
          s.y = respawn.y;
          s.velocity = respawn.velocity;
        } else {
          s.x += s.velocity.x;
          s.y += s.velocity.y;
        }

        const border = handleBorderCollision(s.x, s.y, s.velocity, s.size, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT, constants.BOUNCE_DAMPENING);
        s.x = border.position.x;
        s.y = border.position.y;
        s.velocity = border.velocity;
        return s;
      };

      let updatedPlayer = updateShip(player);
      let updatedCpu = updateShip(cpu);

      const aiResult = updateCpuAI(updatedCpu, updatedPlayer, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT, constants.SUN_RADIUS, aiStateRef.current, difficulty);
      aiStateRef.current = aiResult.aiState;
      updatedCpu = { ...updatedCpu, ...aiResult.updatedCpu };

      setPlayer(updatedPlayer);
      setCpu(updatedCpu);

      drawShip(ctx, updatedPlayer);
      drawShip(ctx, updatedCpu);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasRef, constants]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={constants.CANVAS_WIDTH} height={constants.CANVAS_HEIGHT} />
      {gameOver && <GameResult won={gameWon} onPlayAgain={onPlayAgain} />}
    </div>
  );
};

export default SpacewarGame;
