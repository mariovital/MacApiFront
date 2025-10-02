// /models/index.js - Configuración de Modelos y Asociaciones

import sequelize from '../config/database.js';
import Role from './Role.js';
import User from './User.js';
import Category from './Category.js';
import Priority from './Priority.js';
import TicketStatus from './TicketStatus.js';
import Ticket from './Ticket.js';

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
  Ticket
};

export default db;
export {
  sequelize,
  Role,
  User,
  Category,
  Priority,
  TicketStatus,
  Ticket
};

