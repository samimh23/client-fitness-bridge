
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientNew from "./pages/ClientNew";
import Workouts from "./pages/Workouts";
import WorkoutNew from "./pages/WorkoutNew";
import Nutrition from "./pages/Nutrition";
import NutritionNew from "./pages/NutritionNew";
import ClientApp from "./pages/ClientApp";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Coach Routes - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <ClientDetail />
            </ProtectedRoute>
          } />
          <Route path="/clients/new" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <ClientNew />
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <Workouts />
            </ProtectedRoute>
          } />
          <Route path="/workouts/new" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <WorkoutNew />
            </ProtectedRoute>
          } />
          <Route path="/nutrition" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <Nutrition />
            </ProtectedRoute>
          } />
          <Route path="/nutrition/new" element={
            <ProtectedRoute requiredRole="coach">
              <Navbar />
              <NutritionNew />
            </ProtectedRoute>
          } />

          {/* Client Routes */}
          <Route path="/client-app" element={
            <ProtectedRoute requiredRole="client">
              <ClientApp />
            </ProtectedRoute>
          } />
          
          {/* Fallback routes */}
          <Route path="/logout" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
