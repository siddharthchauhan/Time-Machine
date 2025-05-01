
export type TimeEntry = {
  project_id: string;
  task_id: string;
  date: string;
  hours: number;
  description?: string;
  user_id: string;
  status: 'draft' | 'submitted';
  approval_status: 'pending' | 'approved' | 'rejected';
};

export type UseTimeEntryState = {
  date: Date;
  isTracking: boolean;
  isPaused: boolean;
  selectedProject: string;
  selectedTask: string;
  description: string;
  manualHours: string;
  trackingDuration: number;
  trackingStartTime: Date | null;
  isSubmitting: boolean;
};

export type UseTimeEntryActions = {
  setDate: (date: Date) => void;
  setSelectedProject: (id: string) => void;
  setSelectedTask: (id: string) => void;
  setDescription: (description: string) => void;
  setManualHours: (hours: string) => void;
  handleStartTracking: () => void;
  handlePauseTracking: () => void;
  handleStopTracking: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleSubmitForApproval: () => Promise<void>;
  handleReset: () => void;
};

export type Task = {
  id: string;
  name: string;
};
