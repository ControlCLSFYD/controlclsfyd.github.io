
export interface BaseGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
  score: number;
}

export interface GameControlHandlers {
  handleContinue: () => void;
  handlePlayAgain: () => void;
}
