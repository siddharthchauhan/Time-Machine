
import { useState, useEffect, useRef } from "react";

interface UseIdleDetectionProps {
  isTracking: boolean;
  isPaused: boolean;
  onIdle?: () => void;
  idleThreshold?: number;
}

export const useIdleDetection = ({
  isTracking,
  isPaused,
  onIdle,
  idleThreshold = 300, // 5 minutes in seconds by default
}: UseIdleDetectionProps) => {
  const [idleTime, setIdleTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!isTracking) return;
    
    const handleActivity = () => {
      if (isIdle) {
        setIsIdle(false);
      }
      lastActivityRef.current = Date.now();
    };
    
    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    
    // Check for idle time
    const idleInterval = setInterval(() => {
      if (!isTracking || isPaused) return;
      
      const idleSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      setIdleTime(idleSeconds);
      
      if (idleSeconds >= idleThreshold && !isIdle) {
        setIsIdle(true);
        if (onIdle) {
          onIdle();
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(idleInterval);
    };
  }, [isTracking, isPaused, isIdle, onIdle, idleThreshold]);

  return { idleTime, isIdle };
};
