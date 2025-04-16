
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
    setEndTime(null);
  }, [initialTime]);

  // Update running state when isActive changes
  useEffect(() => {
    setIsRunning(isActive);
    
    // When timer becomes active, set the end timestamp
    if (isActive && !endTime) {
      const now = Date.now();
      setEndTime(now + timeLeft * 1000);
    } else if (!isActive) {
      // When timer becomes inactive, save the remaining time
      if (endTime) {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        setEndTime(null);
      }
    }
  }, [isActive, endTime, timeLeft]);

  // Use requestAnimationFrame for accurate timing across tab switches
  useEffect(() => {
    if (!isRunning || !endTime) return;

    let frameId: number;

    const updateTimer = () => {
      const now = Date.now();
      const newTimeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      if (newTimeLeft !== timeLeft) {
        setTimeLeft(newTimeLeft);
      }
      
      if (newTimeLeft <= 0) {
        if (onTimeUp) {
          onTimeUp();
        }
        return;
      }
      
      frameId = requestAnimationFrame(updateTimer);
    };

    frameId = requestAnimationFrame(updateTimer);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isRunning, endTime, timeLeft, onTimeUp]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={`text-terminal-green ${timeLeft <= 30 ? 'animate-pulse text-red-500' : ''}`}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
