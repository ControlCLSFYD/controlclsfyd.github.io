import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface IntroVideoProps {
  onVideoEnd: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onVideoEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is unmuted and volume is up
    video.muted = false;
    video.volume = 1;

    // Set up video event listeners
    const handleEnded = () => {
      handleSkip(); // Programmatically trigger skip after video ends
    };

    const handleError = () => {
      console.error('Error playing intro video');
      onVideoEnd(); // Fallback to loading screen if video fails
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Cleanup
    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onVideoEnd]);

  const handleSkip = () => {
    onVideoEnd();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-50 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
        {/* Fallback content if video fails to load */}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <p className="text-terminal-green">Loading...</p>
        </div>
      </video>
      
      {/* Skip button */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-50">
        <Button
          onClick={handleSkip}
          className="border border-terminal-green text-terminal-green px-4 py-2 bg-black hover:bg-terminal-green hover:text-black transition-all duration-300 text-sm sm:text-base"
        >
          SKIP
        </Button>
      </div>
    </div>
  );
};

export default IntroVideo; 