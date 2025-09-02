// /contexts/ThemeContext.jsx - Tema Claro/Oscuro

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Detectar preferencia del sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Aplicar clase al html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Tema de Material-UI
  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3B82F6', // blue-500
      },
      secondary: {
        main: '#10B981', // emerald-500
      },
      background: {
        default: darkMode ? '#111827' : '#F9FAFB', // gray-900 : gray-50
        paper: darkMode ? '#1F2937' : '#FFFFFF', // gray-800 : white
      },
      text: {
        primary: darkMode ? '#F9FAFB' : '#374151',
        secondary: darkMode ? '#D1D5DB' : '#6B7280',
      }
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    components: {
      // Personalización de componentes MUI
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // No uppercase
            fontWeight: 500,
            borderRadius: '8px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: darkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const value = {
    darkMode,
    toggleTheme,
    muiTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de CustomThemeProvider');
  }
  return context;
};
