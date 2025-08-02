import { WebSocketServer } from "ws";
import parentRepository from "../repositories/parent.repository.js";
import { websocketAuth } from "../utils/websocket.util.js";

let wss;

const handleSubscription = async (ws, data) => {
    console.log('Processing subscription:', data, 'for user role:', ws.user.role);
    
    switch (ws.user.role) {
        case 'PARENT':
            if (!data.busId) {
                console.warn(`Parent ${ws.user.userId} tried to subscribe without busId`);
                ws.terminate();
                return;
            }
            const parentBus = await parentRepository.getBusForParent(ws.user.userId);
            if (parentBus && parentBus.id === data.busId) {
                ws.busId = data.busId;
                console.log(`Parent ${ws.user.userId} subscribed to bus ${ws.busId}`);
            } else {
                console.warn(`Auth failed: Parent ${ws.user.userId} tried to subscribe to unauthorized bus ${data.busId}`);
                ws.terminate();
            }
            break;
        case 'ADMIN':
            ws.isAdmin = true;
            console.log('Admin client subscribed for all updates.');
            break;
        case 'SUPERVISOR':
            // Supervisors can only subscribe to their own bus, which we can verify later
            // For now, we trust the client but could add a check against their assigned bus.
            ws.busId = data.busId;
            console.log(`Supervisor ${ws.user.userId} subscribed to bus ${ws.busId}`);
            break;
        default:
            console.warn(`Unhandled role ${ws.user.role} attempted to subscribe.`);
            ws.terminate();
    }
};

const handleMessage = async (ws, message) => {
    try {
        const data = JSON.parse(message);
        if (data.type === 'SUBSCRIBE') {
            await handleSubscription(ws, data);
        }
    } catch (error) {
        console.error('Failed to parse message or invalid message format:', error);
    }
};

const handleConnection = async (ws, req) => {
    try {
        const token = req.url.split('token=')[1];
        const user = websocketAuth(token);
        ws.user = user;

        console.log(`Client connected: user ${user.userId}, role ${user.role}`);

        ws.on("message", (message) => handleMessage(ws, message));
        ws.on('close', () => console.log(`Client ${user.userId} has disconnected`));
        ws.on('error', (error) => console.error(`WebSocket error for user ${user.userId}:`, error));

    } catch (error) {
        console.error('WebSocket connection error:', error.message);
        ws.close(1008, error.message);
    }
};


export const initWebSocketServer = (server) => {
    wss = new WebSocketServer({ server });
    wss.on('connection', handleConnection);
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
    console.log(message);
    
    wss.clients.forEach(client => {
        console.log(client.isAdmin, client.busId, locationData.busId);
        if (client.readyState === client.OPEN) {
            if (client.isAdmin || client.busId === locationData.busId) {
                client.send(message);
            }
        }
    });
}; 