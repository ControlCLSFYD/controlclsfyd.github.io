
import { Question } from '../components/GameLevel';
import { LessonContent } from '../components/LessonScreen';

export interface Level {
  id: number;
  questions: Question[][];  // Array of question sets (for revolving questions)
  currentQuestionSet?: number; // Index of the current question set
  imageSrc?: string | string[];  // String or array of strings for revolving images
  hasLesson?: boolean;  // Whether this level has a lesson before it
}

export interface GameData {
  levels: Level[];
  lessons: LessonContent[];
}

// Lessons content
export const lessonData: LessonContent[] = [
  {
    id: 1,
    title: "Introduction to online image searching (basic)",
    content: [
      "Google image search is a basic tool that helps the investigator find relevant results online which can enhance his investigation.",
      "While limited, its ease of use and wide availability makes it an essential go-to tool for any Open Source Intelligence (OSINT) investigation.",
      "How: Right click and select search with Google Lens.",
      "On mobile: Press and hold finger on image, select save image. Then open the Google app and click on the camera icon next to the search bar to either select your saved image or take a picture of the image with your camera.",
      "Pros:",
      "- An image with a detectable online record will usually be picked up with Google Lens/Image Search.",
      "- Use your phone camera and the Google app to instantly search vehicles, logos, or buildings.",
      "Cons:",
      "- Doesn't work well if the image on the public record is not identical to the image being searched.",
      "- Doesn't work for people.",
      "Let's test your ability to carry out a successful Google Image Search."
    ]
  },
  {
    id: 2,
    title: "Introduction to building a search query",
    content: [
      "Every search proceeds from the most easily identifiable results.",
      "Let's say you're looking for your friend Klaus in a restaurant. Klaus is a tall, blonde German with a penchant for feet pics.",
      "You wouldn't ask the waiter if he's seen a man who is into feet. Rather, you would ask for the tall, blonde German called Klaus.",
      "Specific questions follow from general questions.",
      "This next level will prove whether you can build a basic search query based on prior search results."
    ]
  }
];

// Game levels with revolving questions
export const gameLevels: Level[] = [
  {
    id: 1,
    hasLesson: true,
    imageSrc: [
      "/lovable-uploads/1fb6b7bb-34d5-486c-aff9-51bb886b406b.png", // Image for WGA question (aircraft)
      "/lovable-uploads/ac576421-6c21-48d3-aff9-268fe77c8de9.png", // Image for Kenneth Arnold question
      "/lovable-uploads/de09e4b3-9288-41b0-9e3c-8a5b141c6121.png"  // Image for Benito Mussolini question
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
      ]
    ],
    currentQuestionSet: 0
  },
  {
    id: 2,
    hasLesson: true,
    imageSrc: "/lovable-uploads/bd22cfea-71dc-4646-adf7-5ef6a9073db5.png",
    questions: [
      [
        {
          id: "A",
          text: "What city is the following complex located?",
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
      ]
    ],
    currentQuestionSet: 0
  },
  {
    id: 3,
    questions: [
      [
        {
          id: "A",
          text: "Two citizens of which country were arrested armed with explosives on 10 October 2001 in the Mexican legislative assembly?",
          answer: "Israel"
        }
      ]
    ],
    currentQuestionSet: 0
  },
  {
    id: 4,
    questions: [
      [
        {
          id: "A",
          text: "What infamous letter was published in 1950 by the Madrid Geo-Political Center.",
          answer: "Madrid Circular"
        }
      ]
    ],
    currentQuestionSet: 0
  },
  {
    id: 5,
    imageSrc: "/lovable-uploads/9f6705d8-64d1-4183-8114-2d02f58c91c1.png",
    questions: [
      [
        {
          id: "A",
          text: "Which European Prime Minister was a member of the masonic organization blamed for misleading a police investigation into this terrorist bombing?",
          answer: "Silvio Berlusconi"
        }
      ]
    ],
    currentQuestionSet: 0
  }
];

// Export both lessons and levels
export const gameData: GameData = {
  levels: gameLevels,
  lessons: lessonData
};
