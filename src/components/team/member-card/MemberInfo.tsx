
import React from 'react';
import { TeamMember } from "@/components/team/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRoleBadge } from './utils';

interface MemberInfoProps {
  member: TeamMember;
}

const MemberInfo: React.FC<MemberInfoProps> = ({ member }) => {
  return (
    <>
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
    </>
  );
};

export default MemberInfo;
