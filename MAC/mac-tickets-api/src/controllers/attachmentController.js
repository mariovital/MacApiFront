// /controllers/attachmentController.js - Lógica para manejo de archivos adjuntos

import { Ticket, TicketAttachment, User } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * POST /api/tickets/:ticketId/attachments
 * Subir un archivo a un ticket
 */
export const uploadAttachment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { description } = req.body;
    const file = req.file;

    // Validar que se subió un archivo
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Verificar que el ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Verificar permisos (solo creador, asignado o admin)
    const canUpload = 
      req.user.role === 'admin' ||
      ticket.created_by === req.user.id ||
      ticket.assigned_to === req.user.id;

    if (!canUpload) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para adjuntar archivos a este ticket'
      });
    }

    // Usar nombre generado por multer (file.filename) y exponer como URL estática
    const storedName = file.filename || `${uuidv4()}${path.extname(file.originalname)}`;
    const fileUrl = `/uploads/${storedName}`;

    // Crear registro en la base de datos (alineado al modelo TicketAttachment)
    const attachment = await TicketAttachment.create({
      ticket_id: ticketId,
      user_id: req.user.id,
      original_name: file.originalname,
      file_name: storedName,
      file_size: file.size,
      file_type: file.mimetype,
      s3_url: fileUrl,   // usando almacenamiento local expuesto como /uploads
      s3_key: storedName,
      is_image: (file.mimetype || '').startsWith('image/'),
      description: description || null,
      ip_address: req.ip || null,
      user_agent: req.get('user-agent') || null
    });

    // Obtener attachment con relaciones
    const attachmentWithUser = await TicketAttachment.findByPk(attachment.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: attachmentWithUser
    });

  } catch (error) {
    console.error('Error subiendo archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir el archivo',
      error: error.message
    });
  }
};

/**
 * POST /api/tickets/:ticketId/attachments/multiple
 * Subir múltiples archivos a un ticket
 */
export const uploadMultipleAttachments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { description } = req.body;
  const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron archivos'
      });
    }

    // Verificar que el ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Verificar permisos
    const canUpload = 
      req.user.role === 'admin' ||
      ticket.created_by === req.user.id ||
      ticket.assigned_to === req.user.id;

    if (!canUpload) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para adjuntar archivos a este ticket'
      });
    }

    // Procesar cada archivo
  const uploadedAttachments = [];
    
    for (const file of files) {
      const storedName = file.filename || `${uuidv4()}${path.extname(file.originalname)}`;
      const fileUrl = `/uploads/${storedName}`;
      const attachment = await TicketAttachment.create({
        ticket_id: ticketId,
        user_id: req.user.id,
        original_name: file.originalname,
        file_name: storedName,
        file_size: file.size,
        file_type: file.mimetype,
        s3_url: fileUrl,
        s3_key: storedName,
        is_image: (file.mimetype || '').startsWith('image/'),
        description: description || null,
        ip_address: req.ip || null,
        user_agent: req.get('user-agent') || null
      });

      uploadedAttachments.push(attachment);
    }

    // Obtener attachments con relaciones
    const attachmentsWithUser = await TicketAttachment.findAll({
      where: {
        id: uploadedAttachments.map(a => a.id)
      },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: `${files.length} archivo(s) subido(s) exitosamente`,
      data: attachmentsWithUser
    });

  } catch (error) {
    console.error('Error subiendo archivos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir los archivos',
      error: error.message
    });
  }
};

/**
 * GET /api/tickets/:ticketId/attachments
 * Listar archivos adjuntos de un ticket
 */
export const getTicketAttachments = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Verificar que el ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Verificar permisos
    const canView = 
      req.user.role === 'admin' ||
      ticket.created_by === req.user.id ||
      ticket.assigned_to === req.user.id;

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver los archivos de este ticket'
      });
    }

    const attachments = await TicketAttachment.findAll({
      where: {
        ticket_id: ticketId,
        deleted_at: null
      },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Devolver lista directa para alinearse con Android (AttachmentListResponse.data = List)
    res.status(200).json({
      success: true,
      message: 'Archivos obtenidos exitosamente',
      data: attachments
    });

  } catch (error) {
    console.error('Error obteniendo archivos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los archivos'
    });
  }
};

/**
 * GET /api/attachments/:id
 * Obtener información de un archivo específico
 */
export const getAttachmentById = async (req, res) => {
  try {
    const { id } = req.params;

  const attachment = await TicketAttachment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'first_name', 'last_name', 'username']
        },
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'ticket_number', 'title', 'created_by', 'assigned_to']
        }
      ]
    });

    if (!attachment || attachment.deleted_at) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar permisos
    const canView = 
      req.user.role === 'admin' ||
      attachment.ticket.created_by === req.user.id ||
      attachment.ticket.assigned_to === req.user.id;

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este archivo'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Archivo obtenido exitosamente',
      data: attachment
    });

  } catch (error) {
    console.error('Error obteniendo archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el archivo'
    });
  }
};

/**
 * GET /api/attachments/:id/download
 * Descargar un archivo
 */
export const downloadAttachment = async (req, res) => {
  try {
    const { id } = req.params;

  const attachment = await TicketAttachment.findByPk(id, {
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'created_by', 'assigned_to']
        }
      ]
    });

    if (!attachment || attachment.deleted_at) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Verificar permisos
    const canDownload = 
      req.user.role === 'admin' ||
      attachment.ticket.created_by === req.user.id ||
      attachment.ticket.assigned_to === req.user.id;

    if (!canDownload) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para descargar este archivo'
      });
    }

    // TODO: En producción, generar URL firmada de S3 o servir desde S3
    // Por ahora, retornamos la información del archivo
  res.status(200).json({
      success: true,
      message: 'URL de descarga generada',
      data: {
    file_name: attachment.file_name,
    file_url: attachment.s3_url,
        file_size: attachment.file_size,
        file_type: attachment.file_type,
        // En producción: signed_url con expiración
    download_url: `${process.env.API_URL || 'http://localhost:3001'}${attachment.s3_url}`
      }
    });

  } catch (error) {
    console.error('Error descargando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al descargar el archivo'
    });
  }
};

/**
 * DELETE /api/attachments/:id
 * Eliminar un archivo adjunto (soft delete)
 */
export const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

  const attachment = await TicketAttachment.findByPk(id, {
      include: [
        {
          model: Ticket,
          as: 'ticket',
          attributes: ['id', 'created_by', 'assigned_to']
        }
      ]
    });

    if (!attachment || attachment.deleted_at) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Solo el creador del ticket o admin pueden eliminar
    const canDelete = 
      req.user.role === 'admin' ||
      attachment.ticket.created_by === req.user.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este archivo'
      });
    }

    // Soft delete
    await attachment.update({
      deleted_at: new Date(),
      deleted_by: req.user.id
    });

    // TODO: En producción, eliminar de S3 también

    res.status(200).json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el archivo'
    });
  }
};

