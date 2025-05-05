
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TimeEntryStatus, TimeEntry } from "./types";
import { getStatusBadge } from "./utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimeEntryCardProps {
  entry: TimeEntry;
  onDelete?: (id: string) => void;
  onEdit?: (entry: TimeEntry) => void;
}

const TimeEntryCard = ({ entry, onDelete, onEdit }: TimeEntryCardProps) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(entry.id);
      toast({
        title: "Time entry deleted",
        description: "The time entry has been successfully deleted.",
      });
    } else {
      toast({
        title: "Operation not supported",
        description: "Deletion is not available for this entry.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry);
    } else {
      toast({
        title: "Operation not supported",
        description: "Editing is not available for this entry.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <div className="flex items-center p-3 rounded-lg border bg-card">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{entry.project}</h4>
            {getStatusBadge(entry.status)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
            <p className="text-xs text-muted-foreground">
              {entry.task}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(entry.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs font-medium">{entry.hours} hours</p>
          </div>
          {entry.description && (
            <p className="text-xs mt-2 line-clamp-2">{entry.description}</p>
          )}
          {entry.status === 'rejected' && entry.rejection_reason && (
            <div className="mt-2 p-2 bg-destructive/10 rounded-sm text-xs">
              <span className="font-medium">Rejection feedback:</span> {entry.rejection_reason}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setShowViewDialog(true)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            disabled={entry.status === 'approved'}
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-destructive" 
            disabled={entry.status === 'approved'}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* View Entry Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Time Entry Details</DialogTitle>
            <DialogDescription>
              Full details for this time entry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <h4 className="text-sm font-medium">Project</h4>
              <p className="text-sm text-muted-foreground">{entry.project}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Task</h4>
              <p className="text-sm text-muted-foreground">{entry.task}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Date</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(entry.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Hours</h4>
              <p className="text-sm text-muted-foreground">{entry.hours}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Status</h4>
              <div className="mt-1">{getStatusBadge(entry.status)}</div>
            </div>
            {entry.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.description}</p>
              </div>
            )}
            {entry.status === 'rejected' && entry.rejection_reason && (
              <div>
                <h4 className="text-sm font-medium text-destructive">Rejection Feedback</h4>
                <p className="text-sm text-destructive-foreground">{entry.rejection_reason}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimeEntryCard;
