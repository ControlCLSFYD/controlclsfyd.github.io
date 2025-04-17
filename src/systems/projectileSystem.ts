
import { Ship, Projectile, GameConstants } from '../interfaces/SpacewarInterfaces';

// Create a projectile from the ship
export const createProjectile = (
  owner: 'player' | 'cpu',
  ship: Ship,
  projectileSpeed: number,
  projectileSize: number,
  isSpecial: boolean = false,
  specialColor: string = '#ffffff'
): Projectile => {
  console.log(`${owner} fired a projectile`);
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

// Process and update all projectiles in one pass
export const processProjectiles = (
  projectiles: Projectile[],
  player: Ship,
  cpu: Ship,
  constants: GameConstants,
  updatePlayerScore: (increment: number) => void,
  updateCpuScore: (increment: number) => void
): Projectile[] => {
  return projectiles.map(p => updateProjectile(p)).filter(p => {
    // Check if projectile hits enemy ship
    if (p.owner === 'player' && checkProjectileHit(p, cpu)) {
      console.log("Player projectile hit CPU +1 point for player");
      updatePlayerScore(1);
      return false; // Remove this projectile
    }
    
    if (p.owner === 'cpu' && checkProjectileHit(p, player)) {
      console.log("CPU projectile hit player +1 point for CPU");
      updateCpuScore(1);
      return false; // Remove this projectile
    }
    
    // Check if projectile hits sun
    if (checkProjectileSunHit(p, constants.CANVAS_WIDTH / 2, constants.CANVAS_HEIGHT / 2, constants.SUN_RADIUS)) {
      console.log(`Projectile hit sun`);
      return false; // Remove this projectile
    }
    
    // Check if projectile hits border
    if (checkProjectileBorder(p, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT)) {
      return false; // Remove this projectile
    }
    
    return true; // Keep this projectile
  });
};

// Check if projectile hits a ship
export const checkProjectileHit = (
  projectile: Projectile,
  ship: Ship
): boolean => {
  // Don't let ships hit themselves with their own projectiles
  if (projectile.owner === 'player' && ship.color === '#00ff00') return false;
  if (projectile.owner === 'cpu' && ship.color === '#ff0000') return false;
  
  const distance = Math.sqrt(
    Math.pow(projectile.x - ship.x, 2) + 
    Math.pow(projectile.y - ship.y, 2)
  );
  
  return distance < (ship.size + projectile.size);
};

// Check if projectile hits the sun
export const checkProjectileSunHit = (
  projectile: Projectile,
  sunX: number,
  sunY: number,
  sunRadius: number
): boolean => {
  const distance = Math.sqrt(
    Math.pow(projectile.x - sunX, 2) + 
    Math.pow(projectile.y - sunY, 2)
  );
  
  return distance < (sunRadius + projectile.size);
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

// Autofire projectile manager
export interface AutofireManager {
  lastPlayerFireTime: number;
  lastCpuFireTime: number;
  canPlayerFire: boolean;
  canCpuFire: boolean;
  playerSpecialCooldown: number;
  cpuSpecialCooldown: number;
}

// Create initial autofire manager state
export const createAutofireManager = (): AutofireManager => ({
  lastPlayerFireTime: 0,
  lastCpuFireTime: 0,
  canPlayerFire: true,
  canCpuFire: true,
  playerSpecialCooldown: 0,
  cpuSpecialCooldown: 0
});

// Manage auto firing with timestamps
export const manageAutofire = (
  timestamp: number, 
  manager: AutofireManager, 
  fireInterval: number,
  specialCooldown: number
): AutofireManager => {
  const updated = { ...manager };
  
  // Check if player can fire
  if (timestamp - updated.lastPlayerFireTime >= fireInterval) {
    updated.canPlayerFire = true;
    updated.lastPlayerFireTime = timestamp;
  } else {
    updated.canPlayerFire = false;
  }
  
  // Check if CPU can fire
  if (timestamp - updated.lastCpuFireTime >= fireInterval) {
    updated.canCpuFire = true;
    updated.lastCpuFireTime = timestamp;
  } else {
    updated.canCpuFire = false;
  }
  
  // Manage special cooldowns
  if (updated.playerSpecialCooldown > 0) {
    if (timestamp - updated.playerSpecialCooldown >= specialCooldown) {
      updated.playerSpecialCooldown = 0; // Reset cooldown
    }
  }
  
  if (updated.cpuSpecialCooldown > 0) {
    if (timestamp - updated.cpuSpecialCooldown >= specialCooldown) {
      updated.cpuSpecialCooldown = 0; // Reset cooldown
    }
  }
  
  return updated;
};
