
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Project {
  id: string;
  name: string;
  progress: number;
  hoursLogged: number;
  hoursEstimated: number;
  dueDate: string;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    progress: 68,
    hoursLogged: 45,
    hoursEstimated: 80,
    dueDate: '2025-05-15'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    progress: 32,
    hoursLogged: 120,
    hoursEstimated: 360,
    dueDate: '2025-07-30'
  },
  {
    id: '3',
    name: 'CRM Integration',
    progress: 87,
    hoursLogged: 65,
    hoursEstimated: 75,
    dueDate: '2025-04-30'
  }
];

const ProjectProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>
          Progress and time budget across your active projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm">{project.name}</h4>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{project.hoursLogged} / {project.hoursEstimated} hours</span>
                <span>Due: {new Date(project.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
