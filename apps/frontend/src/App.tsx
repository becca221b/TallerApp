import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {  useAuth } from "./contexts/AuthContext";
import AuthProvider from "./contexts/AuthContext";
import Login from "./pages/Login";
import CostureroDashboard from "./pages/CostureroDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'Supervisor' | 'Costurero' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role ===  'Supervisor' ? '/supervisor' : '/costurero'} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/costurero" 
            element={
              <ProtectedRoute requiredRole="Costurero">
                <CostureroDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supervisor" 
            element={
              <ProtectedRoute requiredRole="Supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
