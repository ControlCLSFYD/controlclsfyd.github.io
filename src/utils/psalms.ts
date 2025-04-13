
// Array of psalms to randomly display on the access code screen
export const psalms = [
  "The fool hath said in his heart, There\nis no God.",
  "Why are you fearful, Oh ye of little faith?"
];

// Psalm to display on the end screen
export const endScreenPsalm = 
  "Jesus spoke unto them, saying; be not afraid.\n\nAnd when Peter came down out of the ship, he walked on the water to go to Jesus. But when he saw the wind boisterous, he was afraid. And immediately Jesus stretched forth his hand, and caught him, and said unto him, \"O yet of little faith.\"";

/**
 * Returns a random psalm from the array
 */
export const getRandomPsalm = (): string => {
  const randomIndex = Math.floor(Math.random() * psalms.length);
  return psalms[randomIndex];
};
