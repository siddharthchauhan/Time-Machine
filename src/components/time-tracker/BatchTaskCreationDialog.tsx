
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import ProjectTaskSelector from "./ProjectTaskSelector";

type Project = {
  id: string;
  name: string;
};

type BatchTaskCreationDialogProps = {
  projects: Project[];
  onTasksCreated: (count: number) => void;
};

const BatchTaskCreationDialog = ({ projects, onTasksCreated }: BatchTaskCreationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("8");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();

  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;

    // Check if the date is already selected
    const dateExists = selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );

    // Toggle the date
    if (dateExists) {
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => selectedDate.toDateString() !== date.toDateString()
        )
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !selectedTask) {
      toast({
        title: "Missing fields",
        description: "Please select a project and task",
        variant: "destructive",
      });
      return;
    }

    if (selectedDates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select at least one date",
        variant: "destructive",
      });
      return;
    }

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      toast({
        title: "Invalid hours",
        description: "Please enter a valid number of hours",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Make sure we have a valid user profile ID
      if (!profile?.id) {
        throw new Error("User profile not available");
      }
      
      // Prepare entries for insertion
      const entries = selectedDates.map(date => ({
        project_id: selectedProject,
        task_id: selectedTask,
        date: format(date, 'yyyy-MM-dd'),
        hours: parsedHours,
        description: description,
        user_id: profile.id,
        status: 'draft',
        approval_status: 'pending'
      }));
      
      // Insert the entries
      const { data, error } = await supabase
        .from('time_entries')
        .insert(entries);
      
      if (error) throw error;
      
      toast({
        title: "Time entries created",
        description: `Successfully created ${entries.length} time entries`,
      });
      
      onTasksCreated(entries.length);
      
      // Reset form
      setSelectedDates([]);
      setSelectedTask("");
      setDescription("");
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error creating time entries",
        description: error.message || "Failed to create time entries",
        variant: "destructive",
      });
      console.error("Batch task creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <CalendarPlus className="h-4 w-4" />
          Batch Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Batch Create Time Entries</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectTaskSelector
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                tasks={{}}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Daily Hours</Label>
              <Input
                type="number"
                step="0.25"
                min="0.25"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                disabled={isSubmitting}
                className="max-w-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for all entries..."
                rows={2}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select Dates</Label>
              <p className="text-sm text-muted-foreground">
                Click on dates to select/deselect them ({selectedDates.length} selected)
              </p>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onDayClick={handleDayClick}
                  disabled={isSubmitting}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedDates.length === 0}
            >
              {isSubmitting 
                ? `Creating ${selectedDates.length} entries...` 
                : `Create ${selectedDates.length} Entries`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchTaskCreationDialog;
