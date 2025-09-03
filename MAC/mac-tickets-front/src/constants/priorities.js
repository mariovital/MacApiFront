// /constants/priorities.js - Prioridades (OBLIGATORIAS)

export const PRIORITIES = {
  BAJA: { id: 1, name: 'Baja', level: 1, color: '#4CAF50', slaHours: 72 },
  MEDIA: { id: 2, name: 'Media', level: 2, color: '#FF9800', slaHours: 24 },
  ALTA: { id: 3, name: 'Alta', level: 3, color: '#FF5722', slaHours: 8 },
  CRITICA: { id: 4, name: 'Crítica', level: 4, color: '#F44336', slaHours: 4 }
};

export const getPriorityById = (id) => {
  return Object.values(PRIORITIES).find(priority => priority.id === id);
};

export const getPriorityName = (id) => {
  return getPriorityById(id)?.name || 'Media';
};

export const getPriorityColor = (id) => {
  return getPriorityById(id)?.color || '#FF9800';
};
