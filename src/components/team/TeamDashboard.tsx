
import React from 'react';
import { TeamMember } from './types';
import TeamOverviewCard from './dashboard/cards/TeamOverviewCard';
import DepartmentDistributionChart from './dashboard/charts/DepartmentDistributionChart';
import TeamRolesChart from './dashboard/charts/TeamRolesChart';
import ProjectAssignmentsChart from './dashboard/charts/ProjectAssignmentsChart';
import TeamDirectoryTable from './dashboard/tables/TeamDirectoryTable';

interface TeamDashboardProps {
  members: TeamMember[];
}

const TeamDashboard = ({ members }: TeamDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TeamOverviewCard members={members} />
        <DepartmentDistributionChart members={members} />
        <TeamRolesChart members={members} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectAssignmentsChart members={members} />
        <TeamDirectoryTable members={members} />
      </div>
    </div>
  );
};

export default TeamDashboard;
