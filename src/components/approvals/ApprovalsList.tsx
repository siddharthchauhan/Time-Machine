
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Info, XCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  employee: string;
  submitted: string;
  status: 'submitted';
  description?: string;
}

const pendingApprovals: TimeEntry[] = [
  {
    id: '1',
    date: '2025-04-22',
    project: 'Website Redesign',
    task: 'Frontend Development',
    hours: 4.5,
    employee: 'John Smith',
    submitted: '2025-04-22',
    status: 'submitted',
    description: 'Implemented responsive header and navigation'
  },
  {
    id: '2',
    date: '2025-04-21',
    project: 'Mobile App',
    task: 'UI Design',
    hours: 3,
    employee: 'Sarah Johnson',
    submitted: '2025-04-22',
    status: 'submitted',
    description: 'Created mockups for profile screens'
  },
  {
    id: '3',
    date: '2025-04-21',
    project: 'CRM Integration',
    task: 'API Development',
    hours: 6,
    employee: 'Michael Wong',
    submitted: '2025-04-21',
    status: 'submitted',
    description: 'Working on authentication endpoints'
  }
];

const ApprovalsList = () => {
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingEntry, setRejectingEntry] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get unique values for filters
  const uniqueEmployees = Array.from(new Set(pendingApprovals.map(entry => entry.employee)));
  const uniqueProjects = Array.from(new Set(pendingApprovals.map(entry => entry.project)));
  
  const filteredApprovals = pendingApprovals.filter(entry => {
    const matchesEmployee = filterEmployee === 'all' || entry.employee === filterEmployee;
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    
    return matchesEmployee && matchesProject;
  });
  
  const handleSelectAll = () => {
    if (selectedEntries.size === filteredApprovals.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredApprovals.map(entry => entry.id)));
    }
  };
  
  const toggleEntrySelection = (id: string) => {
    const newSelection = new Set(selectedEntries);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEntries(newSelection);
  };
  
  const handleApproveSelected = () => {
    if (selectedEntries.size === 0) {
      toast({
        title: "No entries selected",
        description: "Please select at least one time entry to approve",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Entries approved",
      description: `Successfully approved ${selectedEntries.size} time ${selectedEntries.size === 1 ? 'entry' : 'entries'}`,
    });
    
    // Reset selection
    setSelectedEntries(new Set());
  };
  
  const handleApproveEntry = (id: string) => {
    toast({
      title: "Entry approved",
      description: "The time entry has been approved successfully",
    });
  };
  
  const openRejectDialog = (id: string) => {
    setRejectingEntry(id);
    setRejectReason('');
    setShowRejectDialog(true);
  };
  
  const handleRejectEntry = () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Entry rejected",
      description: "Feedback has been sent to the employee",
    });
    
    setShowRejectDialog(false);
    setRejectingEntry(null);
    setRejectReason('');
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Time entries waiting for your approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select
              value={filterEmployee}
              onValueChange={setFilterEmployee}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {uniqueEmployees.map(employee => (
                  <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterProject}
              onValueChange={setFilterProject}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border">
            <div className="flex items-center p-4 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-primary rounded"
                  checked={selectedEntries.size === filteredApprovals.length && filteredApprovals.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="font-medium text-sm">Select All</span>
              </div>
              {selectedEntries.size > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="ml-4"
                  onClick={handleApproveSelected}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve Selected ({selectedEntries.size})
                </Button>
              )}
            </div>
            
            {filteredApprovals.length > 0 ? (
              <div className="divide-y">
                {filteredApprovals.map((entry) => (
                  <div key={entry.id} className="flex items-start p-4">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 mt-1 text-primary rounded"
                      checked={selectedEntries.has(entry.id)}
                      onChange={() => toggleEntrySelection(entry.id)}
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                          <h4 className="font-medium">{entry.employee}</h4>
                          <p className="text-sm text-muted-foreground">{entry.project} - {entry.task}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Badge variant="outline" className="status-badge-submitted">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                          <span className="text-sm font-medium">{entry.hours} hours</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">{entry.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>Date: {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Submitted: {new Date(entry.submitted).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApproveEntry(entry.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => openRejectDialog(entry.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Time Entry Details</DialogTitle>
                              <DialogDescription>
                                Full details for the submitted time entry
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium">Employee</h4>
                                  <p className="text-sm">{entry.employee}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Hours</h4>
                                  <p className="text-sm">{entry.hours}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Project</h4>
                                  <p className="text-sm">{entry.project}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Task</h4>
                                  <p className="text-sm">{entry.task}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Date</h4>
                                  <p className="text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Submitted</h4>
                                  <p className="text-sm">{new Date(entry.submitted).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Description</h4>
                                <p className="text-sm mt-1">{entry.description}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" type="button">
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No pending approvals found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {pendingApprovals.length} pending {pendingApprovals.length === 1 ? 'entry' : 'entries'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Time Entry</DialogTitle>
            <DialogDescription>
              Please provide feedback explaining why this time entry is being rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Provide specific feedback for the employee..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-32"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectEntry}>
              Reject Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalsList;
