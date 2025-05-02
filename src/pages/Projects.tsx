import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, ProjectFormValues } from "@/components/projects/ProjectModel";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { useProjects } from "@/components/projects/hooks";

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  const {
    projects,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    isLoading,
    isSubmitting,
    handleCreateProject,
    handleUpdateProject,
    handleArchiveProject
  } = useProjects();

  const handleOpenDialog = (project: Project | null = null) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentProject(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    let success;
    
    if (currentProject) {
      success = await handleUpdateProject(currentProject.id, values);
    } else {
      success = await handleCreateProject(values);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your projects and track time against them
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md flex-1"
          />
          
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="flex-1">
            <TabsList className="grid grid-cols-4 sm:w-fit">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ProjectList 
          projects={projects}
          isLoading={isLoading}
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          onClearSearch={() => setSearchTerm("")}
          onResetFilter={() => setActiveFilter("all")}
          onAddProject={() => handleOpenDialog()}
          onEditProject={(project) => handleOpenDialog(project)}
          onArchiveProject={handleArchiveProject}
        />
      </div>

      <ProjectDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentProject={currentProject}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
      />
    </MainLayout>
  );
};

export default Projects;
