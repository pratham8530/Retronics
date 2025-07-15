import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Scrap from "./pages/Scrap";
import Recycling from "./pages/Recycling";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/SellerDashboard"; // Import the SellerDashboard component
import BuyerDashboard from "./pages/BuyerDashboard"; // Import the BuyerDashboard component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/scrap" element={<Scrap />} />
          <Route path="/recycling" element={<Recycling />} />
          <Route path="/auth/:mode" element={<Auth />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} /> {/* Add the SellerDashboard route */}
          <Route path="/dashboard/buyer" element={<BuyerDashboard />} /> {/* Add the BuyerDashboard route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;