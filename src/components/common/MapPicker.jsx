// import React, { useState, useCallback } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const defaultCenter = {
//   lat: 25.2048, // Dubai's latitude
//   lng: 55.2708  // Dubai's longitude
// };

// const MapPicker = ({ onLocationSelect, initialLocation }) => {
//   const [marker, setMarker] = useState(initialLocation || defaultCenter);

//   const handleMapClick = useCallback((e) => {
//     const newLocation = {
//       lat: e.latLng.lat(),
//       lng: e.latLng.lng()
//     };
//     setMarker(newLocation);
//     onLocationSelect(newLocation);
//   }, [onLocationSelect]);

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyBsqJFvJbRA0kP8tCezzr47UwkNWFWi6zM">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={marker}
//         zoom={10}
//         onClick={handleMapClick}
//       >
//         {marker && <Marker position={marker} />}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MapPicker;
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 25.2048,
  lng: 55.2708
};

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [marker, setMarker] = useState(initialLocation || defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleMapClick = useCallback((e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(newLocation);
    onLocationSelect(newLocation);
  }, [onLocationSelect]);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMarker(newLocation);
        onLocationSelect(newLocation);
        setSearchValue(place.formatted_address);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBsqJFvJbRA0kP8tCezzr47UwkNWFWi6zM" libraries={['places']}>
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search for a location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full max-w-xs focus:outline-none focus:border-[#BEA355]"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker}
        zoom={10}
        onClick={handleMapClick}
      >
        <Marker 
          position={marker} 
          title="Selected Location"
          // onClick={() => {
          //   alert(`Marker clicked at: ${marker.lat}, ${marker.lng}`);
          // }}
          options={{
            scale: 1.5,
            clickable: true
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapPicker;