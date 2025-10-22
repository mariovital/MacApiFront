// src/config/googleMapsConfig.js
// Configuración centralizada para Google Maps

/**
 * Librerías de Google Maps a cargar
 */
export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'];

/**
 * Opciones por defecto para el mapa
 */
export const DEFAULT_MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  gestureHandling: 'cooperative',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

/**
 * Centro por defecto (México)
 * Cambia esto según la ubicación principal de tu empresa
 */
export const DEFAULT_CENTER = {
  lat: 19.4326, // Ciudad de México
  lng: -99.1332
};

/**
 * Configuración del marcador personalizado
 */
export const DEFAULT_MARKER_CONFIG = {
  animation: 2, // google.maps.Animation.DROP
  icon: {
    path: 0, // google.maps.SymbolPath.CIRCLE
    fillColor: '#E31E24', // Color rojo MAC
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 8
  }
};

/**
 * Región por defecto para geocodificación
 */
export const DEFAULT_GEOCODING_REGION = 'mx';

/**
 * Configuración de carga del script
 */
export const LOAD_SCRIPT_OPTIONS = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  libraries: GOOGLE_MAPS_LIBRARIES,
  region: DEFAULT_GEOCODING_REGION,
  language: 'es-MX'
};

/**
 * Valida si una dirección es suficientemente específica para geocodificar
 */
export const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  const trimmed = address.trim();
  
  // Rechazar direcciones muy cortas o genéricas
  if (trimmed.length < 5) return false;
  if (trimmed === '—' || trimmed === '-' || trimmed === 'N/A') return false;
  
  // Rechazar si solo contiene números o caracteres especiales
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed)) return false;
  
  return true;
};

/**
 * Sanitiza una dirección para geocodificación
 */
export const sanitizeAddress = (address) => {
  if (!address) return '';
  
  return address
    .replace(/[\n\r\t]/g, ' ') // Quitar saltos de línea
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
};

/**
 * Formatea una dirección para México
 */
export const formatAddressForMexico = (address) => {
  const sanitized = sanitizeAddress(address);
  
  if (!sanitized) return '';
  
  // Si no tiene "México" al final, agregarlo
  if (!sanitized.toLowerCase().includes('méxico') && !sanitized.toLowerCase().includes('mexico')) {
    return `${sanitized}, México`;
  }
  
  return sanitized;
};

/**
 * Configuración de debounce para geocodificación
 */
export const GEOCODING_DEBOUNCE_MS = 2000;

/**
 * Zoom levels para diferentes tipos de ubicaciones
 */
export const ZOOM_LEVELS = {
  STREET: 17,
  NEIGHBORHOOD: 15,
  CITY: 13,
  STATE: 10,
  COUNTRY: 6
};

export default {
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_MAP_OPTIONS,
  DEFAULT_CENTER,
  DEFAULT_MARKER_CONFIG,
  DEFAULT_GEOCODING_REGION,
  LOAD_SCRIPT_OPTIONS,
  isValidAddress,
  sanitizeAddress,
  formatAddressForMexico,
  GEOCODING_DEBOUNCE_MS,
  ZOOM_LEVELS
};

