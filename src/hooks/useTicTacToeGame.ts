
import { useState, useEffect, useCallback } from 'react';
import { BoardState, GameStatus, Player } from '../interfaces/TicTacToeInterfaces';
import { checkWinner, getBestMove } from '../utils/ticTacToeLogic';

export const useTicTacToeGame = (
  onGameComplete: () => void,
  onPlayAgain: () => void,
  difficulty = 1
) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false); // CPU starts first by default
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [showInstructions, setShowInstructions] = useState(true);
  const [cpuWins, setCpuWins] = useState<number>(0);
  const [playerFirstMove, setPlayerFirstMove] = useState<boolean>(false);
  
  // Function to make CPU move
  const makeCpuMove = useCallback((currentBoard: BoardState) => {
    const computerMoveIndex = getBestMove(currentBoard, 'X');
    const newBoard = [...currentBoard];
    newBoard[computerMoveIndex] = 'X';
    setBoard(newBoard);
    
    if (checkWinner(newBoard, 'X')) {
      setGameStatus('lost');
    } else if (!newBoard.includes(null)) {
      setGameStatus('draw');
    } else {
      setIsPlayerTurn(true);
    }
  }, []);
  
  const resetGame = useCallback(() => {
    const initialBoard = Array(9).fill(null);
    setBoard(initialBoard);
    setGameStatus('playing');
    setIsPlayerTurn(playerFirstMove); // Use playerFirstMove to determine who goes first
  }, [playerFirstMove]);
  
  // Handle CPU's first move
  useEffect(() => {
    if (gameStatus === 'playing' && !isPlayerTurn && !showInstructions) {
      const timer = setTimeout(() => {
        makeCpuMove([...board]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn, gameStatus, makeCpuMove, showInstructions]);
  
  // Initial setup and instructions
  useEffect(() => {
    setShowInstructions(true);
    
    const timer = setTimeout(() => {
      setShowInstructions(false);
      resetGame();
      
      // If CPU goes first, make its move shortly after instructions disappear
      if (!playerFirstMove) {
        const cpuMoveTimer = setTimeout(() => {
          makeCpuMove(Array(9).fill(null));
        }, 500);
        
        return () => clearTimeout(cpuMoveTimer);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [difficulty, resetGame, playerFirstMove, makeCpuMove]);

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;
    
    const newBoard = [...board];
    newBoard[index] = 'O';
    setBoard(newBoard);
    
    if (checkWinner(newBoard, 'O')) {
      setGameStatus('won');
      return;
    }
    
    if (!newBoard.includes(null)) {
      setGameStatus('draw');
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => {
      makeCpuMove(newBoard);
    }, 500);
  };

  const handleContinue = () => {
    onGameComplete();
  };
  
  const handlePlayAgain = () => {
    if (gameStatus === 'lost') {
      // If player lost, increment CPU win counter
      const newCpuWins = cpuWins + 1;
      setCpuWins(newCpuWins);
      
      // After 2 CPU wins, let player go first
      if (newCpuWins >= 2 && !playerFirstMove) {
        setPlayerFirstMove(true);
      }
    }
    
    onPlayAgain();
    resetGame();
  };

  return {
    board,
    isPlayerTurn,
    gameStatus,
    showInstructions,
    cpuWins,
    playerFirstMove,
    handleCellClick,
    handleContinue,
    handlePlayAgain
  };
};
