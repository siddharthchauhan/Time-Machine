
import { Badge } from "@/components/ui/badge";
import { TimeEntryStatus } from "./types";

export const getStatusBadge = (status: TimeEntryStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-muted text-muted-foreground">Draft</Badge>;
    case 'submitted':
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};
