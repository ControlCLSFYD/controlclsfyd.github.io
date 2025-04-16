
import React from 'react';
import TypewriterText from '../TypewriterText';
import AnswerInput from '../AnswerInput';
import { Question } from '../GameLevel';

interface GameQuestionsProps {
  questions: Question[];
  level: number;
  savedAnswers: Record<string, string>;
  onCorrectAnswer: (questionId: string, answer: string) => void;
}

const GameQuestions: React.FC<GameQuestionsProps> = ({
  questions,
  level,
  savedAnswers,
  onCorrectAnswer,
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
              onCorrectAnswer={() => onCorrectAnswer(question.id, savedAnswer || question.answer)}
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
