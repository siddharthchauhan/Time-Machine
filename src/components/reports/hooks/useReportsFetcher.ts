
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { TimeEntryData, ProjectData } from '../types/reportTypes';

// Project colors for consistent visualization
const PROJECT_COLORS = [
  "#000000", "#333333", "#555555", "#777777", "#999999", 
  "#222222", "#444444", "#666666", "#888888", "#AAAAAA"
];

export function useReportsFetcher(selectedDate: Date, selectedProjectId: string = 'all') {
  const [timeEntries, setTimeEntries] = useState<TimeEntryData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile, supabase } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get dates for the current week of the selected date
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        
        // Check if we're using a guest user
        const isGuestUser = profile?.id === 'guest';
        
        let projectsData: ProjectData[] = [];
        let timeEntriesData: TimeEntryData[] = [];
        
        // Fetch projects
        if (isGuestUser) {
          // Get from localStorage
          const storedProjects = localStorage.getItem('guestProjects');
          if (storedProjects) {
            projectsData = JSON.parse(storedProjects).map((project: any, index: number) => ({
              id: project.id,
              name: project.name,
              color: PROJECT_COLORS[index % PROJECT_COLORS.length]
            }));
          }
        } else {
          // Get from Supabase
          const { data: projectsResult, error: projectsError } = await supabase
            .from('projects')
            .select('id, name');
            
          if (projectsError) {
            throw projectsError;
          }
          
          if (projectsResult) {
            projectsData = projectsResult.map((project, index) => ({
              id: project.id,
              name: project.name,
              color: PROJECT_COLORS[index % PROJECT_COLORS.length]
            }));
          }
        }
        
        // Fetch time entries
        if (isGuestUser) {
          // Get from localStorage
          const storedEntries = localStorage.getItem('guestTimeEntries');
          if (storedEntries) {
            const parsedEntries = JSON.parse(storedEntries);
            // Filter entries for the selected week
            timeEntriesData = parsedEntries.filter((entry: any) => {
              const entryDate = parseISO(entry.date);
              return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
            }).map((entry: any) => ({
              id: entry.id,
              project_id: entry.project_id,
              task_id: entry.task_id,
              date: entry.date,
              hours: entry.hours,
              description: entry.description,
              billable: true // Assume all entries are billable for the demo
            }));
          }
        } else {
          // Get from Supabase - fetch time entries for the selected week
          const { data: entriesResult, error: entriesError } = await supabase
            .from('time_entries')
            .select('id, project_id, task_id, date, hours, description')
            .gte('date', format(weekStart, 'yyyy-MM-dd'))
            .lte('date', format(weekEnd, 'yyyy-MM-dd'))
            .eq('user_id', profile?.id);
            
          if (entriesError) {
            throw entriesError;
          }
          
          if (entriesResult) {
            timeEntriesData = entriesResult.map(entry => ({
              ...entry,
              billable: true // Assume all entries are billable for the demo
            }));
          }
        }
        
        // Filter by selected project if needed
        if (selectedProjectId !== 'all') {
          timeEntriesData = timeEntriesData.filter(entry => entry.project_id === selectedProjectId);
        }
        
        // Attach project names to time entries
        timeEntriesData = timeEntriesData.map(entry => {
          const project = projectsData.find(p => p.id === entry.project_id);
          return {
            ...entry,
            project_name: project?.name || 'Unknown Project'
          };
        });
        
        setProjects(projectsData);
        setTimeEntries(timeEntriesData);
      } catch (err: any) {
        console.error('Error fetching reports data:', err);
        setError(err.message || 'Failed to load report data');
        toast({
          title: "Error loading report data",
          description: err.message || 'Failed to load report data',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate, selectedProjectId, profile, supabase, toast]);

  return {
    timeEntries,
    projects,
    isLoading,
    error
  };
}
