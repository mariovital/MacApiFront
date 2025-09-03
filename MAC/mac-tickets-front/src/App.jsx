// App.jsx - Componente principal de la aplicación

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Páginas
import Login from './pages/auth/Login';

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

// Componente Dashboard temporal
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ¡Bienvenido al Dashboard!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Hola {user?.first_name} {user?.last_name} ({user?.email})
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Rol: {user?.role_id === 1 ? 'Administrador' : user?.role_id === 2 ? 'Técnico' : 'Mesa de Trabajo'}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Sistema Funcionando
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                ✅ Autenticación implementada<br/>
                ✅ Context API funcionando<br/>
                ✅ Temas claro/oscuro<br/>
                ✅ React Router configurado
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Próximos Pasos
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                🔄 Crear componentes de layout<br/>
                🎫 Implementar gestión de tickets<br/>
                👥 Sistema de usuarios<br/>
                📊 Dashboard con métricas
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Tecnologías
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                ⚛️ React 19 + Vite<br/>
                🎨 TailwindCSS + MUI<br/>
                🔐 JWT Authentication<br/>
                📡 Axios + Socket.IO ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
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
