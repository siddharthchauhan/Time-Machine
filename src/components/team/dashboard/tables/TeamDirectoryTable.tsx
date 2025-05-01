
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TeamMember } from '../../types';

interface TeamDirectoryTableProps {
  members: TeamMember[];
}

const TeamDirectoryTable = ({ members }: TeamDirectoryTableProps) => {
  return (
    <Card className="border border-white/10 backdrop-blur-sm bg-card/50">
      <CardHeader>
        <CardTitle>Team Directory</CardTitle>
        <CardDescription>Contact information for team leads</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-foreground/70">Name</TableHead>
              <TableHead className="text-foreground/70">Role</TableHead>
              <TableHead className="text-foreground/70">Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.filter(m => m.role === 'manager' || m.role === 'admin' || m.role === 'project_manager')
              .map((member) => (
                <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role === 'admin' ? 'Admin' : member.role === 'project_manager' ? 'Project Manager' : 'Manager'}</TableCell>
                  <TableCell>{member.department}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamDirectoryTable;
