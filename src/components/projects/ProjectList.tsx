import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "./ProjectModel";
import { ProjectCard } from "./ProjectCard";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  searchTerm: string;
  activeFilter: string;
  onClearSearch: () => void;
  onResetFilter: () => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onArchiveProject: (projectId: string) => void;
  canCreateProjects?: boolean;
}

export function ProjectList({
  projects,
  isLoading,
  searchTerm,
  activeFilter,
  onClearSearch,
  onResetFilter,
  onAddProject,
  onEditProject,
  onArchiveProject,
  canCreateProjects = true
}: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground mb-2 text-center">
            {searchTerm
              ? "No projects found matching your search."
              : activeFilter !== "all"
              ? `No ${activeFilter} projects found.`
              : "No projects found. Create your first project to get started!"}
          </p>
          {searchTerm || activeFilter !== "all" ? (
            <div className="flex gap-2">
              {searchTerm && (
                <Button variant="outline" onClick={onClearSearch}>
                  Clear search
                </Button>
              )}
              {activeFilter !== "all" && (
                <Button variant="outline" onClick={onResetFilter}>
                  Show all projects
                </Button>
              )}
            </div>
          ) : (
            canCreateProjects ? (
              <Button onClick={onAddProject}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Only managers can create new projects</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onEdit={onEditProject}
          onArchive={onArchiveProject}
        />
      ))}
    </div>
  );
}
