// /pages/tickets/TicketDetail.jsx - Vista de Detalle de Ticket

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Avatar,
  Divider,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Radio
} from '@mui/material';
import {
  FiArrowLeft,
  FiEdit2,
  FiClock,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiPaperclip,
  FiDownload,
  FiTrash2,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import ticketService from '../../services/ticketService';
import catalogService from '../../services/catalogService';
import { useAuth } from '../../contexts/AuthContext';
import { TICKET_STATUSES, PRIORITIES } from '../../constants';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Estados para reasignación
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(false);

  // Cargar ticket
  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTicketById(id);
      
      if (response.success) {
        setTicket(response.data);
      } else {
        setError('No se pudo cargar el ticket');
      }
    } catch (err) {
      setError('Error al cargar el ticket');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await ticketService.addComment(id, commentText, isInternal);
      setCommentText('');
      setIsInternal(false);
      await loadTicketData(); // Recargar para ver el comentario
    } catch (err) {
      console.error('Error agregando comentario:', err);
      alert('Error al agregar comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async (newStatusId) => {
    try {
      await ticketService.updateTicketStatus(id, newStatusId);
      await loadTicketData();
    } catch (err) {
      console.error('Error cambiando estado:', err);
      alert('Error al cambiar el estado');
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      // TODO: Implementar subida de archivos
      console.log('Subiendo archivos:', selectedFiles);
      alert('Funcionalidad de subida en desarrollo');
    } catch (err) {
      console.error('Error subiendo archivos:', err);
    }
  };

  // Cargar técnicos al abrir el diálogo de asignación
  const handleOpenAssignDialog = async () => {
    setShowAssignDialog(true);
    setLoadingTechnicians(true);
    
    try {
      const response = await catalogService.getTechnicians();
      if (response.success) {
        setTechnicians(response.data || []);
      } else {
        console.error('Error cargando técnicos');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cargar lista de técnicos');
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // Cerrar diálogo
  const handleCloseAssignDialog = () => {
    setShowAssignDialog(false);
    setSelectedTechnician(null);
  };

  // Reasignar ticket
  const handleAssignTicket = async () => {
    if (!selectedTechnician) {
      alert('Por favor selecciona un técnico');
      return;
    }

    try {
      setAssigningTicket(true);
      await ticketService.assignTicket(id, selectedTechnician.id, 'Reasignación manual');
      
      // Recargar datos del ticket
      await loadTicketData();
      
      // Cerrar diálogo
      handleCloseAssignDialog();
      
      alert('Ticket reasignado exitosamente');
    } catch (err) {
      console.error('Error reasignando ticket:', err);
      alert('Error al reasignar el ticket. Intenta de nuevo.');
    } finally {
      setAssigningTicket(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <FiXCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <Typography variant="h5" className="mb-4 dark:text-white">
              {error || 'Ticket no encontrado'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/tickets')}
              className="bg-red-600 hover:bg-red-700"
            >
              Volver a Tickets
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Permisos
  const canEdit = user?.role === 'admin' || ticket.created_by === user?.id || ticket.assigned_to === user?.id;
  const canChangeStatus = user?.role === 'admin' || ticket.assigned_to === user?.id;
  const canAssign = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/tickets')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                startIcon={<FiArrowLeft />}
              >
                Volver
              </Button>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <Typography variant="h5" className="font-bold text-gray-900 dark:text-white flex items-center">
                  {ticket.ticket_number}
                  <span className="w-2 h-2 bg-red-600 rounded-full ml-2"></span>
                </Typography>
                <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                  Detalles del ticket
                </Typography>
              </div>
            </div>
            
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<FiEdit2 />}
                className="bg-red-600 hover:bg-red-700"
                onClick={() => navigate(`/tickets/${id}/edit`)}
              >
                Editar Ticket
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Principal */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h4" className="font-bold text-gray-900 dark:text-white mb-4">
                  {ticket.title}
                </Typography>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Chip
                    label={ticket.status?.name || 'Sin estado'}
                    style={{ backgroundColor: ticket.status?.color || '#6B7280', color: 'white' }}
                  />
                  <Chip
                    label={ticket.priority?.name || 'Sin prioridad'}
                    style={{ backgroundColor: ticket.priority?.color || '#6B7280', color: 'white' }}
                  />
                  <Chip
                    label={ticket.category?.name || 'Sin categoría'}
                    variant="outlined"
                    className="dark:text-white dark:border-gray-600"
                  />
                </div>

                <Divider className="my-4 dark:border-gray-700" />

                <div className="mb-6">
                  <Typography variant="subtitle2" className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {ticket.description || 'Sin descripción'}
                  </Typography>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-2" />
                  Creado el {new Date(ticket.created_at).toLocaleString('es-MX')}
                  {ticket.creator && (
                    <span className="ml-2">
                      por <span className="font-semibold">{ticket.creator.first_name} {ticket.creator.last_name}</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cambiar Estado (Solo Admin/Técnico) */}
            {canChangeStatus && (
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                    Cambiar Estado
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel className="dark:text-gray-400">Estado</InputLabel>
                    <Select
                      value={ticket.status_id}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      label="Estado"
                      className="dark:text-white dark:border-gray-600"
                    >
                      {Object.values(TICKET_STATUSES).map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: status.color }}
                            ></div>
                            {status.name}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            )}

            {/* Comentarios */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Comentarios
                </Typography>

                {/* Formulario de comentario */}
                <div className="mb-6">
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Agregar comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-3"
                    variant="outlined"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user?.role !== 'mesa_trabajo' && (
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Comentario interno (solo visible para técnicos)
                          </span>
                        </label>
                      )}
                    </div>
                    
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || submittingComment}
                      startIcon={submittingComment ? <CircularProgress size={16} /> : <FiSend />}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Enviar
                    </Button>
                  </div>
                </div>

                <Divider className="my-4 dark:border-gray-700" />

                {/* Lista de comentarios */}
                <div className="space-y-4">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar className="bg-red-600">
                          {comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Typography variant="body2" className="font-semibold dark:text-white">
                              {comment.user?.first_name} {comment.user?.last_name}
                            </Typography>
                            {comment.is_internal && (
                              <Chip
                                label="Interno"
                                size="small"
                                className="bg-yellow-100 text-yellow-800"
                              />
                            )}
                            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                              {new Date(comment.created_at).toLocaleString('es-MX')}
                            </Typography>
                          </div>
                          <Typography variant="body2" className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.comment}
                          </Typography>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No hay comentarios aún
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral - 1/3 */}
          <div className="space-y-6">
            {/* Información del Cliente */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Información del Cliente
                </Typography>
                
                <div className="space-y-3">
                  {ticket.client_company && (
                    <div className="flex items-start">
                      <FiBriefcase className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Empresa
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.client_company}
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  {ticket.client_contact && (
                    <div className="flex items-start">
                      <FiUser className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Contacto
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.client_contact}
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  {ticket.client_email && (
                    <div className="flex items-start">
                      <FiMail className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Email
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.client_email}
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  {ticket.client_phone && (
                    <div className="flex items-start">
                      <FiPhone className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Teléfono
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.client_phone}
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  {ticket.location && (
                    <div className="flex items-start">
                      <FiMapPin className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                          Ubicación
                        </Typography>
                        <Typography variant="body2" className="text-gray-900 dark:text-white font-medium">
                          {ticket.location}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Asignación */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Asignación
                </Typography>
                
                {ticket.assignee ? (
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="bg-blue-600">
                      {ticket.assignee.first_name?.[0]}{ticket.assignee.last_name?.[0]}
                    </Avatar>
                    <div>
                      <Typography variant="body2" className="font-semibold dark:text-white">
                        {ticket.assignee.first_name} {ticket.assignee.last_name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        Técnico asignado
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mb-4">
                    Sin asignar
                  </Typography>
                )}
                
                {canAssign && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FiUser />}
                    onClick={handleOpenAssignDialog}
                    className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Reasignar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Archivos Adjuntos */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Archivos Adjuntos
                </Typography>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<FiPaperclip />}
                    className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 mb-4"
                  >
                    Seleccionar Archivos
                  </Button>
                </label>

                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block mb-2">
                      {selectedFiles.length} archivo(s) seleccionado(s)
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleUploadFiles}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Subir Archivos
                    </Button>
                  </div>
                )}

                <Divider className="my-4 dark:border-gray-700" />

                {ticket.attachments && ticket.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {ticket.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FiPaperclip className="text-gray-400 flex-shrink-0" />
                          <Typography variant="body2" className="truncate dark:text-white">
                            {file.file_name}
                          </Typography>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <IconButton size="small">
                            <FiDownload className="text-gray-600 dark:text-gray-400" />
                          </IconButton>
                          <IconButton size="small">
                            <FiTrash2 className="text-red-600" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay archivos adjuntos
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Métricas */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                  Métricas
                </Typography>
                
                <div className="space-y-3">
                  <div>
                    <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                      Tiempo Transcurrido
                    </Typography>
                    <Typography variant="body2" className="text-gray-900 dark:text-white font-semibold">
                      {Math.floor((new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60))}h
                    </Typography>
                  </div>
                  
                  {ticket.first_response_at && (
                    <div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 block">
                        Primera Respuesta
                      </Typography>
                      <Typography variant="body2" className="text-gray-900 dark:text-white font-semibold">
                        {Math.floor((new Date(ticket.first_response_at) - new Date(ticket.created_at)) / (1000 * 60))}min
                      </Typography>
                    </div>
                  )}
                  
                  {ticket.sla_breach && (
                    <div className="flex items-center text-red-600">
                      <FiAlertCircle className="mr-2" />
                      <Typography variant="body2" className="font-semibold">
                        SLA Incumplido
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Reasignación de Ticket */}
      <Dialog
        open={showAssignDialog}
        onClose={handleCloseAssignDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-[#E31E24] to-[#C41A1F] text-white">
          <div className="flex items-center space-x-2">
            <FiUser size={24} />
            <Typography variant="h6" className="font-bold">
              Reasignar Ticket
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent className="mt-4 dark:bg-gray-800">
          {loadingTechnicians ? (
            <div className="flex items-center justify-center py-8">
              <CircularProgress sx={{ color: '#E31E24' }} />
              <Typography className="ml-4 text-gray-600 dark:text-gray-400">
                Cargando técnicos...
              </Typography>
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-8">
              <FiAlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                No hay técnicos disponibles
              </Typography>
            </div>
          ) : (
            <>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                Selecciona el técnico al que deseas asignar este ticket:
              </Typography>
              
              <List className="space-y-2">
                {technicians.map((tech) => (
                  <ListItem
                    key={tech.id}
                    disablePadding
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ListItemButton
                      onClick={() => setSelectedTechnician(tech)}
                      selected={selectedTechnician?.id === tech.id}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(227, 30, 36, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(227, 30, 36, 0.2)'
                          }
                        }
                      }}
                    >
                      <Radio
                        checked={selectedTechnician?.id === tech.id}
                        sx={{
                          color: '#E31E24',
                          '&.Mui-checked': {
                            color: '#E31E24'
                          }
                        }}
                      />
                      <ListItemAvatar>
                        <Avatar className="bg-gradient-to-br from-blue-500 to-blue-600">
                          {tech.first_name?.[0]}{tech.last_name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" className="font-semibold text-gray-900 dark:text-white">
                            {tech.first_name} {tech.last_name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                            @{tech.username} • {tech.email}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button
            onClick={handleCloseAssignDialog}
            disabled={assigningTicket}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              color: 'text.primary'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAssignTicket}
            disabled={!selectedTechnician || assigningTicket}
            variant="contained"
            startIcon={assigningTicket ? <CircularProgress size={16} color="inherit" /> : <FiCheckCircle />}
            sx={{
              backgroundColor: '#E31E24',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
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
            {assigningTicket ? 'Asignando...' : 'Asignar Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketDetail;

