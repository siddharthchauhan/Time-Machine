
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Plus, Trash, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'admin' | 'manager' | 'member';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department: string;
  projects: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'admin',
    department: 'Engineering',
    projects: ['Website Redesign', 'Mobile App']
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'manager',
    department: 'Design',
    projects: ['Website Redesign', 'Mobile App', 'CRM Integration']
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    role: 'member',
    department: 'Engineering',
    projects: ['CRM Integration', 'Mobile App']
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    role: 'member',
    department: 'Marketing',
    projects: ['Website Redesign']
  },
  {
    id: '5',
    name: 'Robert Chen',
    email: 'robert.c@example.com',
    role: 'manager',
    department: 'Engineering',
    projects: ['CRM Integration']
  }
];

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-brand-500">Admin</Badge>;
    case 'manager':
      return <Badge variant="outline" className="border-brand-300 text-brand-700">Manager</Badge>;
    case 'member':
      return <Badge variant="outline" className="border-muted text-muted-foreground">Team Member</Badge>;
  }
};

const TeamList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  
  // Get unique departments for filter
  const departments = Array.from(new Set(teamMembers.map(member => member.department)));
  
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Team member added",
      description: "New team member has been added successfully",
    });
    
    setShowAddDialog(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage your team members and their permissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
              <TabsTrigger value="member">Team Members</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={filterDepartment}
                    onValueChange={setFilterDepartment}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterRole}
                    onValueChange={setFilterRole}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Team Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center p-4 rounded-lg border">
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
                              <p className="text-sm">{member.department}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Projects: {member.projects.join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
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
                                    <Input id="edit-name" defaultValue={member.name} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input id="edit-email" type="email" defaultValue={member.email} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-department">Department</Label>
                                    <Input id="edit-department" defaultValue={member.department} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select defaultValue={member.role}>
                                      <SelectTrigger id="edit-role">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="member">Team Member</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </form>
                              <DialogFooter>
                                <Button type="button">Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No team members found matching your filters.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            {(['admin', 'manager', 'member'] as UserRole[]).map(role => (
              <TabsContent key={role} value={role}>
                <div className="space-y-4 mt-4">
                  {teamMembers.filter(member => member.role === role).map((member) => (
                    <div key={member.id} className="flex items-center p-4 rounded-lg border">
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
                            <p className="text-sm">{member.department}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Projects: {member.projects.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {teamMembers.length} team members
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new team member
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input id="new-name" placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input id="new-email" type="email" placeholder="Email address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-department">Department</Label>
                <Select required>
                  <SelectTrigger id="new-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select defaultValue="member" required>
                  <SelectTrigger id="new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-4">
              <Label htmlFor="new-projects">Projects</Label>
              <Select>
                <SelectTrigger id="new-projects">
                  <SelectValue placeholder="Assign to projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website Redesign</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="crm">CRM Integration</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">You can assign more projects later</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Team Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamList;
