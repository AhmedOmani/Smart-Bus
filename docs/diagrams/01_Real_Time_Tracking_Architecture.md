# Real-Time Tracking Architecture

This diagram illustrates the high-level data flow for the real-time bus tracking feature. It shows how the Supervisor's PWA communicates with the backend, which then broadcasts the location data to the Parent's PWA in real-time using WebSockets.

```mermaid
sequenceDiagram
    participant SupervisorPWA as Supervisor's PWA
    participant Backend as Node.js Backend
    participant ParentPWA as Parent's PWA

    SupervisorPWA->>Backend: 1. Connect WebSocket
    ParentPWA->>Backend: 2. Connect WebSocket & Subscribe to Bus ID

    loop Every 30 seconds
        SupervisorPWA->>Backend: 3. Send Location Update (lat, long)
        Backend->>ParentPWA: 4. Broadcast Location Update to Subscribers
    end
``` 