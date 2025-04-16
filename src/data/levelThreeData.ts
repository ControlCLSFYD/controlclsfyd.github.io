
import { Level } from '../interfaces/GameDataInterfaces';

// Level 3 data
export const levelThreeData: Level = {
  id: 3,
  hasLesson: true,
  imageSrc: [
    "/lovable-uploads/2d21d6a5-c93e-411b-a503-f0d65c58db81.png", // Level 3 Revolving 1 (men with pistols)
    "/lovable-uploads/a1c6d5da-783c-46a6-bf5c-2675953ea3bc.png", // Level 3 Revolving 2 (hanging scene)
    "/lovable-uploads/a1c6d5da-783c-46a6-bf5c-2675953ea3bc.png"  // Level 3 Revolving 3 (same image as 2)
  ],
  questions: [
    [
      {
        id: "A",
        text: "What brand of pistol were these men found with?",
        answer: "GLOCK"
      }
    ],
    [
      {
        id: "A",
        text: "What colour was the rope?",
        answer: "ORANGE"
      }
    ],
    [
      {
        id: "A",
        text: "What infamous company of investigators did this man's family hire to look into his death?",
        answer: "KROLL"
      }
    ]
  ],
  currentQuestionSet: 0
};
