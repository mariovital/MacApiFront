// /pages/dashboard/Dashboard.jsx - Dashboard Principal con estética Figma

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
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
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiClock,
  FiTag,
  FiTarget,
  FiActivity,
  FiEye,
  FiRefreshCw,
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiUsers
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/reportService';
import ticketService from '../../services/ticketService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para datos del dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);

  // Cargar datos del dashboard al montar componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Función para cargar todos los datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamadas en paralelo para mejor performance
      const [statsResponse, ticketsResponse] = await Promise.all([
        reportService.getDashboardStats('30days'),
        ticketService.getTickets({ 
          limit: 5, 
          page: 1,
          sortBy: 'created_at',
          sortOrder: 'DESC'
        })
      ]);

      // Procesar estadísticas
      if (statsResponse.success) {
        const stats = statsResponse.data.stats;
        
        // Calcular tickets en proceso y nuevos desde las estadísticas
        const inProgressCount = statsResponse.data.priorityStats?.reduce((sum, p) => sum + p.total, 0) || 0;
        const criticalTickets = statsResponse.data.priorityStats?.find(p => p.name === 'Crítica')?.total || 0;
        const highPriorityTickets = statsResponse.data.priorityStats?.find(p => p.name === 'Alta')?.total || 0;

        setDashboardStats({
          totalTickets: stats.totalTickets || 0,
          newTickets: stats.totalTickets - stats.resolvedTickets - stats.closedTickets || 0,
          inProgress: inProgressCount,
          resolved: stats.resolvedTickets || 0,
          critical: criticalTickets,
          highPriority: highPriorityTickets,
          avgResolutionTime: stats.averageResolutionTime || '0 horas',
          customerSatisfaction: 4.5, // Placeholder - agregar al backend si es necesario
          slaCompliance: stats.slaCompliance || 0,
          trends: {
            tickets: { 
              value: Math.abs(stats.trends?.ticketsGrowth || 0), 
              isPositive: (stats.trends?.ticketsGrowth || 0) >= 0 
            },
            resolution: { 
              value: Math.abs(stats.trends?.resolutionImprovement || 0), 
              isPositive: (stats.trends?.resolutionImprovement || 0) >= 0 
            },
            satisfaction: { value: 3.2, isPositive: true }
          }
        });

        setPriorityStats(statsResponse.data.priorityStats || []);
      }

      // Procesar tickets recientes
      if (ticketsResponse.success && ticketsResponse.data?.items) {
        setRecentTickets(ticketsResponse.data.items);
      }

    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError('Error al cargar los datos del dashboard. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar actualización manual
  const handleRefresh = async () => {
    await loadDashboardData();
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

  // Generar tareas pendientes dinámicas basadas en datos reales
  const generateUpcomingTasks = () => {
    const tasks = [];
    
    // Tarea de tickets críticos
    if (dashboardStats?.critical > 0) {
      tasks.push({
        task: `Revisar ${dashboardStats.critical} ticket${dashboardStats.critical > 1 ? 's' : ''} crítico${dashboardStats.critical > 1 ? 's' : ''} pendiente${dashboardStats.critical > 1 ? 's' : ''}`,
        deadline: 'Urgente',
        priority: 'high',
        icon: <FiAlertCircle />
      });
    }
    
    // Tarea de tickets sin asignar
    const unassignedTickets = recentTickets.filter(t => !t.assigned_to).length;
    if (unassignedTickets > 0) {
      tasks.push({
        task: `Asignar ${unassignedTickets} ticket${unassignedTickets > 1 ? 's' : ''} pendiente${unassignedTickets > 1 ? 's' : ''}`,
        deadline: 'Hoy',
        priority: 'medium',
        icon: <FiUsers />
      });
    }

    // Tarea general de seguimiento
    tasks.push({
      task: 'Revisión de tickets en proceso',
      deadline: 'Diario',
      priority: 'low',
      icon: <FiActivity />
    });

    return tasks;
  };

  const upcomingTasks = generateUpcomingTasks();

  // Mostrar loading inicial
  if (loading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress sx={{ color: '#E31E24' }} size={60} />
          <Typography variant="h6" className="text-gray-600 dark:text-gray-400 mt-4">
            Cargando dashboard...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Dashboard<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              {getWelcomeMessage()} • {getRoleLabel(user?.role_id)}
            </Typography>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => navigate('/tickets')}
              sx={{
                backgroundColor: '#E31E24',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                padding: '10px 24px',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#C41A1F'
                }
              }}
            >
              Nuevo Ticket
            </Button>
            <Button
              variant="outlined"
              startIcon={<FiRefreshCw className={loading ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
                borderRadius: '12px',
                textTransform: 'none',
                padding: '10px 24px',
                fontWeight: '600',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB'
                }
              }}
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="px-6 mb-4">
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ borderRadius: '12px' }}
          >
            {error}
          </Alert>
        </div>
      )}

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Métricas principales - Estilo Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Tickets */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FiTag className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                {dashboardStats?.trends?.tickets && (
                  <div className="flex items-center space-x-1">
                    {dashboardStats.trends.tickets.isPositive ? (
                      <FiTrendingUp className="text-green-500 dark:text-green-400" size={16} />
                    ) : (
                      <FiTrendingDown className="text-red-500 dark:text-red-400" size={16} />
                    )}
                    <Typography variant="caption" className={`${dashboardStats.trends.tickets.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-bold`}>
                      {dashboardStats.trends.tickets.isPositive ? '+' : '-'}{dashboardStats.trends.tickets.value}%
                    </Typography>
                  </div>
                )}
              </div>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                Total Tickets
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                {dashboardStats?.totalTickets || 0}
              </Typography>
            </CardContent>
          </Card>

          {/* En Proceso */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <FiClock className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <Typography variant="caption" className="text-gray-600 dark:text-gray-400 font-medium">
                  {dashboardStats?.totalTickets > 0 
                    ? Math.round((dashboardStats.inProgress / dashboardStats.totalTickets) * 100)
                    : 0}%
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                En Proceso
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                {dashboardStats?.inProgress || 0}
              </Typography>
            </CardContent>
          </Card>

          {/* Resueltos */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <FiTarget className="text-green-600 dark:text-green-400" size={24} />
                </div>
                {dashboardStats?.trends?.resolution && (
                  <div className="flex items-center space-x-1">
                    {dashboardStats.trends.resolution.isPositive ? (
                      <FiTrendingUp className="text-green-500 dark:text-green-400" size={16} />
                    ) : (
                      <FiTrendingDown className="text-red-500 dark:text-red-400" size={16} />
                    )}
                    <Typography variant="caption" className="text-green-600 dark:text-green-400 font-bold">
                      {Math.abs(dashboardStats.trends.resolution.value)}%
                    </Typography>
                  </div>
                )}
              </div>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                Resueltos
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                {dashboardStats?.resolved || 0}
              </Typography>
            </CardContent>
          </Card>

          {/* Críticos */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <FiActivity className="text-red-600 dark:text-red-400" size={24} />
                </div>
                {dashboardStats?.critical > 0 && (
                  <Chip 
                    label="Atención"
                    size="small"
                    sx={{
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      fontWeight: '700',
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </div>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                Críticos
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                {dashboardStats?.critical || 0}
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Contenido en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets Recientes - 2/3 del ancho */}
          <div className="lg:col-span-2">
            <Card 
              className="shadow-lg"
              sx={{ borderRadius: '16px' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    Tickets Recientes
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/tickets')}
                    sx={{
                      color: '#E31E24',
                      textTransform: 'none',
                      fontWeight: '600',
                      '&:hover': {
                        backgroundColor: '#FEE2E2'
                      }
                    }}
                  >
                    Ver todos
                  </Button>
                </div>
                
                <TableContainer>
                  {recentTickets.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableCell className="font-bold text-gray-700 dark:text-gray-300">Ticket</TableCell>
                          <TableCell className="font-bold text-gray-700 dark:text-gray-300">Prioridad</TableCell>
                          <TableCell className="font-bold text-gray-700 dark:text-gray-300">Estado</TableCell>
                          <TableCell className="font-bold text-gray-700 dark:text-gray-300">Asignado</TableCell>
                          <TableCell className="font-bold text-gray-700 dark:text-gray-300">Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentTickets.map((ticket) => (
                          <TableRow 
                            key={ticket.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <TableCell>
                              <div>
                                <Typography variant="body2" className="font-semibold text-[#E31E24]">
                                  {ticket.ticket_number}
                                </Typography>
                                <Typography variant="caption" className="text-gray-600 dark:text-gray-400 block truncate max-w-xs">
                                  {ticket.title}
                                </Typography>
                                <Typography variant="caption" className="text-gray-400 dark:text-gray-500 flex items-center mt-1">
                                  <FiClock className="mr-1" size={12} />
                                  {formatTimeAgo(ticket.created_at)}
                                </Typography>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={ticket.priority?.name || 'Media'}
                                size="small"
                                sx={{ 
                                  backgroundColor: ticket.priority?.color || '#FF9800',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: '700'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={ticket.status?.name || 'Nuevo'}
                                size="small"
                                sx={{ 
                                  backgroundColor: (ticket.status?.color || '#6B7280') + '20',
                                  color: ticket.status?.color || '#6B7280',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  border: `1px solid ${ticket.status?.color || '#6B7280'}40`
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {ticket.assigned_to ? (
                                <Typography variant="caption" className="text-gray-700 dark:text-gray-300 font-medium">
                                  {ticket.assigned_to.first_name} {ticket.assigned_to.last_name}
                                </Typography>
                              ) : (
                                <Typography variant="caption" className="text-gray-400 dark:text-gray-500 italic">
                                  Sin asignar
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver detalles">
                                <IconButton 
                                  size="small"
                                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                                  sx={{ 
                                    color: '#E31E24',
                                    '&:hover': {
                                      backgroundColor: '#FEE2E2'
                                    }
                                  }}
                                >
                                  <FiEye />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                        No hay tickets recientes para mostrar
                      </Typography>
                    </div>
                  )}
                </TableContainer>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral - 1/3 del ancho */}
          <div className="space-y-6">
            {/* Próximas tareas */}
            <Card 
              className="shadow-lg"
              sx={{ borderRadius: '16px' }}
            >
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-[#E31E24]" />
                  Próximas Tareas
                </Typography>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                          task.priority === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 
                          'bg-green-100 dark:bg-green-900/30 text-green-600'
                        }`}>
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
                            {task.task}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500 flex items-center mt-1">
                            <FiClock className="mr-1" size={12} />
                            {task.deadline}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métricas del mes */}
            <Card 
              className="shadow-lg"
              sx={{ borderRadius: '16px' }}
            >
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiActivity className="mr-2 text-[#E31E24]" />
                  Métricas del Mes
                </Typography>
                <div className="space-y-4">
                  {/* Tiempo Promedio */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium">
                        Tiempo Promedio
                      </Typography>
                      <Typography variant="body2" className="font-bold text-green-600 dark:text-green-400">
                        {dashboardStats?.avgResolutionTime || '0 horas'}
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#10B981',
                          borderRadius: 4
                        }
                      }}
                    />
                  </div>
                  
                  {/* Satisfacción Cliente */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium">
                        Satisfacción Cliente
                      </Typography>
                      <Typography variant="body2" className="font-bold text-blue-600 dark:text-blue-400">
                        ⭐ {dashboardStats?.customerSatisfaction || 0}/5.0
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dashboardStats?.customerSatisfaction || 0) * 20} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3B82F6',
                          borderRadius: 4
                        }
                      }}
                    />
                  </div>

                  {/* SLA Compliance */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium">
                        SLA Compliance
                      </Typography>
                      <Typography variant="body2" className="font-bold text-purple-600 dark:text-purple-400">
                        {dashboardStats?.slaCompliance || 0}%
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={dashboardStats?.slaCompliance || 0} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#8B5CF6',
                          borderRadius: 4
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
    </div>
  );
};

export default Dashboard;
