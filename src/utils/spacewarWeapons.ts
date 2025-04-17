
import { Ship, Projectile } from '../interfaces/SpacewarInterfaces';

// Create a projectile from the ship
export const createProjectile = (
  owner: 'player' | 'cpu',
  ship: Ship,
  projectileSpeed: number,
  projectileSize: number,
  isSpecial: boolean = false,
  specialColor: string = '#ffffff'
): Projectile => {
  // Calculate the exact position at the tip of the ship
  const shipTipX = ship.x + Math.cos(ship.rotation) * (ship.size + 2);
  const shipTipY = ship.y + Math.sin(ship.rotation) * (ship.size + 2);
  
  return {
    x: shipTipX,
    y: shipTipY,
    rotation: ship.rotation,
    velocity: {
      x: Math.cos(ship.rotation) * projectileSpeed,
      y: Math.sin(ship.rotation) * projectileSpeed
    },
    owner: owner,
    active: true,
    size: projectileSize,
    color: isSpecial ? specialColor : (owner === 'player' ? '#00ffff' : '#ff00ff'), // Cyan for player, magenta for CPU
    special: isSpecial
  };
};

// Update projectile position
export const updateProjectile = (projectile: Projectile): Projectile => {
  return {
    ...projectile,
    x: projectile.x + projectile.velocity.x,
    y: projectile.y + projectile.velocity.y
  };
};

// Check if projectile hits a ship
export const checkProjectileHit = (
  projectile: Projectile,
  ship: Ship
): boolean => {
  // Fixed: Don't compare the projectile with the ship object directly
  // Instead check if the projectile's owner is the same as the ship we're checking against
  if (projectile.owner === 'player' && ship.color === '#00ff00') return false;
  if (projectile.owner === 'cpu' && ship.color === '#ff0000') return false;
  
  const distance = Math.sqrt(
    Math.pow(projectile.x - ship.x, 2) + 
    Math.pow(projectile.y - ship.y, 2)
  );
  
  return distance < (ship.size + projectile.size);
};

// Check if projectile hits canvas border
export const checkProjectileBorder = (
  projectile: Projectile,
  canvasWidth: number,
  canvasHeight: number
): boolean => {
  return (
    projectile.x - projectile.size <= 0 ||
    projectile.x + projectile.size >= canvasWidth ||
    projectile.y - projectile.size <= 0 ||
    projectile.y + projectile.size >= canvasHeight
  );
};
