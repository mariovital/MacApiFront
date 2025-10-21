// /models/TicketAttachment.js - Archivos adjuntos de tickets

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TicketAttachment = sequelize.define('TicketAttachment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ticket_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  original_name: { type: DataTypes.STRING(255), allowNull: false },
  file_name: { type: DataTypes.STRING(255), allowNull: false },
  file_size: { type: DataTypes.BIGINT, allowNull: false },
  file_type: { type: DataTypes.STRING(100), allowNull: false },
  file_path: { type: DataTypes.STRING(500), allowNull: false, comment: 'Ruta local del archivo' },
  storage_type: { type: DataTypes.ENUM('local', 'external'), defaultValue: 'local', allowNull: false },
  s3_url: { type: DataTypes.STRING(500), allowNull: true, comment: 'DEPRECATED - Migración de S3' },
  s3_key: { type: DataTypes.STRING(500), allowNull: true, comment: 'DEPRECATED - Migración de S3' },
  is_image: { type: DataTypes.BOOLEAN, defaultValue: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  ip_address: { type: DataTypes.STRING(45), allowNull: true },
  user_agent: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
  deleted_by: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'ticket_attachments',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: false
});

export default TicketAttachment;
