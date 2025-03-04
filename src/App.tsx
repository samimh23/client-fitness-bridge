
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientNew from "./pages/ClientNew";
import Workouts from "./pages/Workouts";
import WorkoutNew from "./pages/WorkoutNew";
import Nutrition from "./pages/Nutrition";
import NutritionNew from "./pages/NutritionNew";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/new" element={<ClientNew />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/new" element={<WorkoutNew />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/nutrition/new" element={<NutritionNew />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
