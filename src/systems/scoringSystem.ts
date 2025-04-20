
import { Ship } from '../interfaces/SpacewarInterfaces';

export interface ScoreState {
  playerHits: number;
  cpuScore: number;
  requiredHits: number;
  gameOver: boolean;
  playerWon: boolean;
  timerActive: boolean;
}

// Initialize scoring system
export const createScoreState = (): ScoreState => ({
  playerHits: 0,
  cpuScore: 0,
  requiredHits: 5,
  gameOver: false,
  playerWon: false,
  timerActive: false
});

// Increment player hits and check for win
export const incrementPlayerHits = (state: ScoreState): ScoreState => {
  const newPlayerHits = state.playerHits + 1;
  console.log(`Player hits increased to ${newPlayerHits}`);
  
  // Check if player won (5 hits achieved)
  const playerWon = newPlayerHits >= state.requiredHits;
  if (playerWon) {
    console.log("Player won the game!");
  }
  
  return {
    ...state,
    playerHits: newPlayerHits,
    gameOver: playerWon,
    playerWon: playerWon,
  };
};

// Reset game state when player dies
export const handlePlayerDeath = (state: ScoreState): ScoreState => {
  console.log("Player died - resetting hits");
  return {
    ...state,
    playerHits: 0,
    gameOver: true,
    playerWon: false,
    timerActive: false
  };
};

// Reset scores
export const resetScores = (): ScoreState => {
  console.log("Scores reset");
  return createScoreState();
};

