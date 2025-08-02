import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// This is a common workaround for Leaflet's default icon to work correctly with bundlers like Vite.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapView = ({ locations }) => {
    const markers = useMemo(() => {
        if (!locations) return [];

        // Handle single location object (from ParentDashboard)
        if (locations.latitude && locations.longitude) {
            return [locations];
        }

        // Handle object of location objects (from AdminDashboard)
        if (typeof locations === 'object' && !Array.isArray(locations)) {
            return Object.values(locations).filter(loc => loc && loc.latitude && loc.longitude);
        }

        return [];
    }, [locations]);

    const defaultCenter = [23.5859, 58.3842]; // Default to Muscat, Oman

    const mapBounds = useMemo(() => {
        if (markers.length === 0) return null;
        const bounds = new L.LatLngBounds();
        markers.forEach(marker => {
            bounds.extend([marker.latitude, marker.longitude]);
        });
        return bounds;
    }, [markers]);

    return (
        <MapContainer
            center={defaultCenter}
            zoom={markers.length > 0 ? 13 : 9}
            bounds={mapBounds}
            style={{ height: '600px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map(loc => (
                <Marker key={loc.busId} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                        Bus ID: {loc.busId} <br />
                        Last updated: {new Date(loc.timestamp).toLocaleTimeString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView; 