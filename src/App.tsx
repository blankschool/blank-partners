import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AgencyRoute } from "@/components/AgencyRoute";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Contents from "./pages/Contents";
import Team from "./pages/Team";
import Healthscore from "./pages/Healthscore";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ScopeControl from "./pages/ScopeControl";
import Reports from "./pages/Reports";
import Meetings from "./pages/Meetings";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <AdminRoute>
                  <Clients />
                </AdminRoute>
              }
            />
            <Route
              path="/contents"
              element={
                <AdminRoute>
                  <Contents />
                </AdminRoute>
              }
            />
            <Route
              path="/team"
              element={
                <AdminRoute>
                  <Team />
                </AdminRoute>
              }
            />
            <Route
              path="/healthscore"
              element={
                <AdminRoute>
                  <Healthscore />
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
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
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="/scope-control"
              element={
                <AdminRoute>
                  <ScopeControl />
                </AdminRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <AgencyRoute>
                  <Reports />
                </AgencyRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <AgencyRoute>
                  <Meetings />
                </AgencyRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
