
/**
 * Get timer duration in seconds based on level number
 */
export const getTimerDuration = (level: number): number => {
  switch(level) {
    case 1: return 7 * 60;      // 7 minutes in seconds
    case 2: return 5.5 * 60;    // 5:30 minutes in seconds
    case 3: return 4 * 60;      // 4 minutes in seconds
    case 4: return 3 * 60;      // 3 minutes in seconds
    case 5: return 1.5 * 60;    // 1:30 minutes in seconds
    default: return 7 * 60;     // Default to 7 minutes
  }
};
