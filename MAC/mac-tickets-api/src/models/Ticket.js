// /models/Ticket.js - Modelo de Tickets

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  priority_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'priorities',
      key: 'id'
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'ticket_statuses',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  first_response_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reopen_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  solution_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority_justification: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimated_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  actual_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  resolution_time_hours: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  sla_breach: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  client_company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  client_contact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  client_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  client_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  client_department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    // Generar ticket_number antes de crear
    beforeCreate: async (ticket) => {
      if (!ticket.ticket_number) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        
        // Obtener el último ticket del mes actual
        const lastTicket = await Ticket.findOne({
          where: {
            ticket_number: {
              [sequelize.Sequelize.Op.like]: `ID-${year}-${month}-%`
            }
          },
          order: [['created_at', 'DESC']]
        });

        let nextNumber = 1;
        if (lastTicket) {
          const lastNumber = parseInt(lastTicket.ticket_number.split('-')[3]);
          nextNumber = lastNumber + 1;
        }

        ticket.ticket_number = `ID-${year}-${month}-${String(nextNumber).padStart(3, '0')}`;
      }
    },
    // Calcular resolution_time_hours cuando se resuelve
    beforeUpdate: async (ticket) => {
      if (ticket.changed('resolved_at') && ticket.resolved_at && !ticket.resolution_time_hours) {
        const createdAt = new Date(ticket.created_at);
        const resolvedAt = new Date(ticket.resolved_at);
        const hours = (resolvedAt - createdAt) / (1000 * 60 * 60);
        ticket.resolution_time_hours = parseFloat(hours.toFixed(2));
      }
    }
  }
});

export default Ticket;

