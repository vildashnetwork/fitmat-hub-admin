import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Participants from "./pages/Participants";
import Admins from "./pages/Admins";
import Settings from "./pages/Settings";

import Requests from "./pages/Requests";
import Approve from "./pages/Approve";
import ElectionsPage from "./pages/ElectionsPage"

import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { initializeStorage } from "@/utils/storage";
import axios from "axios"
const queryClient = new QueryClient();


const App = () => {
  useEffect(() => {

    initializeStorage();

  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="*"
                  element={
                    <ProtectedRoute>
                      <SidebarProvider defaultOpen={true}>
                        <div className="min-h-screen flex w-full bg-background">
                          <AppSidebar />
                          <div className="flex-1 flex flex-col">
                            <Navbar />
                            <main className="flex-1 overflow-auto">
                              <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/requests" element={<Requests />} />
                                <Route path="/approved" element={<Approve />} />
                                  <Route path="/elections" element={<ElectionsPage />} />

                                <Route path="/participants" element={<Participants />} />
                                <Route path="/admins" element={<Admins />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </main>
                          </div>
                        </div>
                      </SidebarProvider>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;







