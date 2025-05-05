
import { useState } from "react";
import { useFetchProjects } from "./useFetchProjects";
import { useProjectMutations } from "./useProjectMutations";
import { UseProjectsReturn } from "./projectTypes";
import { ProjectFormValues } from "../ProjectModel";

export function useProjects(): UseProjectsReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const {
    projects,
    setProjects,
    isLoading,
    error
  } = useFetchProjects();

  const {
    isSubmitting,
    handleCreateProject: createProject,
    handleUpdateProject: updateProject,
    handleArchiveProject: archiveProject,
  } = useProjectMutations(projects, setProjects);

  // Wrapper functions to maintain the same API
  const handleCreateProject = async (values: ProjectFormValues): Promise<boolean> => {
    return await createProject(values);
  };

  const handleUpdateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    return await updateProject(projectId, values);
  };

  const handleArchiveProject = async (projectId: string): Promise<boolean> => {
    return await archiveProject(projectId);
  };

  // To make the app compatible with the existing interface, provide these properties
  // Extract error message from Error object or use null if no error
  const dbConnectionError = error ? error.message : null;
  const retryConnection = () => {
    console.log("Retrying connection...");
    // This would normally reconnect to the database
  };

  return {
    projects,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    isLoading,
    isSubmitting,
    dbConnectionError,
    handleCreateProject,
    handleUpdateProject,
    handleArchiveProject,
    retryConnection
  };
}
