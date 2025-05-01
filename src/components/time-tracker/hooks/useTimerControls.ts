
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useTimerControls = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [trackingDuration, setTrackingDuration] = useState(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const intervalIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTracking = (validation?: () => boolean) => {
    if (validation && !validation()) {
      return false;
    }
    
    setTrackingStartTime(new Date());
    setIsTracking(true);
    setIsPaused(false);
    
    const intervalId = window.setInterval(() => {
      setTrackingDuration(prev => prev + 1);
    }, 1000);
    
    intervalIdRef.current = intervalId;
    document.documentElement.setAttribute('data-timer-id', intervalId.toString());
    return true;
  };

  const pauseTracking = () => {
    if (isPaused) {
      // Resume tracking
      setIsPaused(false);
      
      const intervalId = window.setInterval(() => {
        setTrackingDuration(prev => prev + 1);
      }, 1000);
      
      intervalIdRef.current = intervalId;
      document.documentElement.setAttribute('data-timer-id', intervalId.toString());
      
      toast({
        title: "Timer resumed",
        description: "Time tracking has been resumed",
      });
    } else {
      // Pause tracking
      setIsPaused(true);
      
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      
      toast({
        title: "Timer paused",
        description: "Time tracking has been paused",
      });
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    const formattedDuration = formatDuration(trackingDuration);
    const hours = trackingDuration / 3600;
    
    toast({
      title: "Time tracking stopped",
      description: `Tracked ${formattedDuration}`,
    });
    
    return hours.toFixed(2);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    isPaused,
    trackingDuration,
    trackingStartTime,
    startTracking,
    pauseTracking,
    stopTracking,
    formatDuration
  };
};
