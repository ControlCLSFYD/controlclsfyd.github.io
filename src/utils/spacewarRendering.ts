
import { Ship, Beam } from '../interfaces/SpacewarInterfaces';

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
  
  // Draw beam emitter at the front of the ship if beam is active
  if (ship.beamActive) {
    ctx.fillStyle = '#00aaff';
    ctx.beginPath();
    ctx.arc(ship.size, 0, 2, 0, Math.PI * 2);
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

// Draw a beam on the canvas
export const drawBeam = (ctx: CanvasRenderingContext2D, beam: Beam) => {
  if (!beam.active) return;
  
  const beamColor = beam.owner === 'player' ? '#00aaff' : '#ff00aa';
  
  // Draw intermittent beam with alpha based on intensity
  ctx.save();
  ctx.strokeStyle = beamColor;
  ctx.globalAlpha = beam.intensity * 0.7;
  ctx.lineWidth = 1;
  
  // Draw dashed beam line
  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  ctx.moveTo(beam.startX, beam.startY);
  ctx.lineTo(beam.endX, beam.endY);
  ctx.stroke();
  
  // Draw beam tip (small glow)
  const glowSize = 3 + beam.intensity * 2;
  ctx.globalAlpha = beam.intensity * 0.5;
  ctx.beginPath();
  ctx.arc(beam.endX, beam.endY, glowSize, 0, Math.PI * 2);
  ctx.fillStyle = beamColor;
  ctx.fill();
  
  ctx.restore();
  
  // Draw projectile if active
  if (beam.projectileActive) {
    ctx.fillStyle = beam.owner === 'player' ? '#00ffff' : '#ff66ff';
    ctx.beginPath();
    ctx.arc(beam.projectileX, beam.projectileY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw projectile trail
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = beam.owner === 'player' ? '#00ffff' : '#ff66ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    const trailLength = 10;
    const trailEndX = beam.projectileX - Math.cos(beam.rotation) * trailLength;
    const trailEndY = beam.projectileY - Math.sin(beam.rotation) * trailLength;
    
    ctx.moveTo(beam.projectileX, beam.projectileY);
    ctx.lineTo(trailEndX, trailEndY);
    ctx.stroke();
    ctx.restore();
  }
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
