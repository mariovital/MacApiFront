// /components/common/GoogleMapComponent.jsx - Componente de Google Maps

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { CircularProgress, Typography } from '@mui/material';
import { FiMapPin, FiAlertCircle } from 'react-icons/fi';
import geocodeService from '../../services/geocodeService';

const GoogleMapComponent = ({ 
  address, 
  height = '200px', 
  width = '100%',
  zoom = 15,
  showLoadingState = true,
  className = ''
}) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Configuración del mapa
  const mapContainerStyle = {
    width: width,
    height: height
  };

  // Centro por defecto (San José, Costa Rica)
  const defaultCenter = {
    lat: 9.9281,
    lng: -84.0907
  };

  const mapOptions = {
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

  // Geocodificar la dirección cuando cambie
  useEffect(() => {
    const geocodeAddressAsync = async () => {
      if (!address || address === '—') {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const result = await geocodeService.geocodeAddress(address);
        
        if (result) {
          setCoordinates({
            lat: result.lat,
            lng: result.lng
          });
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error en geocodificación:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddressAsync();
  }, [address]);

  // Estado de carga
  if (loading && showLoadingState) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <CircularProgress size={24} sx={{ color: '#3B82F6' }} />
          <Typography variant="caption" className="block mt-2 text-gray-600 dark:text-gray-400">
            Cargando mapa...
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
          No se pudo geocodificar la dirección
        </Typography>
      </div>
    );
  }

  // Mapa real
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates || defaultCenter}
          zoom={zoom}
          options={mapOptions}
        >
          {coordinates && (
            <Marker
              position={coordinates}
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                fillColor: '#E31E24',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 1.5,
                anchor: { x: 12, y: 24 }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;

