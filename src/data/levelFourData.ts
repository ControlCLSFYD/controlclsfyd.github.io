import { Level } from '../interfaces/GameDataInterfaces';

// Level 4 data
export const levelFourData: Level = {
  id: 4,
  hasLesson: true,
  timeLimit: 300,
  questions: [
    [
      {
        id: "A",
        text: "Think about the Marbella story we're investigating. What common office supply shares a name with a covert operation that brought similar experts over to the United States?.",
        answer: "Operation Paperclip"
      }
    ],
    [
      {
        id: "A",
        text: "What infamous letter was distributed in 1950 by the German Geo-Political Center in Madrid.",
        answer: "Madrid Circular"
      },
      {
        id: "B",
        text: "What was the surname of the author who first translated and reprinted the letter?",
        answer: "TETENS"
      },
      {
        id: "C",
        text: "The letter suggested that post-war Germany should create a political bloc out of which two non-European regions:",
        answer: "AFRICA"
      },
      {
        id: "D",
        text: "Region 2:",
        answer: "LATIN AMERICA"
      }
    ],
    [
      {
        id: "A",
        text: "In what French hotel did some Nazi's who smelled defeat organise a secretive meeting to plan for post-war recovery in 1943?",
        answer: "MAISON ROUGE HOTEL"
      },
      {
        id: "B",
        text: "What famous German car brand was represented at the meeting?",
        answer: "VOLKSWAGEN"
      },
      {
        id: "C",
        text: "What was the official acronym of the American aid program that secret Nazi-German money used as cover to flow back into Germany in 1948:",
        answer: "ERP"
      }
    ]
  ],
  currentQuestionSet: 0
};
