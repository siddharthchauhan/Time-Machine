
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectFormValues } from "./ProjectModel";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Client } from "@/components/clients/ClientModel";
import { useProjectForm } from "./form/useProjectForm";
import BasicProjectInfo from "./form/BasicProjectInfo";
import ClientSelector from "./form/ClientSelector";
import DatePickerField from "./form/DatePickerField";
import BudgetFields from "./form/BudgetFields";
import StatusSelector from "./form/StatusSelector";

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
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const { supabase } = useAuth();
  
  const {
    values,
    startDate,
    endDate,
    handleChange,
    handleSelectChange,
    handleStartDateChange,
    handleEndDateChange,
    validateForm
  } = useProjectForm(initialValues, onSubmit);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
          <BasicProjectInfo
            name={values.name}
            description={values.description}
            onChange={handleChange}
          />

          <ClientSelector
            clientId={values.clientId}
            clients={clients}
            onClientChange={(value) => handleSelectChange("clientId", value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              label="Start Date"
              date={startDate}
              onDateChange={handleStartDateChange}
              id="startDate"
            />

            <DatePickerField
              label="End Date"
              date={endDate}
              onDateChange={handleEndDateChange}
              minDate={startDate}
              id="endDate"
            />
          </div>

          <BudgetFields
            budgetHours={values.budgetHours}
            budgetAmount={values.budgetAmount}
            onChange={handleChange}
          />

          <StatusSelector
            status={values.status}
            onStatusChange={(value) => handleSelectChange("status", value)}
          />
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
