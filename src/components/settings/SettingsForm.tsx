
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SettingsForm = () => {
  const { toast } = useToast();
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully",
    });
  };
  
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been saved successfully",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <form onSubmit={handleSaveProfile} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Alex Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="alex.johnson@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Project Manager" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Engineering" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us a little about yourself"
                    defaultValue="Experienced project manager with 5+ years in software development. Passionate about agile methodologies and team productivity."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="pb-2 pt-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="notifications">
            <form onSubmit={handleSaveNotifications} className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-approvals" className="font-medium">Time Entry Approvals</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when your time entries are approved or rejected</p>
                    </div>
                    <Switch id="email-approvals" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-reminders" className="font-medium">Weekly Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded to submit your time sheets at the end of the week</p>
                    </div>
                    <Switch id="email-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-pending" className="font-medium">Pending Approvals</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for time entries waiting for your approval</p>
                    </div>
                    <Switch id="email-pending" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-project" className="font-medium">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about changes to projects you're assigned to</p>
                    </div>
                    <Switch id="email-project" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="app-assignments" className="font-medium">New Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when you're assigned to new tasks</p>
                    </div>
                    <Switch id="app-assignments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="app-mentions" className="font-medium">Mentions and Comments</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you're mentioned in task comments</p>
                    </div>
                    <Switch id="app-mentions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="app-deadlines" className="font-medium">Upcoming Deadlines</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders about approaching task deadlines</p>
                    </div>
                    <Switch id="app-deadlines" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Notification Preferences</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="appearance">
            <form onSubmit={handleSaveAppearance} className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative aspect-video cursor-pointer rounded-md overflow-hidden border-2 border-primary bg-white">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">Light</span>
                    </div>
                  </div>
                  <div className="relative aspect-video cursor-pointer rounded-md overflow-hidden border-2 border-muted bg-gray-950">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">Dark</span>
                    </div>
                  </div>
                  <div className="relative aspect-video cursor-pointer rounded-md overflow-hidden border-2 border-muted bg-gradient-to-r from-white to-gray-950">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Time Display</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-format" className="font-medium">Time Format</Label>
                      <p className="text-sm text-muted-foreground">Choose how time is displayed throughout the application</p>
                    </div>
                    <Select defaultValue="decimal">
                      <SelectTrigger id="time-format" className="w-[180px]">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="decimal">Decimal (8.5 hours)</SelectItem>
                        <SelectItem value="hhmm">HH:MM (8:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="week-start" className="font-medium">Week Starts On</Label>
                      <p className="text-sm text-muted-foreground">Choose which day your week begins on</p>
                    </div>
                    <Select defaultValue="monday">
                      <SelectTrigger id="week-start" className="w-[180px]">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Dashboard</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-recent" className="font-medium">Show Recent Time Entries</Label>
                      <p className="text-sm text-muted-foreground">Display your recent time entries on the dashboard</p>
                    </div>
                    <Switch id="show-recent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-tasks" className="font-medium">Show Upcoming Tasks</Label>
                      <p className="text-sm text-muted-foreground">Display upcoming tasks on the dashboard</p>
                    </div>
                    <Switch id="show-tasks" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Appearance Settings</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
