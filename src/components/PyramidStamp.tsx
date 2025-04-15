
import React from 'react';

interface PyramidStampProps {
  centered?: boolean;
}

const PyramidStamp: React.FC<PyramidStampProps> = ({ centered = false }) => {
  return (
    <div className={`${centered ? 'fixed bottom-2 right-2' : 'fixed bottom-2 right-2'} flex flex-col items-center`} style={{ zIndex: 1000 }}>
      {/* Small floating heart without Chi Ro symbol */}
      <div className="relative mb-1 animate-float">
        <svg width="15" height="13" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg">
          {/* Heart shape */}
          <path 
            d="M150,60 C150,60 120,0 60,0 C0,0 0,50 0,50 C0,100 50,150 150,240 C250,150 300,100 300,50 C300,50 300,0 240,0 C180,0 150,60 150,60 Z" 
            fill="#00FF00" 
            stroke="#000000" 
            strokeWidth="6"
          />
        </svg>
      </div>
      
      {/* Wider at base pyramid */}
      <svg width="30" height="20" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M50,380 L300,20 L550,380 Z" 
          fill="#00FF00" 
          stroke="#000000" 
          strokeWidth="6"
        />
      </svg>
    </div>
  );
};

export default PyramidStamp;

