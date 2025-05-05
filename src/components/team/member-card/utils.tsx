
import { UserRole } from "@/components/team/types";
import { Badge } from "@/components/ui/badge";

export const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-primary/90">Admin</Badge>;
    case 'project_manager':
      return <Badge variant="outline" className="border-purple-300/70 text-purple-300">Project Manager</Badge>;
    case 'manager':
      return <Badge variant="outline" className="border-primary/70 text-primary">Manager</Badge>;
    case 'member':
      return <Badge variant="outline" className="border-muted text-muted-foreground">Team Member</Badge>;
  }
};
