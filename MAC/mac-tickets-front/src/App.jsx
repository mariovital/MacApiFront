
// App.jsx - Componente principal de la aplicación
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Layout
import { MainLayout } from './components/layout';

// Páginas  
import { Login, Dashboard, TicketList, UserList, Reports, Settings } from './pages';
import { TicketHistory, CreateTicket } from './pages/tickets';

// Hook para rutas protegidas
import { useAuth } from './contexts/AuthContext';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Wrapper para aplicar MainLayout a rutas protegidas
const ProtectedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/tickets" 
              element={
                <ProtectedLayout>
                  <TicketList />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/tickets/create" 
              element={
                <ProtectedLayout>
                  <CreateTicket />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/tickets/history" 
              element={
                <ProtectedLayout>
                  <TicketHistory />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedLayout>
                  <UserList />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedLayout>
                  <Reports />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              } 
            />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Ruta 404 temporal */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
