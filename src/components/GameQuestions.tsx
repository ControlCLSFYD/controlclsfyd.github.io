
import React from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import { Question } from './GameLevel';

interface GameQuestionsProps {
  level: number;
  questions: Question[];
  savedAnswers: Record<string, string>;
  onAnswerUpdate: (levelId: number, questionId: string, answer: string) => void;
  onCorrectAnswer: (questionId: string, answer: string) => void;
}

const GameQuestions: React.FC<GameQuestionsProps> = ({
  level,
  questions,
  savedAnswers,
  onAnswerUpdate,
  onCorrectAnswer
}) => {
  return (
    <div className="space-y-2">
      {questions.map((question) => {
        const answerKey = `${level}-${question.id}`;
        const savedAnswer = savedAnswers[answerKey] || '';
        
        return (
          <div key={question.id} className="mb-4">
            <div className="min-h-[40px] mb-1">
              <TypewriterText 
                text={question.text} 
                className="block"
              />
            </div>
            <AnswerInput 
              correctAnswer={question.answer} 
              onCorrectAnswer={() => {
                onAnswerUpdate(level, question.id, savedAnswer || question.answer);
                onCorrectAnswer(question.id, savedAnswer || question.answer);
              }}
              questionLabel={`Answer for ${question.id}`}
              savedAnswer={savedAnswer}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameQuestions;
