
import { Clock } from "lucide-react";
import { formatDuration } from "./utils/formatTime";

interface TimerDisplayProps {
  trackingDuration: number;
  isIdle: boolean;
  idleTime: number;
  isPaused: boolean;
}

const TimerDisplay = ({
  trackingDuration,
  isIdle,
  idleTime,
  isPaused
}: TimerDisplayProps) => {
  return (
    <>
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
      
      {(isIdle && isPaused) && (
        <div className="text-sm text-muted-foreground">
          Timer paused after {Math.floor(300 / 60)} minutes of inactivity.
        </div>
      )}
    </>
  );
};

export default TimerDisplay;
