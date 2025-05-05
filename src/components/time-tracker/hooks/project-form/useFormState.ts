
import { useState } from "react";
import { ProjectFormValues } from "./types";

export const useFormState = () => {
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    name: "",
    description: "",
    clientId: undefined,
    status: "active"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "clientId" && value === "none" ? undefined : value,
    }));
  };

  return {
    formValues,
    setFormValues,
    isSubmitting,
    setIsSubmitting,
    isRefreshing,
    setIsRefreshing,
    profileError,
    setProfileError,
    handleChange,
    handleSelectChange
  };
};
