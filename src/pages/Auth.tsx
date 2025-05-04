
import { useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/use-auth";

export default function Auth() {
  const {
    user,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    // If user is logged in, redirect to home or the page they were trying to access
    if (user && !isLoading) {
      navigate(from, {
        replace: true
      });
    }
  }, [user, isLoading, navigate, from]);

  // If still loading or user exists, show loading state to prevent flash of login form
  if (isLoading || user) {
    return <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  
  return <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Time Machine</CardTitle>
            <CardDescription className="text-center">
              <Routes>
                <Route path="/" element={<span>Login to your account</span>} />
                <Route path="signup" element={<span>Create a new account</span>} />
              </Routes>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="signup" element={<SignupForm />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CardContent>
        </Card>
      </div>
    </div>;
}
