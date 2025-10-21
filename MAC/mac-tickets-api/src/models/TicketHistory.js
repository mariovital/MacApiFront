// /models/TicketHistory.js - Historial de cambios en tickets

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TicketHistory = sequelize.define('TicketHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ticket_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  action_type: {
    type: DataTypes.ENUM(
      'created',
      'status_changed',
      'assigned',
      'reassigned',
      'commented',
      'attachment_added',
      'reopened',
      'closed',
      'first_response',
      'sla_breach'
    ),
    allowNull: false
  },
  old_value: { type: DataTypes.TEXT, allowNull: true },
  new_value: { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  ip_address: { type: DataTypes.STRING(45), allowNull: true },
  user_agent: { type: DataTypes.TEXT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'ticket_history',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: false
});

export default TicketHistory;

