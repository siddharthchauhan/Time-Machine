
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, PlayCircle, PauseCircle, AlertCircle, Save } from "lucide-react";
import DatePicker from "./DatePicker";
import ProjectTaskSelector from "./ProjectTaskSelector";
import TimeTracker from "./TimeTracker";
import DescriptionField from "./DescriptionField";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { useTimeEntry } from "./hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface TimeEntryFormProps {
  projects: any[];
  tasks: Record<string, any[]>;
  onEntrySubmitted?: () => void;
  profileLoaded?: boolean;
  onProfileRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

const TimeEntryForm = ({ 
  projects, 
  tasks, 
  onEntrySubmitted,
  profileLoaded = false,
  onProfileRefresh,
  isRefreshing = false
}: TimeEntryFormProps) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const { toast } = useToast();
  
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
    isProfileLoaded: hookProfileLoaded,
    saveTimeEntry,
    handleReset,
    refreshProfile
  } = useTimeEntry(projects, tasks);
  
  // Combine external profileLoaded with hook's internal state
  const isProfileAvailable = profileLoaded || hookProfileLoaded;
  
  const handleSubmit = async () => {
    console.log("Submit button clicked");
    // Convert manualHours from string to number or use tracking duration
    const hoursFromInput = parseFloat(manualHours);
    const hoursToSave = hoursFromInput > 0 
      ? hoursFromInput 
      : trackingDuration > 0 
        ? trackingDuration / 3600 // Convert seconds to hours
        : 0;
    
    console.log("Hours to save:", hoursToSave);
    
    if (hoursToSave <= 0) {
      console.log("No hours to submit");
      toast({
        title: "No hours to submit",
        description: "Please enter hours or start the timer before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await saveTimeEntry(hoursToSave, 'submitted');
    console.log("Submission result:", success);
    
    if (success) {
      handleReset();
      // Call the callback to refresh the time entries list
      if (onEntrySubmitted) {
        onEntrySubmitted();
      }
    }
  };
  
  const handleSaveDraft = async () => {
    // Convert manualHours from string to number
    const hours = parseFloat(manualHours);
    const hoursToSave = hours > 0 
      ? hours 
      : trackingDuration > 0 
        ? trackingDuration / 3600 
        : 0;
        
    if (hoursToSave <= 0) {
      toast({
        title: "No hours to save",
        description: "Please enter hours or start the timer before saving as draft.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await saveTimeEntry(hoursToSave, 'draft');
    if (success) {
      handleReset();
      // Call the callback to refresh the time entries list
      if (onEntrySubmitted) {
        onEntrySubmitted();
      }
    }
  };
  
  // Determine if submit/save should be disabled
  const isFormSubmittable = () => {
    const hasHours = parseFloat(manualHours) > 0 || trackingDuration > 0;
    const hasProject = !!selectedProject;
    const hasTask = !!selectedTask;
    return hasHours && hasProject && hasTask && !isTracking && !isSubmitting && isProfileAvailable;
  };
  
  // Handle profile refresh button click
  const handleProfileRefreshClick = async () => {
    try {
      if (onProfileRefresh) {
        await onProfileRefresh();
      } else {
        await refreshProfile();
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast({
        title: "Profile refresh failed",
        description: "Please try again or reload the page",
        variant: "destructive"
      });
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
        {!isProfileAvailable && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-amber-600">Profile data not loaded</AlertTitle>
            <div className="flex items-center justify-between">
              <AlertDescription className="text-amber-600">
                Your profile is required to track time.
              </AlertDescription>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProfileRefreshClick}
                className="ml-2 h-8"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
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
          disabled={isTracking || !isProfileAvailable}
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
          disabled={!isProfileAvailable}
        />
        
        {showKeyboardShortcuts && <KeyboardShortcuts />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          disabled={!isFormSubmittable()}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isFormSubmittable()}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TimeEntryForm;
