
export type UserRole = 'admin' | 'manager' | 'member';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department: string;
  projects: string[];
}

export interface NewTeamMember {
  name: string;
  email: string;
  department: string;
  role: UserRole;
  projects: string[];
}
