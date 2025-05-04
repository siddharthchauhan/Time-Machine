
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
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { StrictMode } from "react";
import { ThemeProvider } from "./components/theme/ThemeProvider";

// Configure query client with error handling for database connections
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: any) => {
          console.error("Query error:", error);
          // You can use toast here if needed
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          console.error("Mutation error:", error);
          // You can use toast here if needed
        }
      }
    }
  }
});

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark">
          <div className="gradient-bg">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="/time-tracker" element={<TimeTracker />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/team" element={<Team />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
