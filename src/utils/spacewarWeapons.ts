
import { Ship, Torpedo } from '../interfaces/SpacewarInterfaces';

// Fire a special weapon torpedo
export const fireSpecialWeapon = (
  owner: 'player' | 'cpu', 
  ship: Ship, 
  specialTorpedoSpeed: number,
  specialTorpedoLifespan: number
): Torpedo => {
  // Calculate the exact position at the tip of the ship
  const shipTipX = ship.x + Math.cos(ship.rotation) * (ship.size + 2);
  const shipTipY = ship.y + Math.sin(ship.rotation) * (ship.size + 2);
  
  return {
    x: shipTipX,
    y: shipTipY,
    velocity: {
      x: ship.velocity.x + Math.cos(ship.rotation) * specialTorpedoSpeed,
      y: ship.velocity.y + Math.sin(ship.rotation) * specialTorpedoSpeed
    },
    alive: true,
    owner: owner,
    lifespan: specialTorpedoLifespan,
    isSpecial: true
  };
};

// Fire a standard weapon torpedo
export const fireStandardWeapon = (
  owner: 'player' | 'cpu', 
  ship: Ship,
  standardTorpedoSpeed: number,
  standardTorpedoLifespan: number
): Torpedo => {
  // Calculate the exact position at the tip of the ship
  const shipTipX = ship.x + Math.cos(ship.rotation) * (ship.size + 2);
  const shipTipY = ship.y + Math.sin(ship.rotation) * (ship.size + 2);
  
  return {
    x: shipTipX,
    y: shipTipY,
    velocity: {
      x: ship.velocity.x + Math.cos(ship.rotation) * standardTorpedoSpeed,
      y: ship.velocity.y + Math.sin(ship.rotation) * standardTorpedoSpeed
    },
    alive: true,
    owner: owner,
    lifespan: standardTorpedoLifespan,
    isStandard: true
  };
};

// Fire a regular torpedo
export const fireTorpedo = (
  owner: 'player' | 'cpu', 
  ship: Ship,
  torpedoSpeed: number,
  torpedoLifespan: number
): Torpedo => {
  // Calculate the exact position at the tip of the ship
  const shipTipX = ship.x + Math.cos(ship.rotation) * (ship.size + 2);
  const shipTipY = ship.y + Math.sin(ship.rotation) * (ship.size + 2);
  
  return {
    x: shipTipX,
    y: shipTipY,
    velocity: {
      x: ship.velocity.x + Math.cos(ship.rotation) * torpedoSpeed,
      y: ship.velocity.y + Math.sin(ship.rotation) * torpedoSpeed
    },
    alive: true,
    owner: owner,
    lifespan: torpedoLifespan,
    isSpecial: false,
    isStandard: false
  };
};
