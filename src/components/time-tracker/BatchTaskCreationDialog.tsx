
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

interface BatchTaskCreationDialogProps {
  projects: any[];
  onTasksCreated: (count: number) => void;
}

type WeekdayHours = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

const DEFAULT_WEEKDAY_HOURS: WeekdayHours = {
  monday: 8,
  tuesday: 8,
  wednesday: 8,
  thursday: 8,
  friday: 8,
  saturday: 0,
  sunday: 0,
};

const BatchTaskCreationDialog: React.FC<BatchTaskCreationDialogProps> = ({
  projects,
  onTasksCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [weekdayHours, setWeekdayHours] = useState<WeekdayHours>(DEFAULT_WEEKDAY_HOURS);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const handleCreateBatchTasks = async () => {
    if (!projectId || !taskName || selectedDates.length === 0 || !user) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select at least one date.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // First create the task
      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .insert({
          name: taskName,
          project_id: projectId,
          description: description || null,
          created_by: user.id,
          status: "active",
        })
        .select("id")
        .single();

      if (taskError) {
        throw taskError;
      }

      const taskId = taskData.id;

      // Now create time entries for all selected dates
      const timeEntries = selectedDates.map((date) => {
        const dayOfWeek = date.getDay();
        // Convert from JavaScript's 0-6 (Sun-Sat) to our weekday hours object
        const dayMap: { [key: number]: keyof WeekdayHours } = {
          0: "sunday",
          1: "monday",
          2: "tuesday",
          3: "wednesday",
          4: "thursday", 
          5: "friday",
          6: "saturday",
        };
        
        const day = dayMap[dayOfWeek];
        const hours = weekdayHours[day];

        // Skip days with 0 hours
        if (hours <= 0) return null;

        return {
          user_id: user.id,
          project_id: projectId,
          task_id: taskId,
          description: description || null,
          date: format(date, "yyyy-MM-dd"),
          hours: hours,
          status: "planned",
          approval_status: "pending",
        };
      }).filter(Boolean); // Remove null entries (days with 0 hours)

      if (timeEntries.length === 0) {
        toast({
          title: "No entries to create",
          description: "The selected days all have 0 hours. Please adjust your weekday hours.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from("time_entries").insert(timeEntries);

      if (error) {
        throw error;
      }

      toast({
        title: "Task entries created",
        description: `Successfully created ${timeEntries.length} task entries.`,
      });
      
      onTasksCreated(timeEntries.length);
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error creating batch tasks:", error);
      toast({
        title: "Error creating tasks",
        description: error.message || "Failed to create tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDates([]);
    setTaskName("");
    setDescription("");
    setProjectId("");
    setWeekdayHours(DEFAULT_WEEKDAY_HOURS);
  };

  const updateWeekdayHours = (day: keyof WeekdayHours, hours: number) => {
    setWeekdayHours((prev) => ({
      ...prev,
      [day]: hours,
    }));
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDates((currentDates) => {
      const dateExists = currentDates.some(
        (date) => format(date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );

      if (dateExists) {
        return currentDates.filter(
          (date) => format(date, "yyyy-MM-dd") !== format(day, "yyyy-MM-dd")
        );
      } else {
        return [...currentDates, day];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="secondary">Batch Create Tasks</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Multiple Task Entries</DialogTitle>
          <DialogDescription>
            Plan your tasks for multiple days at once. Select dates, set hours by weekday,
            and create entries for a whole period.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                value={projectId}
                onValueChange={(value) => setProjectId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Projects</SelectLabel>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-name">Task Name</Label>
              <Input
                id="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Select Dates</Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  className="rounded-md border"
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Hours by Weekday</Label>
              <div className="space-y-2">
                {(Object.keys(weekdayHours) as Array<keyof WeekdayHours>).map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <Label className="w-24 capitalize">{day}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={weekdayHours[day]}
                      onChange={(e) => updateWeekdayHours(day, parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBatchTasks} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create {selectedDates.length > 0 ? `for ${selectedDates.length} days` : 'Tasks'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchTaskCreationDialog;
