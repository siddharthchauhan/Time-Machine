
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportFiltersProps {
  date: Date;
  setDate: (date: Date) => void;
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  projects: Array<{ id: string; name: string }>;
}

const ReportFilters = ({
  date,
  setDate,
  selectedProject,
  setSelectedProject,
  selectedPeriod,
  setSelectedPeriod,
  projects
}: ReportFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Select 
        value={selectedPeriod} 
        onValueChange={setSelectedPeriod}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Time Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current">Current Week</SelectItem>
          <SelectItem value="previous">Previous Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Select 
        value={selectedProject} 
        onValueChange={setSelectedProject}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReportFilters;
