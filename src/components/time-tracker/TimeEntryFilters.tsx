
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeEntryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  uniqueProjects: string[];
}

const TimeEntryFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterProject,
  setFilterProject,
  uniqueProjects
}: TimeEntryFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search entries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
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
      <Select
        value={filterStatus}
        onValueChange={setFilterStatus}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="submitted">Submitted</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeEntryFilters;
