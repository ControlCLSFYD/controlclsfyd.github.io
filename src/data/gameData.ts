
import { Question } from '../components/GameLevel';

export interface Level {
  id: number;
  questions: Question[];
  imageSrc?: string;
}

export const gameLevels: Level[] = [
  {
    id: 1,
    imageSrc: "/lovable-uploads/bd22cfea-71dc-4646-adf7-5ef6a9073db5.png",
    questions: [
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
  },
  {
    id: 2,
    imageSrc: "/lovable-uploads/1fb6b7bb-34d5-486c-aff9-51bb886b406b.png",
    questions: [
      {
        id: "A",
        text: "Who was accused of being the Ultimate Beneficial Owner of this aircraft?",
        answer: "CIA"
      }
    ]
  },
  {
    id: 3,
    questions: [
      {
        id: "A",
        text: "Two citizens of which country were arrested armed with explosives on 10 October 2001 in the Mexican legislative assembly?",
        answer: "Israel"
      }
    ]
  },
  {
    id: 4,
    questions: [
      {
        id: "A",
        text: "What infamous letter was published in 1950 by the Madrid Geo-Political Center.",
        answer: "Madrid Circular"
      }
    ]
  },
  {
    id: 5,
    imageSrc: "/lovable-uploads/9f6705d8-64d1-4183-8114-2d02f58c91c1.png",
    questions: [
      {
        id: "A",
        text: "Which European Prime Minister was a member of the masonic organization blamed for misleading a police investigation into this terrorist bombing?",
        answer: "Silvio Berlusconi"
      }
    ]
  }
];
