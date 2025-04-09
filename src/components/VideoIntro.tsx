
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

  return (
    <div className="fixed inset-0 bg-terminal-black z-50 flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        className={`${isMobile ? 'h-full w-auto' : 'w-full h-auto'} object-contain`}
        src={videoSrc}
        autoPlay
        playsInline
        muted
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
    </div>
  );
};

export default VideoIntro;
