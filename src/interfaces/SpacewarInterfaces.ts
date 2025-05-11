
// This interface file is needed for the space war game components
// which depend on these types. Currently the game isn't actively used,
// but we need this file to fix build errors.

export interface SpacewarGameState {
  // Game state placeholder
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
}

export interface SpacewarShip {
  // Ship properties placeholder
  id: number;
  x: number;
  y: number;
}

export interface SpacewarProjectile {
  // Projectile properties placeholder
  id: number;
  x: number;
  y: number;
}

export interface SpacewarGameControls {
  // Controls placeholder
  left: boolean;
  right: boolean;
  fire: boolean;
}
