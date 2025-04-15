
import React from 'react';
import { X, Circle } from 'lucide-react';
import { TicTacToeBoardProps } from '../interfaces/TicTacToeInterfaces';

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ 
  board, 
  isPlayerTurn, 
  gameStatus, 
  onCellClick 
}) => {
  const renderCell = (index: number) => {
    const cellValue = board[index];
    
    return (
      <div 
        key={index}
        className="flex items-center justify-center w-20 h-20 border-2 border-terminal-green cursor-pointer"
        onClick={() => onCellClick(index)}
      >
        {cellValue === 'O' && <Circle className="text-terminal-green" size={40} />}
        {cellValue === 'X' && <X className="text-terminal-green" size={40} />}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-1 w-64 h-64 bg-black p-2">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
    </div>
  );
};

export default TicTacToeBoard;
