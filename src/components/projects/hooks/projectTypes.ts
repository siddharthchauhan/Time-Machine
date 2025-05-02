
import { Project, ProjectFormValues } from "../ProjectModel";

export interface UseProjectsReturn {
  projects: Project[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isLoading: boolean;
  isSubmitting: boolean;
  dbConnectionError: string | null;
  handleCreateProject: (values: ProjectFormValues) => Promise<boolean>;
  handleUpdateProject: (projectId: string, values: ProjectFormValues) => Promise<boolean>;
  handleArchiveProject: (projectId: string) => Promise<boolean>;
  retryConnection: () => void;
}
