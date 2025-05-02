
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
    handleStartTracking,
    handleStopTracking,
    handlePauseTracking,
    handleResumeTracking,
  } = useTimerControls({
    validateRequiredFields
  });

  useKeyboardShortcuts({
    isTracking,
    isPaused,
    startTimer: handleStartTracking,
    stopTimer: handleStopTracking,
    pauseTimer: handlePauseTracking,
    resumeTimer: handleResumeTracking,
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
    refreshProfile  // Make sure to include this function in the returned object
  };
};
