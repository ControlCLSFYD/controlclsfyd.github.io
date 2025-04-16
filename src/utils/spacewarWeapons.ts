import { Ship, Beam } from '../interfaces/SpacewarInterfaces';

// Create a beam from the ship
export const createBeam = (
  owner: 'player' | 'cpu',
  ship: Ship
): Beam => {
  // Calculate the exact position at the tip of the ship
  const shipTipX = ship.x + Math.cos(ship.rotation) * (ship.size + 2);
  const shipTipY = ship.y + Math.sin(ship.rotation) * (ship.size + 2);
  
  // Calculate the end point of the beam
  const endX = ship.x + Math.cos(ship.rotation) * ship.beamLength;
  const endY = ship.y + Math.sin(ship.rotation) * ship.beamLength;
  
  return {
    startX: shipTipX,
    startY: shipTipY,
    endX: endX,
    endY: endY,
    rotation: ship.rotation,
    owner: owner,
    active: true,
    intensity: 1.0, // Full intensity to start
    projectileActive: false, // No projectile yet
    projectileX: 0,
    projectileY: 0,
    projectileVelocity: { x: 0, y: 0 },
    projectileLifespan: 0
  };
};

// Fire a projectile from the beam
export const fireBeamProjectile = (
  beam: Beam,
  projectileSpeed: number,
  projectileLifespan: number
): Beam => {
  const updatedBeam = { ...beam };
  
  updatedBeam.projectileActive = true;
  updatedBeam.projectileX = beam.endX;
  updatedBeam.projectileY = beam.endY;
  updatedBeam.projectileVelocity = {
    x: Math.cos(beam.rotation) * projectileSpeed,
    y: Math.sin(beam.rotation) * projectileSpeed
  };
  updatedBeam.projectileLifespan = projectileLifespan;
  
  return updatedBeam;
};
