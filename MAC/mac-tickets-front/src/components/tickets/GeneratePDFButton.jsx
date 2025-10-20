// /components/tickets/GeneratePDFButton.jsx

import React, { useState } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { FiDownload, FiFileText } from 'react-icons/fi';
import pdfService from '../../services/pdfService';

const GeneratePDFButton = ({ ticket, variant = 'contained', size = 'medium', fullWidth = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      setError(null);

      // Descargar el PDF
      await pdfService.downloadTicketPDF(ticket.id, ticket.ticket_number);

      // Opcional: Mostrar notificación de éxito
      console.log('PDF descargado exitosamente');

    } catch (err) {
      console.error('Error generando PDF:', err);
      setError('Error al generar el PDF');
      
      // Mostrar el error al usuario
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Solo mostrar el botón si el ticket está en ciertos estados
  const canGeneratePDF = ticket && (
    ticket.status?.name === 'Resuelto' || 
    ticket.status?.name === 'Cerrado' ||
    ticket.status_id === 5 || // Resuelto
    ticket.status_id === 6    // Cerrado
  );

  if (!canGeneratePDF) {
    return null;
  }

  return (
    <Tooltip title="Generar PDF para firma física" arrow>
      <span>
        <Button
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          onClick={handleGeneratePDF}
          disabled={loading}
          className={`
            ${variant === 'contained' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            text-white
            transition-all
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
          `}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FiFileText />}
        >
          {loading ? 'Generando PDF...' : 'Generar PDF'}
        </Button>
      </span>
    </Tooltip>
  );
};

export default GeneratePDFButton;

