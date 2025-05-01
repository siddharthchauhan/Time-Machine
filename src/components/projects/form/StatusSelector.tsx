
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ProjectStatus = 'active' | 'completed' | 'onHold' | 'archived';

interface StatusSelectorProps {
  status: ProjectStatus;
  onStatusChange: (value: ProjectStatus) => void;
}

const StatusSelector = ({ status, onStatusChange }: StatusSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="status">Status</Label>
      <Select
        value={status}
        onValueChange={(value) => 
          onStatusChange(value as 'active' | 'completed' | 'onHold' | 'archived')}
      >
        <SelectTrigger id="status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="onHold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
