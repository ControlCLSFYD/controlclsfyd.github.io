
import { Ship, Torpedo } from '../interfaces/SpacewarInterfaces';

// Normalize angle to range -PI to PI
export const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
};

// Check if torpedo hit a ship
export const checkTorpedoHit = (
  torpedo: Torpedo, 
  ship: Ship
): boolean => {
  const dx = torpedo.x - ship.x;
  const dy = torpedo.y - ship.y;
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

// Wrap position around screen edges
export const wrapPosition = (
  x: number,
  y: number,
  width: number, 
  height: number
): { x: number; y: number } => {
  let newX = x;
  let newY = y;
  
  if (newX > width) newX = 0;
  if (newX < 0) newX = width;
  if (newY > height) newY = 0;
  if (newY < 0) newY = height;
  
  return { x: newX, y: newY };
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
