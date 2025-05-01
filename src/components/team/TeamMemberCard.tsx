
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, TeamMember } from "@/components/team/types";

interface TeamMemberCardProps {
  member: TeamMember;
  isEditMode?: boolean;
}

const getRoleBadge = (role: UserRole) => {
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

const TeamMemberCard = ({ member, isEditMode = true }: TeamMemberCardProps) => {
  return (
    <div key={member.id} className="flex items-center p-4 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm hover:border-white/20 transition-all">
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {member.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <h4 className="font-medium">{member.name}</h4>
              <div className="ml-2">{getRoleBadge(member.role)}</div>
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-sm text-primary/90 font-medium">{member.department}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Projects: {member.projects.join(', ')}
          </p>
        </div>
      </div>
      {isEditMode && (
        <div className="flex items-center gap-1 ml-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="hover:bg-white/10">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-white/10 shadow-xl">
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
                <DialogDescription>
                  Update information for {member.name}
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input 
                      id="edit-name" 
                      defaultValue={member.name} 
                      className="bg-secondary/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      defaultValue={member.email} 
                      className="bg-secondary/50 border-white/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Input 
                      id="edit-department" 
                      defaultValue={member.department} 
                      className="bg-secondary/50 border-white/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select defaultValue={member.role}>
                      <SelectTrigger id="edit-role" className="bg-secondary/50 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-white/10">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="project_manager">Project Manager</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Team Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" className="border-white/10">Cancel</Button>
                <Button type="button">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="icon" variant="ghost" className="text-destructive hover:bg-white/10">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
