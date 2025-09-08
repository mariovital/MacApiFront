import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Typography, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleLabel = (roleId) => {
    const roleLabels = {
      1: 'Administrador',
      2: 'Técnico',
      3: 'Mesa de Trabajo'
    };
    return roleLabels[roleId] || 'Usuario';
  };

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div>
        <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-2">
          ¡Bienvenido al Dashboard, {user?.first_name}!
        </Typography>
        <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
          {getRoleLabel(user?.role_id)} · {user?.email}
        </Typography>
      </div>

      {/* Cards de estado del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Sistema Funcionando
            </Typography>
            <div className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Layout responsivo implementado
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Navegación desktop y móvil
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Sidebar con navegación por roles
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Header con búsqueda y notificaciones
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-green-900 dark:text-green-100 mb-3">
              Próximos Pasos
            </Typography>
            <div className="space-y-2 text-green-700 dark:text-green-300 text-sm">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">🔄</span>
                Implementar métricas del dashboard
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">🔄</span>
                Crear vista de lista de tickets
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">🔄</span>
                Sistema de gestión de usuarios
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">🔄</span>
                Reportes y analytics
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
              Navegación Disponible
            </Typography>
            <div className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
              <div className="flex items-center">
                <span className="mr-2">🏠</span>
                Dashboard (todas las vistas)
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎫</span>
                Tickets (en desarrollo)
              </div>
              {user?.role === 'admin' && (
                <>
                  <div className="flex items-center">
                    <span className="mr-2">👥</span>
                    Usuarios (solo Admin)
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📊</span>
                    Reportes (solo Admin)
                  </div>
                </>
              )}
              <div className="flex items-center">
                <span className="mr-2">⚙️</span>
                Configuración
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test de funcionalidades del layout */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4">
            Test del Layout Implementado
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="subtitle2" className="font-medium mb-2">
                Desktop Features:
              </Typography>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Sidebar colapsible (botón en la esquina)</li>
                <li>• Navegación filtrada por rol de usuario</li>
                <li>• Header con breadcrumbs dinámicos</li>
                <li>• Búsqueda global (placeholder)</li>
                <li>• Menú de notificaciones con badge</li>
                <li>• Menú de perfil con logout</li>
              </ul>
            </div>
            <div>
              <Typography variant="subtitle2" className="font-medium mb-2">
                Mobile Features:
              </Typography>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Header móvil compacto</li>
                <li>• Sidebar overlay con toggle</li>
                <li>• Bottom navigation tabs</li>
                <li>• Navegación filtrada por rol</li>
                <li>• Responsive breakpoints automáticos</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Typography variant="body2" className="text-yellow-800 dark:text-yellow-200">
              <strong>Prueba la funcionalidad:</strong> Redimensiona la ventana para ver el comportamiento responsive, 
              usa el botón de colapsar sidebar, prueba la búsqueda, abre los menús de notificaciones y perfil.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
