import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import TimeEntryHeader from "./TimeEntryHeader";
import ProjectTaskSelector from "./ProjectTaskSelector";
import DatePicker from "./DatePicker";
import TimeTracker from "./TimeTracker";
import DescriptionField from "./DescriptionField";
import TimeEntryActions from "./TimeEntryActions";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

type Project = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  name: string;
};

type TimeEntryFormProps = {
  projects?: Project[];
  tasks?: Record<string, Task[]>;
};

const TimeEntryForm = ({ projects = [], tasks = {} }: TimeEntryFormProps) => {
  // If no projects are provided, use some defaults
  const availableProjects = projects.length > 0 ? projects : [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'CRM Integration' },
  ];

  // Default tasks data structure for fallback
  const defaultTasks = {
    '1': [
      { id: '1-1', name: 'Frontend Development' },
      { id: '1-2', name: 'Content Creation' },
      { id: '1-3', name: 'UI Design' },
    ],
    '2': [
      { id: '2-1', name: 'UI Design' },
      { id: '2-2', name: 'Feature Development' },
      { id: '2-3', name: 'QA Testing' },
    ],
    '3': [
      { id: '3-1', name: 'API Development' },
      { id: '3-2', name: 'Integration Testing' },
      { id: '3-3', name: 'Documentation' },
    ],
  };

  // Merge provided tasks with default tasks as fallback
  const availableTasks = Object.keys(tasks).length > 0 ? tasks : defaultTasks;

  const [date, setDate] = useState<Date>(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [trackingDuration, setTrackingDuration] = useState(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { profile, supabase } = useAuth();
  const intervalIdRef = useRef<number | null>(null);
  
  // Create a tasks variable using the defaultTasks
  const tasks = availableTasks;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    if (!selectedProject || !selectedTask) {
      toast({
        title: "Required fields missing",
        description: "Please select a project and task before starting the timer",
        variant: "destructive",
      });
      return;
    }
    
    setTrackingStartTime(new Date());
    setIsTracking(true);
    setIsPaused(false);
    
    const intervalId = window.setInterval(() => {
      setTrackingDuration(prev => prev + 1);
    }, 1000);
    
    intervalIdRef.current = intervalId;
    document.documentElement.setAttribute('data-timer-id', intervalId.toString());
  };

  const handlePauseTracking = () => {
    if (isPaused) {
      // Resume tracking
      setIsPaused(false);
      
      const intervalId = window.setInterval(() => {
        setTrackingDuration(prev => prev + 1);
      }, 1000);
      
      intervalIdRef.current = intervalId;
      document.documentElement.setAttribute('data-timer-id', intervalId.toString());
      
      toast({
        title: "Timer resumed",
        description: "Time tracking has been resumed",
      });
    } else {
      // Pause tracking
      setIsPaused(true);
      
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      
      toast({
        title: "Timer paused",
        description: "Time tracking has been paused",
      });
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    const hours = trackingDuration / 3600;
    setManualHours(hours.toFixed(2));
    
    toast({
      title: "Time tracking stopped",
      description: `Tracked ${formatDuration(trackingDuration)}`,
    });
  };

  // Add state for handling submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !selectedTask || (!manualHours && !isTracking)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (isTracking) {
      handleStopTracking();
    }

    setIsSubmitting(true);
    
    try {
      // Save time entry to Supabase
      const hours = parseFloat(manualHours);
      const entryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          project_id: selectedProject,
          task_id: selectedTask,
          date: entryDate,
          hours: hours,
          description: description,
          user_id: profile?.id,
          status: 'draft',
          approval_status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Time entry saved",
        description: "Your time entry has been saved as a draft",
      });
      
      handleReset();
    } catch (error: any) {
      toast({
        title: "Error saving time entry",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitForApproval = async () => {
    if (!selectedProject || !selectedTask || (!manualHours && !isTracking)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (isTracking) {
      handleStopTracking();
    }

    setIsSubmitting(true);
    
    try {
      // Save time entry to Supabase and submit for approval
      const hours = parseFloat(manualHours);
      const entryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const { error } = await supabase
        .from('time_entries')
        .insert({
          project_id: selectedProject,
          task_id: selectedTask,
          date: entryDate,
          hours: hours,
          description: description,
          user_id: profile?.id,
          status: 'submitted',
          approval_status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Time entry submitted",
        description: "Your time entry has been submitted for approval",
      });
      
      handleReset();
    } catch (error: any) {
      toast({
        title: "Error submitting time entry",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedProject('');
    setSelectedTask('');
    setDescription('');
    setManualHours('');
    setTrackingDuration(0);
    setIsTracking(false);
    setIsPaused(false);
    
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

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
        if (isTracking) {
          handleStopTracking();
        } else {
          handleStartTracking();
        }
      }

      // Alt+P to pause/resume timer
      if (e.altKey && e.key === 'p' && isTracking) {
        e.preventDefault();
        handlePauseTracking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTracking, isPaused]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <TimeEntryHeader />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ProjectTaskSelector 
            projects={availableProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            tasks={availableTasks}
          />
          
          <DatePicker 
            date={date}
            setDate={setDate}
          />
          
          <TimeTracker 
            isTracking={isTracking}
            isPaused={isPaused}
            trackingDuration={trackingDuration}
            manualHours={manualHours}
            setManualHours={setManualHours}
            handleStartTracking={handleStartTracking}
            handleStopTracking={handleStopTracking}
            handlePauseTracking={handlePauseTracking}
          />
          
          <DescriptionField 
            description={description}
            setDescription={setDescription}
          />
          
          <KeyboardShortcuts />
        </CardContent>
        
        <CardFooter className="flex flex-col items-start gap-3">
          <TimeEntryActions 
            isSubmitting={isSubmitting}
            isTracking={isTracking}
            handleSubmitForApproval={handleSubmitForApproval}
            handleReset={handleReset}
          />
        </CardFooter>
      </form>
    </Card>
  );
};

export default TimeEntryForm;
