import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  TextField,
  InputAdornment,
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
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit,
  FiClock,
  FiUser,
  FiTag
} from 'react-icons/fi';

const TicketList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para tickets
  const mockTickets = [
    {
      id: 1,
      ticket_number: 'ID-2025-001',
      title: 'Problema con impresora HP en oficina principal',
      category: { name: 'Hardware', color: '#EF4444' },
      priority: { name: 'Alta', color: '#FF5722', level: 3 },
      status: { name: 'Asignado', color: '#3B82F6' },
      assigned_to: { first_name: 'Juan', last_name: 'Pérez' },
      created_at: '2025-01-15T10:30:00Z',
      client_company: 'Empresa ABC'
    },
    {
      id: 2,
      ticket_number: 'ID-2025-002',
      title: 'Error en sistema contable - No carga módulo facturación',
      category: { name: 'Software', color: '#3B82F6' },
      priority: { name: 'Crítica', color: '#F44336', level: 4 },
      status: { name: 'En Proceso', color: '#F59E0B' },
      assigned_to: { first_name: 'María', last_name: 'González' },
      created_at: '2025-01-15T09:15:00Z',
      client_company: 'Corporativo XYZ'
    },
    {
      id: 3,
      ticket_number: 'ID-2025-003',
      title: 'Solicitud de nueva cuenta de usuario para empleado',
      category: { name: 'Soporte', color: '#10B981' },
      priority: { name: 'Media', color: '#FF9800', level: 2 },
      status: { name: 'Nuevo', color: '#6B7280' },
      assigned_to: null,
      created_at: '2025-01-15T08:45:00Z',
      client_company: 'StartupTech'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Nuevo': 'bg-gray-100 text-gray-800',
      'Asignado': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'Resuelto': 'bg-green-100 text-green-800',
      'Cerrado': 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Baja': 'bg-green-100 text-green-800',
      'Media': 'bg-orange-100 text-orange-800',
      'Alta': 'bg-red-100 text-red-800',
      'Crítica': 'bg-red-200 text-red-900 font-bold'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
            Gestión de Tickets
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
            Administra y da seguimiento a todos los tickets del sistema
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nuevo Ticket
        </Button>
      </div>

      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <TextField
              placeholder="Buscar tickets por título, número o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="flex-1"
            />
            <Button
              variant="outlined"
              startIcon={<FiFilter />}
              className="border-gray-300"
            >
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <CardContent className="flex items-center p-4">
            <FiTag className="text-blue-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-blue-700">
                {mockTickets.length}
              </Typography>
              <Typography variant="body2" className="text-blue-600">
                Total Tickets
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <CardContent className="flex items-center p-4">
            <FiClock className="text-yellow-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-yellow-700">
                {mockTickets.filter(t => t.status.name === 'En Proceso').length}
              </Typography>
              <Typography variant="body2" className="text-yellow-600">
                En Proceso
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-500">
          <CardContent className="flex items-center p-4">
            <FiUser className="text-red-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-red-700">
                {mockTickets.filter(t => t.priority.name === 'Crítica').length}
              </Typography>
              <Typography variant="body2" className="text-red-600">
                Críticos
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <CardContent className="flex items-center p-4">
            <FiTag className="text-green-500 text-2xl mr-3" />
            <div>
              <Typography variant="h6" className="font-bold text-green-700">
                0
              </Typography>
              <Typography variant="body2" className="text-green-600">
                Resueltos Hoy
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de tickets */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <TableContainer component={Paper} className="shadow-none">
            <Table>
              <TableHead className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableCell className="font-semibold">Ticket</TableCell>
                  <TableCell className="font-semibold">Estado</TableCell>
                  <TableCell className="font-semibold">Prioridad</TableCell>
                  <TableCell className="font-semibold">Asignado</TableCell>
                  <TableCell className="font-semibold">Cliente</TableCell>
                  <TableCell className="font-semibold">Fecha</TableCell>
                  <TableCell className="font-semibold">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <Typography variant="body2" className="font-medium text-blue-600">
                          {ticket.ticket_number}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {ticket.title}
                        </Typography>
                        <Chip
                          label={ticket.category.name}
                          size="small"
                          style={{ 
                            backgroundColor: ticket.category.color + '20',
                            color: ticket.category.color,
                            fontSize: '0.7rem',
                            marginTop: '4px'
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status.name}
                        size="small"
                        className={getStatusColor(ticket.status.name)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority.name}
                        size="small"
                        className={getPriorityColor(ticket.priority.name)}
                      />
                    </TableCell>
                    <TableCell>
                      {ticket.assigned_to ? (
                        <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                          {ticket.assigned_to.first_name} {ticket.assigned_to.last_name}
                        </Typography>
                      ) : (
                        <Typography variant="body2" className="text-gray-400 italic">
                          Sin asignar
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {ticket.client_company}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        {formatDate(ticket.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" className="text-blue-600 hover:bg-blue-50">
                            <FiEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" className="text-gray-600 hover:bg-gray-50">
                            <FiEdit />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketList;
