// src/App.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLocation } from './locationSlice';

function App() {
  const dispatch = useDispatch();
  const location = useSelector(state => state.location);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchAddress(location.lat, location.lng);
    }
  }, [location.lat, location.lng]);

  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/get-location', {
        lat,
        lng
      });
      const address = response.data.results[0]?.formatted_address || 'No address found';
      dispatch(setLocation({ lat, lng, address }));
    } catch (err) {
      setError('Unable to fetch address');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({ lat: latitude, lng: longitude, address: '' }));
      }, (err) => {
        setError('Location permission denied');
      });
    }
  };

  const handleSearchManually = () => {
    const address = prompt('Enter your address:');
    if (address) {
      fetchAddressFromInput(address);
    }
  };

  const fetchAddressFromInput = async (address) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=your_google_maps_api_key_here`);
      const result = response.data.results[0];
      if (result) {
        const { lat, lng } = result.geometry.location;
        dispatch(setLocation({ lat, lng, address: result.formatted_address }));
      }
    } catch (err) {
      setError('Unable to fetch location from input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Delivery Location</h1>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}

      <div>
        <button onClick={handleLocationPermission}>Enable Location</button>
        <button onClick={handleSearchManually}>Search Manually</button>
      </div>

      {location.lat && location.lng && (
        <div>
          <h3>Selected Location</h3>
          <p>{location.address}</p>
          <button onClick={() => alert('Save this address')}>Save Address</button>
        </div>
      )}
    </div>
  );
}

export default App;
