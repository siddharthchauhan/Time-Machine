
import { Badge } from "@/components/ui/badge";
import { TimeEntryStatus } from "./types";

export const getStatusBadge = (status: TimeEntryStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="status-badge-draft">Draft</Badge>;
    case 'submitted':
      return <Badge variant="outline" className="status-badge-submitted">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="status-badge-approved">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="status-badge-rejected">Rejected</Badge>;
  }
};
