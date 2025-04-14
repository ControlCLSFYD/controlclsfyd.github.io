
import React from 'react';

const PyramidStamp: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center" style={{ zIndex: 1000 }}>
      {/* Heart with Chi Ro symbol that floats up and down */}
      <div className="relative mb-1 animate-float">
        <svg width="30" height="26" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg">
          {/* Heart shape */}
          <path 
            d="M150,60 C150,60 120,0 60,0 C0,0 0,50 0,50 C0,100 50,150 150,240 C250,150 300,100 300,50 C300,50 300,0 240,0 C180,0 150,60 150,60 Z" 
            fill="#1e517c" 
            stroke="#000000" 
            strokeWidth="6"
          />
          
          {/* Chi Rho symbol */}
          <g transform="translate(115, 70) scale(0.7)">
            {/* P (Rho) */}
            <path 
              d="M80,20 L80,140 M80,20 C120,20 120,70 80,70" 
              stroke="#333" 
              strokeWidth="12" 
              fill="none"
            />
            
            {/* X (Chi) */}
            <path 
              d="M40,30 L120,130 M40,130 L120,30" 
              stroke="#333" 
              strokeWidth="12" 
              fill="none"
            />
          </g>
        </svg>
      </div>
      
      {/* Pyramid base */}
      <svg width="60" height="40" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M20,380 L300,20 L580,380 Z" 
          fill="#1e517c" 
          stroke="#000000" 
          strokeWidth="6"
        />
      </svg>
    </div>
  );
};

export default PyramidStamp;
