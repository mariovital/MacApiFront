// src/services/geocodeService.js
// Servicio de geocodificación usando Google Maps Geocoding API

import { 
  isValidAddress, 
  sanitizeAddress, 
  formatAddressForMexico,
  DEFAULT_GEOCODING_REGION 
} from '../config/googleMapsConfig';

// Cache para evitar llamadas repetidas a la API
const geocodeCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Geocodifica una dirección usando Google Maps Geocoding API
 * @param {string} address - Dirección a geocodificar
 * @returns {Promise<{lat: number, lng: number, formatted_address: string} | null>}
 */
const geocodeAddress = async (address) => {
  const cleanAddress = sanitizeAddress(address);
  
  // Validar dirección
  if (!isValidAddress(cleanAddress)) {
    console.warn('Dirección inválida o demasiado genérica:', address);
    return null;
  }

  // Verificar cache
  if (geocodeCache.has(cleanAddress)) {
    console.log('Usando dirección desde cache:', cleanAddress);
    return geocodeCache.get(cleanAddress);
  }

  try {
    // Formatear dirección para México
    const formattedAddress = formatAddressForMexico(cleanAddress);
    console.log('Geocodificando dirección:', formattedAddress);
    
    // Intentar geocodificar
    let result = await callGoogleGeocodingAPI(formattedAddress);

    // Si falla con formato México, intentar sin él
    if (!result && formattedAddress !== cleanAddress) {
      console.log('Reintentando sin formato México...');
      result = await callGoogleGeocodingAPI(cleanAddress);
    }

    // Guardar en cache si fue exitoso
    if (result) {
      // Limitar el tamaño del cache
      if (geocodeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = geocodeCache.keys().next().value;
        geocodeCache.delete(firstKey);
      }
      geocodeCache.set(cleanAddress, result);
      console.log('Geocodificación exitosa:', result);
    } else {
      console.warn('No se pudo geocodificar la dirección:', address);
    }

    return result;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return null;
  }
};

/**
 * Llama a Google Maps Geocoding API usando el objeto Geocoder
 * @param {string} address - Dirección a geocodificar
 * @returns {Promise<{lat: number, lng: number, formatted_address: string} | null>}
 */
const callGoogleGeocodingAPI = async (address) => {
  return new Promise((resolve) => {
    // Verificar que Google Maps esté cargado
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error('Google Maps API no está cargada');
      resolve(null);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      {
        address: address,
        region: DEFAULT_GEOCODING_REGION,
        language: 'es-MX'
      },
      (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          const location = result.geometry.location;
          
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formatted_address: result.formatted_address
          });
        } else {
          console.warn('Geocoding status:', status);
          resolve(null);
        }
      }
    );
  });
};

/**
 * Geocodifica una dirección con reintentos
 * @param {string} address - Dirección a geocodificar
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise<{lat: number, lng: number, formatted_address: string} | null>}
 */
const geocodeAddressWithRetry = async (address, maxRetries = 2) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await geocodeAddress(address);
      if (result) return result;
      
      // Esperar antes de reintentar
      if (i < maxRetries) {
        console.log(`Reintento ${i + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      console.error(`Error en intento ${i + 1}:`, error);
    }
  }
  
  return null;
};

/**
 * Obtiene coordenadas de múltiples direcciones en lote
 * @param {string[]} addresses - Array de direcciones
 * @returns {Promise<Array<{address: string, coordinates: object | null}>>}
 */
const geocodeBatch = async (addresses) => {
  const results = [];
  
  for (const address of addresses) {
    try {
      const coordinates = await geocodeAddress(address);
      results.push({ address, coordinates });
      
      // Pequeña pausa entre requests para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error en geocodificación batch:', error);
      results.push({ address, coordinates: null });
    }
  }
  
  return results;
};

/**
 * Limpia el cache de geocodificación
 */
const clearCache = () => {
  geocodeCache.clear();
  console.log('Cache de geocodificación limpiado');
};

/**
 * Obtiene el tamaño actual del cache
 */
const getCacheSize = () => {
  return geocodeCache.size;
};

/**
 * Obtiene estadísticas del cache
 */
const getCacheStats = () => {
  return {
    size: geocodeCache.size,
    maxSize: MAX_CACHE_SIZE,
    entries: Array.from(geocodeCache.keys())
  };
};

/**
 * Elimina una entrada específica del cache
 */
const removeCacheEntry = (address) => {
  const cleanAddress = sanitizeAddress(address);
  return geocodeCache.delete(cleanAddress);
};

const geocodeService = {
  geocodeAddress,
  geocodeAddressWithRetry,
  geocodeBatch,
  sanitizeAddress,
  isValidAddress,
  formatAddressForMexico,
  clearCache,
  getCacheSize,
  getCacheStats,
  removeCacheEntry
};

export default geocodeService;
