
import { GameState } from '../../interfaces/GameInterfaces';

export interface UseSpacewarGameProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  difficulty?: number;
  onGameComplete?: () => void;
  isPageVisible?: boolean;
}

export interface UseSpacewarGameReturn {
  gameState: GameState;
  userScore: number;
  computerScore: number;
  showInstructions: boolean;
  canvasWidth: number;
  canvasHeight: number;
  WINNING_SCORE: number;
  handleLeftButton: () => void;
  handleRightButton: () => void;
  handleButtonUp: () => void;
  handleContinue: () => void;
  resetGame: () => void;
}

export interface GameStateRef {
  player: {
    x: number;
    y: number;
    movingLeft: boolean;
    movingRight: boolean;
    speed: number;
    shootCooldown: number;
  };
  enemy: {
    x: number;
    y: number;
    speed: number;
    direction: number;
    shootCooldown: number;
  };
  playerBullets: Array<{ x: number; y: number; active: boolean }>;
  enemyBullets: Array<{ x: number; y: number; active: boolean }>;
  stars: Array<{ x: number; y: number; size: number; brightness: number }>;
  asteroids: Array<{ x: number; y: number; dx: number; dy: number }>;
  shipSize: number;
  bulletSize: number;
  bulletSpeed: number;
  asteroidSize: number;
  userScore: number;
  computerScore: number;
  scoreChanged: boolean;
  lastEnemyMoveTime: number;
  enemyMoveDelay: number;
  lastEnemyShootTime: number;
  enemyShootDelay: number;
  canvasWidth: number;
  canvasHeight: number;
}
