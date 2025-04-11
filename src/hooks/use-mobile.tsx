
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
