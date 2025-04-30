
export type TimeEntryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: TimeEntryStatus;
  description?: string;
  rejection_reason?: string | null;
}
