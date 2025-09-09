import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiClock,
  FiUsers,
  FiTag,
  FiTarget,
  FiActivity,
  FiEye,
  FiRefreshCw,
  FiPlus,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock data para el dashboard
  const dashboardStats = {
    totalTickets: 156,
    newTickets: 23,
    inProgress: 34,
    resolved: 98,
    critical: 3,
    highPriority: 12,
    avgResolutionTime: '4.2 horas',
    customerSatisfaction: 4.6,
    trends: {
      tickets: { value: 12.5, isPositive: true },
      resolution: { value: -15.3, isPositive: true }, // negativo es mejor en tiempo
      satisfaction: { value: 3.2, isPositive: true }
    }
  };

  const recentTickets = [
    {
      id: 1,
      ticket_number: 'ID-2025-001',
      title: 'Error crítico en sistema de facturación',
      priority: { name: 'Crítica', color: '#F44336' },
      status: { name: 'En Proceso', color: '#F59E0B' },
      created_at: '2025-01-15T10:30:00Z',
      assigned_to: { first_name: 'Juan', last_name: 'Pérez' }
    },
    {
      id: 2,
      ticket_number: 'ID-2025-002',
      title: 'Problema con impresora HP LaserJet',
      priority: { name: 'Alta', color: '#FF5722' },
      status: { name: 'Asignado', color: '#3B82F6' },
      created_at: '2025-01-15T09:15:00Z',
      assigned_to: { first_name: 'María', last_name: 'González' }
    },
    {
      id: 3,
      ticket_number: 'ID-2025-003',
      title: 'Solicitud nueva cuenta usuario',
      priority: { name: 'Media', color: '#FF9800' },
      status: { name: 'Nuevo', color: '#6B7280' },
      created_at: '2025-01-15T08:45:00Z',
      assigned_to: null
    }
  ];

  const upcomingTasks = [
    { task: 'Revisar tickets críticos pendientes', deadline: 'En 2 horas', priority: 'high' },
    { task: 'Reunión de seguimiento semanal', deadline: 'Mañana 10:00 AM', priority: 'medium' },
    { task: 'Actualización sistema de monitoreo', deadline: 'Viernes', priority: 'low' }
  ];

  const handleRefresh = async () => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${Math.ceil(diffHours / 24)} días`;
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';
    
    return `${greeting}, ${user?.first_name || 'Usuario'}!`;
  };

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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              {getWelcomeMessage()}
            </Typography>
            <Typography variant="body1" className="opacity-90 mb-1">
              {getRoleLabel(user?.role_id)} • {user?.email}
            </Typography>
            <Typography variant="body2" className="opacity-75">
              Sistema de Tickets - {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </div>
          <div className="hidden md:flex space-x-3">
            <Button
              variant="outlined"
              startIcon={<FiPlus />}
              onClick={() => navigate('/tickets')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Nuevo Ticket
            </Button>
            <Button
              variant="contained"
              startIcon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-blue-600 font-medium mb-1">
                  Total Tickets
                </Typography>
                <Typography variant="h4" className="font-bold text-blue-700 mb-2">
                  {dashboardStats.totalTickets}
                </Typography>
                <div className="flex items-center">
                  <FiTrendingUp className="text-green-500 mr-1" size={16} />
                  <Typography variant="caption" className="text-green-600 font-medium">
                    +{dashboardStats.trends.tickets.value}%
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <FiTag className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En Proceso */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-yellow-600 font-medium mb-1">
                  En Proceso
                </Typography>
                <Typography variant="h4" className="font-bold text-yellow-700 mb-2">
                  {dashboardStats.inProgress}
                </Typography>
                <div className="flex items-center">
                  <Typography variant="caption" className="text-yellow-600 font-medium">
                    {Math.round((dashboardStats.inProgress / dashboardStats.totalTickets) * 100)}% del total
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <FiClock className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resueltos */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-green-600 font-medium mb-1">
                  Resueltos
                </Typography>
                <Typography variant="h4" className="font-bold text-green-700 mb-2">
                  {dashboardStats.resolved}
                </Typography>
                <div className="flex items-center">
                  <FiTrendingDown className="text-green-500 mr-1" size={16} />
                  <Typography variant="caption" className="text-green-600 font-medium">
                    {Math.abs(dashboardStats.trends.resolution.value)}% mejor tiempo
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <FiTarget className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Críticos */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-red-600 font-medium mb-1">
                  Críticos
                </Typography>
                <Typography variant="h4" className="font-bold text-red-700 mb-2">
                  {dashboardStats.critical}
                </Typography>
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-500 mr-1" size={16} />
                  <Typography variant="caption" className="text-red-600 font-medium">
                    Requieren atención
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <FiActivity className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Recientes - 2/3 del ancho */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  Tickets Recientes
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/tickets')}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Ver todos
                </Button>
              </div>
              
              <TableContainer component={Paper} className="shadow-none">
                <Table size="small">
                  <TableHead className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      <TableCell className="font-semibold">Ticket</TableCell>
                      <TableCell className="font-semibold">Prioridad</TableCell>
                      <TableCell className="font-semibold">Estado</TableCell>
                      <TableCell className="font-semibold">Asignado</TableCell>
                      <TableCell className="font-semibold">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div>
                            <Typography variant="body2" className="font-medium text-blue-600">
                              {ticket.ticket_number}
                            </Typography>
                            <Typography variant="caption" className="text-gray-600 dark:text-gray-400 block truncate max-w-xs">
                              {ticket.title}
                            </Typography>
                            <Typography variant="caption" className="text-gray-400">
                              {formatTimeAgo(ticket.created_at)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.priority.name}
                            size="small"
                            style={{ 
                              backgroundColor: ticket.priority.color + '20',
                              color: ticket.priority.color,
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.status.name}
                            size="small"
                            style={{ 
                              backgroundColor: ticket.status.color + '20',
                              color: ticket.status.color,
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {ticket.assigned_to ? (
                            <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                              {ticket.assigned_to.first_name} {ticket.assigned_to.last_name}
                            </Typography>
                          ) : (
                            <Typography variant="caption" className="text-gray-400 italic">
                              Sin asignar
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Ver detalles">
                            <IconButton size="small" className="text-blue-600 hover:bg-blue-50">
                              <FiEye />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - 1/3 del ancho */}
        <div className="space-y-6">
          {/* Próximas tareas */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                Próximas Tareas
              </Typography>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <Typography variant="body2" className="font-medium">
                        {task.task}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {task.deadline}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métricas adicionales */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                Métricas del Mes
              </Typography>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography variant="body2" className="text-gray-600">
                      Tiempo Promedio
                    </Typography>
                    <Typography variant="body2" className="font-bold text-green-600">
                      {dashboardStats.avgResolutionTime}
                    </Typography>
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    className="h-2 rounded-full"
                    sx={{
                      backgroundColor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#10B981'
                      }
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography variant="body2" className="text-gray-600">
                      Satisfacción Cliente
                    </Typography>
                    <Typography variant="body2" className="font-bold text-blue-600">
                      ⭐ {dashboardStats.customerSatisfaction}/5.0
                    </Typography>
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={dashboardStats.customerSatisfaction * 20} 
                    className="h-2 rounded-full"
                    sx={{
                      backgroundColor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#3B82F6'
                      }
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Typography variant="body2" className="text-gray-600">
                      SLA Compliance
                    </Typography>
                    <Typography variant="body2" className="font-bold text-purple-600">
                      87%
                    </Typography>
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={87} 
                    className="h-2 rounded-full"
                    sx={{
                      backgroundColor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#8B5CF6'
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;