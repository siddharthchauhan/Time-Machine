
import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimeEntryForm, useTimerControls } from "./hooks";
import DatePicker from "./DatePicker";
import ProjectTaskSelector from "./ProjectTaskSelector";
import DescriptionField from "./DescriptionField";
import TimeTracker from "./TimeTracker";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeEntryFormProps {
  projects: any[];
  tasks: Record<string, any[]>;
}

const TimeEntryForm = ({ projects, tasks }: TimeEntryFormProps) => {
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
    saveTimeEntry
  } = useTimeEntryForm();
  
  const {
    isTracking,
    trackingDuration,
    isPaused,
    startTracking,
    pauseTracking,
    stopTracking
  } = useTimerControls();
  
  const handleStartTracking = () => {
    if (validateRequiredFields()) {
      startTracking();
    }
  };
  
  const handlePauseTracking = () => {
    pauseTracking();
  };
  
  const handleStopTracking = () => {
    const hours = stopTracking();
    setManualHours(hours);
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
  
  const handleSaveDraft = async () => {
    const hours = isTracking 
      ? Number((trackingDuration / 3600).toFixed(2))
      : Number(manualHours);
      
    if (hours <= 0) {
      return;
    }
    
    const success = await saveTimeEntry(hours, 'draft');
    if (success) {
      handleReset();
    }
  };
  
  const handleSubmit = async () => {
    const hours = isTracking 
      ? Number((trackingDuration / 3600).toFixed(2))
      : Number(manualHours);
      
    if (hours <= 0) {
      return;
    }
    
    const success = await saveTimeEntry(hours, 'submitted');
    if (success) {
      handleReset();
    }
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Time</CardTitle>
        <p className="text-sm text-muted-foreground">
          Record time spent on tasks and projects
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isProfileLoaded && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>User profile not available. Please refresh the page to load your profile.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 bg-white" 
                onClick={handleRefreshPage}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <DatePicker
          date={date}
          setDate={setDate}
        />
        
        <ProjectTaskSelector
          projects={projects}
          tasks={tasks}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          disabled={isTracking}
        />
        
        <TimeTracker
          isTracking={isTracking}
          trackingDuration={trackingDuration}
          manualHours={manualHours}
          setManualHours={setManualHours}
          handleStartTracking={handleStartTracking}
          handleStopTracking={handleStopTracking}
          handlePauseTracking={handlePauseTracking}
          isPaused={isPaused}
        />
        
        <DescriptionField
          description={description}
          setDescription={setDescription}
        />
        
        <KeyboardShortcuts />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isSubmitting || (!isTracking && !selectedProject && !selectedTask && !description && !manualHours)}
        >
          Reset
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={handleSaveDraft} 
            disabled={isSubmitting || isTracking || (!isTracking && Number(manualHours) <= 0) || !isProfileLoaded}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isTracking || (!isTracking && Number(manualHours) <= 0) || !isProfileLoaded}
          >
            Submit for Approval
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TimeEntryForm;
