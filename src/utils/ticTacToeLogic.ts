
import { BoardState, Player } from '../interfaces/TicTacToeInterfaces';

export const checkWinner = (board: BoardState, player: Player): boolean => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];
  
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
};

// Advanced minimax algorithm for optimal CPU moves
export const minimax = (
  board: BoardState, 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number = -Infinity, 
  beta: number = Infinity
): number => {
  // Check terminal states
  if (checkWinner(board, 'X')) return 10 - depth;
  if (checkWinner(board, 'O')) return depth - 10;
  if (!board.includes(null)) return 0;
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        const score = minimax(newBoard, depth + 1, false, alpha, beta);
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        const score = minimax(newBoard, depth + 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return bestScore;
  }
};

export const getBestMove = (board: BoardState, player: Player): number => {
  // Always play perfectly regardless of difficulty
  let bestScore = -Infinity;
  let bestMove = 0;
  
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = player;
      const score = minimax(newBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
};
