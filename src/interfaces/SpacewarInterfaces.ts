
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
  specialWeaponCharge: number;
  standardWeaponCharge: number;
  firingSpecial: boolean;
  firingStandard: boolean;
  rapidFireCount: number;
}

export interface Torpedo {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  alive: boolean;
  owner: 'player' | 'cpu';
  lifespan: number;
  isSpecial?: boolean;
  isStandard?: boolean;
}

export interface GameConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  SUN_RADIUS: number;
  GRAVITY_STRENGTH: number;
  ROTATION_SPEED: number;
  THRUST_POWER: number;
  TORPEDO_SPEED: number;
  STANDARD_TORPEDO_SPEED: number;
  SPECIAL_TORPEDO_SPEED: number;
  TORPEDO_LIFESPAN: number;
  STANDARD_TORPEDO_LIFESPAN: number;
  SPECIAL_TORPEDO_LIFESPAN: number;
  PLAYER_FIRE_RATE: number;
  CPU_FIRE_RATE: number;
  STANDARD_WEAPON_FIRE_RATE: number;
  STANDARD_WEAPON_COOLDOWN: number;
  SPECIAL_WEAPON_COOLDOWN: number;
  WINNING_SCORE: number;
  RAPID_FIRE_COUNT: number;
  DIFFICULTY_MODIFIER: number;
  FRICTION: number;
  BOUNCE_DAMPENING: number;
}
