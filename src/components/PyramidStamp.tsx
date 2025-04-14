
import React from 'react';

const PyramidStamp: React.FC = () => {
  // Use the uploaded image in the component
  const imageUrl = '/lovable-uploads/35ffe47f-b9a9-418f-a8ee-7d49bec5f4b6.png';
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2" style={{ zIndex: 10 }}>
      <div className="relative" style={{ width: '80px', height: '80px' }}>
        {/* Pyramid base (static) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <img 
            src={imageUrl} 
            alt="Pyramid with heart" 
            className="w-16 h-auto"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Add styling to index.css for the floating animation */}
      </div>
    </div>
  );
};

export default PyramidStamp;
