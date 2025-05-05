
import { useEffect } from "react";
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/use-auth";

export default function Auth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (user && !isLoading) {
      navigate(location.state?.from?.pathname || '/');
    }
  }, [user, isLoading, navigate, location]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardContent className="pt-6">
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
            </Routes>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
