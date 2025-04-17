
import { Ship } from '../interfaces/SpacewarInterfaces';

// The scoring system manages score state and provides methods to update scores
export interface ScoreState {
  playerScore: number;
  cpuScore: number;
  winningScore: number;
  gameOver: boolean;
  playerWon: boolean;
}

// Initialize scoring system
export const createScoreState = (winningScore: number): ScoreState => ({
  playerScore: 0,
  cpuScore: 0,
  winningScore,
  gameOver: false,
  playerWon: false
});

// Increment player score and check for win
export const incrementPlayerScore = (state: ScoreState): ScoreState => {
  const newPlayerScore = state.playerScore + 1;
  console.log(`Player score increased to ${newPlayerScore}`);
  
  // Check if player won
  const playerWon = newPlayerScore >= state.winningScore;
  if (playerWon) {
    console.log("Player won the game!");
  }
  
  return {
    ...state,
    playerScore: newPlayerScore,
    gameOver: playerWon,
    playerWon: playerWon
  };
};

// Increment CPU score and check for win
export const incrementCpuScore = (state: ScoreState): ScoreState => {
  const newCpuScore = state.cpuScore + 1;
  console.log(`CPU score increased to ${newCpuScore}`);
  
  // Check if CPU won
  const cpuWon = newCpuScore >= state.winningScore;
  if (cpuWon) {
    console.log("CPU won the game!");
  }
  
  return {
    ...state,
    cpuScore: newCpuScore,
    gameOver: cpuWon,
    playerWon: false
  };
};

// Handle scoring when ship hits the sun
export const processSunCollisionScore = (
  ship: Ship, 
  isPlayer: boolean, 
  scoreState: ScoreState
): ScoreState => {
  if (isPlayer) {
    console.log("Player crashed into the sun! CPU +1 point");
    return incrementCpuScore(scoreState);
  } else {
    console.log("CPU crashed into the sun! Player +1 point");
    return incrementPlayerScore(scoreState);
  }
};

// Reset scores
export const resetScores = (winningScore: number): ScoreState => {
  console.log("Scores reset");
  return createScoreState(winningScore);
};
