
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && onTimeUp) {
      onTimeUp();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeLeft, isRunning, onTimeUp]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="text-terminal-green">
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
