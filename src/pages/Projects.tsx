import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Pencil, Archive, BarChart3, Calendar, Clock, CircleDollarSign } from "lucide-react";
import { Project, ProjectFormValues } from "@/components/projects/ProjectModel";
import ProjectForm from "@/components/projects/ProjectForm";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { supabase } = useAuth();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
              status: project.status,
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

    fetchProjects();
  }, [supabase, toast]);

  // Filter projects when search term changes
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

  const handleOpenDialog = (project: Project | null = null) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentProject(null);
    setIsDialogOpen(false);
  };

  const handleCreateProject = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString();

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

      const newProject = {
        ...data,
        client_name: clientName,
      } as Project;

      setProjects([...projects, newProject]);

      toast({
        title: "Project created",
        description: `${values.name} has been created successfully`,
      });
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (values: ProjectFormValues) => {
    if (!currentProject) return;

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
        .eq("id", currentProject.id)
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

      const updatedProject = {
        ...data,
        client_name: clientName,
      } as Project;

      setProjects(
        projects.map((project) =>
          project.id === currentProject.id ? updatedProject : project
        )
      );

      toast({
        title: "Project updated",
        description: `${values.name} has been updated successfully`,
      });
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to archive this project?")) return;

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
    } catch (error: any) {
      toast({
        title: "Error archiving project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    if (currentProject) {
      await handleUpdateProject(values);
    } else {
      await handleCreateProject(values);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-700">Active</Badge>;
      case "onHold":
        return <Badge className="bg-yellow-700">On Hold</Badge>;
      case "completed":
        return <Badge className="bg-blue-700">Completed</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="h-24 bg-muted rounded-t-lg"></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
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
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear search
                    </Button>
                  )}
                  {activeFilter !== "all" && (
                    <Button variant="outline" onClick={() => setActiveFilter("all")}>
                      Show all projects
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className={cn("overflow-hidden", 
                project.status === "archived" ? "opacity-70" : "")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      {project.client_name && (
                        <CardDescription>
                          {project.client_name}
                        </CardDescription>
                      )}
                    </div>
                    <div>{getStatusBadge(project.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.description && (
                      <p className="text-sm line-clamp-2">{project.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {project.start_date && (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(project.start_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {project.end_date && (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(project.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {project.budget_hours && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="text-xs">{project.budget_hours} hrs</span>
                        </div>
                      )}

                      {project.budget_amount && (
                        <div className="flex items-center">
                          <CircleDollarSign className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          <span className="text-xs">${project.budget_amount}</span>
                        </div>
                      )}
                    </div>

                    {project.budget_hours && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-1" />
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-1 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => handleOpenDialog(project)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      
                      {project.status !== "archived" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => handleArchiveProject(project.id)}
                        >
                          <Archive className="h-3.5 w-3.5 mr-1" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {currentProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            initialValues={
              currentProject
                ? {
                    name: currentProject.name,
                    description: currentProject.description,
                    clientId: currentProject.client_id,
                    startDate: currentProject.start_date,
                    endDate: currentProject.end_date,
                    budgetHours: currentProject.budget_hours,
                    budgetAmount: currentProject.budget_amount,
                    status: currentProject.status,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Projects;
