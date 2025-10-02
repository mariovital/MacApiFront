// /models/Priority.js - Modelo de Prioridades

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Priority = sequelize.define('Priority', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  sla_hours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'priorities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Priority;

