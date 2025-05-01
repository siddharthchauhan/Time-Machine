
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Project, ProjectFormValues } from "./ProjectModel";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase } = useAuth();

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [supabase]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          clients (
            id,
            name
          )
        `)
        .order("name");

      if (error) throw error;

      // Map the response data to Project type
      const projectsData = data
        ? data.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            client_id: project.client_id,
            client_name: project.clients?.name,
            start_date: project.start_date,
            end_date: project.end_date,
            budget_hours: project.budget_hours,
            budget_amount: project.budget_amount,
            status: mapStatusToEnum(project.status),
            created_at: project.created_at,
            updated_at: project.updated_at
          }))
        : [];

      setProjects(projectsData);
      setFilteredProjects(projectsData);
    } catch (error: any) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map string status to enum
  const mapStatusToEnum = (status: string): "active" | "completed" | "onHold" | "archived" => {
    switch (status) {
      case "active":
        return "active";
      case "completed":
        return "completed";
      case "onHold":
        return "onHold";
      case "archived":
        return "archived";
      default:
        return "active"; // Default to active if unknown status
    }
  };

  // Filter projects when search term or active filter changes
  useEffect(() => {
    let filtered = projects;

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((project) => project.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, activeFilter, projects]);

  const handleCreateProject = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      
      // Get the current user's ID from the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: values.name,
          description: values.description,
          client_id: values.clientId || null,
          start_date: values.startDate,
          end_date: values.endDate,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          status: values.status,
          created_by: userId,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select("*")
        .single();

      if (error) throw error;

      // Fetch the client name if a client was selected
      let clientName = undefined;
      if (values.clientId) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("name")
          .eq("id", values.clientId)
          .single();
        
        if (clientData) {
          clientName = clientData.name;
        }
      }

      const newProject: Project = {
        ...data,
        client_name: clientName,
        status: mapStatusToEnum(data.status),
      };

      setProjects([...projects, newProject]);

      toast({
        title: "Project created",
        description: `${values.name} has been created successfully`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (projectId: string, values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: values.name,
          description: values.description,
          client_id: values.clientId || null,
          start_date: values.startDate,
          end_date: values.endDate,
          budget_hours: values.budgetHours,
          budget_amount: values.budgetAmount,
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select("*")
        .single();

      if (error) throw error;

      // Fetch the client name if a client was selected
      let clientName = undefined;
      if (values.clientId) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("name")
          .eq("id", values.clientId)
          .single();
        
        if (clientData) {
          clientName = clientData.name;
        }
      }

      const updatedProject: Project = {
        ...data,
        client_name: clientName,
        status: mapStatusToEnum(data.status),
      };

      setProjects(
        projects.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      );

      toast({
        title: "Project updated",
        description: `${values.name} has been updated successfully`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to archive this project?")) return false;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "archived", updated_at: new Date().toISOString() })
        .eq("id", projectId);

      if (error) throw error;

      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, status: "archived" } : project
        )
      );

      toast({
        title: "Project archived",
        description: "Project has been archived successfully",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error archiving project",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    }
  };

  return {
    projects: filteredProjects,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    isLoading,
    isSubmitting,
    handleCreateProject,
    handleUpdateProject,
    handleArchiveProject,
    refreshProjects: fetchProjects
  };
}
