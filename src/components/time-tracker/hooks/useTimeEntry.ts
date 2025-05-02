
import { useState, useEffect } from "react";
import { useTimeEntryForm } from "./useTimeEntryForm";
import { useTimerControls } from "./useTimerControls";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

export const useTimeEntry = (projects: any[], tasks: Record<string, any[]>) => {
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
    isProfileLoaded,
    validateRequiredFields,
    saveTimeEntry,
    refreshProfile
  } = useTimeEntryForm();
  
  const {
    isTracking,
    isPaused,
    trackingDuration,
    startTracking,
    pauseTracking,
    stopTracking,
  } = useTimerControls();

  // Create handler functions that match what's expected elsewhere
  const handleStartTracking = () => {
    startTracking(validateRequiredFields);
  };

  const handleStopTracking = () => {
    stopTracking();
  };

  const handlePauseTracking = () => {
    pauseTracking();
  };

  const handleResumeTracking = handlePauseTracking; // Resume is the same function as pause

  useKeyboardShortcuts({
    isTracking,
    isPaused,
    onStartStop: handleStartTracking,
    onPauseResume: handlePauseTracking,
  });
  
  // Reset the form
  const handleReset = () => {
    setSelectedProject('');
    setSelectedTask('');
    setDescription('');
    setManualHours('');
  };
  
  // When project changes, reset the task
  useEffect(() => {
    setSelectedTask('');
  }, [selectedProject, setSelectedTask]);
  
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
    handleStartTracking,
    handleStopTracking,
    handlePauseTracking,
    handleResumeTracking,
    isSubmitting,
    isProfileLoaded,
    saveTimeEntry,
    handleReset,
    refreshProfile
  };
};
