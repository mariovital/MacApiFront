// /services/pdfService.js

import PDFDocument from 'pdfkit';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { Ticket, User, Category, Priority, TicketStatus, TicketAttachment, Comment } = db;

const pdfService = {
  /**
   * Genera un PDF para firma física con todos los datos del ticket
   * @param {number} ticketId - ID del ticket
   * @returns {Promise<PDFDocument>} - Stream del PDF generado
   */
  generateTicketPDF: async (ticketId) => {
    try {
      // 1. Obtener datos completos del ticket
      const ticket = await Ticket.findByPk(ticketId, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'description']
          },
          {
            model: Priority,
            as: 'priority',
            attributes: ['id', 'name', 'level', 'color']
          },
          {
            model: TicketStatus,
            as: 'status',
            attributes: ['id', 'name', 'color']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'first_name', 'last_name', 'email', 'username']
          },
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'first_name', 'last_name', 'email', 'username']
          }
        ]
      });

      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      // 2. Obtener archivos adjuntos
      const attachments = await TicketAttachment.findAll({
        where: { 
          ticket_id: ticketId,
          deleted_at: null // Solo archivos no eliminados
        },
        include: [
          {
            model: User,
            as: 'uploader',
            attributes: ['first_name', 'last_name']
          }
        ],
        order: [['created_at', 'ASC']]
      });

      // 3. Obtener comentarios (usaremos esto como historial)
      const comments = await Comment.findAll({
        where: { ticket_id: ticketId },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['first_name', 'last_name']
          }
        ],
        order: [['created_at', 'ASC']]
      });

      // 4. Crear documento PDF
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        info: {
          Title: `Orden de Servicio - Ticket #${ticket.ticket_number}`,
          Author: 'MAC Computadoras',
          Subject: 'Orden de Servicio',
          Keywords: 'ticket, orden, servicio, MAC',
          CreationDate: new Date()
        }
      });

      // 5. Construir el PDF
      pdfService.buildPDFContent(doc, ticket, attachments, comments);

      // 6. Finalizar el documento
      doc.end();

      return doc;

    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  },

  /**
   * Construye el contenido visual del PDF
   */
  buildPDFContent: (doc, ticket, attachments, comments) => {
    const pageWidth = doc.page.width - 100; // Ancho útil (restando márgenes)
    let currentY = 50;

    // ========================================
    // HEADER - Logo y Título (COMPACTO)
    // ========================================
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('MAC COMPUTADORAS', 50, currentY);
    
    currentY += 25;
    
    doc.fontSize(16)
       .fillColor('#3B82F6')
       .text('ORDEN DE SERVICIO', 50, currentY);
    
    doc.fontSize(12)
       .fillColor('#6B7280')
       .text(`Ticket #${ticket.ticket_number}`, 50, currentY + 20);
    
    currentY += 45;

    // Línea divisoria
    doc.moveTo(50, currentY)
       .lineTo(doc.page.width - 50, currentY)
       .strokeColor('#E5E7EB')
       .lineWidth(1)
       .stroke();
    
    currentY += 20;

    // ========================================
    // INFORMACIÓN GENERAL
    // ========================================
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('INFORMACIÓN GENERAL', 50, currentY);
    
    currentY += 18;

    // Formatear fechas
    const fechaApertura = new Date(ticket.created_at).toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const fechaCierre = ticket.closed_at 
      ? new Date(ticket.closed_at).toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Pendiente';

    // Calcular tiempo de resolución
    let tiempoResolucion = 'En proceso';
    if (ticket.closed_at) {
      const diff = new Date(ticket.closed_at) - new Date(ticket.created_at);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      tiempoResolucion = `${days} días, ${hours} horas`;
    }

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151');

    const infoGeneral = [
      { label: 'Fecha de Apertura:', value: fechaApertura },
      { label: 'Fecha de Cierre:', value: fechaCierre },
      { label: 'Tiempo de Resolución:', value: tiempoResolucion },
      { label: 'Categoría:', value: ticket.category?.name || 'Sin categoría' },
      { label: 'Prioridad:', value: ticket.priority?.name || 'Media' }
    ];

    infoGeneral.forEach(item => {
      // Renderizar label
      doc.font('Helvetica-Bold').text(item.label, 70, currentY, { continued: false, width: 150 });
      // Renderizar valor en la misma línea pero con posición X específica
      doc.font('Helvetica').text(item.value, 220, currentY, { continued: false, width: 350 });
      
      // Calcular altura real del texto para casos de texto largo
      const textHeight = Math.max(
        doc.heightOfString(item.label, { width: 150 }),
        doc.heightOfString(item.value, { width: 350 })
      );
      currentY += Math.ceil(textHeight) + 4;
    });

    currentY += 15;

    // ========================================
    // DATOS DEL CLIENTE
    // ========================================
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('DATOS DEL CLIENTE', 50, currentY);
    
    currentY += 18;

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151');

    const datosCliente = [
      { label: 'Empresa:', value: ticket.client_company || 'No especificado' },
      { label: 'Contacto:', value: ticket.client_contact || 'No especificado' },
      { label: 'Ubicación:', value: ticket.location || 'No especificada' }
    ];

    datosCliente.forEach(item => {
      // Renderizar label y valor en posiciones fijas
      doc.font('Helvetica-Bold').text(item.label, 70, currentY, { continued: false, width: 100 });
      doc.font('Helvetica').text(item.value, 170, currentY, { continued: false, width: 390 });
      
      // Calcular altura real del texto
      const textHeight = Math.max(
        doc.heightOfString(item.label, { width: 100 }),
        doc.heightOfString(item.value, { width: 390 })
      );
      currentY += Math.ceil(textHeight) + 4;
    });

    currentY += 15;

    // ========================================
    // TÉCNICO RESPONSABLE
    // ========================================
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('TÉCNICO RESPONSABLE', 50, currentY);
    
    currentY += 18;

    if (ticket.assignee) {
      const tecnicoNombre = `${ticket.assignee.first_name} ${ticket.assignee.last_name}`;
      const tecnicoEmail = ticket.assignee.email;

      // Nombre
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Nombre:', 70, currentY, { continued: false, width: 100 });
      doc.font('Helvetica')
         .text(tecnicoNombre, 170, currentY, { continued: false, width: 390 });
      
      const nombreHeight = Math.max(
        doc.heightOfString('Nombre:', { width: 100 }),
        doc.heightOfString(tecnicoNombre, { width: 390 })
      );
      currentY += Math.ceil(nombreHeight) + 4;

      // Correo
      doc.font('Helvetica-Bold')
         .text('Correo:', 70, currentY, { continued: false, width: 100 });
      doc.font('Helvetica')
         .text(tecnicoEmail, 170, currentY, { continued: false, width: 390 });
      
      const correoHeight = Math.max(
        doc.heightOfString('Correo:', { width: 100 }),
        doc.heightOfString(tecnicoEmail, { width: 390 })
      );
      currentY += Math.ceil(correoHeight) + 4;
    } else {
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .fillColor('#9CA3AF')
         .text('No asignado', 70, currentY);
      currentY += 16;
    }

    currentY += 15;

    // ========================================
    // DESCRIPCIÓN DEL PROBLEMA
    // ========================================
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('DESCRIPCIÓN DEL PROBLEMA', 50, currentY);
    
    currentY += 18;

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151')
       .text(ticket.description || 'Sin descripción', 70, currentY, {
         width: pageWidth - 20,
         align: 'justify'
       });

    currentY += doc.heightOfString(ticket.description || 'Sin descripción', {
      width: pageWidth - 20
    }) + 15;

    // ========================================
    // SOLUCIÓN APLICADA
    // ========================================
    if (ticket.resolution_notes) {
      // Check if new page needed
      if (currentY > doc.page.height - 150) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('SOLUCIÓN APLICADA', 50, currentY);
      
      currentY += 18;

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#374151')
         .text(ticket.resolution_notes, 70, currentY, {
           width: pageWidth - 20,
           align: 'justify'
         });

      currentY += doc.heightOfString(ticket.resolution_notes, {
        width: pageWidth - 20
      }) + 15;
    }

    // ========================================
    // ARCHIVOS ADJUNTOS
    // ========================================
    if (attachments && attachments.length > 0) {
      // Check if new page needed
      if (currentY > doc.page.height - 120) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('ARCHIVOS ADJUNTOS', 50, currentY);
      
      currentY += 18;

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#374151');

      attachments.forEach((attachment, index) => {
        const uploadDate = new Date(attachment.created_at).toLocaleDateString('es-MX');
        const uploader = attachment.uploader 
          ? `${attachment.uploader.first_name} ${attachment.uploader.last_name}`
          : 'Desconocido';

        doc.text(
          `• ${attachment.file_name} - Subido por ${uploader} el ${uploadDate}`,
          70,
          currentY,
          { width: pageWidth - 20 }
        );
        currentY += 14;
      });

      currentY += 15;
    }

    // ========================================
    // COMENTARIOS Y SEGUIMIENTO
    // ========================================
    if (comments && comments.length > 0) {
      // Check if new page needed
      if (currentY > doc.page.height - 200) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#1F2937')
         .text('COMENTARIOS Y SEGUIMIENTO', 50, currentY);
      
      currentY += 18;

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#374151');

      comments.forEach(comment => {
        const fecha = new Date(comment.created_at).toLocaleString('es-MX', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        const autor = comment.author 
          ? `${comment.author.first_name} ${comment.author.last_name}`
          : 'Desconocido';

        // Tipo de comentario
        const tipo = comment.is_internal ? '[INT]' : '[PUB]';

        doc.font('Helvetica-Bold')
           .fillColor('#374151')
           .text(`${tipo} [${fecha}] ${autor}`, 70, currentY, { width: pageWidth - 20 });
        currentY += 12;

        doc.font('Helvetica')
           .fillColor('#6B7280')
           .text(comment.comment || 'Sin comentario', 70, currentY, { width: pageWidth - 20 });
        
        currentY += doc.heightOfString(comment.comment || 'Sin comentario', {
          width: pageWidth - 20
        }) + 8;

        // Línea divisoria entre comentarios
        doc.moveTo(70, currentY)
           .lineTo(doc.page.width - 70, currentY)
           .strokeColor('#E5E7EB')
           .lineWidth(0.3)
           .stroke();
        
        currentY += 8;
        
        // Check if new page needed
        if (currentY > doc.page.height - 120) {
          doc.addPage();
          currentY = 50;
        }
      });

      currentY += 15;
    }

    // ========================================
    // SECCIÓN DE FIRMAS (OPTIMIZADA Y COMPACTA)
    // ========================================
    // Solo crear nueva página si NO hay espacio suficiente para TODA la sección de firmas
    const firmasHeight = 200; // Altura necesaria para toda la sección
    if (currentY > doc.page.height - firmasHeight) {
      doc.addPage();
      currentY = 50;
    }

    // Línea divisoria antes de firmas
    doc.moveTo(50, currentY)
       .lineTo(doc.page.width - 50, currentY)
       .strokeColor('#E5E7EB')
       .lineWidth(1)
       .stroke();
    
    currentY += 20;

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('FIRMAS', 50, currentY);
    
    currentY += 25;

    // Firma del Técnico
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text('Técnico Responsable:', 70, currentY);
    
    currentY += 35;

    doc.fontSize(9)
       .font('Helvetica')
       .text('Firma: ', 70, currentY);
    
    // Línea para firma
    doc.moveTo(110, currentY + 10)
       .lineTo(280, currentY + 10)
       .strokeColor('#9CA3AF')
       .lineWidth(0.5)
       .stroke();

    currentY += 40;

    // Firma del Cliente
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text('Cliente / Responsable:', 70, currentY);
    
    currentY += 30;

    doc.fontSize(9)
       .font('Helvetica')
       .text('Nombre: ', 70, currentY);
    
    // Línea para nombre
    doc.moveTo(115, currentY + 10)
       .lineTo(380, currentY + 10)
       .strokeColor('#9CA3AF')
       .lineWidth(0.5)
       .stroke();

    currentY += 30;

    doc.text('Firma: ', 70, currentY);
    
    // Línea para firma
    doc.moveTo(110, currentY + 10)
       .lineTo(380, currentY + 10)
       .strokeColor('#9CA3AF')
       .lineWidth(0.5)
       .stroke();

    currentY += 30;

    doc.text('Fecha: ', 70, currentY);
    
    // Línea para fecha
    doc.moveTo(110, currentY + 10)
       .lineTo(280, currentY + 10)
       .strokeColor('#9CA3AF')
       .lineWidth(0.5)
       .stroke();

    // ========================================
    // FOOTER (COMPACTO)
    // ========================================
    const footerY = doc.page.height - 50;
    
    doc.moveTo(50, footerY)
       .lineTo(doc.page.width - 50, footerY)
       .strokeColor('#E5E7EB')
       .lineWidth(0.5)
       .stroke();

    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#9CA3AF')
       .text(
         'MAC Computadoras © 2025',
         50,
         footerY + 8,
         { width: pageWidth / 2, align: 'left' }
       );

    const fechaGeneracion = new Date().toLocaleString('es-MX');
    doc.text(
      `Generado: ${fechaGeneracion}`,
      doc.page.width / 2,
      footerY + 8,
      { width: pageWidth / 2, align: 'right' }
    );
  }
};

export default pdfService;

