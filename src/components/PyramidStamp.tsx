
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center" style={{ zIndex: 1000 }}>
      {/* Fixed positioning container with reduced size */}
      <div className="relative flex flex-col items-center" style={{ width: '8px', height: '16px' }}>
        {/* Only the heart floats */}
        <div className="absolute bottom-1 animate-float">
          <img 
            src="/lovable-uploads/245bde29-84b2-4518-bd86-036e319788bb.png" 
            alt="Pixelated Heart Pyramid Logo" 
            className="w-8 h-auto" // Made even smaller
          />
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
