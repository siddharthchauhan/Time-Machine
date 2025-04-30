
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMember } from '../types';

interface TeamOverviewCardProps {
  members: TeamMember[];
}

const TeamOverviewCard = ({ members }: TeamOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Overview</CardTitle>
        <CardDescription>Key team statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{members.length}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">{new Set(members.map(m => m.department)).size}</div>
            <div className="text-sm text-muted-foreground">Departments</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">
              {members.filter(m => m.role === 'manager' || m.role === 'project_manager').length}
            </div>
            <div className="text-sm text-muted-foreground">Managers</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg text-center">
            <div className="text-3xl font-bold">
              {new Set(members.flatMap(m => m.projects)).size}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamOverviewCard;
