
import { Level } from '../interfaces/GameDataInterfaces';

// Level 2 data
export const levelTwoData: Level = {
  id: 2,
  hasLesson: true,
  imageSrc: [
    "/lovable-uploads/bd22cfea-71dc-4646-adf7-5ef6a9073db5.png", // Original image
    "/lovable-uploads/b792dd1e-eeca-4d12-bd4e-4109f3221af6.png", // Beirut complex (new)
    "/lovable-uploads/f0a8248d-5369-45b1-b794-cb8cacd0feaa.png", // Paul hall (new)
    "/lovable-uploads/ecab6a20-a929-4bfa-8fdc-e57e92c56fae.png"  // Nazi ring (new)
  ],
  questions: [
    [
      {
        id: "A",
        text: "In which city is the following complex located?",
        answer: "Bratislava"
      },
      {
        id: "B",
        text: "Which architect designed it?",
        answer: "Zaha Hadid"
      },
      {
        id: "C",
        text: "Who was the developer?",
        answer: "Penta"
      }
    ],
    [
      {
        id: "A",
        text: "In what city is this complex located?",
        answer: "BEIRUT"
      },
      {
        id: "B",
        text: "How many acres does it span?",
        answer: "43"
      },
      {
        id: "C",
        text: "In what Californian city is the architectural studio responsible for the complex based?",
        answer: "CULVER"
      }
    ],
    [
      {
        id: "A",
        text: "What apostle is this hall named after?",
        answer: "PAUL"
      },
      {
        id: "B",
        text: "The building has attracted interest after people noticed its similarities to which animal?",
        answer: "SNAKE"
      },
      {
        id: "C",
        text: "The sculpture supposedly depicts Jesus rising from what garden?",
        answer: "GETHSEMANE"
      }
    ],
    [
      {
        id: "A",
        text: "In what country is this ring located in?",
        answer: "POLAND"
      },
      {
        id: "B",
        text: "According to certain historians, what was the German name of the advanced Nazi project that was tested here?",
        answer: "DIE GLOCKE"
      },
      {
        id: "C",
        text: "What was the codename of the radioactive substance supposedly used by this device?",
        answer: "XERUM 525"
      }
    ]
  ],
  currentQuestionSet: 0
};
