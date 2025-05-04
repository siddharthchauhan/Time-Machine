
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  const [selectedProject, setSelectedProject] = useState("");
  const [numberOfEntries, setNumberOfEntries] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) {
      toast({
        title: "Project required",
        description: "Please select a project for the batch entries",
        variant: "destructive",
      });
      return;
    }

    const count = parseInt(numberOfEntries);
    if (isNaN(count) || count < 1 || count > 50) {
      toast({
        title: "Invalid number of entries",
        description: "Please enter a number between 1 and 50",
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
      
      // For the "guest" user, we'll create mock time entries
      if (profile.id === 'guest') {
        // Generate the current date as YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        // Create an array to store the new entries
        const newEntries = [];
        
        // Get existing time entries from localStorage or initialize empty array
        const existingEntries = localStorage.getItem('guestTimeEntries')
          ? JSON.parse(localStorage.getItem('guestTimeEntries')!)
          : [];
        
        // Create mock time entries
        for (let i = 0; i < count; i++) {
          newEntries.push({
            id: crypto.randomUUID(),
            project_id: selectedProject,
            date: today,
            hours: Math.floor(Math.random() * 4) + 1, // Random between 1-4 hours
            description: `Auto-generated time entry ${i+1}`,
            user_id: profile.id,
            status: 'draft',
            approval_status: 'pending',
            created_at: new Date().toISOString()
          });
        }
        
        // Save to localStorage
        localStorage.setItem('guestTimeEntries', JSON.stringify([...existingEntries, ...newEntries]));
        
        // Notify about the "created" entries
        onTasksCreated(count);
        toast({
          title: "Batch creation complete",
          description: `${count} time entries have been created`,
        });
        
        setOpen(false);
        return;
      }
      
      // Generate the current date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Create an array of time entries to insert
      const timeEntries = Array.from({ length: count }, (_, i) => ({
        project_id: selectedProject,
        date: today,
        hours: Math.floor(Math.random() * 4) + 1, // Random between 1-4 hours
        description: `Auto-generated time entry ${i+1}`,
        user_id: profile.id,
        status: 'draft',
        approval_status: 'pending'
      }));
      
      // Insert the entries into the database
      const { error } = await supabase
        .from('time_entries')
        .insert(timeEntries);
      
      if (error) throw error;
      
      onTasksCreated(count);
      
      toast({
        title: "Batch creation complete",
        description: `${count} time entries have been created`,
      });
      
      setOpen(false);
    } catch (error: any) {
      console.error("Batch creation error:", error);
      toast({
        title: "Error creating batch entries",
        description: error.message || "Failed to create batch entries",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-1">
          <FileSpreadsheet className="h-4 w-4" />
          Batch Create Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Batch Create Time Entries</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-select">Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="num-entries">Number of Entries (1-50)</Label>
              <Input
                id="num-entries"
                type="number"
                min={1}
                max={50}
                value={numberOfEntries}
                onChange={(e) => setNumberOfEntries(e.target.value)}
              />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Entries"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchTaskCreationDialog;
