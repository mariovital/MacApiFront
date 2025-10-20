// /services/ticketService.js

import { Ticket, User, Category, Priority, TicketStatus, Comment } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Servicio para gestión de tickets
 * Contiene toda la lógica de negocio relacionada con tickets
 */

/**
 * Obtener lista de tickets con filtros y paginación
 */
export const getTickets = async (filters) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    category,
    assignedTo,
    createdBy,
    search,
    userId,
    userRole
  } = filters;

  try {
    // Construir condiciones WHERE según rol del usuario
    let whereConditions = {};

    // Filtros por rol
    if (userRole === 'tecnico') {
      // Técnico solo ve sus tickets asignados
      whereConditions.assigned_to = userId;
    } else if (userRole === 'mesa_trabajo') {
      // Mesa de trabajo solo ve tickets que creó
      whereConditions.created_by = userId;
    }
    // Admin ve todos los tickets (sin filtro adicional)

    // Filtros adicionales opcionales
    if (status) whereConditions.status_id = status;
    if (priority) whereConditions.priority_id = priority;
    if (category) whereConditions.category_id = category;
    if (assignedTo) whereConditions.assigned_to = assignedTo;
    if (createdBy) whereConditions.created_by = createdBy;

    // Búsqueda por texto (título, descripción, número de ticket)
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { ticket_number: { [Op.like]: `%${search}%` } }
      ];
    }

    // Excluir tickets eliminados (soft delete)
    whereConditions.deleted_at = null;

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Consultar tickets con relaciones
    const { count, rows } = await Ticket.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'description']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'level', 'color', 'sla_hours']
        },
        {
          model: TicketStatus,
          as: 'status',
          attributes: ['id', 'name', 'color', 'is_final', 'order_index']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']],
      distinct: true
    });

    return {
      items: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    };

  } catch (error) {
    console.error('Error en ticketService.getTickets:', error);
    throw new Error('Error obteniendo tickets de la base de datos');
  }
};

/**
 * Obtener detalle completo de un ticket por ID
 */
export const getTicketById = async (ticketId, userId, userRole) => {
  try {
    const ticket = await Ticket.findOne({
      where: { 
        id: ticketId,
        deleted_at: null
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color', 'description']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'level', 'color', 'sla_hours']
        },
        {
          model: TicketStatus,
          as: 'status',
          attributes: ['id', 'name', 'color', 'is_final', 'order_index']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'username', 'email', 'avatar_url']
        },
        {
          model: User,
          as: 'assigner',
          attributes: ['id', 'first_name', 'last_name', 'username']
        }
      ]
    });

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // Verificar permisos según rol
    if (userRole === 'tecnico' && ticket.assigned_to !== userId) {
      throw new Error('No tienes permiso para ver este ticket');
    }

    if (userRole === 'mesa_trabajo' && ticket.created_by !== userId) {
      throw new Error('No tienes permiso para ver este ticket');
    }

    return ticket;

  } catch (error) {
    console.error('Error en ticketService.getTicketById:', error);
    throw error;
  }
};

/**
 * Crear nuevo ticket
 */
export const createTicket = async (ticketData, userId) => {
  try {
    // Validar datos básicos
    if (!ticketData.title || ticketData.title.length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (!ticketData.description || ticketData.description.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    // Generar número de ticket
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Obtener último número del mes
    const lastTicket = await Ticket.findOne({
      where: {
        ticket_number: {
          [Op.like]: `ID-${year}-${month}-%`
        }
      },
      order: [['created_at', 'DESC']]
    });

    let nextNumber = 1;
    if (lastTicket && lastTicket.ticket_number) {
      const lastNumber = parseInt(lastTicket.ticket_number.split('-')[3]);
      nextNumber = lastNumber + 1;
    }

    const ticketNumber = `ID-${year}-${month}-${String(nextNumber).padStart(3, '0')}`;

    // Crear ticket
    const ticket = await Ticket.create({
      ticket_number: ticketNumber,
      title: ticketData.title,
      description: ticketData.description,
      category_id: ticketData.category_id,
      priority_id: ticketData.priority_id,
      status_id: 1, // Estado "Nuevo" por defecto
      created_by: userId,
      client_company: ticketData.client_company,
      client_contact: ticketData.client_contact,
      client_email: ticketData.client_email,
      client_phone: ticketData.client_phone,
      client_department: ticketData.client_department,
      location: ticketData.location,
      priority_justification: ticketData.priority_justification,
      ip_address: ticketData.ip_address,
      user_agent: ticketData.user_agent
    });

    // Obtener ticket completo con relaciones
    const newTicket = await Ticket.findByPk(ticket.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { 
          model: User, 
          as: 'creator', 
          attributes: ['id', 'first_name', 'last_name', 'username', 'email'] 
        }
      ]
    });

    return newTicket;

  } catch (error) {
    console.error('Error en ticketService.createTicket:', error);
    throw error;
  }
};

/**
 * Actualizar ticket
 */
export const updateTicket = async (ticketId, updates, userId, userRole) => {
  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    if (ticket.deleted_at) {
      throw new Error('El ticket ha sido eliminado');
    }

    // Verificar permisos
    if (userRole === 'tecnico' && ticket.assigned_to !== userId) {
      throw new Error('No tienes permiso para actualizar este ticket');
    }

    if (userRole === 'mesa_trabajo' && ticket.created_by !== userId) {
      throw new Error('No tienes permiso para actualizar este ticket');
    }

    // Campos permitidos para actualizar
    const allowedFields = [
      'title',
      'description',
      'category_id',
      'priority_id',
      'client_company',
      'client_contact',
      'client_email',
      'client_phone',
      'client_department',
      'location',
      'priority_justification'
    ];

    // Solo actualizar campos permitidos
    const updateData = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await ticket.update(updateData);

    // Retornar ticket actualizado con relaciones
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.updateTicket:', error);
    throw error;
  }
};

/**
 * Cambiar estado de ticket
 */
export const updateTicketStatus = async (ticketId, statusId, userId, userRole) => {
  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // Verificar permisos
    if (userRole === 'tecnico' && ticket.assigned_to !== userId) {
      throw new Error('No tienes permiso para cambiar el estado de este ticket');
    }

    if (userRole === 'mesa_trabajo') {
      throw new Error('Solo técnicos y administradores pueden cambiar estados');
    }

    // Actualizar estado
    await ticket.update({
      status_id: statusId
    });

    // Si el estado es "Resuelto" o "Cerrado", actualizar timestamps
    if (statusId === 5) { // Resuelto
      await ticket.update({ resolved_at: new Date() });
    } else if (statusId === 6) { // Cerrado
      await ticket.update({ 
        closed_at: new Date(),
        resolved_at: ticket.resolved_at || new Date()
      });
    }

    // Retornar ticket actualizado
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.updateTicketStatus:', error);
    throw error;
  }
};

/**
 * Aceptar ticket por el técnico asignado
 */
export const acceptTicket = async (ticketId, userId, userRole) => {
  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // Solo el técnico asignado puede aceptar
    if (userRole !== 'tecnico' || ticket.assigned_to !== userId) {
      throw new Error('Solo el técnico asignado puede aceptar este ticket');
    }

    // Debe estar en estado Asignado (2) para poder aceptar
    if (ticket.status_id !== 2) {
      throw new Error('El ticket no está en estado asignado');
    }

    await ticket.update({
      accepted_at: new Date(),
      first_response_at: ticket.first_response_at || new Date(),
      status_id: 3 // En Proceso
    });

    const updated = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    return updated;
  } catch (error) {
    console.error('Error en ticketService.acceptTicket:', error);
    throw error;
  }
};

/**
 * Rechazar ticket por el técnico asignado
 */
export const rejectTicket = async (ticketId, reason, userId, userRole) => {
  try {
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // Solo el técnico asignado puede rechazar
    if (userRole !== 'tecnico' || ticket.assigned_to !== userId) {
      throw new Error('Solo el técnico asignado puede rechazar este ticket');
    }

    // Solo se puede rechazar cuando está asignado
    if (ticket.status_id !== 2) {
      throw new Error('Solo se puede rechazar un ticket en estado asignado');
    }

    // Obtener o crear estado "Rechazado"
    let rejectedStatus = await TicketStatus.findOne({ where: { name: 'Rechazado' } });
    if (!rejectedStatus) {
      rejectedStatus = await TicketStatus.create({
        name: 'Rechazado',
        description: 'Ticket rechazado por el técnico asignado',
        color: '#D32F2F',
        is_final: false,
        order_index: 2
      });
    }

    await ticket.update({
      assigned_to: null,
      assigned_by: null,
      assigned_at: null,
      accepted_at: null,
      status_id: rejectedStatus.id,
      // Persistimos el motivo en reopen_reason como campo reutilizable para mostrarlo en el frontend
      reopen_reason: reason || null
    });

  const updated = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    return updated;
  } catch (error) {
    console.error('Error en ticketService.rejectTicket:', error);
    throw error;
  }
};
/**
 * Asignar ticket a un técnico (solo admin)
 */
export const assignTicket = async (ticketId, technicianId, userId, userRole) => {
  try {
    // Buscar ticket primero para validar permisos con creador
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    const currentAssignee = ticket.assigned_to;

    // Permisos y reglas de asignación vs. reasignación
    // - Si NO hay asignado aún (currentAssignee null):
    //     admin puede asignar; mesa_trabajo puede asignar si es el creador; técnico no puede
    // - Si YA hay asignado:
    //     si se intenta cambiar a OTRO técnico -> solo admin puede reasignar
    //     si se asigna al MISMO técnico -> no-op permitido para todos los roles con acceso

    if (currentAssignee == null) {
      if (userRole === 'admin') {
        // permitido
      } else if (userRole === 'mesa_trabajo' && ticket.created_by === userId) {
        // permitido
      } else {
        throw new Error('No tienes permiso para asignar este ticket');
      }
    } else {
      if (technicianId !== currentAssignee) {
        if (userRole !== 'admin') {
          throw new Error('Solo administradores pueden reasignar tickets');
        }
      } else {
        // Mismo técnico -> permitir no-op devolviendo ticket actualizado
      }
    }

    // Verificar que el técnico existe y tiene rol de técnico
    const technician = await User.findByPk(technicianId);

    if (!technician) {
      throw new Error('Técnico no encontrado');
    }

    if (technician.role_id !== 2) { // 2 = técnico
      throw new Error('El usuario seleccionado no es un técnico');
    }

    // Si es no-op (mismo técnico), regresamos el ticket con include
    if (currentAssignee !== null && technicianId === currentAssignee) {
      const sameAssigneeTicket = await Ticket.findByPk(ticketId, {
        include: [
          { model: Category, as: 'category' },
          { model: Priority, as: 'priority' },
          { model: TicketStatus, as: 'status' },
          { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
          { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
        ]
      });
      return sameAssigneeTicket;
    }

    // Asignar o reasignar ticket
    await ticket.update({
      assigned_to: technicianId,
      assigned_by: userId,
      assigned_at: new Date(),
      status_id: 2 // Estado "Asignado"
    });

    // Retornar ticket actualizado
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] }
      ]
    });

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.assignTicket:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de tickets (para dashboard)
 */
export const getTicketStats = async (userId, userRole) => {
  try {
    let whereConditions = { deleted_at: null };

    // Filtrar según rol
    if (userRole === 'tecnico') {
      whereConditions.assigned_to = userId;
    } else if (userRole === 'mesa_trabajo') {
      whereConditions.created_by = userId;
    }

    const total = await Ticket.count({ where: whereConditions });
    const nuevo = await Ticket.count({ where: { ...whereConditions, status_id: 1 } });
    const asignado = await Ticket.count({ where: { ...whereConditions, status_id: 2 } });
    const enProceso = await Ticket.count({ where: { ...whereConditions, status_id: 3 } });
    const resuelto = await Ticket.count({ where: { ...whereConditions, status_id: 5 } });
    const cerrado = await Ticket.count({ where: { ...whereConditions, status_id: 6 } });

    const critica = await Ticket.count({ where: { ...whereConditions, priority_id: 4 } });
    const alta = await Ticket.count({ where: { ...whereConditions, priority_id: 3 } });

    return {
      total,
      porEstado: {
        nuevo,
        asignado,
        enProceso,
        resuelto,
        cerrado
      },
      porPrioridad: {
        critica,
        alta
      }
    };

  } catch (error) {
    console.error('Error en ticketService.getTicketStats:', error);
    throw error;
  }
};

/**
 * Marcar ticket como resuelto (solo técnico asignado)
 */
export const resolveTicket = async (ticketId, resolutionComment, userId, userRole) => {
  try {
    // Buscar ticket
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'assignee' }
      ]
    });

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // VALIDACIÓN 1: Solo el técnico asignado o admin pueden marcar como resuelto
    if (userRole === 'tecnico' && ticket.assigned_to !== userId) {
      throw new Error('Solo el técnico asignado puede marcar este ticket como resuelto');
    }

    if (userRole === 'mesa_trabajo') {
      throw new Error('Solo técnicos y administradores pueden resolver tickets');
    }

    // VALIDACIÓN 2: El ticket debe estar en estado "En Proceso" (status_id = 3)
    if (ticket.status_id !== 3) {
      throw new Error('El ticket debe estar en estado "En Proceso" para poder marcarlo como resuelto');
    }

    // Agregar comentario de resolución
    await Comment.create({
      ticket_id: ticketId,
      user_id: userId,
      comment: `[RESOLUCIÓN] ${resolutionComment}`,
      is_internal: false
    });

    // Actualizar ticket a estado "Resuelto" (status_id = 5)
    await ticket.update({
      status_id: 5,
      resolved_at: new Date(),
      resolved_by: userId
    });

    // Retornar ticket actualizado con relaciones
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'username'] }
      ]
    });

    console.log(`✅ Ticket ${ticketId} marcado como resuelto por usuario ${userId}`);

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.resolveTicket:', error);
    throw error;
  }
};

/**
 * Cerrar ticket (solo admin)
 */
export const closeTicket = async (ticketId, closeReason, userId, userRole) => {
  try {
    // VALIDACIÓN: Solo admin puede cerrar tickets
    if (userRole !== 'admin') {
      throw new Error('Solo administradores pueden cerrar tickets');
    }

    // Buscar ticket
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // VALIDACIÓN: El ticket debe estar en estado "Resuelto" (status_id = 5)
    if (ticket.status_id !== 5) {
      throw new Error('El ticket debe estar en estado "Resuelto" para poder cerrarlo');
    }

    // Agregar comentario de cierre
    await Comment.create({
      ticket_id: ticketId,
      user_id: userId,
      comment: `[CIERRE] Ticket cerrado. Razón: ${closeReason}`,
      is_internal: true
    });

    // Actualizar ticket a estado "Cerrado" (status_id = 6)
    await ticket.update({
      status_id: 6,
      closed_at: new Date(),
      closed_by: userId
    });

    // Retornar ticket actualizado con relaciones
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'username'] }
      ]
    });

    console.log(`✅ Ticket ${ticketId} cerrado por admin ${userId}`);

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.closeTicket:', error);
    throw error;
  }
};

/**
 * Reabrir ticket cerrado (solo admin)
 */
export const reopenTicket = async (ticketId, reopenReason, userId, userRole) => {
  try {
    // VALIDACIÓN: Solo admin puede reabrir tickets
    if (userRole !== 'admin') {
      throw new Error('Solo administradores pueden reabrir tickets');
    }

    // Buscar ticket
    const ticket = await Ticket.findByPk(ticketId);

    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }

    // VALIDACIÓN: El ticket debe estar en estado "Cerrado" (status_id = 6)
    if (ticket.status_id !== 6) {
      throw new Error('Solo se pueden reabrir tickets en estado "Cerrado"');
    }

    // Agregar comentario de reapertura
    await Comment.create({
      ticket_id: ticketId,
      user_id: userId,
      comment: `[REAPERTURA] Ticket reabierto. Razón: ${reopenReason}`,
      is_internal: true
    });

    // Actualizar ticket a estado "Reabierto" (status_id = 7)
    await ticket.update({
      status_id: 7,
      reopened_at: new Date(),
      reopened_by: userId,
      resolved_at: null,  // Limpiar fecha de resolución
      closed_at: null      // Limpiar fecha de cierre
    });

    // Retornar ticket actualizado con relaciones
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Category, as: 'category' },
        { model: Priority, as: 'priority' },
        { model: TicketStatus, as: 'status' },
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'username'] }
      ]
    });

    console.log(`✅ Ticket ${ticketId} reabierto por admin ${userId}`);

    return updatedTicket;

  } catch (error) {
    console.error('Error en ticketService.reopenTicket:', error);
    throw error;
  }
};

export default {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  acceptTicket,
  rejectTicket,
  getTicketStats,
  resolveTicket,
  closeTicket,
  reopenTicket
};

