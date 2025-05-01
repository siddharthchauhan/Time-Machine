import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectFormValues } from "./ProjectModel";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Client } from "@/components/clients/ClientModel";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProjectForm = ({
  initialValues = {
    name: "",
    description: "",
    clientId: undefined,
    startDate: undefined,
    endDate: undefined,
    budgetHours: undefined,
    budgetAmount: undefined,
    status: "active" as const,
  },
  onSubmit,
  isSubmitting,
  onCancel,
}: ProjectFormProps) => {
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const { supabase } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(
    values.startDate ? new Date(values.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    values.endDate ? new Date(values.endDate) : undefined
  );

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name");

        if (error) throw error;

        // Map the response data to Client type
        const clientsData = data?.map(client => ({
          id: client.id,
          name: client.name,
          contact_name: client.contact_name,
          contact_email: client.contact_email,
          contact_phone: client.contact_phone,
          address: client.address,
          billing_rate: client.billing_rate,
          created_at: client.created_at,
          updated_at: client.updated_at
        })) || [];

        setClients(clientsData);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "budgetHours" || name === "budgetAmount"
        ? parseFloat(value) || undefined
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setValues((prev) => ({
      ...prev,
      startDate: date ? date.toISOString().split('T')[0] : undefined,
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setValues((prev) => ({
      ...prev,
      endDate: date ? date.toISOString().split('T')[0] : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    if (values.endDate && values.startDate && values.endDate < values.startDate) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialValues.name ? "Edit Project" : "Create New Project"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Project Name*</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={values.clientId}
              onValueChange={(value) => handleSelectChange("clientId", value)}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="budgetHours">Budget (Hours)</Label>
              <Input
                id="budgetHours"
                name="budgetHours"
                type="number"
                min="0"
                step="0.5"
                value={values.budgetHours || ""}
                onChange={handleChange}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="budgetAmount">Budget (Amount)</Label>
              <Input
                id="budgetAmount"
                name="budgetAmount"
                type="number"
                min="0"
                step="0.01"
                value={values.budgetAmount || ""}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <Select
              value={values.status}
              onValueChange={(value) => 
                handleSelectChange("status", value as 'active' | 'completed' | 'onHold' | 'archived')}
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
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialValues.name
              ? "Update Project"
              : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProjectForm;
