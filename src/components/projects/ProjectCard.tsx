
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pencil, Archive, Calendar, Clock, CircleDollarSign } from "lucide-react";
import { Project } from "./ProjectModel";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onArchive: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onArchive }: ProjectCardProps) {
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
              onClick={() => onEdit(project)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            
            {project.status !== "archived" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => onArchive(project.id)}
              >
                <Archive className="h-3.5 w-3.5 mr-1" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
