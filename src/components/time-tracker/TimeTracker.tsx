
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayCircle, PauseCircle, StopCircle } from "lucide-react";
import TimerDisplay from "./TimerDisplay";

interface TimeTrackerProps {
  isTracking: boolean;
  isPaused: boolean;
  trackingDuration: number;
  manualHours: string;
  setManualHours: (hours: string) => void;
  handleStartTracking: () => void;
  handleStopTracking: () => void;
  handlePauseTracking: () => void;
  disabled?: boolean;
}

const TimeTracker = ({
  isTracking,
  isPaused,
  trackingDuration,
  manualHours,
  setManualHours,
  handleStartTracking,
  handleStopTracking,
  handlePauseTracking,
  disabled = false
}: TimeTrackerProps) => {
  const [inputError, setInputError] = useState(false);
  
  // Handle manual hours input validation
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input or valid number
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setManualHours(value);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };
  
  // Clear error after a delay
  useEffect(() => {
    if (inputError) {
      const timer = setTimeout(() => setInputError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [inputError]);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manual-hours">Duration (hours)</Label>
          <Input
            id="manual-hours"
            type="text"
            value={manualHours}
            onChange={handleHoursChange}
            placeholder="0.00"
            className={inputError ? "border-red-500" : ""}
            disabled={isTracking || disabled}
          />
          {inputError && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid number
            </p>
          )}
        </div>
        
        <div>
          <Label>Live Timer</Label>
          <TimerDisplay seconds={trackingDuration} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {!isTracking ? (
          <Button
            type="button"
            onClick={handleStartTracking}
            className="w-full"
            disabled={disabled}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Timer
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handlePauseTracking}
              className="flex-1"
            >
              {isPaused ? (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleStopTracking}
              className="flex-1"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;
