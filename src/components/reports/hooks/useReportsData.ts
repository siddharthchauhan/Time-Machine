
import { useReportsFetcher } from './useReportsFetcher';
import { transformToWeeklyChartData, transformToProjectChartData, calculateSummary } from '../utils/dataTransformUtils';

export function useReportsData(selectedDate: Date, selectedProjectId: string = 'all') {
  const { timeEntries, projects, isLoading, error } = useReportsFetcher(selectedDate, selectedProjectId);
  
  // Transform data for charts and summary
  const weeklyChartData = transformToWeeklyChartData(timeEntries);
  const projectChartData = transformToProjectChartData(timeEntries, projects);
  const summary = calculateSummary(timeEntries, projectChartData);

  return {
    isLoading,
    error,
    timeEntries,
    projects,
    weeklyChartData,
    projectChartData,
    summary
  };
}

// Re-export types for convenience
export * from '../types/reportTypes';
