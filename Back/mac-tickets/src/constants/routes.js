// /constants/routes.js - Rutas de la Aplicación

export const ROUTE_PATHS = {
  // Rutas públicas
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Dashboard principal
  DASHBOARD: '/dashboard',
  
  // Tickets
  TICKETS: '/tickets',
  TICKET_DETAIL: '/tickets/:id',
  CREATE_TICKET: '/tickets/create',
  EDIT_TICKET: '/tickets/:id/edit',
  MY_TICKETS: '/my-tickets',
  
  // Usuarios (Solo Admin)
  USERS: '/users',
  CREATE_USER: '/users/create',
  EDIT_USER: '/users/:id/edit',
  USER_PROFILE: '/profile',
  
  // Reportes (Solo Admin)
  REPORTS: '/reports',
  TICKET_REPORTS: '/reports/tickets',
  
  // Configuraciones
  SETTINGS: '/settings',
  CATEGORIES: '/settings/categories',
  PRIORITIES: '/settings/priorities',
  
  // Páginas de error
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403'
};

// Rutas que requieren autenticación
export const PROTECTED_ROUTES = [
  ROUTE_PATHS.DASHBOARD,
  ROUTE_PATHS.TICKETS,
  ROUTE_PATHS.TICKET_DETAIL,
  ROUTE_PATHS.CREATE_TICKET,
  ROUTE_PATHS.EDIT_TICKET,
  ROUTE_PATHS.MY_TICKETS,
  ROUTE_PATHS.USERS,
  ROUTE_PATHS.CREATE_USER,
  ROUTE_PATHS.EDIT_USER,
  ROUTE_PATHS.USER_PROFILE,
  ROUTE_PATHS.REPORTS,
  ROUTE_PATHS.TICKET_REPORTS,
  ROUTE_PATHS.SETTINGS,
  ROUTE_PATHS.CATEGORIES,
  ROUTE_PATHS.PRIORITIES
];

// Rutas solo para admin
export const ADMIN_ONLY_ROUTES = [
  ROUTE_PATHS.USERS,
  ROUTE_PATHS.CREATE_USER,
  ROUTE_PATHS.EDIT_USER,
  ROUTE_PATHS.REPORTS,
  ROUTE_PATHS.TICKET_REPORTS,
  ROUTE_PATHS.CATEGORIES,
  ROUTE_PATHS.PRIORITIES
];
