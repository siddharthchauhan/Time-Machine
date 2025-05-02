
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, PlayCircle, PauseCircle, AlertCircle, Save } from "lucide-react";
import DatePicker from "./DatePicker";
import ProjectTaskSelector from "./ProjectTaskSelector";
import TimeTracker from "./TimeTracker";
import DescriptionField from "./DescriptionField";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { useTimeEntry, Task } from "./hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TimeEntryFormProps {
  projects: any[];
  tasks: Record<string, any[]>;
}

const TimeEntryForm = ({ projects, tasks }: TimeEntryFormProps) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  const {
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
  } = useTimeEntry(projects, tasks);
  
  const handleSubmit = async () => {
    // Convert manualHours from string to number
    const hours = parseFloat(manualHours);
    if (hours > 0 || trackingDuration > 0) {
      const hoursToSave = hours > 0 ? hours : trackingDuration / 3600; // 3600 seconds in an hour
      await saveTimeEntry(hoursToSave, 'submitted');
      handleReset();
    }
  };
  
  const handleSaveDraft = async () => {
    // Convert manualHours from string to number
    const hours = parseFloat(manualHours);
    if (hours > 0 || trackingDuration > 0) {
      const hoursToSave = hours > 0 ? hours : trackingDuration / 3600; // 3600 seconds in an hour
      await saveTimeEntry(hoursToSave, 'draft');
      handleReset();
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>New Time Entry</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowKeyboardShortcuts(prev => !prev)}
          >
            Shortcuts
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProfileLoaded && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile data not loaded</AlertTitle>
            <div className="flex items-center justify-between">
              <AlertDescription>
                Your profile is required to track time.
              </AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshProfile}
                className="ml-2 h-8"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </Alert>
        )}
        
        <DatePicker date={date} setDate={setDate} disabled={isTracking} />
        
        <ProjectTaskSelector 
          projects={projects}
          tasks={tasks}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          disabled={isTracking}
        />
        
        <DescriptionField 
          description={description}
          setDescription={setDescription}
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
        
        {showKeyboardShortcuts && <KeyboardShortcuts />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          disabled={isTracking || isSubmitting || !isProfileLoaded}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isTracking || isSubmitting || !isProfileLoaded}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TimeEntryForm;
