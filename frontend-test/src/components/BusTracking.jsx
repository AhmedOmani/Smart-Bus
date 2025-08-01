import React, { useState, useEffect } from 'react';

const BusTracking = ({ role, busId }) => {
    const [lastLocation, setLastLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setError(null);

            const subscriptionMessage = {
                type: 'SUBSCRIBE',
                role: role,
                busId: busId,
            };
            ws.send(JSON.stringify(subscriptionMessage));
            console.log('Subscription message sent:', subscriptionMessage);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'LOCATION_UPDATE') {
                    setLastLocation(message.payload);
                }
            } catch (err) {
                console.error('Failed to parse message:', err);
                setError('Received malformed data from server.');
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('WebSocket connection error. See console for details.');
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, [role, busId]); // Rerun effect if role or busId changes

    return (
        <div>
            <h2>Real-Time Bus Tracking</h2>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {lastLocation ? (
                <div>
                    <p><strong>Bus ID:</strong> {lastLocation.busId}</p>
                    <p><strong>Latitude:</strong> {lastLocation.latitude}</p>
                    <p><strong>Longitude:</strong> {lastLocation.longitude}</p>
                    <p><strong>Timestamp:</strong> {new Date(lastLocation.timestamp).toLocaleTimeString()}</p>
                </div>
            ) : (
                <p>Waiting for location data...</p>
            )}
        </div>
    );
};

export default BusTracking; 