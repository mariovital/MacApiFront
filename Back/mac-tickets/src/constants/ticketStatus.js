// /constants/ticketStatus.js - Estados de Tickets (OBLIGATORIOS)

export const TICKET_STATUSES = {
  NUEVO: { id: 1, name: 'Nuevo', color: '#6B7280', order: 1 },
  ASIGNADO: { id: 2, name: 'Asignado', color: '#3B82F6', order: 2 },
  EN_PROCESO: { id: 3, name: 'En Proceso', color: '#F59E0B', order: 3 },
  PENDIENTE_CLIENTE: { id: 4, name: 'Pendiente Cliente', color: '#8B5CF6', order: 4 },
  RESUELTO: { id: 5, name: 'Resuelto', color: '#10B981', order: 5 },
  CERRADO: { id: 6, name: 'Cerrado', color: '#4B5563', order: 6, final: true },
  REABIERTO: { id: 7, name: 'Reabierto', color: '#EF4444', order: 7 }
};

export const getStatusById = (id) => {
  return Object.values(TICKET_STATUSES).find(status => status.id === id);
};

export const getStatusName = (id) => {
  return getStatusById(id)?.name || 'Desconocido';
};

export const getStatusColor = (id) => {
  return getStatusById(id)?.color || '#6B7280';
};
