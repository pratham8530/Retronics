import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Circle, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const Heatmap = ({
  data,
  center: initialCenter,
  zoom,
  onRegionClick,
}: {
  data: { lat: number; lng: number; totalRequests: number; name: string; type?: string }[];
  center: { lat: number; lng: number };
  zoom: number;
  onRegionClick: (region: any) => void;
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["visualization", "geometry"], // Added "geometry" for distance calculations
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    if (map) {
      map.setCenter(initialCenter);
      map.setZoom(zoom);
    }
  }, [initialCenter, zoom, map]);

  // Determine circle color based on density (totalRequests)
  const getCircleColor = (totalRequests: number, maxRequests: number) => {
    const density = totalRequests / maxRequests;
    if (density > 0.75) return "#8B0000"; // Dark red
    if (density > 0.5) return "#FF4040"; // Medium red
    if (density > 0.25) return "#FF6666"; // Light red
    return "#FF9999"; // Very light red
  };

  // Calculate dynamic center and radius for a region based on its data points
  const calculateCircleParams = (regionData: { lat: number; lng: number }[], regionType?: string) => {
    if (regionData.length === 0) {
      return { center: initialCenter, radius: 1000 }; // Default to initial center and minimum radius
    }

    // Calculate centroid (average coordinates) for the region
    const latSum = regionData.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = regionData.reduce((sum, point) => sum + point.lng, 0);
    const center = {
      lat: latSum / regionData.length,
      lng: lngSum / regionData.length,
    };

    // Calculate maximum distance from centroid to any point using Geometry API
    let maxDistance = 0;
    if (window.google && window.google.maps && window.google.maps.geometry) {
      regionData.forEach(point => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(center.lat, center.lng),
          new google.maps.LatLng(point.lat, point.lng)
        );
        maxDistance = Math.max(maxDistance, distance);
      });
    } else {
      console.warn("Google Maps Geometry library not loaded. Using fallback radius.");
      // Fallback: Approximate radius based on latitude difference (1 degree ≈ 111 km)
      const latDiff = Math.max(...regionData.map(p => Math.abs(p.lat - center.lat))) * 111000;
      maxDistance = latDiff; // Rough estimate in meters
    }

    // Apply minimum radius based on region type
    const minRadius = regionType === "city" ? 20000 : regionType === "area" ? 5000 : 1000; // meters
    const radius = Math.max(maxDistance, minRadius); // Use the larger of calculated distance or minimum

    return { center, radius };
  };

  if (loadError) {
    return <div className="text-red-500">Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div className="text-gray-500">Loading map...</div>;
  }

  const maxRequests = Math.max(...data.map((d) => d.totalRequests || 1)); // Avoid division by zero

  return (
    <div className="relative rounded-lg border shadow-md overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={zoom}
        onLoad={handleMapLoad}
      >
        {data.some((point) => point.type === "user") ? (
          // Show markers for users
          data.map((point, index) =>
            point.type === "user" ? (
              <Marker
                key={index}
                position={{ lat: point.lat, lng: point.lng }}
                onClick={() => onRegionClick(point)}
              />
            ) : null
          )
        ) : (
          // Show circles based on density with dynamic center and radius
          data.map((region, index) => {
            // Use all data points for the same region name to calculate center and radius
            const regionData = data.filter(d => d.name === region.name).map(d => ({ lat: d.lat, lng: d.lng }));
            const { center, radius } = calculateCircleParams(regionData, region.type);

            return (
              <Circle
                key={index}
                center={center}
                radius={radius}
                options={{
                  fillColor: getCircleColor(region.totalRequests || 1, maxRequests),
                  fillOpacity: 0.5,
                  strokeColor: getCircleColor(region.totalRequests || 1, maxRequests),
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
                onClick={() => onRegionClick(region)}
              />
            );
          })
        )}
      </GoogleMap>
    </div>
  );
};

export default Heatmap;