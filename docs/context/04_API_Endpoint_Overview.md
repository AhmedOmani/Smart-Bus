# 04: API Endpoint Overview

This document provides a high-level map of the backend's REST API.

## Authentication (`/api/v1/auth`)

| Endpoint | Method | Purpose | Authentication |
| :--- | :--- | :--- | :--- |
| `/login` | `POST` | Authenticates a user and returns a JWT. | Public |
| `/logout`| `POST` | Invalidates the current user's JWT. | Required |
| `/me` | `GET` | Returns the profile of the currently logged-in user. | Required |
| `/change-password` | `POST` | Allows a logged-in user to change their password. | Required |

## Admin (`/api/v1/admin`)

All admin routes are protected and require the `ADMIN` role.

| Resource | Endpoints | Purpose |
| :--- | :--- | :--- |
| **Dashboard** | `GET /dashboard` | Provides aggregate statistics for the admin dashboard. |
| **Users** | `GET /users`, `GET /users/search`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` | Full CRUD operations for managing all users (Parents, Supervisors, Admins). |
| **Students** | `GET /students`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id` | Full CRUD operations for managing student records. |
| **Buses** | `GET /buses`, `POST /buses`, `PUT /buses/:id`, `DELETE /buses/:id` | Full CRUD operations for managing buses, including assigning supervisors. |
| **Supervisors** | `GET /supervisors` | Fetches all supervisor records with their associated users. |

## Parent (`/api/v1/parent`)

All parent routes are protected and require the `PARENT` role.

| Resource | Endpoints | Purpose |
| :--- | :--- | :--- |
| **Students** | `GET /students` | Fetches the list of students associated with the currently logged-in parent. |
| **Dashboard** | `GET /dashboard` | Fetches all data needed for the parent's main view (children, bus info, etc.). |
| **Home Location** | `PUT /home-location` | Updates the parent's home location for proximity-based notifications. |
| **FCM Token** | `PUT /fcm-token` | Updates the parent's Firebase Cloud Messaging token for push notifications. |
| **Profile** | `GET /profile` | Fetches the parent's profile information including home location and FCM token. |

## Supervisor (`/api/v1/supervisor`)

All supervisor routes are protected and require the `SUPERVISOR` role.

| Resource | Endpoints | Purpose |
| :--- | :--- | :--- |
| **My Bus** | `GET /my-bus` | Fetches the bus assigned to the currently logged-in supervisor. |
| **Home Location** | `PUT /home-location` | Updates the supervisor's home location. |
| **Profile** | `GET /profile` | Fetches the supervisor's profile information including home location. |

## Bus Tracking (`/api/v1/bus`)

All bus routes are protected and require authentication.

| Resource | Endpoints | Purpose |
| :--- | :--- | :--- |
| **Location** | `POST /location` | Updates the current bus location (used by supervisors). Requires `SUPERVISOR` role. |

## WebSocket Endpoints

| Endpoint | Purpose | Authentication |
| :--- | :--- | :--- |
| `ws://host:port?token=<jwt>` | Real-time bus location updates and messaging. | JWT Token Required |

### WebSocket Message Types

| Type | Purpose | Payload |
| :--- | :--- | :--- |
| `SUBSCRIBE` | Subscribe to bus location updates | `{ type: 'SUBSCRIBE', busId: string \| null }` |
| `LOCATION_UPDATE` | Real-time bus location broadcast | `{ type: 'LOCATION_UPDATE', payload: { busId, latitude, longitude, timestamp } }` |

## Enhanced Features

### 🏠 Home Location System
- **Parent**: `PUT /api/v1/parent/home-location` - Set home coordinates
- **Supervisor**: `PUT /api/v1/supervisor/home-location` - Set home coordinates
- Enables proximity-based notifications and route optimization

### 📱 Push Notifications
- **Parent**: `PUT /api/v1/parent/fcm-token` - Update FCM token
- Enables real-time notifications for bus arrival/departure
- Firebase Cloud Messaging integration

### 📊 Profile Management
- **Parent**: `GET /api/v1/parent/profile` - Get profile with home location and FCM token
- **Supervisor**: `GET /api/v1/supervisor/profile` - Get profile with home location
- Comprehensive user profile management

### 🚌 Real-Time Bus Tracking
- **WebSocket**: Real-time location broadcasting
- **Location API**: `POST /api/v1/bus/location` - Update bus location
- **Subscription System**: Role-based access to bus location updates
  - **Admin**: Can subscribe to all buses
  - **Parent**: Can subscribe to their child's bus only
  - **Supervisor**: Can subscribe to their assigned bus

## Authentication & Authorization

### Role-Based Access Control
- **ADMIN**: Full system access
- **SUPERVISOR**: Bus management and location updates
- **PARENT**: Student and bus tracking access

### JWT Token System
- Stateless authentication
- Role-based authorization
- Token blacklisting for logout
- WebSocket authentication via URL parameters

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []
  }
}
```

## Success Responses

All successful endpoints return:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
``` 