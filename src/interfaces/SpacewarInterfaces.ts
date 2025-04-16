
export interface Ship {
  x: number;
  y: number;
  rotation: number;
  velocity: { x: number; y: number };
  thrust: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  score: number;
  size: number;
  color: string;
  beamActive: boolean;
  beamCooldown: number;
  beamLength: number;
}

export interface Beam {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  owner: 'player' | 'cpu';
  active: boolean;
  intensity: number;
  projectileActive: boolean;
  projectileX: number;
  projectileY: number;
  projectileVelocity: { x: number; y: number };
  projectileLifespan: number;
}

export interface GameConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  SUN_RADIUS: number;
  GRAVITY_STRENGTH: number;
  ROTATION_SPEED: number;
  THRUST_POWER: number;
  BEAM_LENGTH: number;
  BEAM_COOLDOWN: number;
  BEAM_DURATION: number;
  BEAM_PROJECTILE_SPEED: number;
  BEAM_PROJECTILE_LIFESPAN: number;
  WINNING_SCORE: number;
  DIFFICULTY_MODIFIER: number;
  FRICTION: number;
  BOUNCE_DAMPENING: number;
}
