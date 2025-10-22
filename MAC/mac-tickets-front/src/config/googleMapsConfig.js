// /config/googleMapsConfig.js - Configuración centralizada de Google Maps

/**
 * API Key de Google Maps desde variables de entorno
 */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Librerías de Google Maps a cargar
 */
export const GOOGLE_MAPS_LIBRARIES = ['places'];

/**
 * Centro por defecto del mapa (México DF)
 */
export const DEFAULT_CENTER = {
  lat: 19.4326, // Ciudad de México
  lng: -99.1332
};

/**
 * Configuración por defecto del mapa
 */
export const DEFAULT_MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

/**
 * Configuración del marcador personalizado
 */
export const DEFAULT_MARKER_CONFIG = {
  animation: null, // Se agregará dinámicamente
  icon: {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#E31E24', // Rojo de MAC Computadoras
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.5,
    anchor: { x: 12, y: 24 }
  }
};

/**
 * Región por defecto para geocodificación
 */
export const DEFAULT_GEOCODING_REGION = 'MX';

/**
 * Zoom por defecto para diferentes tipos de vistas
 */
export const ZOOM_LEVELS = {
  STREET: 18,    // Vista de calle
  BUILDING: 17,  // Vista de edificio
  AREA: 15,      // Vista de área
  CITY: 12,      // Vista de ciudad
  REGION: 8      // Vista de región
};

/**
 * Configuración de geocodificación
 */
export const GEOCODING_CONFIG = {
  debounceDelay: 500, // ms
  maxRetries: 3,
  retryDelay: 1000 // ms
};

