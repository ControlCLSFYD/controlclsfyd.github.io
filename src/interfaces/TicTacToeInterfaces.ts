
export type Player = 'X' | 'O' | null;
export type BoardState = Player[];
export type GameStatus = 'playing' | 'won' | 'lost' | 'draw';

export interface TicTacToeGameProps {
  onGameComplete: () => void;
  onPlayAgain: () => void;
  difficulty?: number;
}

export interface TicTacToeBoardProps {
  board: BoardState;
  isPlayerTurn: boolean;
  gameStatus: GameStatus;
  onCellClick: (index: number) => void;
}
