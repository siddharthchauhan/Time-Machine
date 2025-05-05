
export type ProjectFormValues = {
  name: string;
  description: string;
  clientId: string | undefined;
  status: string;
};

export type UseProjectFormProps = {
  onProjectCreated: (project: { id: string; name: string }) => void;
  onClose: () => void;
};

export type UseProjectFormReturn = {
  formValues: ProjectFormValues;
  isSubmitting: boolean;
  isRefreshing: boolean;
  profileError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRefresh: () => Promise<void>;
};
