import { useState, useEffect, useRef } from 'react';

const getWebSocketURL = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    try {
        const url = new URL(apiUrl);
        const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProtocol}//${url.host}`;
    } catch (error) {
        // Fallback if URL parsing fails
        console.warn('Failed to parse VITE_API_URL, using localhost fallback');
        return 'ws://localhost:3001';
    }
};

export const useBusTracking = ({ busId, role }) => {
    const [location, setLocation] = useState(null); 
    const [locations, setLocations] = useState({}); 
    const [error, setError] = useState(null);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const socketRef = useRef(null);
    const locationIntervalRef = useRef(null);

    useEffect(() => {
        if (role === 'SUPERVISOR' || (!busId && role !== 'ADMIN')) {
            console.log('Skipping WebSocket connection for role:', role, 'busId:', busId);
            return;
        }

        const token = localStorage.getItem('admin_token');
        if (!token) {
            setError("Authentication token not found.");
            return;
        }

        try {
            const wsURL = `${getWebSocketURL()}?token=${token}`;
            console.log('Attempting to connect to WebSocket:', wsURL);
            socketRef.current = new WebSocket(wsURL);

            socketRef.current.onopen = () => {
                console.log('WebSocket connection opened successfully');
                setError(null); // Clear any previous errors
                const subscriptionMessage = {
                    type: 'SUBSCRIBE',
                    busId: role === 'ADMIN' ? null : busId,
                };
                console.log('Sending subscription message:', subscriptionMessage);
                socketRef.current.send(JSON.stringify(subscriptionMessage));
            };

            socketRef.current.onmessage = (event) => {
                console.log('Received WebSocket message:', event.data);
                try {
                    const message = JSON.parse(event.data);
                    console.log('Parsed message:', message);
                    if (message.type === 'LOCATION_UPDATE') {
                        const { payload } = message;
                        console.log('Location update received:', payload);
                        if (role === 'ADMIN') {
                            setLocations(prev => ({ ...prev, [payload.busId]: payload }));
                        } else if (payload.busId === busId) {
                            setLocation(payload);
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err, 'Raw message:', event.data);
                    setError('Failed to parse incoming message');
                }
            };

            socketRef.current.onerror = (err) => {
                console.error('WebSocket error event:', err);
                setError('WebSocket connection error.');
            };
            
            socketRef.current.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
                if (event.code !== 1000) { // 1000 is normal closure
                    setError(`WebSocket closed unexpectedly: ${event.code} - ${event.reason}`);
                }
            };

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setError('Failed to establish WebSocket connection.');
        }

        return () => {
            if (socketRef.current) {
                console.log('Cleaning up WebSocket connection');
                socketRef.current.close();
            }
        };
    }, [busId, role]);

    const startBroadcasting = () => {
        setIsBroadcasting(true);
        locationIntervalRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationData = { busId, latitude, longitude, timestamp: new Date().toISOString() };
                    console.log('Broadcasting location:', locationData);
                    setLocation(locationData); 
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setError('Failed to get location. Please enable location services.');
                },
                { enableHighAccuracy: true }
            );
        }, 5000);
    };

    const stopBroadcasting = () => {
        setIsBroadcasting(false);
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
        }
    };

    return { location, locations, error, isBroadcasting, startBroadcasting, stopBroadcasting };
}; 