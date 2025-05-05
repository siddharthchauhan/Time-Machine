
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteDialogProps {
  memberName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ 
  memberName, 
  isOpen, 
  onOpenChange, 
  onDelete 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-destructive hover:bg-white/10">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-white/10 shadow-xl">
        <DialogHeader>
          <DialogTitle>Delete Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {memberName} from the team? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" className="border-white/10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
