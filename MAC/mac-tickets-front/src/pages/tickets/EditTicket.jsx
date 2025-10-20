// /pages/tickets/EditTicket.jsx - Página para editar ticket

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { FiCheckCircle, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import TicketForm from '../../components/forms/TicketForm';
import ticketService from '../../services/ticketService';
import { useAuth } from '../../contexts/AuthContext';

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar ticket al montar el componente
  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTicketById(id);
      
      if (response.success) {
        setTicket(response.data);
      } else {
        setError('No se pudo cargar el ticket');
      }
    } catch (err) {
      console.error('Error cargando ticket:', err);
      setError('Error al cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Actualizar el ticket con la API
      const response = await ticketService.updateTicket(id, formData);
      
      console.log('Ticket actualizado exitosamente:', response);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Redirigir al detalle después de 1.5 segundos
      setTimeout(() => {
        navigate(`/tickets/${id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error actualizando ticket:', error);
      throw error; // El formulario manejará el error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tickets/${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress sx={{ color: '#E31E24' }} size={48} />
          <Typography className="mt-4 text-gray-600 dark:text-gray-400">
            Cargando ticket...
          </Typography>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <Card 
            className="p-8 text-center dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <Typography variant="h5" className="mb-4 dark:text-white">
              {error || 'Ticket no encontrado'}
            </Typography>
            <button
              onClick={() => navigate('/tickets')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Volver a Tickets
            </button>
          </Card>
        </div>
      </div>
    );
  }

  // Verificar permisos
  const canEdit = user?.role === 'admin' || ticket.created_by === user?.id || ticket.assigned_to === user?.id;
  
  if (!canEdit) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto">
          <Card 
            className="p-8 text-center dark:bg-gray-800"
            sx={{ borderRadius: '16px' }}
          >
            <FiAlertCircle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <Typography variant="h5" className="mb-4 dark:text-white">
              No tienes permiso para editar este ticket
            </Typography>
            <button
              onClick={() => navigate(`/tickets/${id}`)}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Ver Ticket
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Header estilo Figma */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
              Editar Ticket<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
              Modifica la información del ticket {ticket.ticket_number}
            </Typography>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6 max-w-5xl mx-auto">
        <Card 
          className="shadow-lg dark:bg-gray-800"
          sx={{ borderRadius: '16px' }}
        >
          <CardContent className="p-8">
            <TicketForm 
              initialData={ticket}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>

      {/* Snackbar de éxito */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<FiCheckCircle />}
          onClose={() => setShowSuccess(false)}
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: '#10B981'
            }
          }}
        >
          ¡Ticket actualizado exitosamente! Redirigiendo...
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditTicket;

