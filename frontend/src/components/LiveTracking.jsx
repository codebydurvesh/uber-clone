import React, { useEffect, useState, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SocketContext } from "../context/SocketContext.jsx";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom car icon for captain
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom user icon
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Destination marker icon
const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Component to update map bounds to fit all markers and route
const MapUpdater = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions && positions.length > 0) {
      const validPositions = positions.filter((p) => p && p[0] && p[1]);
      if (validPositions.length > 0) {
        const bounds = L.latLngBounds(validPositions);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [positions, map]);

  return null;
};

const LiveTracking = ({ userType, rideId, ride, onRouteInfo }) => {
  const { socket } = useContext(SocketContext);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [otherPosition, setOtherPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
  });
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);

  // Get coordinates from ride data
  useEffect(() => {
    console.log("Ride data received:", ride);
    if (ride?.destinationCoords?.lat && ride?.destinationCoords?.lng) {
      setDestinationCoords([
        ride.destinationCoords.lat,
        ride.destinationCoords.lng,
      ]);
      console.log("Destination coords set:", [
        ride.destinationCoords.lat,
        ride.destinationCoords.lng,
      ]);
    }
    if (ride?.pickupCoords?.lat && ride?.pickupCoords?.lng) {
      setPickupCoords([ride.pickupCoords.lat, ride.pickupCoords.lng]);
      console.log("Pickup coords set:", [
        ride.pickupCoords.lat,
        ride.pickupCoords.lng,
      ]);
    }
  }, [ride]);

  // Fetch route from OSRM
  const fetchRoute = async (start, end) => {
    try {
      console.log("Fetching route from:", start, "to:", end);
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      console.log("OSRM response:", data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // Convert GeoJSON coordinates to Leaflet format [lat, lng]
        const coords = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        setRouteCoordinates(coords);
        console.log("Route coordinates set:", coords.length, "points");

        // Calculate distance and duration
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.ceil(route.duration / 60);

        setRouteInfo({
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`,
        });

        if (onRouteInfo) {
          onRouteInfo({ distance: distanceKm, duration: durationMin });
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Get current location and watch for changes
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Default to a location if geolocation fails
        setCurrentPosition([19.076, 72.8777]); // Mumbai
      },
      { enableHighAccuracy: true }
    );

    // Watch position changes
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition([latitude, longitude]);

        // Send location update via socket
        if (socket && rideId) {
          socket.emit("update-location", {
            rideId,
            userType,
            location: {
              lat: latitude,
              lng: longitude,
            },
          });
        }
      },
      (error) => {
        console.error("Error watching location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, rideId, userType]);

  // Fetch route when current position or destination changes
  useEffect(() => {
    if (currentPosition && destinationCoords) {
      fetchRoute(currentPosition, destinationCoords);
    }
  }, [currentPosition, destinationCoords]);

  // Listen for other party's location updates
  useEffect(() => {
    if (socket) {
      socket.on("location-update", (data) => {
        if (data.rideId === rideId) {
          // Only update if it's from the other party
          if (
            (userType === "captain" && data.userType === "user") ||
            (userType === "user" && data.userType === "captain")
          ) {
            setOtherPosition([data.location.lat, data.location.lng]);
          }
        }
      });

      return () => {
        socket.off("location-update");
      };
    }
  }, [socket, rideId, userType]);

  if (!currentPosition) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  // Collect all positions for bounds calculation
  const allPositions = [currentPosition];
  if (destinationCoords) allPositions.push(destinationCoords);
  if (otherPosition) allPositions.push(otherPosition);

  return (
    <div className="relative h-full w-full">
      {/* Route Info Overlay */}
      {routeInfo.distance && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-lg font-bold text-gray-800">
                {routeInfo.distance}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500">ETA</p>
              <p className="text-lg font-bold text-green-600">
                {routeInfo.duration}
              </p>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={currentPosition}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater positions={allPositions} />

        {/* Route polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={5}
            opacity={0.8}
          />
        )}

        {/* Current user's marker */}
        <Marker
          position={currentPosition}
          icon={userType === "captain" ? carIcon : userIcon}
        >
          <Popup>
            {userType === "captain"
              ? "Your Location (Captain)"
              : "Your Location"}
          </Popup>
        </Marker>

        {/* Destination marker */}
        {destinationCoords && (
          <Marker position={destinationCoords} icon={destinationIcon}>
            <Popup>Destination: {ride?.destination || "Drop-off"}</Popup>
          </Marker>
        )}

        {/* Other party's marker */}
        {otherPosition && (
          <Marker
            position={otherPosition}
            icon={userType === "captain" ? userIcon : carIcon}
          >
            <Popup>
              {userType === "captain"
                ? "Passenger Location"
                : "Captain Location"}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
