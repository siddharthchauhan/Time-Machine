
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, CircleStop, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TimeTrackerProps {
  isTracking: boolean;
  trackingDuration: number;
  manualHours: string;
  setManualHours: (hours: string) => void;
  handleStartTracking: () => void;
  handleStopTracking: () => void;
  handlePauseTracking?: () => void;
  isPaused?: boolean;
}

const TimeTracker = ({
  isTracking,
  trackingDuration,
  manualHours,
  setManualHours,
  handleStartTracking,
  handleStopTracking,
  handlePauseTracking,
  isPaused = false
}: TimeTrackerProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Detect idle time (user inactivity)
  const [idleTime, setIdleTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const idleThreshold = 300; // 5 minutes in seconds
  
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
        if (handlePauseTracking) {
          handlePauseTracking();
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(idleInterval);
    };
  }, [isTracking, isPaused, isIdle, handlePauseTracking]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="hours">Duration (hours)</Label>
          <Input
            id="hours"
            type="number"
            step="0.25"
            placeholder="0.00"
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
            disabled={isTracking}
          />
        </div>
        
        <div className="space-y-1">
          <Label>Live Timer</Label>
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <Button
                type="button"
                onClick={handleStartTracking}
                variant="default"
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Timer
              </Button>
            ) : (
              <div className="flex gap-2 flex-1">
                {isPaused ? (
                  <Button
                    type="button"
                    onClick={handlePauseTracking}
                    variant="default"
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handlePauseTracking}
                    variant="outline"
                    className="flex-1"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleStopTracking}
                  variant="destructive"
                  className="flex-1"
                >
                  <CircleStop className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isTracking && (
        <div className="bg-card border rounded-md p-4 flex items-center justify-center gap-4">
          <Clock className="h-5 w-5" />
          <div className="text-2xl font-bold tracking-wider">
            {formatDuration(trackingDuration)}
          </div>
          {isIdle && (
            <div className="text-sm text-destructive">
              Paused due to inactivity ({Math.floor(idleTime / 60)} min idle)
            </div>
          )}
        </div>
      )}
      
      {(isIdle && isPaused) && (
        <div className="text-sm text-muted-foreground">
          Timer paused after {Math.floor(idleThreshold / 60)} minutes of inactivity.
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
