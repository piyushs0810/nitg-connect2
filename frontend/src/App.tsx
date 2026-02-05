import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LostFound from "./pages/LostFound";
import WebId from "./pages/WebId";
import Notices from "./pages/Notices";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import PeopleSearch from "./pages/PeopleSearch";
import Birthdays from "./pages/Birthdays";
import Clubs from "./pages/Clubs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// React Query client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/lost-found" element={<LostFound />} />
              <Route
                path="/web-id"
                element={
                  <ProtectedRoute>
                    <WebId />
                  </ProtectedRoute>
                }
              />
              <Route path="/notices" element={<Notices />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/people-search" element={<PeopleSearch />} />
              <Route path="/birthdays" element={<Birthdays />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;