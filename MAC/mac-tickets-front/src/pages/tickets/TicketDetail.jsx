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
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // Estados para reasignación
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(false);

  // Estados para resolución (técnico)
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionComment, setResolutionComment] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [resolving, setResolving] = useState(false);

  // Estados para cerrar ticket (admin)
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [closing, setClosing] = useState(false);

  // Estados para reabrir ticket (admin)
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

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
        // Cargar comentarios
        await loadComments();
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

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const response = await ticketService.getComments(id);
      
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (err) {
      console.error('Error cargando comentarios:', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await ticketService.addComment(id, commentText, isInternal);
      setCommentText('');
      setIsInternal(false);
      // Recargar solo comentarios
      await loadComments();
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

  // Marcar ticket como resuelto (técnico)
  const handleResolveTicket = async () => {
    // Validación
    if (!resolutionComment || resolutionComment.trim().length < 10) {
      alert('El comentario de resolución debe tener al menos 10 caracteres');
      return;
    }

    try {
      setResolving(true);
      await ticketService.resolveTicket(id, resolutionComment.trim(), evidenceFile);
      
      // Recargar datos del ticket
      await loadTicketData();
      
      // Cerrar diálogo y limpiar
      setShowResolveDialog(false);
      setResolutionComment('');
      setEvidenceFile(null);
      
      alert('✅ Ticket marcado como resuelto exitosamente');
    } catch (err) {
      console.error('Error resolviendo ticket:', err);
      const errorMsg = err.response?.data?.message || 'Error al resolver el ticket. Intenta de nuevo.';
      alert(errorMsg);
    } finally {
      setResolving(false);
    }
  };

  // Cerrar ticket (admin)
  const handleCloseTicket = async () => {
    try {
      setClosing(true);
      await ticketService.closeTicket(id, closeReason || 'Cerrado por administrador');
      
      // Recargar datos del ticket
      await loadTicketData();
      
      // Cerrar diálogo y limpiar
      setShowCloseDialog(false);
      setCloseReason('');
      
      alert('✅ Ticket cerrado exitosamente');
    } catch (err) {
      console.error('Error cerrando ticket:', err);
      const errorMsg = err.response?.data?.message || 'Error al cerrar el ticket. Intenta de nuevo.';
      alert(errorMsg);
    } finally {
      setClosing(false);
    }
  };

  // Reabrir ticket (admin)
  const handleReopenTicket = async () => {
    // Validación
    if (!reopenReason || reopenReason.trim().length < 10) {
      alert('La razón para reabrir debe tener al menos 10 caracteres');
      return;
    }

    try {
      setReopening(true);
      await ticketService.reopenTicket(id, reopenReason.trim());
      
      // Recargar datos del ticket
      await loadTicketData();
      
      // Cerrar diálogo y limpiar
      setShowReopenDialog(false);
      setReopenReason('');
      
      alert('✅ Ticket reabierto exitosamente');
    } catch (err) {
      console.error('Error reabriendo ticket:', err);
      const errorMsg = err.response?.data?.message || 'Error al reabrir el ticket. Intenta de nuevo.';
      alert(errorMsg);
    } finally {
      setReopening(false);
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
  const canResolve = (user?.role === 'tecnico' && ticket.assigned_to === user?.id && ticket.status_id === 3) || 
                     (user?.role === 'admin' && ticket.status_id === 3);
  const canClose = user?.role === 'admin' && ticket.status_id === 5;
  const canReopen = user?.role === 'admin' && ticket.status_id === 6;

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
                  {loadingComments ? (
                    <div className="flex items-center justify-center py-8">
                      <CircularProgress size={24} sx={{ color: '#E31E24' }} />
                      <Typography className="ml-3 text-gray-600 dark:text-gray-400">
                        Cargando comentarios...
                      </Typography>
                    </div>
                  ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-4">
                        <Avatar className="bg-red-600">
                          {comment.author?.first_name?.[0]}{comment.author?.last_name?.[0]}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Typography variant="body2" className="font-semibold dark:text-white">
                              {comment.author?.first_name} {comment.author?.last_name}
                            </Typography>
                            {comment.is_internal && (
                              <Chip
                                label="Interno"
                                size="small"
                                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              />
                            )}
                            {comment.comment?.startsWith('[RESOLUCIÓN]') && (
                              <Chip
                                label="Resolución"
                                size="small"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              />
                            )}
                            {comment.comment?.startsWith('[CIERRE]') && (
                              <Chip
                                label="Cierre"
                                size="small"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              />
                            )}
                            {comment.comment?.startsWith('[REAPERTURA]') && (
                              <Chip
                                label="Reapertura"
                                size="small"
                                className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
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

            {/* Acciones del Ticket */}
            {(canResolve || canClose || canReopen) && (
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-4">
                    Acciones
                  </Typography>
                  
                  <div className="space-y-3">
                    {/* Botón: Marcar como Resuelto (Técnico) */}
                    {canResolve && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<FiCheckCircle />}
                        onClick={() => setShowResolveDialog(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Marcar como Resuelto
                      </Button>
                    )}

                    {/* Botón: Cerrar Ticket (Admin) */}
                    {canClose && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<FiCheckCircle />}
                        onClick={() => setShowCloseDialog(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Cerrar Ticket
                      </Button>
                    )}

                    {/* Botón: Reabrir Ticket (Admin) */}
                    {canReopen && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<FiAlertCircle />}
                        onClick={() => setShowReopenDialog(true)}
                        className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900"
                      >
                        Reabrir Ticket
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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

      {/* Dialog de Marcar como Resuelto */}
      <Dialog
        open={showResolveDialog}
        onClose={() => !resolving && setShowResolveDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex items-center space-x-2">
            <FiCheckCircle size={24} />
            <Typography variant="h6" className="font-bold">
              Marcar Ticket como Resuelto
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent className="mt-4 dark:bg-gray-800">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
            Describe cómo se resolvió el problema. Este comentario será visible para el cliente.
          </Typography>
          
          <TextField
            label="Comentario de Resolución *"
            multiline
            rows={4}
            fullWidth
            value={resolutionComment}
            onChange={(e) => setResolutionComment(e.target.value)}
            placeholder="Ej: Se reemplazó el cable de red defectuoso. El sistema está funcionando correctamente."
            helperText={`${resolutionComment.length}/500 caracteres (mínimo 10)`}
            inputProps={{ maxLength: 500 }}
            className="mb-4"
            error={resolutionComment.length > 0 && resolutionComment.length < 10}
          />

          <div className="mt-4">
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
              Evidencia (Opcional)
            </Typography>
            <input
              type="file"
              onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            {evidenceFile && (
              <Typography variant="caption" className="text-green-600 mt-2 block">
                ✓ {evidenceFile.name}
              </Typography>
            )}
          </div>
        </DialogContent>

        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button
            onClick={() => {
              setShowResolveDialog(false);
              setResolutionComment('');
              setEvidenceFile(null);
            }}
            disabled={resolving}
            sx={{ borderRadius: '12px', textTransform: 'none', padding: '10px 24px', fontWeight: '600' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleResolveTicket}
            disabled={!resolutionComment || resolutionComment.trim().length < 10 || resolving}
            variant="contained"
            startIcon={resolving ? <CircularProgress size={16} color="inherit" /> : <FiCheckCircle />}
            sx={{
              backgroundColor: '#16A34A',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              '&:hover': { backgroundColor: '#15803D' },
              '&:disabled': { backgroundColor: '#86EFAC', color: 'white' }
            }}
          >
            {resolving ? 'Marcando como Resuelto...' : 'Marcar como Resuelto'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Cerrar Ticket (Admin) */}
      <Dialog
        open={showCloseDialog}
        onClose={() => !closing && setShowCloseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-2">
            <FiCheckCircle size={24} />
            <Typography variant="h6" className="font-bold">
              Cerrar Ticket
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent className="mt-4 dark:bg-gray-800">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
            Confirma que deseas cerrar este ticket. Esta acción marcará el ticket como finalizado.
          </Typography>
          
          <TextField
            label="Razón de Cierre (Opcional)"
            multiline
            rows={3}
            fullWidth
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            placeholder="Ej: Cliente confirmó que el problema fue resuelto satisfactoriamente"
            inputProps={{ maxLength: 300 }}
          />
        </DialogContent>

        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button
            onClick={() => {
              setShowCloseDialog(false);
              setCloseReason('');
            }}
            disabled={closing}
            sx={{ borderRadius: '12px', textTransform: 'none', padding: '10px 24px', fontWeight: '600' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCloseTicket}
            disabled={closing}
            variant="contained"
            startIcon={closing ? <CircularProgress size={16} color="inherit" /> : <FiCheckCircle />}
            sx={{
              backgroundColor: '#2563EB',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              '&:hover': { backgroundColor: '#1D4ED8' },
              '&:disabled': { backgroundColor: '#93C5FD', color: 'white' }
            }}
          >
            {closing ? 'Cerrando...' : 'Cerrar Ticket'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Reabrir Ticket (Admin) */}
      <Dialog
        open={showReopenDialog}
        onClose={() => !reopening && setShowReopenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <div className="flex items-center space-x-2">
            <FiAlertCircle size={24} />
            <Typography variant="h6" className="font-bold">
              Reabrir Ticket
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent className="mt-4 dark:bg-gray-800">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
            Explica la razón por la cual se necesita reabrir este ticket. Este comentario será visible internamente.
          </Typography>
          
          <TextField
            label="Razón para Reabrir *"
            multiline
            rows={4}
            fullWidth
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            placeholder="Ej: El cliente reportó que el problema volvió a ocurrir"
            helperText={`${reopenReason.length}/300 caracteres (mínimo 10)`}
            inputProps={{ maxLength: 300 }}
            error={reopenReason.length > 0 && reopenReason.length < 10}
          />
        </DialogContent>

        <DialogActions className="px-6 pb-4 dark:bg-gray-800">
          <Button
            onClick={() => {
              setShowReopenDialog(false);
              setReopenReason('');
            }}
            disabled={reopening}
            sx={{ borderRadius: '12px', textTransform: 'none', padding: '10px 24px', fontWeight: '600' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleReopenTicket}
            disabled={!reopenReason || reopenReason.trim().length < 10 || reopening}
            variant="contained"
            startIcon={reopening ? <CircularProgress size={16} color="inherit" /> : <FiAlertCircle />}
            sx={{
              backgroundColor: '#EA580C',
              color: 'white',
              borderRadius: '12px',
              textTransform: 'none',
              padding: '10px 24px',
              fontWeight: '600',
              '&:hover': { backgroundColor: '#C2410C' },
              '&:disabled': { backgroundColor: '#FDBA74', color: 'white' }
            }}
          >
            {reopening ? 'Reabriendo...' : 'Reabrir Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TicketDetail;

