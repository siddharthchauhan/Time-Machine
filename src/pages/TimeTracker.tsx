
import MainLayout from "@/components/layout/MainLayout";
import TimeEntryForm from "@/components/time-tracker/TimeEntryForm";
import TimeEntriesList from "@/components/time-tracker/TimeEntriesList";
import NewProjectDialog from "@/components/time-tracker/NewProjectDialog";
import NewTaskDialog from "@/components/time-tracker/NewTaskDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Default projects for demo purposes
const defaultProjects = [
  { id: '1', name: 'Website Redesign' },
  { id: '2', name: 'Mobile App' },
  { id: '3', name: 'CRM Integration' },
];

const TimeTracker = () => {
  const [projects, setProjects] = useState(defaultProjects);
  const { toast } = useToast();
  
  const handleProjectCreated = (newProject: { id: string; name: string }) => {
    setProjects([...projects, newProject]);
  };
  
  const handleTaskCreated = (newTask: { id: string; name: string; projectId: string }) => {
    // In a real app, this would update the tasks list
    // For now we just display a success toast as the tasks are handled in the TimeEntryForm component
    toast({
      title: "Task added",
      description: `${newTask.name} has been added to the selected project`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Time Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Record and manage your time entries for projects and tasks.
            </p>
          </div>
          <div className="flex gap-2">
            <NewTaskDialog projects={projects} onTaskCreated={handleTaskCreated} />
            <NewProjectDialog onProjectCreated={handleProjectCreated} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TimeEntryForm projects={projects} />
          </div>
          <div className="lg:col-span-2">
            <TimeEntriesList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimeTracker;
