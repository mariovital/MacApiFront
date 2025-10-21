// /models/index.js - Configuración de Modelos y Asociaciones

import sequelize from '../config/database.js';
import Role from './Role.js';
import User from './User.js';
import Category from './Category.js';
import Priority from './Priority.js';
import TicketStatus from './TicketStatus.js';
import Ticket from './Ticket.js';
import TicketAttachment from './TicketAttachment.js';
import TicketHistory from './TicketHistory.js';
import Comment from './Comment.js';

// =====================================================================
// DEFINIR ASOCIACIONES ENTRE MODELOS
// =====================================================================

// Role <-> User
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// User <-> Category (created_by)
User.hasMany(Category, { foreignKey: 'created_by', as: 'createdCategories' });
Category.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User <-> Ticket (multiple relations)
User.hasMany(Ticket, { foreignKey: 'created_by', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Ticket, { foreignKey: 'assigned_to', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

User.hasMany(Ticket, { foreignKey: 'assigned_by', as: 'assignedByTickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_by', as: 'assigner' });

// Category <-> Ticket
Category.hasMany(Ticket, { foreignKey: 'category_id', as: 'tickets' });
Ticket.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Priority <-> Ticket
Priority.hasMany(Ticket, { foreignKey: 'priority_id', as: 'tickets' });
Ticket.belongsTo(Priority, { foreignKey: 'priority_id', as: 'priority' });

// TicketStatus <-> Ticket
TicketStatus.hasMany(Ticket, { foreignKey: 'status_id', as: 'tickets' });
Ticket.belongsTo(TicketStatus, { foreignKey: 'status_id', as: 'status' });

// Ticket <-> TicketAttachment
Ticket.hasMany(TicketAttachment, { foreignKey: 'ticket_id', as: 'attachments' });
TicketAttachment.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

// User <-> TicketAttachment (quien sube)
User.hasMany(TicketAttachment, { foreignKey: 'user_id', as: 'uploadedAttachments' });
TicketAttachment.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

// User <-> TicketAttachment (quien elimina - soft delete)
User.hasMany(TicketAttachment, { foreignKey: 'deleted_by', as: 'deletedAttachments' });
TicketAttachment.belongsTo(User, { foreignKey: 'deleted_by', as: 'deleter' });

// Ticket <-> Comment
Ticket.hasMany(Comment, { foreignKey: 'ticket_id', as: 'comments' });
Comment.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Ticket <-> TicketHistory
Ticket.hasMany(TicketHistory, { foreignKey: 'ticket_id', as: 'history' });
TicketHistory.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

// User <-> TicketHistory
User.hasMany(TicketHistory, { foreignKey: 'user_id', as: 'ticketHistory' });
TicketHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// =====================================================================
// EXPORTAR MODELOS Y SEQUELIZE
// =====================================================================

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  
  // Modelos
  Role,
  User,
  Category,
  Priority,
  TicketStatus,
  Ticket,
  TicketAttachment,
  TicketHistory,
  Comment
};

export default db;
export {
  sequelize,
  Role,
  User,
  Category,
  Priority,
  TicketStatus,
  Ticket,
  TicketAttachment,
  TicketAttachment as Attachment, // Alias para facilitar el uso
  TicketHistory,
  Comment
};

