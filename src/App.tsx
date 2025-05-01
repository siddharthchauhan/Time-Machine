
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TimeTracker from "./pages/TimeTracker";
import Approvals from "./pages/Approvals";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { StrictMode } from "react";
import { AuthProvider, RequireAuth } from "./components/auth/AuthProvider";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark">
          <div className="gradient-bg">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/auth/*" element={<Auth />} />
                  
                  <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                  <Route path="/time-tracker" element={<RequireAuth><TimeTracker /></RequireAuth>} />
                  <Route path="/approvals" element={<RequireAuth><Approvals /></RequireAuth>} />
                  <Route path="/team" element={<RequireAuth><Team /></RequireAuth>} />
                  <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
