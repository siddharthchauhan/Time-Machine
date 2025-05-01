
import { useState } from "react";
import { ProjectFormValues } from "../ProjectModel";
import { useToast } from "@/hooks/use-toast";

export function useProjectForm(
  initialValues: ProjectFormValues,
  onSubmit: (values: ProjectFormValues) => Promise<void>
) {
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [startDate, setStartDate] = useState<Date | undefined>(
    values.startDate ? new Date(values.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    values.endDate ? new Date(values.endDate) : undefined
  );
  const { toast } = useToast();

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
      [name]: name === "clientId" && value === "none" ? undefined : value,
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

  const validateForm = () => {
    if (!values.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return false;
    }

    if (values.endDate && values.startDate && values.endDate < values.startDate) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    values,
    startDate,
    endDate,
    handleChange,
    handleSelectChange,
    handleStartDateChange,
    handleEndDateChange,
    validateForm
  };
}
