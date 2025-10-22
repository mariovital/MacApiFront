// /components/common/GoogleMapComponent.jsx - Componente optimizado de Google Maps

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { CircularProgress, Typography } from '@mui/material';
import { FiMapPin, FiAlertCircle } from 'react-icons/fi';
import geocodeService from '../../services/geocodeService';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  DEFAULT_MARKER_CONFIG,
  ZOOM_LEVELS
} from '../../config/googleMapsConfig';

const GoogleMapComponent = ({ 
  address, 
  height = '200px', 
  width = '100%',
  zoom = ZOOM_LEVELS.AREA,
  showLoadingState = true,
  className = ''
}) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Cargar script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly'
  });

  // Configuración del contenedor del mapa
  const mapContainerStyle = useMemo(() => ({
    width: width,
    height: height
  }), [width, height]);

  // Opciones del mapa memoizadas
  const mapOptions = useMemo(() => ({
    ...DEFAULT_MAP_OPTIONS,
    zoom: zoom
  }), [zoom]);

  // Configuración del marcador memoizada
  const markerOptions = useMemo(() => {
    if (typeof google !== 'undefined' && google.maps) {
      return {
        ...DEFAULT_MARKER_CONFIG,
        animation: google.maps.Animation.DROP
      };
    }
    return DEFAULT_MARKER_CONFIG;
  }, [isLoaded]);

  // Geocodificar la dirección cuando cambie
  useEffect(() => {
    const geocodeAddressAsync = async () => {
      if (!address || address === '—') {
        setError('Dirección no disponible');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('📍 Iniciando geocodificación para:', address);
        const result = await geocodeService.geocodeAddressWithRetry(address);
        
        if (result) {
          console.log('✅ Coordenadas obtenidas:', result);
          setCoordinates({
            lat: result.lat,
            lng: result.lng
          });
          setError(null);
        } else {
          console.warn('⚠️ No se pudieron obtener coordenadas');
          setError('No se pudo geocodificar la dirección');
        }
      } catch (err) {
        console.error('❌ Error en geocodificación:', err);
        setError('Error al obtener ubicación');
      } finally {
        setLoading(false);
      }
    };

    geocodeAddressAsync();
  }, [address]);

  // Limpiar referencias al desmontar
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, []);

  // Callback cuando el mapa se carga
  const onMapLoad = (map) => {
    mapRef.current = map;
    setMapInitialized(true);
    console.log('✅ Mapa de Google Maps cargado correctamente');
  };

  // Callback cuando el mapa se desmonta
  const onMapUnmount = () => {
    mapRef.current = null;
    setMapInitialized(false);
    console.log('🗑️ Mapa de Google Maps desmontado');
  };

  // Callback cuando el marcador se carga
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  // Error de carga del script
  if (loadError) {
    console.error('❌ Error cargando Google Maps:', loadError);
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 ${className}`}
        style={{ height }}
      >
        <FiAlertCircle className="text-red-500 dark:text-red-400 mb-2" size={32} />
        <Typography variant="caption" className="text-red-600 dark:text-red-400 text-center px-4">
          Error al cargar Google Maps
        </Typography>
        <Typography variant="caption" className="text-red-500 dark:text-red-500 text-center px-4 mt-1">
          Verifica la API Key
        </Typography>
      </div>
    );
  }

  // Estado de carga del script o geocodificación
  if (!isLoaded || (loading && showLoadingState)) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <CircularProgress size={24} sx={{ color: '#3B82F6' }} />
          <Typography variant="caption" className="block mt-2 text-gray-600 dark:text-gray-400">
            {!isLoaded ? 'Cargando Google Maps...' : 'Obteniendo ubicación...'}
          </Typography>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !coordinates) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl ${className}`}
        style={{ height }}
      >
        <FiAlertCircle className="text-gray-400 dark:text-gray-500 mb-2" size={32} />
        <Typography variant="caption" className="text-gray-500 dark:text-gray-400 text-center px-4">
          {error || 'No se pudo obtener la ubicación'}
        </Typography>
        <Typography variant="caption" className="text-gray-400 dark:text-gray-500 text-center px-4 mt-1">
          {address}
        </Typography>
      </div>
    );
  }

  // Mapa real con Google Maps
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
            icon={markerOptions.icon}
            animation={markerOptions.animation}
            onLoad={onMarkerLoad}
            title={address}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
