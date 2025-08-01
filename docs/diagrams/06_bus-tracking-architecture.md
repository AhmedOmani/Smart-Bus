graph TD
    subgraph Bus/Driver's Device
        A[GPS Sensor] --> B{Bus App/Device};
    end

    subgraph Backend Server
        C[API Endpoint<br/>POST /api/bus/location]
        D[WebSocket Server]
    end

    subgraph Parent's Phone
        E[Frontend App] --> F[Map Display];
        G[WebSocket Client] --> E;
    end

    B -- "1. Sends Lat/Lng every 5s" --> C;
    C -- "2. Receives location & saves it" --> D;
    D -- "3. Broadcasts new location" --> G;
    F -- "4. Renders updated bus position" --> F; 