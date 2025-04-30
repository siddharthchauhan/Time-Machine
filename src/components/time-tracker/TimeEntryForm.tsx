import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Play, CalendarIcon, CircleStop } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type Project = {
  id: string;
  name: string;
};

type TimeEntryFormProps = {
  projects?: Project[];
};

// Default tasks data structure
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

const TimeEntryForm = ({ projects = [] }: TimeEntryFormProps) => {
  // If no projects are provided, use some defaults
  const availableProjects = projects.length > 0 ? projects : [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'CRM Integration' },
  ];

  const [date, setDate] = useState<Date>(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [description, setDescription] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [trackingDuration, setTrackingDuration] = useState(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { profile, supabase } = useAuth();
  
  // Create a tasks variable using the defaultTasks
  const tasks = defaultTasks;

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
    
    const intervalId = setInterval(() => {
      setTrackingDuration(prev => prev + 1);
    }, 1000);
    
    document.documentElement.setAttribute('data-timer-id', intervalId.toString());
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    
    const intervalId = document.documentElement.getAttribute('data-timer-id');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
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
      
      // Reset form
      setSelectedProject('');
      setSelectedTask('');
      setDescription('');
      setManualHours('');
      setTrackingDuration(0);
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
      
      // Reset form
      setSelectedProject('');
      setSelectedTask('');
      setDescription('');
      setManualHours('');
      setTrackingDuration(0);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Time</CardTitle>
        <CardDescription>
          Record time spent on tasks and projects
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="project">Project</Label>
            <Select 
              value={selectedProject} 
              onValueChange={(value) => {
                setSelectedProject(value);
                setSelectedTask('');
              }}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="task">Task</Label>
            <Select 
              value={selectedTask} 
              onValueChange={setSelectedTask}
              disabled={!selectedProject}
            >
              <SelectTrigger id="task">
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                {selectedProject && tasks[selectedProject as keyof typeof tasks]?.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="hours">Duration (hours)</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                placeholder="0.00"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                disabled={isTracking}
              />
            </div>
            
            <div className="space-y-1">
              <Label>Live Timer</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={isTracking ? handleStopTracking : handleStartTracking}
                  variant={isTracking ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isTracking ? (
                    <>
                      <CircleStop className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Timer
                    </>
                  )}
                </Button>
                {isTracking && (
                  <div className="bg-muted text-foreground p-2 rounded-md min-w-24 text-center">
                    {formatDuration(trackingDuration)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work you did..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => {
            setSelectedProject('');
            setSelectedTask('');
            setDescription('');
            setManualHours('');
            setTrackingDuration(0);
            setIsTracking(false);
          }}>
            Reset
          </Button>
          <div className="space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              <Clock className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="button" onClick={handleSubmitForApproval} disabled={isSubmitting} variant="default">
              <Clock className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TimeEntryForm;
