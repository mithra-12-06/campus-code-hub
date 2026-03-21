import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Problems from "@/pages/Problems";
import ProblemDetail from "@/pages/ProblemDetail";
import Events from "@/pages/Events";
import EventRegister from "@/pages/EventRegister";
import Analytics from "@/pages/Analytics";
import Contest from "@/pages/Contest";
import Battle from "@/pages/Battle";
import PairProgramming from "@/pages/PairProgramming";
import Submissions from "@/pages/Submissions";
import Heatmap from "@/pages/Heatmap";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id/register" element={<EventRegister />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/pair" element={<PairProgramming />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/heatmap" element={<Heatmap />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
