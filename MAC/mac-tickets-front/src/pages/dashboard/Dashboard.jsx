// /pages/dashboard/Dashboard.jsx - Dashboard Principal con estética Figma

import React, { useState } from 'react';
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
  Tooltip
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
    slaCompliance: 87,
    trends: {
      tickets: { value: 12.5, isPositive: true },
      resolution: { value: -15.3, isPositive: true },
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
    },
    {
      id: 4,
      ticket_number: 'ID-2025-004',
      title: 'Actualización de sistema operativo',
      priority: { name: 'Baja', color: '#4CAF50' },
      status: { name: 'Resuelto', color: '#10B981' },
      created_at: '2025-01-14T16:20:00Z',
      assigned_to: { first_name: 'Carlos', last_name: 'Ruiz' }
    }
  ];

  const upcomingTasks = [
    { 
      task: 'Revisar tickets críticos pendientes', 
      deadline: 'En 2 horas', 
      priority: 'high',
      icon: <FiAlertCircle />
    },
    { 
      task: 'Reunión de seguimiento semanal', 
      deadline: 'Mañana 10:00 AM', 
      priority: 'medium',
      icon: <FiUsers />
    },
    { 
      task: 'Actualización sistema de monitoreo', 
      deadline: 'Viernes', 
      priority: 'low',
      icon: <FiActivity />
    }
  ];

  const handleRefresh = async () => {
    setLoading(true);
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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header estilo Figma */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-bold text-gray-900">
              Dashboard<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-1">
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

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Métricas principales - Estilo Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Tickets */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FiTag className="text-blue-600" size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <FiTrendingUp className="text-green-500" size={16} />
                  <Typography variant="caption" className="text-green-600 font-bold">
                    +{dashboardStats.trends.tickets.value}%
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Total Tickets
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {dashboardStats.totalTickets}
              </Typography>
            </CardContent>
          </Card>

          {/* En Proceso */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <FiClock className="text-orange-600" size={24} />
                </div>
                <Typography variant="caption" className="text-gray-600 font-medium">
                  {Math.round((dashboardStats.inProgress / dashboardStats.totalTickets) * 100)}%
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                En Proceso
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {dashboardStats.inProgress}
              </Typography>
            </CardContent>
          </Card>

          {/* Resueltos */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FiTarget className="text-green-600" size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <FiTrendingDown className="text-green-500" size={16} />
                  <Typography variant="caption" className="text-green-600 font-bold">
                    {Math.abs(dashboardStats.trends.resolution.value)}%
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Resueltos
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {dashboardStats.resolved}
              </Typography>
            </CardContent>
          </Card>

          {/* Críticos */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <FiActivity className="text-red-600" size={24} />
                </div>
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
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Críticos
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {dashboardStats.critical}
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
                  <Typography variant="h6" className="font-bold text-gray-900">
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
                  <Table size="small">
                    <TableHead>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold text-gray-700">Ticket</TableCell>
                        <TableCell className="font-bold text-gray-700">Prioridad</TableCell>
                        <TableCell className="font-bold text-gray-700">Estado</TableCell>
                        <TableCell className="font-bold text-gray-700">Asignado</TableCell>
                        <TableCell className="font-bold text-gray-700">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTickets.map((ticket) => (
                        <TableRow 
                          key={ticket.id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div>
                              <Typography variant="body2" className="font-semibold text-[#E31E24]">
                                {ticket.ticket_number}
                              </Typography>
                              <Typography variant="caption" className="text-gray-600 block truncate max-w-xs">
                                {ticket.title}
                              </Typography>
                              <Typography variant="caption" className="text-gray-400 flex items-center mt-1">
                                <FiClock className="mr-1" size={12} />
                                {formatTimeAgo(ticket.created_at)}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority.name}
                              size="small"
                              sx={{ 
                                backgroundColor: ticket.priority.color,
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: '700'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.status.name}
                              size="small"
                              sx={{ 
                                backgroundColor: ticket.status.color + '20',
                                color: ticket.status.color,
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                border: `1px solid ${ticket.status.color}40`
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {ticket.assigned_to ? (
                              <Typography variant="caption" className="text-gray-700 font-medium">
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
                              <IconButton 
                                size="small" 
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
                      className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                          task.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <Typography variant="body2" className="font-semibold text-gray-900">
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
                <Typography variant="h6" className="font-bold text-gray-900 mb-4 flex items-center">
                  <FiActivity className="mr-2 text-[#E31E24]" />
                  Métricas del Mes
                </Typography>
                <div className="space-y-4">
                  {/* Tiempo Promedio */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        Tiempo Promedio
                      </Typography>
                      <Typography variant="body2" className="font-bold text-green-600">
                        {dashboardStats.avgResolutionTime}
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
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        Satisfacción Cliente
                      </Typography>
                      <Typography variant="body2" className="font-bold text-blue-600">
                        ⭐ {dashboardStats.customerSatisfaction}/5.0
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={dashboardStats.customerSatisfaction * 20} 
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
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        SLA Compliance
                      </Typography>
                      <Typography variant="body2" className="font-bold text-purple-600">
                        {dashboardStats.slaCompliance}%
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={dashboardStats.slaCompliance} 
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
