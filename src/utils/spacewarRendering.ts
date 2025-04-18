import { Ship, Projectile } from '../interfaces/SpacewarInterfaces';

// Draw a ship on the canvas
export const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.rotation);
  
  // Draw hit animation if ship was recently hit
  if (ship.hitAnimationTime && Date.now() - ship.hitAnimationTime < 200) {
    // Draw white flash around ship
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, ship.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
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
  
  if (projectile.special) {
    // Draw special projectile with a glowing effect
    const gradient = ctx.createRadialGradient(
      projectile.x, projectile.y, 0,
      projectile.x, projectile.y, projectile.size * 1.5
    );
    gradient.addColorStop(0, projectile.color);
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw the core of the projectile
  ctx.fillStyle = projectile.color;
  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
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

// Remove debug info function since we don't need orbiting status anymore
