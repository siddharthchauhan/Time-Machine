
import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  isTracking: boolean;
  isPaused: boolean;
  onStartStop: () => void;
  onPauseResume: () => void;
}

export const useKeyboardShortcuts = ({
  isTracking,
  isPaused,
  onStartStop,
  onPauseResume,
}: UseKeyboardShortcutsProps) => {
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when not in an input field
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Alt+S to start/stop timer
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        onStartStop();
      }

      // Alt+P to pause/resume timer
      if (e.altKey && e.key === 'p' && isTracking) {
        e.preventDefault();
        onPauseResume();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTracking, isPaused, onStartStop, onPauseResume]);
};
