
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
}

export interface GameConstants {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  SUN_RADIUS: number;
  GRAVITY_STRENGTH: number;
  ROTATION_SPEED: number;
  THRUST_POWER: number;
  WINNING_SCORE: number;
  DIFFICULTY_MODIFIER: number;
  FRICTION: number;
  BOUNCE_DAMPENING: number;
}
