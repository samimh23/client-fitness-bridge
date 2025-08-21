
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
import WorkoutPlanDetail from "./pages/WorkoutPlanDetail";
import Nutrition from "./pages/Nutrition";
import NutritionNew from "./pages/NutritionNew";
import NutritionPlanDetail from "./pages/NutritionPlanDetail";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CoachProfile from "./pages/CoachProfile";

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
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <Navbar />
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id" element={
            <ProtectedRoute>
              <Navbar />
              <ClientDetail />
            </ProtectedRoute>
          } />
          <Route path="/clients/new" element={
            <ProtectedRoute>
              <Navbar />
              <ClientNew />
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute>
              <Navbar />
              <Workouts />
            </ProtectedRoute>
          } />
          <Route path="/workouts/new" element={
            <ProtectedRoute>
              <Navbar />
              <WorkoutNew />
            </ProtectedRoute>
          } />
          <Route path="/workouts/:id" element={
            <ProtectedRoute>
              <Navbar />
              <WorkoutPlanDetail />
            </ProtectedRoute>
          } />
          <Route path="/workouts/edit/:id" element={
            <ProtectedRoute>
              <Navbar />
              <WorkoutNew />
            </ProtectedRoute>
          } />
          <Route path="/nutrition" element={
            <ProtectedRoute>
              <Navbar />
              <Nutrition />
            </ProtectedRoute>
          } />
          <Route path="/nutrition/new" element={
            <ProtectedRoute>
              <Navbar />
              <NutritionNew />
            </ProtectedRoute>
          } />
          <Route path="/nutrition/:id" element={
            <ProtectedRoute>
              <Navbar />
              <NutritionPlanDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <CoachProfile />
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
