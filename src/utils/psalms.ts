
// Array of psalms to randomly display on the access code screen
export const psalms = [
  "The fool hath said in his heart, There\nis no God.",
  "Why are you fearful, Oh ye of little faith?"
];

// Empty string for end screen psalm (removed as requested)
export const endScreenPsalm = "";

/**
 * Returns a random psalm from the array
 */
export const getRandomPsalm = (): string => {
  const randomIndex = Math.floor(Math.random() * psalms.length);
  return psalms[randomIndex];
};
