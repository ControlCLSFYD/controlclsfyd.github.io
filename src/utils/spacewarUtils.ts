
import { Ship, Beam } from '../interfaces/SpacewarInterfaces';

// Normalize angle to range -PI to PI
export const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
};

// Check if beam projectile hit a ship
export const checkBeamHit = (
  beam: Beam, 
  ship: Ship
): boolean => {
  if (!beam.projectileActive) return false;
  
  const dx = beam.projectileX - ship.x;
  const dy = beam.projectileY - ship.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ship.size;
};

// Apply sun gravity to an object
export const applySunGravity = (
  objectX: number,
  objectY: number,
  centerX: number,
  centerY: number,
  gravityStrength: number,
  sunRadius: number,
  velocityX: number,
  velocityY: number
): { x: number; y: number; hitSun: boolean } => {
  const objectToSun = {
    x: centerX - objectX,
    y: centerY - objectY
  };
  const distanceToSun = Math.sqrt(objectToSun.x * objectToSun.x + objectToSun.y * objectToSun.y);
  
  // Check if object hit the sun
  if (distanceToSun <= sunRadius) {
    return { x: velocityX, y: velocityY, hitSun: true };
  }
  
  // Apply gravity
  const gravityFactor = gravityStrength / (distanceToSun * 0.1);
  const newVelocityX = velocityX + (objectToSun.x / distanceToSun) * gravityFactor;
  const newVelocityY = velocityY + (objectToSun.y / distanceToSun) * gravityFactor;
  
  return { x: newVelocityX, y: newVelocityY, hitSun: false };
};

// Handle solid border collisions
export const handleBorderCollision = (
  x: number,
  y: number,
  velocity: { x: number; y: number },
  size: number,
  width: number,
  height: number,
  dampening: number
): { position: { x: number; y: number }, velocity: { x: number; y: number }, collision: boolean } => {
  let newX = x;
  let newY = y;
  let newVelocityX = velocity.x;
  let newVelocityY = velocity.y;
  let collision = false;
  
  // Check for collisions with boundaries
  if (newX - size < 0) {
    newX = size; // Set position at boundary
    newVelocityX = Math.abs(newVelocityX) * dampening; // Reverse and reduce velocity
    collision = true;
  } else if (newX + size > width) {
    newX = width - size; // Set position at boundary
    newVelocityX = -Math.abs(newVelocityX) * dampening; // Reverse and reduce velocity
    collision = true;
  }
  
  if (newY - size < 0) {
    newY = size; // Set position at boundary
    newVelocityY = Math.abs(newVelocityY) * dampening; // Reverse and reduce velocity
    collision = true;
  } else if (newY + size > height) {
    newY = height - size; // Set position at boundary
    newVelocityY = -Math.abs(newVelocityY) * dampening; // Reverse and reduce velocity
    collision = true;
  }
  
  return {
    position: { x: newX, y: newY },
    velocity: { x: newVelocityX, y: newVelocityY },
    collision
  };
};

// Apply friction to velocity
export const applyFriction = (
  velocity: { x: number; y: number },
  friction: number
): { x: number; y: number } => {
  return {
    x: velocity.x * friction,
    y: velocity.y * friction
  };
};

// Handle sun collision with respawn
export const handleSunCollision = (
  x: number,
  y: number,
  centerX: number,
  centerY: number,
): { x: number; y: number; velocity: { x: number; y: number } } => {
  const objToSun = {
    x: centerX - x,
    y: centerY - y
  };
  
  const respawnDistance = 100;
  const respawnAngle = Math.atan2(objToSun.y, objToSun.x) + Math.PI;
  
  return {
    x: centerX + Math.cos(respawnAngle) * respawnDistance,
    y: centerY + Math.sin(respawnAngle) * respawnDistance,
    velocity: { x: 0, y: 0 }
  };
};
