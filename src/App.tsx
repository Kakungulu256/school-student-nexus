
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyToken from "./pages/VerifyToken";
import Dashboard from "./pages/Dashboard";

// School pages
import UserManagement from "./pages/school/UserManagement";

// Student pages
import LearningMode from "./pages/student/LearningMode";

// Add education theme colors to tailwind
import './styles/theme.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-token" element={<VerifyToken />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* School routes */}
            <Route path="/dashboard/users" element={<UserManagement />} />
            <Route path="/dashboard/papers" element={<Dashboard />} />
            <Route path="/dashboard/reports" element={<Dashboard />} />
            
            {/* Student routes */}
            <Route path="/dashboard/learning" element={<LearningMode />} />
            <Route path="/dashboard/tests" element={<Dashboard />} />
            <Route path="/dashboard/past-papers" element={<Dashboard />} />
            
            {/* Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
