import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiDownload,
  FiCalendar,
  FiClock,
  FiUsers,
  FiTag,
  FiTarget,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('general');

  // Mock data para reportes
  const mockStats = {
    totalTickets: 156,
    resolvedTickets: 98,
    averageResolutionTime: '4.2 horas',
    customerSatisfaction: 4.6,
    slaCompliance: 87,
    activeUsers: 12,
    criticalTickets: 3,
    pendingTickets: 23,
    trends: {
      ticketsGrowth: 12.5,
      resolutionImprovement: -15.3,
      satisfactionChange: 3.2
    }
  };

  const categoryStats = [
    { name: 'Hardware', total: 45, percentage: 29, color: '#EF4444' },
    { name: 'Software', total: 67, percentage: 43, color: '#3B82F6' },
    { name: 'Red/Conectividad', total: 28, percentage: 18, color: '#10B981' },
    { name: 'Soporte General', total: 16, percentage: 10, color: '#F59E0B' }
  ];

  const technicianStats = [
    { name: 'Juan Pérez', resolved: 34, pending: 8, rating: 4.8, efficiency: 92 },
    { name: 'María González', resolved: 28, pending: 5, rating: 4.7, efficiency: 88 },
    { name: 'Carlos Ruiz', resolved: 25, pending: 7, rating: 4.5, efficiency: 85 },
    { name: 'Ana Torres', resolved: 11, pending: 3, rating: 4.6, efficiency: 78 }
  ];

  const priorityStats = [
    { level: 'Crítica', count: 3, percentage: 2, color: '#F44336' },
    { level: 'Alta', count: 23, percentage: 15, color: '#FF5722' },
    { level: 'Media', count: 89, percentage: 57, color: '#FF9800' },
    { level: 'Baja', count: 41, percentage: 26, color: '#4CAF50' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
            Reportes y Analytics
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis detallado del rendimiento del sistema de tickets
          </Typography>
        </div>
        <div className="flex gap-2">
          <FormControl size="small" className="min-w-32">
            <InputLabel>Período</InputLabel>
            <Select
              value={dateRange}
              label="Período"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="7days">7 días</MenuItem>
              <MenuItem value="30days">30 días</MenuItem>
              <MenuItem value="90days">90 días</MenuItem>
              <MenuItem value="year">Año actual</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<FiDownload />}
            className="bg-green-600 hover:bg-green-700"
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-blue-600 font-medium mb-1">
                  Total Tickets
                </Typography>
                <Typography variant="h4" className="font-bold text-blue-700">
                  {mockStats.totalTickets}
                </Typography>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="text-green-500 mr-1" size={16} />
                  <Typography variant="caption" className="text-green-600 font-medium">
                    +{mockStats.trends.ticketsGrowth}% vs mes anterior
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <FiTag className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Resueltos */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-green-600 font-medium mb-1">
                  Tickets Resueltos
                </Typography>
                <Typography variant="h4" className="font-bold text-green-700">
                  {mockStats.resolvedTickets}
                </Typography>
                <div className="flex items-center mt-2">
                  <Typography variant="caption" className="text-green-600 font-medium">
                    {Math.round((mockStats.resolvedTickets / mockStats.totalTickets) * 100)}% del total
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <FiTarget className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tiempo Promedio */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-yellow-600 font-medium mb-1">
                  Tiempo Promedio
                </Typography>
                <Typography variant="h4" className="font-bold text-yellow-700">
                  {mockStats.averageResolutionTime}
                </Typography>
                <div className="flex items-center mt-2">
                  <FiTrendingDown className="text-green-500 mr-1" size={16} />
                  <Typography variant="caption" className="text-green-600 font-medium">
                    {Math.abs(mockStats.trends.resolutionImprovement)}% mejor
                  </Typography>
                </div>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <FiClock className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SLA Compliance */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-purple-600 font-medium mb-1">
                  Cumplimiento SLA
                </Typography>
                <Typography variant="h4" className="font-bold text-purple-700">
                  {mockStats.slaCompliance}%
                </Typography>
                <div className="mt-2">
                  <LinearProgress 
                    variant="determinate" 
                    value={mockStats.slaCompliance} 
                    className="h-2 rounded-full bg-purple-200"
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#8B5CF6'
                      }
                    }}
                  />
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <FiActivity className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Categoría */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                Tickets por Categoría
              </Typography>
              <FiPieChart className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <Typography variant="body2" className="font-medium">
                      {category.name}
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Typography variant="body2" className="text-gray-600">
                      {category.total}
                    </Typography>
                    <Chip 
                      label={`${category.percentage}%`}
                      size="small"
                      className="bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribución por Prioridad */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                Tickets por Prioridad
              </Typography>
              <FiBarChart2 className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              {priorityStats.map((priority, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <Typography variant="body2" className="font-medium">
                      {priority.level}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {priority.count} ({priority.percentage}%)
                    </Typography>
                  </div>
                  <LinearProgress 
                    variant="determinate" 
                    value={priority.percentage * 2} 
                    className="h-2 rounded-full"
                    sx={{
                      backgroundColor: '#f3f4f6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: priority.color
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento por Técnico */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
              Rendimiento por Técnico
            </Typography>
            <FiUsers className="text-gray-400" size={20} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicianStats.map((tech, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <Typography variant="body1" className="font-bold mb-3">
                    {tech.name}
                  </Typography>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="caption" className="text-gray-600">
                        Resueltos:
                      </Typography>
                      <Typography variant="caption" className="font-bold text-green-600">
                        {tech.resolved}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="caption" className="text-gray-600">
                        Pendientes:
                      </Typography>
                      <Typography variant="caption" className="font-bold text-yellow-600">
                        {tech.pending}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="caption" className="text-gray-600">
                        Rating:
                      </Typography>
                      <Typography variant="caption" className="font-bold text-blue-600">
                        ⭐ {tech.rating}
                      </Typography>
                    </div>
                    <Divider className="my-2" />
                    <div>
                      <Typography variant="caption" className="text-gray-600 mb-1 block">
                        Eficiencia: {tech.efficiency}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={tech.efficiency} 
                        className="h-2 rounded-full"
                        sx={{
                          backgroundColor: '#f3f4f6',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: tech.efficiency > 90 ? '#10B981' : tech.efficiency > 80 ? '#F59E0B' : '#EF4444'
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
