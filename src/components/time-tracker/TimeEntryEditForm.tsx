
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeEntry } from "./types";
import DatePicker from "./DatePicker";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeEntryEditFormProps {
  entry: TimeEntry;
  projects: any[];
  tasks: Record<string, any[]>;
  onSuccess: () => void;
  onCancel: () => void;
}

const TimeEntryEditForm = ({ entry, projects, tasks, onSuccess, onCancel }: TimeEntryEditFormProps) => {
  const [date, setDate] = useState<Date>(new Date(entry.date));
  const [selectedProject, setSelectedProject] = useState('');
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [hours, setHours] = useState(entry.hours.toString());
  const [description, setDescription] = useState(entry.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  // Find project ID from name
  useEffect(() => {
    const findProjectId = () => {
      const project = projects.find(p => p.name === entry.project);
      if (project) {
        setSelectedProject(project.id);
      }
    };
    
    if (projects.length > 0) {
      findProjectId();
    }
  }, [projects, entry]);

  // Update available tasks when project changes
  useEffect(() => {
    if (selectedProject && tasks[selectedProject]) {
      setAvailableTasks(tasks[selectedProject]);
      
      // If we just set the project from the entry, try to find the matching task
      if (!selectedTask) {
        const task = tasks[selectedProject].find(t => t.name === entry.task);
        if (task) {
          setSelectedTask(task.id);
        }
      }
    } else {
      setAvailableTasks([]);
      setSelectedTask('');
    }
  }, [selectedProject, tasks, entry.task]);

  const handleSubmit = async () => {
    if (!selectedProject || !selectedTask || !hours) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate hours
    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours <= 0) {
      toast({
        title: "Invalid hours",
        description: "Hours must be a positive number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const entryDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // For guest user, update in localStorage
      if (profile?.id === 'guest') {
        // Get existing time entries from localStorage
        const storedEntries = localStorage.getItem('guestTimeEntries');
        if (storedEntries) {
          const entries = JSON.parse(storedEntries);
          
          // Find and update the entry
          const updatedEntries = entries.map((item: any) => {
            if (item.id === entry.id) {
              return {
                ...item,
                project_id: selectedProject,
                task_id: selectedTask,
                date: entryDate,
                hours: numericHours,
                description: description,
                updated_at: new Date().toISOString()
              };
            }
            return item;
          });
          
          // Save back to localStorage
          localStorage.setItem('guestTimeEntries', JSON.stringify(updatedEntries));
          
          toast({
            title: "Time entry updated",
            description: "Your time entry has been successfully updated",
          });
          
          onSuccess();
        }
      } else {
        // For authenticated users, update in database
        const { error } = await supabase
          .from('time_entries')
          .update({
            project_id: selectedProject,
            task_id: selectedTask,
            date: entryDate,
            hours: numericHours,
            description: description
          })
          .eq('id', entry.id)
          .eq('user_id', profile?.id); // Safety check
          
        if (error) throw error;
        
        toast({
          title: "Time entry updated",
          description: "Your time entry has been successfully updated",
        });
        
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error updating time entry:", error);
      toast({
        title: "Error updating time entry",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DatePicker date={date} setDate={setDate} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select 
          value={selectedProject} 
          onValueChange={setSelectedProject}
        >
          <SelectTrigger id="project">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <Select 
          value={selectedTask} 
          onValueChange={setSelectedTask}
          disabled={!selectedProject || availableTasks.length === 0}
        >
          <SelectTrigger id="task">
            <SelectValue placeholder="Select task" />
          </SelectTrigger>
          <SelectContent>
            {availableTasks.map(task => (
              <SelectItem key={task.id} value={task.id}>
                {task.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hours">Hours</Label>
        <Input
          id="hours"
          type="number"
          step="0.25"
          min="0.25"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Enter hours"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="min-h-24"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default TimeEntryEditForm;
