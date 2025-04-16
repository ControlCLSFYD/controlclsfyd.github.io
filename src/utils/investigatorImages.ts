
// Different Investi Gator images for different contexts

// Always use this for the small head icon in buttons
export const INVESTI_HEAD_ICON = "/lovable-uploads/f4308e48-123d-4416-9df6-ac0dc4b0342c.png";

// Full body images for different contexts
export const INVESTI_ACCESS_SCREEN = "/lovable-uploads/d4616731-1523-4cf3-b157-662ea661a638.png"; // "Investi says hi"
export const INVESTI_LEVEL_CONGRATS = "/lovable-uploads/dfed344c-7542-4526-b6a3-89cf9d5962c6.png"; // "Investi says Yay!"
export const INVESTI_REGULAR_LEVELS = "/lovable-uploads/4dbbe66a-92f4-455d-a236-81cba5c96fd4.png"; // "Investi is cool"
export const INVESTI_LEVEL_FIVE = "/lovable-uploads/ce2114cd-ef6a-4aec-8581-3884d26109d4.png"; // "Investi says GOGOGOGOGOGO"

// Get the appropriate Investi image based on level
export const getInvestiImageForLevel = (level: number): string => {
  if (level === 5) {
    return INVESTI_LEVEL_FIVE;
  }
  
  return INVESTI_REGULAR_LEVELS;
};
