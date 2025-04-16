
export interface GameResultProps {
  gameWon: boolean;
  onContinue: () => void;
  onPlayAgain: () => void;
  alwaysShowContinue?: boolean;
}
