
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center" style={{ zIndex: 1000 }}>
      {/* Floating heart with ms-dos style pixel art */}
      <div className="relative mb-1 animate-float">
        <img 
          src="/lovable-uploads/245bde29-84b2-4518-bd86-036e319788bb.png" 
          alt="Pixelated Heart Pyramid Logo" 
          className="w-12 h-auto" // Made smaller
        />
      </div>
    </div>
  );
};

export default PyramidStamp;
