
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CoachProfile from "./pages/CoachProfile";

const queryClient = new QueryClient();

// Layout component for protected routes with sidebar
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="ml-4" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Coach Routes - Protected with Sidebar Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/clients/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/clients/new" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientNew />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Workouts />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/workouts/new" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WorkoutNew />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/workouts/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WorkoutPlanDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/workouts/edit/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <WorkoutNew />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/nutrition" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Nutrition />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/nutrition/new" element={
            <ProtectedRoute>
              <DashboardLayout>
                <NutritionNew />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/nutrition/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <NutritionPlanDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CoachProfile />
              </DashboardLayout>
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
