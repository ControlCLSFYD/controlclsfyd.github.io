
import { Ship, Torpedo } from '../interfaces/SpacewarInterfaces';

// Fire a special weapon torpedo
export const fireSpecialWeapon = (
  owner: 'player' | 'cpu', 
  ship: Ship, 
  specialTorpedoSpeed: number,
  specialTorpedoLifespan: number
): Torpedo => {
  return {
    x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
    y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
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
  return {
    x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
    y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
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
  return {
    x: ship.x + Math.cos(ship.rotation) * (ship.size + 5),
    y: ship.y + Math.sin(ship.rotation) * (ship.size + 5),
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
