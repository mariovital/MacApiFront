// /services/geocodeService.js - Servicio de geocodificación usando Google Maps Geocoding API

import { GOOGLE_MAPS_API_KEY, DEFAULT_GEOCODING_REGION, GEOCODING_CONFIG } from '../config/googleMapsConfig';

// Cache para evitar llamadas repetidas a la API
const geocodeCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Sanitiza una dirección eliminando caracteres problemáticos
 */
const sanitizeAddress = (address) => {
  if (!address) return '';
  return address
    .replace(/[\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Valida si una dirección es válida para geocodificar
 */
const isValidAddress = (address) => {
  const cleanAddress = sanitizeAddress(address);
  
  // Rechazar direcciones inválidas
  if (!cleanAddress || 
      cleanAddress === '—' || 
      cleanAddress.length < 5 ||
      /^[0-9\s\-,]+$/.test(cleanAddress)) { // Solo números y separadores
    return false;
  }
  
  return true;
};

/**
 * Geocodifica una dirección usando Google Maps Geocoding API
 */
const geocodeAddress = async (address) => {
  const cleanAddress = sanitizeAddress(address);
  
  if (!isValidAddress(cleanAddress)) {
    console.log('📍 Dirección inválida o vacía:', cleanAddress);
    return null;
  }

  // Verificar cache
  if (geocodeCache.has(cleanAddress)) {
    console.log('📍 Usando geocodificación en cache para:', cleanAddress);
    return geocodeCache.get(cleanAddress);
  }

  // Verificar API Key
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('❌ Google Maps API Key no configurada');
    return null;
  }

  try {
    console.log('📍 Geocodificando dirección:', cleanAddress);
    
    // Intentar geocodificar la dirección original
    let result = await callGoogleGeocodingAPI(cleanAddress);

    // Si falla, intentar agregando ", México"
    if (!result) {
      const addressWithCountry = `${cleanAddress}, México`;
      console.log('📍 Intentando con país agregado:', addressWithCountry);
      result = await callGoogleGeocodingAPI(addressWithCountry);
    }

    // Guardar en cache
    if (result) {
      // Limitar el tamaño del cache
      if (geocodeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = geocodeCache.keys().next().value;
        geocodeCache.delete(firstKey);
      }
      geocodeCache.set(cleanAddress, result);
      console.log('✅ Geocodificación exitosa:', result);
    } else {
      console.warn('⚠️ No se encontraron resultados para:', cleanAddress);
    }

    return result;
  } catch (error) {
    console.error('❌ Error en geocodificación:', error);
    return null;
  }
};

/**
 * Llama a la API de Google Maps Geocoding
 */
const callGoogleGeocodingAPI = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=${DEFAULT_GEOCODING_REGION}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ Error en respuesta de Google Maps API:', response.status);
      return null;
    }

    const data = await response.json();

    // Verificar el estado de la respuesta
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: result.formatted_address,
        place_id: result.place_id
      };
    } else if (data.status === 'ZERO_RESULTS') {
      console.log('📍 Sin resultados para la dirección');
      return null;
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('❌ Límite de consultas excedido');
      return null;
    } else if (data.status === 'REQUEST_DENIED') {
      console.error('❌ Solicitud denegada - Verificar API Key');
      return null;
    } else if (data.status === 'INVALID_REQUEST') {
      console.error('❌ Solicitud inválida');
      return null;
    }

    return null;
  } catch (error) {
    console.error('❌ Error llamando a Google Geocoding API:', error);
    return null;
  }
};

/**
 * Geocodifica una dirección con retry automático
 */
const geocodeAddressWithRetry = async (address, retries = GEOCODING_CONFIG.maxRetries) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await geocodeAddress(address);
      if (result) {
        return result;
      }
      
      // Esperar antes del siguiente intento
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, GEOCODING_CONFIG.retryDelay));
      }
    } catch (error) {
      console.error(`❌ Intento ${i + 1} fallido:`, error);
      if (i === retries - 1) {
        throw error;
      }
    }
  }
  return null;
};

/**
 * Limpia el cache de geocodificación
 */
const clearCache = () => {
  geocodeCache.clear();
  console.log('🗑️ Cache de geocodificación limpiado');
};

/**
 * Obtiene el tamaño actual del cache
 */
const getCacheSize = () => {
  return geocodeCache.size;
};

/**
 * Obtiene las estadísticas del cache
 */
const getCacheStats = () => {
  return {
    size: geocodeCache.size,
    maxSize: MAX_CACHE_SIZE,
    utilization: ((geocodeCache.size / MAX_CACHE_SIZE) * 100).toFixed(2) + '%',
    addresses: Array.from(geocodeCache.keys())
  };
};

const geocodeService = {
  geocodeAddress,
  geocodeAddressWithRetry,
  sanitizeAddress,
  isValidAddress,
  clearCache,
  getCacheSize,
  getCacheStats
};

export default geocodeService;
