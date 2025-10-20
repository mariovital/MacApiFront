// /pages/tickets/TicketHistory.jsx - Vista de Historial (Tickets Pasados) según Figma

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { FiSearch, FiMapPin, FiCalendar, FiTag, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TicketHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data de tickets pasados/completados
  const mockHistoryTickets = [
    {
      id: 1,
      ticket_number: 'TICKET-001',
      title: 'Pantalla Rota Dell.',
      description: 'La pantalla del monitor Dell presenta una fisura en la esquina superior derecha',
      client_name: 'Juan García MAC',
      location: 'Zapote, 200 metros al norte de la Shell, San José',
      coordinates: { lat: 9.9281, lng: -84.0907 },
      reported_date: '2023-01-15 10:30',
      completed_date: '2023-01-16 14:45',
      category: 'Hardware',
      status: { name: 'Cerrado', color: '#10B981' },
      priority: { name: 'ALTA', color: '#FF5722' },
      assigned_to: { name: 'Juan Pérez' },
      resolution_time: '1 día 4 horas'
    },
    {
      id: 2,
      ticket_number: 'TICKET-002',
      title: 'Problema con impresora HP',
      description: 'La impresora no imprime correctamente, documentos salen borrosos',
      client_name: 'María López',
      location: 'Centro comercial, local 45, Heredia',
      coordinates: { lat: 9.9981, lng: -84.1169 },
      reported_date: '2023-01-14 08:20',
      completed_date: '2023-01-14 16:30',
      category: 'Hardware',
      status: { name: 'Resuelto', color: '#10B981' },
      priority: { name: 'MEDIA', color: '#FF9800' },
      assigned_to: { name: 'María González' },
      resolution_time: '8 horas'
    },
    {
      id: 3,
      ticket_number: 'TICKET-003',
      title: 'Configuración de red local',
      description: 'Necesita configuración de red para nueva sucursal',
      client_name: 'Carlos Rodríguez',
      location: 'Oficina nueva, Escazú, San José',
      coordinates: { lat: 9.9199, lng: -84.1422 },
      reported_date: '2023-01-12 09:00',
      completed_date: '2023-01-13 17:00',
      category: 'Redes',
      status: { name: 'Cerrado', color: '#10B981' },
      priority: { name: 'BAJA', color: '#4CAF50' },
      assigned_to: { name: 'Carlos Ruiz' },
      resolution_time: '1 día 8 horas'
    },
    {
      id: 4,
      ticket_number: 'TICKET-004',
      title: 'Instalación de software contable',
      description: 'Instalación y configuración de sistema contable QuickBooks',
      client_name: 'Ana Martínez',
      location: 'Centro de San José, edificio torre 3',
      coordinates: { lat: 9.9333, lng: -84.0833 },
      reported_date: '2023-01-10 11:15',
      completed_date: '2023-01-11 15:30',
      category: 'Software',
      status: { name: 'Resuelto', color: '#10B981' },
      priority: { name: 'MEDIA', color: '#FF9800' },
      assigned_to: { name: 'Ana Torres' },
      resolution_time: '1 día 4 horas'
    }
  ];

  useEffect(() => {
    setTickets(mockHistoryTickets);
  }, []);

  const handleRealizeTicket = (ticketId) => {
    console.log('Realizar ticket nuevamente:', ticketId);
    // Aquí iría la lógica para crear un nuevo ticket basado en este
  };

  const handleViewHistory = (ticketId) => {
    console.log('Ver historial completo del ticket:', ticketId);
    navigate(`/tickets/${ticketId}/history`);
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    {ticket.description}
                  </Typography>

                  {/* Tiempo de resolución */}
                  <div className="flex items-center mt-3 p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <FiClock className="text-green-600 dark:text-green-400 mr-2" size={16} />
                    <Typography variant="caption" className="text-green-700 dark:text-green-300 font-semibold">
                      Resuelto en: {ticket.resolution_time}
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
                        Reportado:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                        {ticket.client_name}
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
                  <div className="flex items-start">
                    <FiUser className="text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Técnico:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                        {ticket.assigned_to.name}
                      </Typography>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start">
                      <FiCalendar className="text-gray-400 dark:text-gray-500 mr-2 mt-1 flex-shrink-0" size={14} />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Iniciado:
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium text-xs">
                          {ticket.reported_date}
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
                          {ticket.completed_date}
                        </Typography>
                      </div>
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

                {/* Botones de acción - Estilo Figma */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                  <Button
                    variant="contained"
                    onClick={() => handleRealizeTicket(ticket.id)}
                    sx={{
                      backgroundColor: '#4F46E5',
                      color: 'white',
                      borderRadius: '12px',
                      textTransform: 'none',
                      padding: '12px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: '#4338CA'
                      }
                    }}
                  >
                    Realizar ticket
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewHistory(ticket.id)}
                    sx={{
                      borderColor: '#4F46E5',
                      color: '#4F46E5',
                      borderRadius: '12px',
                      textTransform: 'none',
                      padding: '12px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: '#4338CA',
                        backgroundColor: '#EEF2FF',
                        borderWidth: '2px'
                      }
                    }}
                  >
                    Historial ticket
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

