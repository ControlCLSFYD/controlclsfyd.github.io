
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to determine if device is mobile
    const checkMobile = () => {
      const isMobileDevice = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        window.innerWidth < MOBILE_BREAKPOINT;
      
      // Set viewport meta tag for mobile devices
      if (isMobileDevice) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
      
      return isMobileDevice;
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkMobile());
    }
    mql.addEventListener("change", onChange)
    setIsMobile(checkMobile());
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Helper function to get viewport size adjusted for mobile
export function getViewportAdjustment() {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  return {
    isMobile,
    scaleFactor: isMobile ? 0.8 : 1, // Scale down elements on mobile
    viewportScale: isMobile ? 'width=device-width, initial-scale=0.9, maximum-scale=1.0, user-scalable=no' : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
  };
}
