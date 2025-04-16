
import { Level } from '../interfaces/GameDataInterfaces';

// Level 1 data
export const levelOneData: Level = {
  id: 1,
  hasLesson: true,
  imageSrc: [
    "/lovable-uploads/1fb6b7bb-34d5-486c-aff9-51bb886b406b.png", // Image for WGA question (aircraft)
    "/lovable-uploads/de09e4b3-9288-41b0-9e3c-8a5b141c6121.png", // Kenneth Arnold question
    "/lovable-uploads/ac576421-6c21-48d3-aff9-268fe77c8de9.png", // Benito Mussolini question
    "/lovable-uploads/8ba06cfd-2e37-4b70-81cc-4ea5011b4c01.png"  // "Lucky" Luciano question (new)
  ],
  questions: [
    [
      {
        id: "A",
        text: "What are the initials of the company that was the owner of this aircraft?",
        answer: "WGA"
      }
    ],
    [
      {
        id: "A",
        text: "What is the name of this man?",
        answer: "KENNETH ARNOLD"
      }
    ],
    [
      {
        id: "A",
        text: "What is the name of the man in this image?",
        answer: "BENITO MUSSOLINI"
      }
    ],
    [
      {
        id: "A",
        text: "What was this man's nickname?",
        answer: "LUCKY"
      }
    ]
  ],
  currentQuestionSet: 0
};
