
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import { useIdleDetection } from "./hooks/useIdleDetection";

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
  const { idleTime, isIdle } = useIdleDetection({
    isTracking,
    isPaused,
    onIdle: handlePauseTracking,
  });

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
            <TimerControls 
              isTracking={isTracking}
              isPaused={isPaused}
              handleStartTracking={handleStartTracking}
              handleStopTracking={handleStopTracking}
              handlePauseTracking={handlePauseTracking}
            />
          </div>
        </div>
      </div>
      
      {isTracking && (
        <TimerDisplay 
          trackingDuration={trackingDuration}
          isIdle={isIdle}
          idleTime={idleTime}
          isPaused={isPaused}
        />
      )}
    </div>
  );
};

export default TimeTracker;
