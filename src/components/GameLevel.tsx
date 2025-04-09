
import React from 'react';
import TypewriterText from './TypewriterText';
import AnswerInput from './AnswerInput';
import CountdownTimer from './CountdownTimer';

export interface Question {
  id: string;
  text: string;
  answer: string;
}

interface GameLevelProps {
  level: number;
  questions: Question[];
  imageSrc?: string;
  isActive: boolean;
  onLevelComplete: () => void;
}

const GameLevel: React.FC<GameLevelProps> = ({
  level,
  questions,
  imageSrc,
  isActive,
  onLevelComplete
}) => {
  const [answeredQuestions, setAnsweredQuestions] = React.useState<string[]>([]);

  const handleCorrectAnswer = (questionId: string) => {
    if (!answeredQuestions.includes(questionId)) {
      const newAnswered = [...answeredQuestions, questionId];
      setAnsweredQuestions(newAnswered);
      
      // Check if all questions are answered
      if (newAnswered.length === questions.length) {
        setTimeout(() => {
          onLevelComplete();
        }, 1000);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <TypewriterText 
          text={`LEVEL ${level}`} 
          className="text-xl"
        />
        {isActive && (
          <CountdownTimer 
            initialTime={7 * 60} // 7 minutes in seconds
            isActive={isActive}
          />
        )}
      </div>
      
      {imageSrc && (
        <div className="mb-4 border border-terminal-green p-1">
          <img src={imageSrc} alt={`Level ${level} Reference`} className="w-full max-h-96 object-contain" />
        </div>
      )}
      
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="mb-6">
            <TypewriterText 
              text={question.text} 
              className="block mb-4"
            />
            <AnswerInput 
              correctAnswer={question.answer} 
              onCorrectAnswer={() => handleCorrectAnswer(question.id)} 
              questionLabel={`Answer for ${question.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLevel;
