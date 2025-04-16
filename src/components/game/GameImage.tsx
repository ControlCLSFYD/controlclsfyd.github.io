
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

interface GameImageProps {
  imageSrc: string;
}

const GameImage: React.FC<GameImageProps> = ({ imageSrc }) => {
  const [imageKey, setImageKey] = useState<number>(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleReloadImage = () => {
    // Reset image states
    setImageLoaded(false);
    setImageError(false);
    
    // Update the imageKey to force React to reload the image
    setImageKey(Date.now());
    
    // Log the reload attempt to confirm functionality
    console.log("Image reload requested at:", new Date().toISOString());
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
    console.log("Image failed to load");
  };

  if (!imageSrc) return null;

  return (
    <div className="mb-4 border border-terminal-green p-1 relative">
      {!imageLoaded && !imageError && (
        <div className="w-full h-64 flex items-center justify-center text-terminal-green">
          Loading image...
        </div>
      )}
      
      {imageError && (
        <div className="w-full h-64 flex flex-col items-center justify-center text-terminal-green">
          <div className="mb-2">Failed to load image</div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReloadImage}
            className="border border-terminal-green text-terminal-green bg-black hover:bg-terminal-green hover:text-black"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      )}
      
      <img 
        src={`${imageSrc}?key=${imageKey}`} 
        alt={`Level Reference`} 
        className={`w-full max-h-96 object-contain ${!imageLoaded ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {imageLoaded && (
        <div className="absolute bottom-2 right-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReloadImage}
            className="border border-terminal-green text-terminal-green bg-black bg-opacity-70 hover:bg-terminal-green hover:text-black"
          >
            <RefreshCw size={14} className="mr-1" />
            Reload
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameImage;
