import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import StudentDirectory from "./pages/StudentDirectory";
import SubjectManager from "./pages/SubjectManager";
import SyllabusProgress from "./pages/SyllabusProgress";
import WorkPool from "./pages/WorkPool";
import DoubtBox from "./pages/DoubtBox";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<StudentDirectory />} />
            <Route path="subjects" element={<SubjectManager />} />
            <Route path="syllabus" element={<SyllabusProgress />} />
            <Route path="work-pool" element={<WorkPool />} />
            <Route path="doubts" element={<DoubtBox />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
