import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const GoogleMapComponent = ({ directions, locations, center }) => {
  const mapRef = useRef();

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = undefined;
  }, []);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: 'AIzaSyDxhvfjHor2xF0lwqZx49NsenOl5TTwlBA' });
  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
      {locations.map((location, index) => (
        <Marker key={index} position={location} />
      ))}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default GoogleMapComponent;
