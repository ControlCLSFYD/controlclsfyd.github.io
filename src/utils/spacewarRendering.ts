
import { Ship, Projectile } from '../interfaces/SpacewarInterfaces';

// Draw a ship on the canvas
export const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.rotation);
  
  // Draw ship body
  ctx.fillStyle = ship.color;
  ctx.beginPath();
  ctx.moveTo(ship.size, 0);
  ctx.lineTo(-ship.size / 2, -ship.size / 2);
  ctx.lineTo(-ship.size / 2, ship.size / 2);
  ctx.closePath();
  ctx.fill();
  
  // Draw thrust if active
  if (ship.thrust) {
    ctx.fillStyle = '#ff9900';
    ctx.beginPath();
    ctx.moveTo(-ship.size / 2, 0);
    ctx.lineTo(-ship.size - 5, -ship.size / 4);
    ctx.lineTo(-ship.size - 5, ship.size / 4);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.restore();
};

// Draw a projectile on the canvas
export const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: Projectile) => {
  ctx.save();
  ctx.fillStyle = projectile.color;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Draw the game scores
export const drawScores = (
  ctx: CanvasRenderingContext2D,
  playerScore: number,
  cpuScore: number,
  canvasWidth: number
) => {
  ctx.font = '20px monospace';
  ctx.fillStyle = '#00ff00';
  ctx.fillText(`Player: ${playerScore}`, 20, 30);
  ctx.fillStyle = '#ff0000';
  ctx.fillText(`CPU: ${cpuScore}`, canvasWidth - 120, 30);
};

// Draw the sun
export const drawSun = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
};

// Draw debug info
export const drawDebugInfo = (
  ctx: CanvasRenderingContext2D,
  isOrbiting: boolean,
  canvasWidth: number
) => {
  if (isOrbiting) {
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.fillText('CPU: Orbiting', canvasWidth - 120, 70);
  }
};
