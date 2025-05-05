
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, format, parseISO, isWithinInterval } from "date-fns";

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

export function useReportsData(selectedDate: Date, selectedProjectId: string = 'all') {
  const [timeEntries, setTimeEntries] = useState<TimeEntryData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile, supabase } = useAuth();
  const { toast } = useToast();

  // Generate colors for projects that don't have one
  const PROJECT_COLORS = [
    "#000000", "#333333", "#555555", "#777777", "#999999", 
    "#222222", "#444444", "#666666", "#888888", "#AAAAAA"
  ];

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

  // Transform time entries into weekly chart data
  const weeklyChartData = () => {
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
    const mondayStart = [...dayData.slice(1), dayData[0]];
    
    return mondayStart;
  };

  // Transform time entries into project chart data
  const projectChartData = () => {
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
  const getSummary = (): ReportsSummary => {
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
      projectDistribution: projectChartData(),
      billableHours,
      billablePercentage
    };
  };

  return {
    isLoading,
    error,
    timeEntries,
    projects,
    weeklyChartData: weeklyChartData(),
    projectChartData: projectChartData(),
    summary: getSummary()
  };
}
