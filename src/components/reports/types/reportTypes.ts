
export interface TimeEntryData {
  id: string;
  project_id: string;
  project_name?: string;
  task_id?: string;
  date: string;
  hours: number;
  description?: string;
  billable?: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  color?: string;
}

export interface WeeklyChartData {
  name: string;
  hours: number;
}

export interface ProjectChartData {
  name: string;
  hours: number;
  color: string;
}

export interface ReportsSummary {
  totalHours: number;
  targetHours: number;
  completionPercentage: number;
  projectDistribution: {
    name: string;
    hours: number;
    color?: string;
  }[];
  billableHours: number;
  billablePercentage: number;
}
