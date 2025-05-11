
// This interface file is needed for the space war game components
// which depend on these types. Currently the game isn't actively used,
// but we need this file to fix build errors.

export interface SpacewarGameState {
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
}

export interface Ship {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  color: string;
  thrust: boolean;
  velocity: {
    x: number;
    y: number;
  };
  rotateLeft: boolean;
  rotateRight: boolean;
  hitAnimationTime?: number;
}

export interface Projectile {
  id?: number;
  x: number;
  y: number;
  rotation: number;
  velocity: {
    x: number;
    y: number;
  };
  owner: 'player' | 'cpu';
  active: boolean;
  size: number;
  color: string;
  special: boolean;
}

export interface GameConstants {
  shipSpeed: number;
  projectileSpeed: number;
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  SUN_RADIUS: number;
}

export interface SpacewarShip {
  id: number;
  x: number;
  y: number;
}

export interface SpacewarProjectile {
  id: number;
  x: number;
  y: number;
}

export interface SpacewarGameControls {
  left: boolean;
  right: boolean;
  fire: boolean;
}
