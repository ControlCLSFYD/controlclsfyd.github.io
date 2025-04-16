
import { useCallback, RefObject } from 'react';

interface UseGameControlsProps {
  keysPressed: React.MutableRefObject<{[key: string]: boolean}>;
}

export const useGameControls = ({ keysPressed }: UseGameControlsProps) => {
  const handleLeftButton = useCallback(() => {
    keysPressed.current.ArrowLeft = true;
    keysPressed.current.ArrowRight = false;
  }, [keysPressed]);
  
  const handleRightButton = useCallback(() => {
    keysPressed.current.ArrowRight = true;
    keysPressed.current.ArrowLeft = false;
  }, [keysPressed]);
  
  const handleButtonUp = useCallback(() => {
    keysPressed.current.ArrowLeft = false;
    keysPressed.current.ArrowRight = false;
  }, [keysPressed]);

  return {
    handleLeftButton,
    handleRightButton,
    handleButtonUp,
  };
};
