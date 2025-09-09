import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { 
  FiUser, 
  FiLock, 
  FiSettings, 
  FiBell,
  FiShield,
  FiDatabase,
  FiMail,
  FiSave,
  FiEdit,
  FiCamera,
  FiKey,
  FiGlobe,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="py-6">{children}</Box>}
    </div>
  );
}

const Settings = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState({
    emailTickets: true,
    emailAssignments: true,
    emailComments: false,
    pushTickets: true,
    pushAssignments: true,
    pushComments: true
  });

  const [profile, setProfile] = useState({
    firstName: user?.first_name || 'Super',
    lastName: user?.last_name || 'Admin',
    email: user?.email || 'admin@tuempresa.com',
    phone: '+52 555 123 4567',
    department: 'Tecnología',
    position: 'Administrador del Sistema',
    timezone: 'America/Mexico_City',
    language: 'es'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
          Configuración
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
          Administra tu perfil, preferencias y configuraciones del sistema
        </Typography>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <Tab 
              icon={<FiUser />} 
              label="Perfil" 
              className="flex-row space-x-2"
            />
            <Tab 
              icon={<FiBell />} 
              label="Notificaciones"
              className="flex-row space-x-2" 
            />
            <Tab 
              icon={<FiShield />} 
              label="Seguridad"
              className="flex-row space-x-2" 
            />
            <Tab 
              icon={<FiSettings />} 
              label="Sistema"
              className="flex-row space-x-2" 
            />
          </Tabs>

          {/* Panel 1: Perfil */}
          <TabPanel value={activeTab} index={0}>
            <div className="space-y-6 px-6">
              {/* Foto de perfil */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar
                    className="w-20 h-20 bg-blue-500 text-white text-2xl"
                  >
                    {getInitials(profile.firstName, profile.lastName)}
                  </Avatar>
                  <Button
                    className="absolute -bottom-1 -right-1 min-w-0 w-8 h-8 p-0 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    style={{ borderRadius: '50%' }}
                  >
                    <FiCamera size={16} />
                  </Button>
                </div>
                <div>
                  <Typography variant="h6" className="font-bold">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {profile.position}
                  </Typography>
                  <Chip 
                    label={user?.role || 'Administrador'} 
                    size="small" 
                    className="bg-blue-100 text-blue-800 mt-2"
                  />
                </div>
              </div>

              <Divider />

              {/* Información personal */}
              <div>
                <Typography variant="h6" className="font-bold mb-4">
                  Información Personal
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={profile.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      value={profile.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Departamento"
                      value={profile.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      value={profile.position}
                      onChange={(e) => handleProfileChange('position', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>

              <Divider />

              {/* Preferencias */}
              <div>
                <Typography variant="h6" className="font-bold mb-4">
                  Preferencias
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Zona Horaria</InputLabel>
                      <Select
                        value={profile.timezone}
                        label="Zona Horaria"
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                      >
                        <MenuItem value="America/Mexico_City">Ciudad de México (GMT-6)</MenuItem>
                        <MenuItem value="America/New_York">Nueva York (GMT-5)</MenuItem>
                        <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Idioma</InputLabel>
                      <Select
                        value={profile.language}
                        label="Idioma"
                        onChange={(e) => handleProfileChange('language', e.target.value)}
                      >
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outlined" className="border-gray-300">
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<FiSave />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </TabPanel>

          {/* Panel 2: Notificaciones */}
          <TabPanel value={activeTab} index={1}>
            <div className="space-y-6 px-6">
              <Alert severity="info" className="mb-4">
                Configura cómo y cuándo quieres recibir notificaciones sobre la actividad de tickets.
              </Alert>

              {/* Notificaciones por Email */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiMail className="text-blue-500" />
                  <Typography variant="h6" className="font-bold">
                    Notificaciones por Email
                  </Typography>
                </div>
                <div className="space-y-3 ml-8">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailTickets}
                        onChange={() => handleNotificationChange('emailTickets')}
                      />
                    }
                    label="Nuevos tickets creados"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailAssignments}
                        onChange={() => handleNotificationChange('emailAssignments')}
                      />
                    }
                    label="Tickets asignados a mí"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailComments}
                        onChange={() => handleNotificationChange('emailComments')}
                      />
                    }
                    label="Nuevos comentarios en mis tickets"
                  />
                </div>
              </div>

              <Divider />

              {/* Notificaciones Push */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiBell className="text-green-500" />
                  <Typography variant="h6" className="font-bold">
                    Notificaciones Push
                  </Typography>
                </div>
                <div className="space-y-3 ml-8">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushTickets}
                        onChange={() => handleNotificationChange('pushTickets')}
                      />
                    }
                    label="Tickets de alta prioridad"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushAssignments}
                        onChange={() => handleNotificationChange('pushAssignments')}
                      />
                    }
                    label="Asignaciones inmediatas"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.pushComments}
                        onChange={() => handleNotificationChange('pushComments')}
                      />
                    }
                    label="Respuestas urgentes"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="contained" 
                  startIcon={<FiSave />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          </TabPanel>

          {/* Panel 3: Seguridad */}
          <TabPanel value={activeTab} index={2}>
            <div className="space-y-6 px-6">
              {/* Cambiar contraseña */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiLock className="text-red-500" />
                  <Typography variant="h6" className="font-bold">
                    Cambiar Contraseña
                  </Typography>
                </div>
                <Grid container spacing={3} className="ml-8">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña Actual"
                      type="password"
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nueva Contraseña"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirmar Contraseña"
                      type="password"
                      placeholder="Repite la nueva contraseña"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      startIcon={<FiKey />}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Actualizar Contraseña
                    </Button>
                  </Grid>
                </Grid>
              </div>

              <Divider />

              {/* Autenticación de dos factores */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FiShield className="text-green-500" />
                    <Typography variant="h6" className="font-bold">
                      Autenticación de Dos Factores
                    </Typography>
                  </div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.twoFactorEnabled}
                        onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                      />
                    }
                    label={security.twoFactorEnabled ? "Activado" : "Desactivado"}
                  />
                </div>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 ml-8">
                  Agrega una capa extra de seguridad requiriendo un código adicional al iniciar sesión.
                </Typography>
              </div>

              <Divider />

              {/* Configuraciones adicionales */}
              <div>
                <Typography variant="h6" className="font-bold mb-4">
                  Configuraciones de Sesión
                </Typography>
                <div className="ml-8 space-y-4">
                  <div>
                    <Typography variant="body2" className="mb-2">
                      Tiempo de inactividad antes de cerrar sesión automáticamente
                    </Typography>
                    <FormControl className="min-w-48">
                      <Select
                        value={security.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      >
                        <MenuItem value={15}>15 minutos</MenuItem>
                        <MenuItem value={30}>30 minutos</MenuItem>
                        <MenuItem value={60}>1 hora</MenuItem>
                        <MenuItem value={240}>4 horas</MenuItem>
                        <MenuItem value={480}>8 horas</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={security.loginNotifications}
                        onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                      />
                    }
                    label="Notificarme sobre inicios de sesión desde dispositivos nuevos"
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Panel 4: Sistema */}
          <TabPanel value={activeTab} index={3}>
            <div className="space-y-6 px-6">
              {/* Apariencia */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {darkMode ? <FiMoon className="text-indigo-500" /> : <FiSun className="text-yellow-500" />}
                  <Typography variant="h6" className="font-bold">
                    Apariencia
                  </Typography>
                </div>
                <div className="ml-8">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={toggleTheme}
                      />
                    }
                    label={`Modo ${darkMode ? 'Oscuro' : 'Claro'}`}
                  />
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                    Cambia entre el tema claro y oscuro de la aplicación
                  </Typography>
                </div>
              </div>

              <Divider />

              {/* Configuración regional */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiGlobe className="text-blue-500" />
                  <Typography variant="h6" className="font-bold">
                    Configuración Regional
                  </Typography>
                </div>
                <Grid container spacing={3} className="ml-8">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Formato de Fecha</InputLabel>
                      <Select defaultValue="dd/mm/yyyy" label="Formato de Fecha">
                        <MenuItem value="dd/mm/yyyy">DD/MM/YYYY</MenuItem>
                        <MenuItem value="mm/dd/yyyy">MM/DD/YYYY</MenuItem>
                        <MenuItem value="yyyy-mm-dd">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Formato de Hora</InputLabel>
                      <Select defaultValue="24h" label="Formato de Hora">
                        <MenuItem value="24h">24 horas (14:30)</MenuItem>
                        <MenuItem value="12h">12 horas (2:30 PM)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              <Divider />

              {/* Información del sistema */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FiDatabase className="text-gray-500" />
                  <Typography variant="h6" className="font-bold">
                    Información del Sistema
                  </Typography>
                </div>
                <div className="ml-8 space-y-2">
                  <div className="flex justify-between py-2">
                    <Typography variant="body2" className="text-gray-600">
                      Versión de la Aplicación:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      v1.0.0
                    </Typography>
                  </div>
                  <div className="flex justify-between py-2">
                    <Typography variant="body2" className="text-gray-600">
                      Última Actualización:
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      15 Enero 2025
                    </Typography>
                  </div>
                  <div className="flex justify-between py-2">
                    <Typography variant="body2" className="text-gray-600">
                      Estado del Sistema:
                    </Typography>
                    <Chip 
                      label="Operativo" 
                      size="small" 
                      className="bg-green-100 text-green-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
