
import { useTimeEntryForm } from "./useTimeEntryForm";
import { useTimerControls } from "./useTimerControls";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Task } from "./types";

export function useTimeEntry(availableTasks: Record<string, Task[]>) {
  const {
    date,
    setDate,
    selectedProject,
    setSelectedProject,
    selectedTask,
    setSelectedTask,
    description,
    setDescription,
    manualHours,
    setManualHours,
    isSubmitting,
    validateRequiredFields,
    saveTimeEntry
  } = useTimeEntryForm();

  const {
    isTracking,
    isPaused,
    trackingDuration,
    trackingStartTime,
    startTracking,
    pauseTracking,
    stopTracking
  } = useTimerControls();

  const handleStartTracking = () => {
    if (startTracking(validateRequiredFields)) {
      // Timer started successfully
    }
  };

  const handlePauseTracking = () => {
    pauseTracking();
  };

  const handleStopTracking = () => {
    const hours = stopTracking();
    setManualHours(hours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isTracking) {
      handleStopTracking();
    }

    const hours = parseFloat(manualHours);
    const success = await saveTimeEntry(hours, 'draft');
    
    if (success) {
      handleReset();
    }
  };
  
  const handleSubmitForApproval = async () => {
    if (isTracking) {
      handleStopTracking();
    }

    const hours = parseFloat(manualHours);
    const success = await saveTimeEntry(hours, 'submitted');
    
    if (success) {
      handleReset();
    }
  };

  const handleReset = () => {
    setSelectedProject('');
    setSelectedTask('');
    setDescription('');
    setManualHours('');
    
    if (isTracking) {
      stopTracking();
    }
  };

  useKeyboardShortcuts({
    isTracking,
    isPaused,
    onStartStop: isTracking ? handleStopTracking : handleStartTracking,
    onPauseResume: handlePauseTracking
  });

  return {
    date,
    setDate,
    isTracking,
    isPaused,
    selectedProject,
    setSelectedProject,
    selectedTask,
    setSelectedTask,
    description,
    setDescription,
    manualHours,
    setManualHours,
    trackingDuration,
    isSubmitting,
    handleStartTracking,
    handlePauseTracking,
    handleStopTracking,
    handleSubmit,
    handleSubmitForApproval,
    handleReset
  };
}
