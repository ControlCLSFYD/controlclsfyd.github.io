
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoIntroProps {
  onComplete: () => void;
  videoSrc: string;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete, videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canSkip, setCanSkip] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 2000); // Allow skipping after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  };

  const handleVideoEnded = () => {
    onComplete();
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", videoSrc);
    setVideoError(true);
  };

  return (
    <div className="fixed inset-0 bg-terminal-black z-50 flex flex-col items-center justify-center">
      {videoError ? (
        <div className="text-terminal-green mb-4">
          Failed to load intro video. Click continue to proceed.
          <Button 
            onClick={handleSkip} 
            className="mt-4 bg-terminal-green text-terminal-black hover:bg-terminal-darkGreen"
          >
            Continue
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className={`${isMobile ? 'h-full w-auto' : 'w-full h-auto'} object-contain`}
            src={videoSrc}
            autoPlay
            playsInline
            onError={handleVideoError}
            onEnded={handleVideoEnded}
          />
          {canSkip && (
            <Button 
              onClick={handleSkip} 
              className="absolute bottom-8 right-8 bg-terminal-green text-terminal-black hover:bg-terminal-darkGreen"
            >
              Skip Intro
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default VideoIntro;
