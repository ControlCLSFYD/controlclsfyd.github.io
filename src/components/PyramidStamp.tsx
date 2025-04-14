
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center pointer-events-none z-10">
      <div className="relative w-16 h-16">
        {/* Static Pyramid Base */}
        <div className="absolute bottom-0 left-0 right-0">
          <img 
            src="/lovable-uploads/2dc4d723-c3e9-4003-999d-f594248562f4.png"
            alt="Pyramid Base"
            className="w-full"
          />
        </div>
        
        {/* Floating Heart */}
        <div className="absolute top-0 left-0 right-0 animate-float">
          <img 
            src="/lovable-uploads/41420305-9e8f-48a6-bac3-e91941eed574.png"
            alt="Floating Heart"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
