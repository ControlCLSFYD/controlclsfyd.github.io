
import React from 'react';

const PixelArtLogo: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="pixel-art-container relative" style={{ maxWidth: '120px' }}>
        {/* Floating heart */}
        <div 
          className="absolute left-0 right-0 mx-auto w-full"
          style={{ 
            top: '-15px',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <svg width="100%" viewBox="0 0 50 50" className="w-10 mx-auto">
            <path 
              d="M15,10 L20,5 L25,0 L30,5 L35,10 L40,15 L40,20 L35,25 L30,30 L25,35 L20,30 L15,25 L10,20 L10,15 Z" 
              fill="#00FF00" 
            />
          </svg>
        </div>

        {/* Pyramid */}
        <div className="pyramid">
          <svg width="100%" viewBox="0 0 100 120" className="w-14 mx-auto">
            <rect x="20" y="20" width="60" height="20" fill="#00FF00" />
            <rect x="15" y="40" width="30" height="15" fill="#00FF00" />
            <rect x="55" y="40" width="30" height="15" fill="#00FF00" />
            <rect x="10" y="55" width="20" height="20" fill="#00FF00" />
            <rect x="40" y="55" width="20" height="20" fill="#00FF00" />
            <rect x="70" y="55" width="20" height="20" fill="#00FF00" />
            <rect x="15" y="75" width="35" height="15" fill="#00FF00" />
            <rect x="55" y="75" width="35" height="15" fill="#00FF00" />
            <rect x="25" y="95" width="50" height="15" fill="#00FF00" />
            <foreignObject x="10" y="115" width="80" height="15">
              <div className="text-xs text-center text-[#00FF00] font-mono">OMNIS AMOR EST</div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PixelArtLogo;
