
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center" style={{ zIndex: 1000 }}>
      {/* Image container with proper spacing between heart and pyramid */}
      <div className="flex flex-col items-center">
        {/* Floating heart */}
        <div className="animate-float mb-1">
          <img 
            src="/lovable-uploads/50d0099d-6365-4d6b-9f6c-116f66395a03.png" 
            alt="Pixel Heart" 
            className="w-10"
            style={{
              imageRendering: 'pixelated',
              clipPath: 'polygon(0% 15%, 15% 0%, 30% 0%, 50% 15%, 70% 0%, 85% 0%, 100% 15%, 100% 30%, 85% 50%, 100% 70%, 100% 85%, 85% 100%, 70% 100%, 50% 85%, 30% 100%, 15% 100%, 0% 85%, 0% 70%, 15% 50%, 0% 30%)',
              height: '40px',
              display: 'block',
              marginBottom: '10px'
            }}
          />
        </div>
        
        {/* Static pyramid base */}
        <img 
          src="/lovable-uploads/50d0099d-6365-4d6b-9f6c-116f66395a03.png" 
          alt="Pixel Pyramid" 
          className="w-20"
          style={{
            imageRendering: 'pixelated',
            clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
            clipPath: 'polygon(5% 100%, 95% 100%, 50% 41%)',
            height: '60px',
            display: 'block',
            marginTop: '-10px'
          }}
        />
      </div>
    </div>
  );
};

export default PyramidStamp;
