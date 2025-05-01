
import { Button } from "@/components/ui/button";
import { Play, Pause, CircleStop } from "lucide-react";

interface TimerControlsProps {
  isTracking: boolean;
  isPaused: boolean;
  handleStartTracking: () => void;
  handleStopTracking: () => void;
  handlePauseTracking?: () => void;
}

const TimerControls = ({
  isTracking,
  isPaused,
  handleStartTracking,
  handleStopTracking,
  handlePauseTracking
}: TimerControlsProps) => {
  if (!isTracking) {
    return (
      <Button
        type="button"
        onClick={handleStartTracking}
        variant="default"
        className="flex-1"
      >
        <Play className="mr-2 h-4 w-4" />
        Start Timer
      </Button>
    );
  }

  return (
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
  );
};

export default TimerControls;
