// /pages/tickets/TicketList.jsx - Vista de Lista de Tickets según Figma

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { FiSearch, FiPlus, FiMapPin, FiCalendar, FiTag, FiUser, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMapComponent } from '../../components/common';
import ticketService from '../../services/ticketService';

const TicketList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data de técnicos (se cargará desde API más adelante)
  const technicians = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María González' },
    { id: 3, name: 'Carlos Ruiz' },
    { id: 4, name: 'Ana Torres' }
  ];

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener tickets desde la API (excluyendo resueltos y cerrados)
      const response = await ticketService.getTickets({
        limit: 100,
        page: 1
      });

      if (response.success && response.data) {
        setTickets(response.data.items || []);
      }
    } catch (err) {
      console.error('Error cargando tickets:', err);
      setError('Error al cargar los tickets. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTickets();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptTicket = (ticketId) => {
    const technicianId = selectedTechnician[ticketId];
    if (technicianId) {
      console.log(`Asignando ticket ${ticketId} a técnico ${technicianId}`);
      // Aquí iría la lógica real de asignación
      const updatedTickets = tickets.map(t => 
        t.id === ticketId 
          ? { ...t, assigned_to: technicianId, status: { name: 'Asignado', color: '#3B82F6' } }
          : t
      );
      setTickets(updatedTickets);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client_contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Tickets<span className="text-[#E31E24]">.</span>
            </Typography>
            {!loading && (
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                <strong>{tickets.length}</strong> tickets activos
              </Typography>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                color: '#E31E24',
                '&:hover': {
                  backgroundColor: 'rgba(227, 30, 36, 0.1)'
                }
              }}
              title="Recargar tickets"
            >
              <FiRefreshCw 
                size={20} 
                className={refreshing ? 'animate-spin' : ''}
              />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => navigate('/tickets/create')}
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
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6">
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <TextField
            fullWidth
            placeholder="Buscar tickets..."
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <CircularProgress sx={{ color: '#E31E24' }} size={48} />
            <Typography className="ml-4 text-gray-600 dark:text-gray-400">
              Cargando tickets...
            </Typography>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <Card className="p-8 text-center shadow-lg dark:bg-gray-800" sx={{ borderRadius: '16px' }}>
            <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <Typography variant="h5" className="mb-4 dark:text-white">
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadTickets}
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
          </Card>
        )}

        {/* Grid de tickets - Estilo Figma */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id}
              className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer dark:bg-gray-800"
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              sx={{ 
                borderRadius: '20px',
                overflow: 'visible'
              }}
            >
              <CardContent className="p-0">
                  {/* Header de la card con badges */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    {ticket.status && (
                      <Chip 
                        label={ticket.status.name}
                        size="small"
                        sx={{
                          backgroundColor: ticket.status.color + '20',
                          color: ticket.status.color,
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase'
                        }}
                      />
                    )}
                    {ticket.priority && (
                      <Chip 
                        label={ticket.priority.name}
                        size="small"
                        sx={{
                          backgroundColor: ticket.priority.color,
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Título del ticket */}
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-2">
                    {ticket.title}
                  </Typography>
                  
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {ticket.description}
                  </Typography>
                </div>

                {/* Información del cliente */}
                <div className="px-6 py-4 space-y-3">
                  {/* Reportado por */}
                  <div className="flex items-start">
                    <FiUser className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Reportado:
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

                  {/* Fecha */}
                  <div className="flex items-start">
                    <FiCalendar className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Fecha:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleString('es-MX') : 'Sin fecha'}
                      </Typography>
                    </div>
                  </div>

                  {/* Ubicación */}
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
                </div>

                {/* Mapa de Google Maps */}
                <div className="px-6 pb-4">
                  <GoogleMapComponent 
                    address={ticket.location}
                    height="160px"
                    zoom={15}
                    className="shadow-md"
                  />
                </div>

                {/* Asignar técnico */}
                <div className="px-6 pb-4">
                  <FormControl fullWidth size="small">
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400 mb-2 block">
                      Asignar a técnico:
                    </Typography>
                    <Select
                      value={selectedTechnician[ticket.id] || ''}
                      onChange={(e) => setSelectedTechnician({
                        ...selectedTechnician,
                        [ticket.id]: e.target.value
                      })}
                      onClick={(e) => e.stopPropagation()}
                      displayEmpty
                      disabled={ticket.assigned_to !== null}
                      className="dark:bg-gray-700 dark:text-white"
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: ticket.assigned_to ? '#F3F4F6' : 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 163, 175, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 163, 175, 0.5)'
                        },
                        '& .MuiSelect-icon': {
                          color: 'inherit'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          className: 'dark:bg-gray-800',
                          sx: {
                            '& .MuiMenuItem-root': {
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(79, 70, 229, 0.1)'
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(79, 70, 229, 0.05)'
                              }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="" disabled className="dark:text-gray-400">
                        {ticket.assigned_to ? 'Ya asignado' : 'Seleccionar técnico'}
                      </MenuItem>
                      {technicians.map((tech) => (
                        <MenuItem key={tech.id} value={tech.id} className="dark:text-white">
                          {tech.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Botones de Acción */}
                <div className="px-6 pb-6 space-y-2">
                  {/* Botón Aceptar - Estilo Figma */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptTicket(ticket.id);
                    }}
                    disabled={!selectedTechnician[ticket.id] || ticket.assigned_to !== null}
                    className={
                      (!selectedTechnician[ticket.id] || ticket.assigned_to !== null)
                        ? 'dark:!bg-gray-700 dark:!text-gray-500'
                        : ''
                    }
                    sx={{
                      backgroundColor: '#4F46E5',
                      color: 'white',
                      borderRadius: '12px',
                      textTransform: 'none',
                      padding: '12px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: '#4338CA'
                      },
                      '&:disabled': {
                        backgroundColor: '#E5E7EB',
                        color: '#9CA3AF'
                      }
                    }}
                  >
                    {ticket.assigned_to ? 'Ticket Asignado' : 'Aceptar'}
                  </Button>

                  {/* Botón Resolver (técnico asignado, estado "En Proceso") */}
                  {((user?.role === 'tecnico' && ticket.assigned_to === user?.id) || user?.role === 'admin') && 
                   ticket.status_id === 3 && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}#resolve`);
                      }}
                      sx={{
                        backgroundColor: '#16A34A',
                        color: 'white',
                        borderRadius: '12px',
                        textTransform: 'none',
                        padding: '12px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: '#15803D'
                        }
                      }}
                    >
                      Marcar como Resuelto
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Sin resultados dentro del grid */}
          {filteredTickets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FiTag className="mx-auto text-gray-400 mb-4" size={48} />
              <Typography variant="h6" className="text-gray-600 dark:text-gray-400">
                No se encontraron tickets
              </Typography>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
