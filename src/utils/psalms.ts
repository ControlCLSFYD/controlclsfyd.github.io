
// Array of psalms to randomly display on the access code screen
export const psalms = [
  "The fool hath said in his heart, There\nis no God.",
  
  "Why are you fearful, Oh ye of little faith?",
  
  "And why do you worry? Consider how the lilies of the field grow: They do not labor or spin. Yet I tell you that not even Solomon in all his glory was adorned like one of these.\n\nIf that is how God clothes the grass of the field, which is here today and tomorrow is thrown into the furnace, will He not much more will he do for you, O you of little faith?",
  
  "Jesus spoke unto them, saying; be not afraid. And Peter answered him and said, Lord, if it be thou, bid me come unto thee on the water.\n\nAnd Jesus said, Come. And when Peter came down out of the ship, he walked on the water to go to Jesus. But when he saw the wind boisterous, he was afraid; and beginning to sink, he cried, saying, Lord, save me. And immediately Jesus stretched forth his hand, and caught him, and said unto him, \"O yet of little faith.\""
];

/**
 * Returns a random psalm from the array
 */
export const getRandomPsalm = (): string => {
  const randomIndex = Math.floor(Math.random() * psalms.length);
  return psalms[randomIndex];
};
