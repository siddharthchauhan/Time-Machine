
export type TimeEntryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface TimeEntry {
  id: string;
  project_id: string;
  task_id?: string;
  date: string;
  hours: number;
  status: TimeEntryStatus;
  description?: string;
  user_id: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
}

export interface Task {
  id: string;
  name: string;
}
