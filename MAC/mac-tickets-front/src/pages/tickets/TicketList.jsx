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
  IconButton
} from '@mui/material';
import { FiSearch, FiPlus, FiMapPin, FiCalendar, FiTag, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TicketList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState({});

  // Mock data de tickets
  const mockTickets = [
    {
      id: 1,
      ticket_number: 'TICKET-001',
      title: 'Pantalla Rota Dell.',
      description: 'La pantalla del monitor Dell presenta una fisura en la esquina superior derecha que se extiende al centro',
      client_name: 'Juan García MAC',
      location: 'Zapote, 200 metros al norte de la Shell, San José',
      coordinates: { lat: 9.9281, lng: -84.0907 },
      reported_date: '2023-02-05 12:51',
      category: 'Hardware',
      status: { name: 'Espera Asig.', color: '#6B7280' },
      priority: { name: 'ALTA', color: '#FF5722' },
      assigned_to: null
    },
    {
      id: 2,
      ticket_number: 'TICKET-002',
      title: 'Problema con impresora HP',
      description: 'La impresora no imprime correctamente los documentos, salen borrosos',
      client_name: 'María López',
      location: 'Centro comercial, local 45, Heredia',
      coordinates: { lat: 9.9981, lng: -84.1169 },
      reported_date: '2023-02-05 10:30',
      category: 'Hardware',
      status: { name: 'En Proceso', color: '#F59E0B' },
      priority: { name: 'MEDIA', color: '#FF9800' },
      assigned_to: 2
    },
    {
      id: 3,
      ticket_number: 'TICKET-003',
      title: 'Error en sistema de facturación',
      description: 'El sistema no permite generar facturas desde hace 2 días',
      client_name: 'Carlos Rodríguez',
      location: 'Oficina principal, edificio corporativo, San José',
      coordinates: { lat: 9.9355, lng: -84.0837 },
      reported_date: '2023-02-04 15:20',
      category: 'Software',
      status: { name: 'Crítico', color: '#F44336' },
      priority: { name: 'CRÍTICA', color: '#F44336' },
      assigned_to: null
    }
  ];

  // Mock data de técnicos
  const technicians = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María González' },
    { id: 3, name: 'Carlos Ruiz' },
    { id: 4, name: 'Ana Torres' }
  ];

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

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
              Tickets<span className="text-[#E31E24]">.</span>
            </Typography>
          </div>
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
                  <FiSearch className="text-gray-400" />
                </InputAdornment>
              ),
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

        {/* Grid de tickets - Estilo Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id}
              className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              sx={{ 
                borderRadius: '20px',
                overflow: 'visible'
              }}
            >
              <CardContent className="p-0">
                {/* Header de la card con badges */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
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
                  </div>
                  
                  {/* Título del ticket */}
                  <Typography variant="h6" className="font-bold text-gray-900 mb-2">
                    {ticket.title}
                  </Typography>
                  
                  <Typography variant="body2" className="text-gray-600 line-clamp-2">
                    {ticket.description}
                  </Typography>
                </div>

                {/* Información del cliente */}
                <div className="px-6 py-4 space-y-3">
                  {/* Reportado por */}
                  <div className="flex items-start">
                    <FiUser className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Reportado:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 font-medium">
                        {ticket.client_name}
                      </Typography>
                    </div>
                  </div>

                  {/* Etiqueta/ID */}
                  <div className="flex items-start">
                    <FiTag className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Etiqueta:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 font-medium">
                        {ticket.ticket_number}
                      </Typography>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-start">
                    <FiCalendar className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Fecha:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 font-medium">
                        {ticket.reported_date}
                      </Typography>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-start">
                    <FiMapPin className="text-gray-400 mr-3 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <Typography variant="caption" className="text-gray-500 block">
                        Ubicación:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 font-medium">
                        {ticket.location}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Mapa placeholder - Estilo Figma */}
                <div className="px-6 pb-4">
                  <div 
                    className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%, #E5E7EB), linear-gradient(45deg, #E5E7EB 25%, transparent 25%, transparent 75%, #E5E7EB 75%, #E5E7EB)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px'
                    }}
                  >
                    <div className="text-center">
                      <FiMapPin className="mx-auto text-blue-600 mb-2" size={32} />
                      <Typography variant="caption" className="text-blue-700 font-medium">
                        Mapa de ubicación
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Asignar técnico */}
                <div className="px-6 pb-4">
                  <FormControl fullWidth size="small">
                    <Typography variant="caption" className="text-gray-600 mb-2 block">
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
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: ticket.assigned_to ? '#F3F4F6' : 'white'
                      }}
                    >
                      <MenuItem value="" disabled>
                        {ticket.assigned_to ? 'Ya asignado' : 'Seleccionar técnico'}
                      </MenuItem>
                      {technicians.map((tech) => (
                        <MenuItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Botón Aceptar - Estilo Figma */}
                <div className="px-6 pb-6">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptTicket(ticket.id);
                    }}
                    disabled={!selectedTechnician[ticket.id] || ticket.assigned_to !== null}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sin resultados */}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="mx-auto text-gray-400 mb-4" size={48} />
            <Typography variant="h6" className="text-gray-600 dark:text-gray-400">
              No se encontraron tickets
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
