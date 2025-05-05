
import { useState } from "react";
import { Project, ProjectFormValues } from "../ProjectModel";
import { useCreateProject } from "./mutations/useCreateProject";
import { useUpdateProject } from "./mutations/useUpdateProject";
import { useArchiveProject } from "./mutations/useArchiveProject";

export function useProjectMutations(
  projects: Project[], 
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { handleCreateProject } = useCreateProject(projects, setProjects);
  const { handleUpdateProject } = useUpdateProject(projects, setProjects);
  const { handleArchiveProject } = useArchiveProject(projects, setProjects);
  
  // Wrap the individual hook functions to manage isSubmitting at this level
  const createProject = async (values: ProjectFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    const result = await handleCreateProject(values);
    setIsSubmitting(false);
    return result;
  };
  
  const updateProject = async (projectId: string, values: ProjectFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    const result = await handleUpdateProject(projectId, values);
    setIsSubmitting(false);
    return result;
  };
  
  const archiveProject = async (projectId: string): Promise<boolean> => {
    setIsSubmitting(true);
    const result = await handleArchiveProject(projectId);
    setIsSubmitting(false);
    return result;
  };
  
  return {
    isSubmitting,
    handleCreateProject: createProject,
    handleUpdateProject: updateProject,
    handleArchiveProject: archiveProject
  };
}
