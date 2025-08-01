import { WebSocketServer } from "ws";

let wss;

export const initWebSocketServer = (server) => {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('A new client connected!');
        
        ws.on("message" , (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'SUBSCRIBE') {
                    if (data.busId) {
                        ws.busId = data.busId;
                        console.log(`Client subscribed to busId: ${ws.busId}`);
                    }
                    if (data.role === 'ADMIN') {
                        ws.isAdmin = true;
                        console.log('Admin client subscribed for all updates.');
                    }
                }
            } catch (error) {
                console.error('Failed to parse websocker client message or invalid message format:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client has disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log("WebSocket server initialized");
}; 

export const broadcastLocationUpdate = (locationData) => {
    if (!wss) {
        console.error("WebSocket server is not initialized.");
        return;
    }

    const message = JSON.stringify({
        type: 'LOCATION_UPDATE',
        payload: locationData
    });

    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            if (client.isAdmin || client.busId === locationData.busId) {
                client.send(message);
            }
        }
    });
}; 