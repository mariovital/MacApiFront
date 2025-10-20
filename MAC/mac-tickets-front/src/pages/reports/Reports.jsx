// /pages/reports/Reports.jsx - Reportes con estética Figma

import React, { useState, useEffect } from 'react';
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
  Divider,
  CircularProgress,
  Alert,
  Snackbar
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
  FiPieChart,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import reportService from '../../services/reportService';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);
  const [technicianStats, setTechnicianStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportService.getDashboardStats(dateRange);
      
      if (response.success) {
        setStats(response.data.stats);
        setCategoryStats(response.data.categoryStats || []);
        setPriorityStats(response.data.priorityStats || []);
        setTechnicianStats(response.data.technicianStats || []);
      }
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('Error al cargar las estadísticas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar a Excel
  const handleExportExcel = async () => {
    try {
      setExporting(true);
      
      const blob = await reportService.exportToExcel(dateRange);
      
      // Descargar archivo
      reportService.downloadExcel(blob, dateRange);
      
      // Mostrar mensaje de éxito
      setSnackbarMessage('Reporte descargado exitosamente');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      
    } catch (err) {
      console.error('Error exportando reporte:', err);
      
      // Verificar si es un error de "no data"
      if (err.response?.data?.code === 'NO_DATA') {
        setSnackbarMessage('No hay tickets en el período seleccionado');
        setSnackbarSeverity('warning');
      } else {
        setSnackbarMessage('Error al exportar el reporte. Por favor, intenta de nuevo.');
        setSnackbarSeverity('error');
      }
      setShowSnackbar(true);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Reportes<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
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
                <MenuItem value="1year">1 año</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <FiDownload />}
              onClick={handleExportExcel}
              disabled={exporting || loading}
              sx={{
                backgroundColor: '#E31E24',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                padding: '8px 24px',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#C41A1F'
                },
                '&:disabled': {
                  backgroundColor: '#FCA5A5',
                  color: 'white'
                }
              }}
            >
              {exporting ? 'Exportando...' : 'Exportar Excel'}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center space-y-4">
            <CircularProgress sx={{ color: '#E31E24' }} size={48} />
            <Typography className="text-gray-600 dark:text-gray-400">
              Cargando estadísticas...
            </Typography>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && !loading && (
        <div className="px-6 pt-6">
          <Alert severity="error" icon={<FiAlertCircle />} onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {!loading && stats && (
          <>
            {/* Métricas Principales - Estilo Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Tickets */}
              <Card 
                className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800"
                sx={{ borderRadius: '16px' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <FiTag className="text-blue-600 dark:text-blue-300" size={24} />
                    </div>
                    {stats.trends.ticketsGrowth !== 0 && (
                      <div className="flex items-center space-x-1">
                        {stats.trends.ticketsGrowth > 0 ? (
                          <FiTrendingUp className="text-green-500 dark:text-green-400" size={16} />
                        ) : (
                          <FiTrendingDown className="text-red-500 dark:text-red-400" size={16} />
                        )}
                        <Typography variant="caption" className={`font-bold ${stats.trends.ticketsGrowth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stats.trends.ticketsGrowth > 0 ? '+' : ''}{stats.trends.ticketsGrowth}%
                        </Typography>
                      </div>
                    )}
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Total Tickets
                  </Typography>
                  <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                    {stats.totalTickets}
                  </Typography>
                </CardContent>
              </Card>

              {/* Tickets Resueltos */}
              <Card 
                className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800"
                sx={{ borderRadius: '16px' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                      <FiTarget className="text-green-600 dark:text-green-300" size={24} />
                    </div>
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400 font-medium">
                      {stats.totalTickets > 0 ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100) : 0}% del total
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Resueltos
                  </Typography>
                  <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                    {stats.resolvedTickets}
                  </Typography>
                </CardContent>
              </Card>

              {/* Tiempo Promedio */}
              <Card 
                className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800"
                sx={{ borderRadius: '16px' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                      <FiClock className="text-orange-600 dark:text-orange-300" size={24} />
                    </div>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Tiempo Promedio
                  </Typography>
                  <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                    {stats.averageResolutionTime}
                  </Typography>
                </CardContent>
              </Card>

              {/* SLA Compliance */}
              <Card 
                className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800"
                sx={{ borderRadius: '16px' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                      <FiActivity className="text-purple-600 dark:text-purple-300" size={24} />
                    </div>
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400 font-medium">
                      Objetivo: 90%
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Cumplimiento SLA
                  </Typography>
                  <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
                    {stats.slaCompliance}%
                  </Typography>
                </CardContent>
              </Card>
            </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribución por Categoría */}
          <Card 
            className="shadow-lg dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  Tickets por Categoría
                </Typography>
                <FiPieChart className="text-gray-400 dark:text-gray-500" size={20} />
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
                        <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </Typography>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium">
                          {category.total}
                        </Typography>
                        <Chip 
                          label={`${category.percentage}%`}
                          size="small"
                          className="dark:bg-gray-700 dark:text-gray-300"
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
                      value={category.percentage} 
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
            className="shadow-lg dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  Tickets por Prioridad
                </Typography>
                <FiBarChart2 className="text-gray-400 dark:text-gray-500" size={20} />
              </div>
              <div className="space-y-4">
                {priorityStats.map((priority, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" className="font-semibold text-gray-900 dark:text-white">
                        {priority.level}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 font-medium">
                        {priority.count} <span className="text-gray-400 dark:text-gray-500">({priority.percentage}%)</span>
                      </Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={priority.percentage} 
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
          className="shadow-lg dark:bg-gray-800"
          sx={{ borderRadius: '16px' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                Rendimiento por Técnico
              </Typography>
              <FiUsers className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicianStats.map((tech, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Typography variant="body1" className="font-bold text-gray-900 dark:text-white mb-4">
                    {tech.name}
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Resueltos:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-green-600 dark:text-green-400">
                        {tech.resolved}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Pendientes:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-orange-600 dark:text-orange-400">
                        {tech.pending}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        Rating:
                      </Typography>
                      <Typography variant="body2" className="font-bold text-blue-600 dark:text-blue-400">
                        ⭐ {tech.rating}
                      </Typography>
                    </div>
                    <Divider className="my-3 dark:border-gray-600" />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400 font-medium">
                          Eficiencia
                        </Typography>
                        <Typography variant="caption" className="font-bold text-gray-900 dark:text-white">
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
          </>
        )}
      </div>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity}
          icon={snackbarSeverity === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Reports;
