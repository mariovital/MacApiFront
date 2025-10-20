// /services/geocodeService.js - Servicio de geocodificación usando OpenStreetMap Nominatim

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
 * Geocodifica una dirección usando OpenStreetMap Nominatim API
 * Sigue la misma lógica que la app Android
 */
const geocodeAddress = async (address) => {
  const cleanAddress = sanitizeAddress(address);
  
  if (!cleanAddress || cleanAddress === '—') {
    return null;
  }

  // Verificar cache
  if (geocodeCache.has(cleanAddress)) {
    return geocodeCache.get(cleanAddress);
  }

  try {
    // Intentar geocodificar la dirección original
    let result = await callNominatimAPI(cleanAddress);

    // Si falla, intentar agregando ", México"
    if (!result) {
      const addressWithCountry = `${cleanAddress}, México`;
      result = await callNominatimAPI(addressWithCountry);
    }

    // Guardar en cache
    if (result) {
      // Limitar el tamaño del cache
      if (geocodeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = geocodeCache.keys().next().value;
        geocodeCache.delete(firstKey);
      }
      geocodeCache.set(cleanAddress, result);
    }

    return result;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return null;
  }
};

/**
 * Llama a la API de OpenStreetMap Nominatim
 * Misma API que usa la app Android
 */
const callNominatimAPI = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=0&countrycodes=mx`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'MAC-Tickets/1.0 (web-dashboard)',
        'Accept-Language': 'es-MX,es;q=0.9'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          lat,
          lng: lon,
          display_name: result.display_name
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error llamando a Nominatim API:', error);
    return null;
  }
};

/**
 * Limpia el cache de geocodificación
 */
const clearCache = () => {
  geocodeCache.clear();
};

/**
 * Obtiene el tamaño actual del cache
 */
const getCacheSize = () => {
  return geocodeCache.size;
};

const geocodeService = {
  geocodeAddress,
  sanitizeAddress,
  clearCache,
  getCacheSize
};

export default geocodeService;

