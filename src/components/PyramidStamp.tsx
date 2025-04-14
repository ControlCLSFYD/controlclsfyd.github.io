
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-4 w-full flex justify-center pointer-events-none">
      <div className="relative w-20 h-24">
        {/* Pyramid base - static */}
        <div className="absolute bottom-0 left-0 w-full">
          <img 
            src="/lovable-uploads/0ea8b51b-71a2-4ab2-a827-ba8d0adc3770.png"
            alt="Pyramid Base"
            className="w-full"
            style={{
              clipPath: 'polygon(0% 42%, 100% 42%, 100% 100%, 0% 100%)'
            }}
          />
        </div>
        
        {/* Heart - floating */}
        <div className="absolute w-full animate-float-heart">
          <img 
            src="/lovable-uploads/0ea8b51b-71a2-4ab2-a827-ba8d0adc3770.png"
            alt="Floating Heart"
            className="w-full"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 41%, 0% 41%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
