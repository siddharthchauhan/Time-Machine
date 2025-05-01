
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import TimeEntryHeader from "./TimeEntryHeader";
import ProjectTaskSelector from "./ProjectTaskSelector";
import DatePicker from "./DatePicker";
import TimeTracker from "./TimeTracker";
import DescriptionField from "./DescriptionField";
import TimeEntryActions from "./TimeEntryActions";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useTimeEntry } from "./hooks/useTimeEntry";

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
  // If no projects are provided, use defaults
  const availableProjects = projects.length > 0 ? projects : [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'CRM Integration' },
  ];

  // Default tasks data structure for fallback
  const availableTasks = Object.keys(tasks).length > 0 ? tasks : {
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
    isSubmitting,
    handleStartTracking,
    handlePauseTracking,
    handleStopTracking,
    handleSubmit,
    handleSubmitForApproval,
    handleReset
  } = useTimeEntry(availableTasks);

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
