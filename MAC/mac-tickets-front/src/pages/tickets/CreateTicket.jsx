// /pages/tickets/CreateTicket.jsx - Página para crear nuevo ticket

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import TicketForm from '../../components/forms/TicketForm';
import ticketService from '../../services/ticketService';
import { useAuth } from '../../contexts/AuthContext';

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Crear el ticket con la API
      const response = await ticketService.createTicket(formData);
      
      console.log('Ticket creado exitosamente:', response);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/tickets');
      }, 1500);
      
    } catch (error) {
      console.error('Error creando ticket:', error);
      throw error; // El formulario manejará el error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header estilo Figma */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <Typography variant="h4" className="font-bold text-gray-900">
              Nuevo Ticket<span className="text-[#E31E24]">.</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-1">
              Completa el formulario para crear un nuevo ticket de soporte
            </Typography>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6 max-w-5xl mx-auto">
        <Card 
          className="shadow-lg"
          sx={{ borderRadius: '16px' }}
        >
          <CardContent className="p-8">
            <TicketForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
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
          ¡Ticket creado exitosamente! Redirigiendo...
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateTicket;

