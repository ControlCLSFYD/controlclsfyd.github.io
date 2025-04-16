
import { Ship, Torpedo } from '../interfaces/SpacewarInterfaces';

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
  
  // Draw special weapon firing effect
  if (ship.firingSpecial) {
    ctx.fillStyle = '#00aaff';
    ctx.beginPath();
    ctx.arc(ship.size + 10, 0, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw standard weapon firing effect
  if (ship.firingStandard) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ship.size + 8, 0, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  
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

// Draw a torpedo on the canvas
export const drawTorpedo = (ctx: CanvasRenderingContext2D, torpedo: Torpedo) => {
  if (!torpedo.alive) return;
  
  let torpedoColor = torpedo.owner === 'player' ? '#00ff00' : '#ff0000'; // Regular torpedoes
  let torpedoSize = 3;
  
  if (torpedo.isSpecial) {
    torpedoColor = '#00aaff'; // Special blue torpedo
    torpedoSize = 5;
  } else if (torpedo.isStandard) {
    torpedoColor = torpedo.owner === 'player' ? '#ffffff' : '#ffcccc'; // Standard white/light red torpedo
    torpedoSize = 2; // Smaller size for standard weapons
  }
  
  ctx.fillStyle = torpedoColor;
  ctx.beginPath();
  ctx.arc(torpedo.x, torpedo.y, torpedoSize, 0, Math.PI * 2);
  ctx.fill();
};

// Draw a charge indicator on the canvas
export const drawChargeIndicator = (
  ctx: CanvasRenderingContext2D, 
  charge: number, 
  x: number, 
  y: number, 
  color: string, 
  label: string
) => {
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, 100, 10);
  
  ctx.fillStyle = color;
  ctx.fillRect(x, y, charge, 10);
  
  if (charge >= 100) {
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText('READY', x + 35, y + 8);
  } else {
    ctx.fillStyle = '#999';
    ctx.font = '8px monospace';
    ctx.fillText(label, x + 5, y + 8);
  }
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
