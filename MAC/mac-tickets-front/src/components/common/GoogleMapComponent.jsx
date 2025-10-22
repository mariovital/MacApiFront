// src/components/common/GoogleMapComponent.jsx
// Componente de Google Maps optimizado y robusto

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { CircularProgress, Typography, Alert } from '@mui/material';
import { FiMapPin, FiAlertCircle } from 'react-icons/fi';
import geocodeService from '../../services/geocodeService';
import { 
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_MAP_OPTIONS,
  DEFAULT_CENTER,
  ZOOM_LEVELS
} from '../../config/googleMapsConfig';

/**
 * Componente de Google Maps para mostrar ubicación de tickets
 * 
 * @param {string} address - Dirección a mostrar
 * @param {string} height - Altura del mapa (default: '200px')
 * @param {string} width - Ancho del mapa (default: '100%')
 * @param {number} zoom - Nivel de zoom (default: 15)
 * @param {boolean} showLoadingState - Mostrar estado de carga
 * @param {string} className - Clases CSS adicionales
 * @param {Function} onCoordinatesChange - Callback con coordenadas obtenidas
 */
const GoogleMapComponent = ({ 
  address, 
  height = '200px', 
  width = '100%',
  zoom = ZOOM_LEVELS.STREET,
  showLoadingState = true,
  className = '',
  onCoordinatesChange = null
}) => {
  // Referencias
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  // Estados
  const [coordinates, setCoordinates] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);

  // Cargar Google Maps Script con useLoadScript
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    region: 'mx',
    language: 'es-MX'
  });

  // Estilos memoizados
  const mapContainerStyle = useMemo(() => ({
    width: width,
    height: height
  }), [width, height]);

  // Opciones del mapa memoizadas
  const mapOptions = useMemo(() => DEFAULT_MAP_OPTIONS, []);

  // Callback cuando el mapa se carga
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapInitialized(true);
    console.log('✅ Google Maps cargado correctamente');
  }, []);

  // Callback cuando el mapa se desmonta
  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
    markerRef.current = null;
    setMapInitialized(false);
    console.log('🗑️ Google Maps desmontado');
  }, []);

  // Geocodificar la dirección cuando cambie
  useEffect(() => {
    const geocodeAddressAsync = async () => {
      // Verificar que Google Maps esté cargado
      if (!isLoaded) {
        console.log('⏳ Esperando carga de Google Maps...');
        return;
      }

      // Verificar dirección válida
      if (!address || address === '—') {
        console.log('⚠️ Dirección vacía o inválida');
        setGeocodingError('No se proporcionó una dirección válida');
        setCoordinates(null);
        return;
      }

      setGeocoding(true);
      setGeocodingError(null);

      try {
        console.log('🔍 Geocodificando:', address);
        const result = await geocodeService.geocodeAddress(address);
        
        if (result) {
          console.log('✅ Coordenadas obtenidas:', result);
          setCoordinates({
            lat: result.lat,
            lng: result.lng
          });
          setGeocodingError(null);
          
          // Notificar al componente padre si hay callback
          if (onCoordinatesChange) {
            onCoordinatesChange(result);
          }

          // Centrar el mapa si está inicializado
          if (mapRef.current && result) {
            mapRef.current.panTo({ lat: result.lat, lng: result.lng });
            mapRef.current.setZoom(zoom);
          }
        } else {
          console.warn('❌ No se pudo geocodificar la dirección');
          setGeocodingError('No se pudo encontrar la ubicación. Verifica la dirección.');
          setCoordinates(null);
        }
      } catch (err) {
        console.error('❌ Error en geocodificación:', err);
        setGeocodingError('Error al buscar la ubicación');
        setCoordinates(null);
      } finally {
        setGeocoding(false);
      }
    };

    geocodeAddressAsync();
  }, [address, isLoaded, zoom, onCoordinatesChange]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, []);

  // Error al cargar Google Maps
  if (loadError) {
    console.error('❌ Error cargando Google Maps:', loadError);
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 ${className}`}
        style={{ height }}
      >
        <FiAlertCircle className="text-red-500 dark:text-red-400 mb-2" size={32} />
        <Typography variant="caption" className="text-red-600 dark:text-red-400 text-center px-4">
          Error al cargar Google Maps
        </Typography>
        <Typography variant="caption" className="text-red-500 dark:text-red-500 text-center px-4 mt-1">
          Verifica tu API key
        </Typography>
      </div>
    );
  }

  // Estado de carga inicial
  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <CircularProgress size={24} sx={{ color: '#3B82F6' }} />
          <Typography variant="caption" className="block mt-2 text-gray-600 dark:text-gray-400">
            Cargando Google Maps...
          </Typography>
        </div>
      </div>
    );
  }

  // Estado de geocodificación
  if (geocoding && showLoadingState) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <CircularProgress size={24} sx={{ color: '#3B82F6' }} />
          <Typography variant="caption" className="block mt-2 text-gray-600 dark:text-gray-400">
            Buscando ubicación...
          </Typography>
        </div>
      </div>
    );
  }

  // Estado de error de geocodificación
  if (geocodingError || !coordinates) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl ${className}`}
        style={{ height }}
      >
        <FiMapPin className="text-gray-400 dark:text-gray-500 mb-2" size={32} />
        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 text-center px-4">
          {geocodingError || 'No se pudo encontrar la ubicación'}
        </Typography>
        {address && (
          <Typography variant="caption" className="text-gray-400 dark:text-gray-500 text-center px-4 mt-1">
            Dirección: {address}
          </Typography>
        )}
      </div>
    );
  }

  // Mapa con coordenadas
  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates || DEFAULT_CENTER}
        zoom={zoom}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
      >
        {coordinates && (
          <Marker
            position={coordinates}
            animation={window.google?.maps?.Animation?.DROP}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              fillColor: '#E31E24',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 8
            }}
            onLoad={(marker) => {
              markerRef.current = marker;
            }}
          />
        )}
      </GoogleMap>
      
      {/* Información de dirección debajo del mapa (opcional) */}
      {coordinates && (
        <div className="bg-white dark:bg-gray-800 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2">
            <FiMapPin className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
              {address}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
