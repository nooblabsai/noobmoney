import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import SyncStatusBar from "./components/SyncStatusBar";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import FinancialProjection from "./pages/FinancialProjection";

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <TooltipProvider>
            <SyncStatusBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/financial-projection" element={<FinancialProjection />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;