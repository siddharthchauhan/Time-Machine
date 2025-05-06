
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Authentication Disabled</CardTitle>
            <CardDescription className="text-center">
              Authentication has been temporarily removed from this application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center mb-4">
              The application is currently running in development mode with authentication disabled.
              All protected routes are accessible without login.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
