
import { TimeEntryData, ProjectData, WeeklyChartData, ProjectChartData, ReportsSummary } from '../types/reportTypes';
import { parseISO } from 'date-fns';

// Transform time entries into weekly chart data
export const transformToWeeklyChartData = (timeEntries: TimeEntryData[]): WeeklyChartData[] => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Initialize with zero hours for all days
  const dayData = days.map(day => ({ name: day, hours: 0 }));
  
  // Sum hours by day
  timeEntries.forEach(entry => {
    const entryDate = parseISO(entry.date);
    const dayOfWeek = entryDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    dayData[dayOfWeek].hours += Number(entry.hours);
  });
  
  // Reorder to start with Monday
  return [...dayData.slice(1), dayData[0]];
};

// Transform time entries into project chart data
export const transformToProjectChartData = (
  timeEntries: TimeEntryData[], 
  projects: ProjectData[]
): ProjectChartData[] => {
  const projectHours: Record<string, number> = {};
  
  // Sum hours by project
  timeEntries.forEach(entry => {
    const projectId = entry.project_id;
    if (!projectHours[projectId]) {
      projectHours[projectId] = 0;
    }
    projectHours[projectId] += Number(entry.hours);
  });
  
  // Convert to chart format
  return Object.entries(projectHours).map(([projectId, hours]) => {
    const project = projects.find(p => p.id === projectId);
    return {
      name: project?.name || 'Unknown Project',
      hours,
      color: project?.color || '#000000'
    };
  }).sort((a, b) => b.hours - a.hours); // Sort by hours descending
};

// Calculate summary statistics
export const calculateSummary = (
  timeEntries: TimeEntryData[], 
  projectChartData: ProjectChartData[]
): ReportsSummary => {
  const totalHours = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const targetHours = 40; // Weekly target hours
  const completionPercentage = (totalHours / targetHours) * 100;
  
  // Calculate billable hours (assuming all entries are billable for now)
  const billableHours = timeEntries.reduce((sum, entry) => 
    entry.billable ? sum + Number(entry.hours) : sum, 0);
  const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;
  
  return {
    totalHours,
    targetHours,
    completionPercentage: Math.min(completionPercentage, 100), // Cap at 100%
    projectDistribution: projectChartData,
    billableHours,
    billablePercentage
  };
};
