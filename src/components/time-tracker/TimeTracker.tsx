
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, CircleStop } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeTrackerProps {
  isTracking: boolean;
  trackingDuration: number;
  manualHours: string;
  setManualHours: (hours: string) => void;
  handleStartTracking: () => void;
  handleStopTracking: () => void;
}

const TimeTracker = ({
  isTracking,
  trackingDuration,
  manualHours,
  setManualHours,
  handleStartTracking,
  handleStopTracking
}: TimeTrackerProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
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
          <Button
            type="button"
            onClick={isTracking ? handleStopTracking : handleStartTracking}
            variant={isTracking ? "destructive" : "default"}
            className="flex-1"
          >
            {isTracking ? (
              <>
                <CircleStop className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Timer
              </>
            )}
          </Button>
          {isTracking && (
            <div className="bg-muted text-foreground p-2 rounded-md min-w-24 text-center">
              {formatDuration(trackingDuration)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
