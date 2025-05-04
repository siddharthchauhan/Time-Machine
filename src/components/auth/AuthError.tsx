
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AuthErrorProps {
  title?: string;
  message: string;
}

export const AuthError: React.FC<AuthErrorProps> = ({ 
  title = "Authentication Error", 
  message 
}) => {
  return (
    <Alert variant="destructive" className="mt-4 mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};
