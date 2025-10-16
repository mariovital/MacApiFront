// /routes/attachments.js - Endpoints para manejo de archivos adjuntos

import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import * as attachmentController from '../controllers/attachmentController.js';

const router = express.Router();

/**
 * Configuración de Multer para subida de archivos
 * - Almacenamiento en memoria (buffer)
 * - Límite de 10MB por archivo
 * - Tipos permitidos: imágenes, PDFs, documentos
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Importante: No usar router.use(authMiddleware) global aquí, para no interceptar otras rutas /api

/**
 * POST /api/tickets/:ticketId/attachments
 * Subir archivo(s) a un ticket
 * 
 * @body {file} file - Archivo a subir (multipart/form-data)
 * @body {string} description - Descripción opcional del archivo
 */
router.post(
  '/tickets/:ticketId/attachments',
  authMiddleware,
  upload.single('file'),
  attachmentController.uploadAttachment
);

/**
 * POST /api/tickets/:ticketId/attachments/multiple
 * Subir múltiples archivos a un ticket
 * 
 * @body {file[]} files - Archivos a subir (multipart/form-data)
 * @body {string} description - Descripción opcional
 */
router.post(
  '/tickets/:ticketId/attachments/multiple',
  authMiddleware,
  upload.array('files', 5), // Máximo 5 archivos a la vez
  attachmentController.uploadMultipleAttachments
);

/**
 * GET /api/tickets/:ticketId/attachments
 * Listar archivos adjuntos de un ticket
 */
router.get(
  '/tickets/:ticketId/attachments',
  authMiddleware,
  attachmentController.getTicketAttachments
);

/**
 * GET /api/attachments/:id
 * Obtener información de un archivo específico
 */
router.get(
  '/attachments/:id',
  authMiddleware,
  attachmentController.getAttachmentById
);

/**
 * GET /api/attachments/:id/download
 * Descargar un archivo
 * Retorna el archivo directamente (no JSON)
 */
router.get(
  '/attachments/:id/download',
  authMiddleware,
  attachmentController.downloadAttachment
);

/**
 * DELETE /api/attachments/:id
 * Eliminar un archivo adjunto
 * Solo el creador del ticket o admin pueden eliminar
 */
router.delete(
  '/attachments/:id',
  authMiddleware,
  attachmentController.deleteAttachment
);

export default router;

