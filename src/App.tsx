import React, { useState } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import ReportsPage from "./pages/ReportsPage";
import ReportBuilder from "./pages/ReportBuilder";
import ReportViewer from "./pages/ReportViewer";
import PublicReportViewer from "./pages/PublicReportViewer";
import PublicFolderViewer from "./pages/PublicFolderViewer";
import { ClientProvider } from "./contexts/ClientContext";
import { ReportProvider } from "./contexts/ReportContext";
import { FolderProvider } from "./contexts/FolderContext";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide main sidebar when viewing a report or login page
  const isLogin = location.pathname === "/login";
  const isReportViewer = location.pathname.startsWith("/reports/view/");
  const isPublic      = location.pathname.startsWith("/public/");

  // Get user info for sidebar
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {!isLogin && !isReportViewer && !isPublic && (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />
      )}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
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
                <ProtectedRoute>
                  <ClientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/builder/:reportId?"
              element={
                <ProtectedRoute>
                  <ReportBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/view/:reportId"
              element={
                <ProtectedRoute>
                  <ReportViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/report/:token"
              element={<PublicReportViewer />}
            />
            <Route
              path="/public/folder/:token"
              element={<PublicFolderViewer />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClientProvider>
        <ReportProvider>
          <FolderProvider>
            <AppContent />
          </FolderProvider>
        </ReportProvider>
      </ClientProvider>
    </BrowserRouter>
  );
}

export default App;
