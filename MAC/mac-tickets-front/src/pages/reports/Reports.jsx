// /pages/reports/Reports.jsx - Reportes con estética Figma

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
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
  FiClock,
  FiUsers,
  FiTag,
  FiTarget,
  FiActivity,
  FiPieChart
} from 'react-icons/fi';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days');

  // Mock data para reportes
  const mockStats = {
    totalTickets: 156,
    resolvedTickets: 98,
    averageResolutionTime: '4.2 horas',
    slaCompliance: 87,
    trends: {
      ticketsGrowth: 12.5,
      resolutionImprovement: -15.3
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
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header estilo Figma */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Typography variant="h4" className="font-bold text-gray-900">
              Reportes<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-1">
              Análisis detallado del rendimiento del sistema de tickets
            </Typography>
          </div>
          <div className="flex gap-3">
            <FormControl 
              size="small" 
              sx={{
                minWidth: 140,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#E31E24'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E31E24'
                  }
                }
              }}
            >
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
              sx={{
                backgroundColor: '#E31E24',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                padding: '8px 24px',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#C41A1F'
                }
              }}
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Métricas Principales - Estilo Dashboard */}
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
                    +{mockStats.trends.ticketsGrowth}%
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Total Tickets
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {mockStats.totalTickets}
              </Typography>
            </CardContent>
          </Card>

          {/* Tickets Resueltos */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FiTarget className="text-green-600" size={24} />
                </div>
                <Typography variant="caption" className="text-gray-600 font-medium">
                  {Math.round((mockStats.resolvedTickets / mockStats.totalTickets) * 100)}% del total
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Resueltos
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {mockStats.resolvedTickets}
              </Typography>
            </CardContent>
          </Card>

          {/* Tiempo Promedio */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <FiClock className="text-orange-600" size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <FiTrendingDown className="text-green-500" size={16} />
                  <Typography variant="caption" className="text-green-600 font-bold">
                    {Math.abs(mockStats.trends.resolutionImprovement)}%
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Tiempo Promedio
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {mockStats.averageResolutionTime}
              </Typography>
            </CardContent>
          </Card>

          {/* SLA Compliance */}
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FiActivity className="text-purple-600" size={24} />
                </div>
                <Typography variant="caption" className="text-gray-600 font-medium">
                  Objetivo: 90%
                </Typography>
              </div>
              <Typography variant="body2" className="text-gray-600 font-medium mb-1">
                Cumplimiento SLA
              </Typography>
              <Typography variant="h3" className="font-bold text-gray-900">
                {mockStats.slaCompliance}%
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribución por Categoría */}
          <Card 
            className="shadow-lg"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-900">
                  Tickets por Categoría
                </Typography>
                <FiPieChart className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <Typography variant="body2" className="font-semibold text-gray-900">
                          {category.name}
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Typography variant="body2" className="text-gray-600 font-medium">
                          {category.total}
                        </Typography>
                        <Chip 
                          label={`${category.percentage}%`}
                          size="small"
                          sx={{
                            backgroundColor: '#F3F4F6',
                            color: '#374151',
                            fontWeight: '700',
                            fontSize: '0.7rem'
                          }}
                        />
                      </div>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.percentage * 2} 
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: category.color,
                          borderRadius: 3
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribución por Prioridad */}
          <Card 
            className="shadow-lg"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-900">
                  Tickets por Prioridad
                </Typography>
                <FiBarChart2 className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                {priorityStats.map((priority, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" className="font-semibold text-gray-900">
                        {priority.level}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        {priority.count} <span className="text-gray-400">({priority.percentage}%)</span>
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={priority.percentage * 2} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#F3F4F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: priority.color,
                          borderRadius: 4
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
        <Card 
          className="shadow-lg"
          sx={{ borderRadius: '16px' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" className="font-bold text-gray-900">
                Rendimiento por Técnico
              </Typography>
              <FiUsers className="text-gray-400" size={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicianStats.map((tech, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Typography variant="body1" className="font-bold text-gray-900 mb-4">
                    {tech.name}
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600">
                        Resueltos:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-green-600">
                        {tech.resolved}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600">
                        Pendientes:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-orange-600">
                        {tech.pending}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600">
                        Rating:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-blue-600">
                        ⭐ {tech.rating}
                      </Typography>
                    </div>
                    <Divider className="my-3" />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Typography variant="caption" className="text-gray-600 font-medium">
                          Eficiencia
                        </Typography>
                        <Typography variant="caption" className="font-bold text-gray-900">
                          {tech.efficiency}%
                        </Typography>
                      </div>
                      <LinearProgress 
                        variant="determinate" 
                        value={tech.efficiency} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#F3F4F6',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: tech.efficiency > 90 ? '#10B981' : tech.efficiency > 80 ? '#F59E0B' : '#EF4444',
                            borderRadius: 4
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
