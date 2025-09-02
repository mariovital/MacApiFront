// /constants/roles.js - Roles de Usuario (OBLIGATORIOS)

export const USER_ROLES = {
  ADMIN: { id: 1, name: 'admin', label: 'Administrador', dashboardOnly: true },
  TECNICO: { id: 2, name: 'tecnico', label: 'Técnico', mobile: true },
  MESA_TRABAJO: { id: 3, name: 'mesa_trabajo', label: 'Mesa de Trabajo', mobile: true }
};

export const getRoleById = (id) => {
  return Object.values(USER_ROLES).find(role => role.id === id);
};

export const getRoleName = (id) => {
  return getRoleById(id)?.name || 'unknown';
};

export const getRoleLabel = (id) => {
  return getRoleById(id)?.label || 'Desconocido';
};

export const canAccessMobile = (roleId) => {
  return getRoleById(roleId)?.mobile || false;
};
