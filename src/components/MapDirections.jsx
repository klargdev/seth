import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

export const MapDirections = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
    getUserLocation();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('program_schedule')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;

      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load location information.');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  const handleEventSelect = async (event) => {
    setSelectedEvent(event);

    if (!userLocation) return;

    const eventLocation = {
      lat: event.location_coords[0],
      lng: event.location_coords[1]
    };

    // Get directions from user location to event location
    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: userLocation,
        destination: eventLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResult(result);
    } catch (error) {
      console.error('Error getting directions:', error);
      setError('Failed to load directions.');
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading map...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const center = userLocation || (events[0]?.location_coords ? {
    lat: events[0].location_coords[0],
    lng: events[0].location_coords[1]
  } : { lat: 0, lng: 0 });

  return (
    <div className="map-container">
      <div className="locations-list">
        <h3>Event Locations</h3>
        {events.map(event => (
          <button
            key={event.id}
            className={`location-button ${selectedEvent?.id === event.id ? 'selected' : ''}`}
            onClick={() => handleEventSelect(event)}
          >
            <div className="location-info">
              <h4>{event.title}</h4>
              <p>{event.location}</p>
              <time>
                {new Date(event.event_date).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </button>
        ))}
      </div>

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: '/user-location.png',
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          )}

          {/* Event location markers */}
          {events.map(event => (
            <Marker
              key={event.id}
              position={{
                lat: event.location_coords[0],
                lng: event.location_coords[1]
              }}
              onClick={() => handleEventSelect(event)}
              animation={selectedEvent?.id === event.id ?
                window.google.maps.Animation.BOUNCE :
                null
              }
            />
          ))}

          {/* Directions route */}
          {directionsResult && (
            <DirectionsRenderer
              directions={directionsResult}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#4a6fa5',
                  strokeWeight: 5
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {selectedEvent && (
        <div className="selected-location-details">
          <h4>{selectedEvent.title}</h4>
          <p>{selectedEvent.location}</p>
          {selectedEvent.description && (
            <p className="description">{selectedEvent.description}</p>
          )}
          {directionsResult && (
            <div className="directions-info">
              <p>
                <strong>Travel Time: </strong>
                {directionsResult.routes[0].legs[0].duration.text}
              </p>
              <p>
                <strong>Distance: </strong>
                {directionsResult.routes[0].legs[0].distance.text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
