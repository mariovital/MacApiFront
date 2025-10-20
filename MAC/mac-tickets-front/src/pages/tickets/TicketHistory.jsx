// /pages/tickets/TicketHistory.jsx - Vista de Historial (Tickets Pasados) según Figma

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material';
import { FiSearch, FiMapPin, FiCalendar, FiTag, FiUser, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';

const TicketHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar tickets completados desde la API
  useEffect(() => {
    loadCompletedTickets();
  }, []);

  const loadCompletedTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener tickets con status 5 (Resuelto) o 6 (Cerrado)
      const response = await ticketService.getTickets({
        status: '5,6', // Filtrar por tickets resueltos o cerrados
        limit: 100,
        page: 1
      });

      if (response.success && response.data) {
        setTickets(response.data.items || []);
      }
    } catch (err) {
      console.error('Error cargando tickets completados:', err);
      setError('Error al cargar el historial de tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicketDetail = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const handleRefresh = async () => {
    await loadCompletedTickets();
  };

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client_contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular tiempo de resolución
  const calculateResolutionTime = (createdAt, closedAt) => {
    if (!closedAt) return 'En proceso';
    
    const start = new Date(createdAt);
    const end = new Date(closedAt);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    
    if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''} ${remainingHours}h`;
    }
    return `${diffHours} horas`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress sx={{ color: '#E31E24' }} size={48} />
          <Typography className="mt-4 text-gray-600 dark:text-gray-400">
            Cargando historial de tickets...
          </Typography>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
            {error}
          </Typography>
          <Button
            onClick={loadCompletedTickets}
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
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Historial<span className="text-[#E31E24]">.</span>
            </Typography>
          </div>
          <div className="flex items-center space-x-4">
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              <strong>{filteredTickets.length}</strong> tickets completados
            </Typography>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
                borderRadius: '12px',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: '600',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB'
                }
              }}
            >
              <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <TextField
            fullWidth
            placeholder="Buscar en historial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch className="text-gray-400 dark:text-gray-500" />
                </InputAdornment>
              ),
              className: "dark:bg-gray-800 dark:text-white",
              sx: {
                backgroundColor: 'white',
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #E5E7EB'
                }
              }
            }}
          />
        </div>

        {/* Grid de tickets históricos - 2 columnas como en Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id}
              className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800"
              sx={{ 
                borderRadius: '20px',
                overflow: 'visible'
              }}
            >
              <CardContent className="p-0">
                {/* Header de la card con badges */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 px-6 py-4 border-b border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-3">
                    <Chip 
                      label={ticket.status.name}
                      size="small"
                      icon={<FiCheckCircle size={14} />}
                      sx={{
                        backgroundColor: ticket.status.color,
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                    <Chip 
                      label={ticket.priority.name}
                      size="small"
                      sx={{
                        backgroundColor: ticket.priority.color + '30',
                        color: ticket.priority.color,
                        fontWeight: '700',
                        fontSize: '0.7rem',
                        border: `1px solid ${ticket.priority.color}`
                      }}
                    />
                  </div>
                  
                  {/* Título del ticket */}
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-2">
                    {ticket.title}
                  </Typography>
                  
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {ticket.description || 'Sin descripción'}
                  </Typography>

                  {/* Tiempo de resolución */}
                  <div className="flex items-center mt-3 p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <FiClock className="text-green-600 dark:text-green-400 mr-2" size={16} />
                    <Typography variant="caption" className="text-green-700 dark:text-green-300 font-semibold">
                      Resuelto en: {calculateResolutionTime(ticket.created_at, ticket.closed_at || ticket.updated_at)}
                    </Typography>
                  </div>
                </div>

                {/* Información del cliente */}
                <div className="px-6 py-4 space-y-3">
                  {/* Reportado por */}
                  <div className="flex items-start">
                    <FiUser className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Cliente:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                        {ticket.client_company || ticket.client_contact || 'Sin información'}
                      </Typography>
                    </div>
                  </div>

                  {/* Etiqueta/ID */}
                  <div className="flex items-start">
                    <FiTag className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Etiqueta:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                        {ticket.ticket_number}
                      </Typography>
                    </div>
                  </div>

                  {/* Técnico asignado */}
                  {ticket.assignee && (
                    <div className="flex items-start">
                      <FiUser className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Técnico:
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.assignee.first_name} {ticket.assignee.last_name}
                        </Typography>
                      </div>
                    </div>
                  )}

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <FiCalendar className="text-gray-400 dark:text-gray-500 mr-2 mt-1 flex-shrink-0" size={14} />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Iniciado:
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-xs">
                          {new Date(ticket.created_at).toLocaleString('es-MX')}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiCheckCircle className="text-green-600 dark:text-green-400 mr-2 mt-1 flex-shrink-0" size={14} />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Completado:
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-xs">
                          {new Date(ticket.closed_at || ticket.updated_at).toLocaleString('es-MX')}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Ubicación */}
                  {ticket.location && (
                    <div className="flex items-start">
                      <FiMapPin className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Ubicación:
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.location}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mapa placeholder */}
                <div className="px-6 pb-4">
                  <div 
                    className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%, #E5E7EB), linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%, #E5E7EB)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px'
                    }}
                  >
                    <div className="text-center">
                      <FiMapPin className="mx-auto text-green-700 dark:text-green-300 mb-1" size={24} />
                      <Typography variant="caption" className="text-green-800 dark:text-green-200 font-medium">
                        Ubicación del servicio
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Botón de acción - Simplificado */}
                <div className="px-6 pb-6">
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewTicketDetail(ticket.id)}
                    startIcon={<FiEye />}
                    sx={{
                      backgroundColor: '#E31E24',
                      color: 'white',
                      borderRadius: '12px',
                      textTransform: 'none',
                      padding: '12px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      '&:hover': {
                        backgroundColor: '#C41A1F'
                      }
                    }}
                  >
                    Ver Detalle del Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sin resultados */}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <FiCheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <Typography variant="h6" className="text-gray-600 dark:text-gray-400">
              No se encontraron tickets en el historial
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketHistory;

