# Smart Bus API Documentation

This document provides a comprehensive overview of the backend API for the Smart Bus system. It includes details on authentication, error handling, available endpoints, and real-time communication via WebSockets.

## 1. General Information

- **Base URL**: All API endpoints are prefixed with `http://localhost:3001/api/v1`.
- **Authentication**: The API uses JSON Web Tokens (JWT) for authentication. After a successful login, a token is provided. This token must be included in the `Authorization` header for all protected requests.
  - **Header Format**: `Authorization: Bearer <YOUR_JWT_TOKEN>`

## 2. Standard Response & Error Format

### Successful Response

All successful responses follow a standard format with a `2xx` status code.

```json
{
  "success": true,
  "data": {
    // ... response-specific data
  },
  "message": "Operation completed successfully"
}
```

### Error Response

All error responses follow a standard format with a `4xx` or `5xx` status code.

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message.",
    "details": [
      {
        "field": "fieldName",
        "message": "Specific error for this field."
      }
    ]
  }
}
```

**Common Error Codes:**
- `BAD_REQUEST`: The request was malformed.
- `UNAUTHORIZED`: Authentication failed or token is missing/invalid.
- `FORBIDDEN`: The authenticated user does not have permission to perform this action.
- `NOT_FOUND`: The requested resource could not be found.
- `CONFLICT`: A resource conflict occurred (e.g., creating a user with a duplicate `nationalId`). The error message will contain the conflicting field.
- `VALIDATION_ERROR`: The request body or query parameters failed validation. The `details` array will be populated with field-specific errors.
- `INTERNAL_SERVER_ERROR`: An unexpected server error occurred.

---

## 3. API Endpoints

### 3.1. Authentication (`/auth`)

#### **POST** `/auth/login`
- **Description**: Authenticates a user and returns a JWT.
- **Authorization**: Public.
- **Request Body**:
  ```json
  {
    "username": "String (Required)",
    "password": "String (Required)"
  }
  ```
- **Validation Rules**:
  - `username`: Must be a string, 3-50 characters.
  - `password`: Must be a string, 8-100 characters.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "your_jwt_token_string",
      "user": {
        "id": "user_id",
        "name": "User Name",
        "username": "user_username",
        "role": "ADMIN" | "PARENT" | "SUPERVISOR",
        "nationalId": "user_national_id"
      }
    },
    "message": "Login successful"
  }
  ```

#### **POST** `/auth/logout`
- **Description**: Invalidates the user's current token by adding it to a blacklist.
- **Authorization**: `ADMIN`, `PARENT`, `SUPERVISOR`.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

#### **POST** `/auth/change-password`
- **Description**: Allows an authenticated user to change their password.
- **Authorization**: `ADMIN`, `PARENT`, `SUPERVISOR`.
- **Request Body**:
  ```json
  {
    "oldPassword": "String (Required)",
    "newPassword": "String (Required, min 8 chars)"
  }
  ```
- **Validation Rules**:
  - `currentPassword`: Must be a string, at least 8 characters.
  - `newPassword`: Must be a string, 8-100 characters, and contain at least one lowercase letter, one uppercase letter, and one number.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

---

### 3.2. Admin (`/admin`)

All endpoints under `/admin` require `ADMIN` role authorization.

#### **GET** `/admin/users`
- **Description**: Retrieves a list of all users. Can be filtered by role.
- **Query Parameters**:
  - `role`: `PARENT` | `SUPERVISOR` (Optional) - Filters users by the specified role.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": "user_id",
          "name": "User Name",
          "username": "user_username",
          "role": "...",
          "nationalId": "..."
        }
      ]
    },
    "message": "Users retrieved successfully"
  }
  ```

#### **GET** `/admin/users/search`
- **Description**: Searches for users by name or national ID, filtered by role. Used for `Autocomplete` fields.
- **Query Parameters**:
  - `role`: `PARENT` | `SUPERVISOR` (Required).
  - `q`: `String` (Required) - The search query.
- **Successful Response (200)**: Same structure as `GET /admin/users`.

#### **POST** `/admin/users`
- **Description**: Creates a new user (`PARENT` or `SUPERVISOR`).
- **Request Body**:
  ```json
  {
    "name": "String (Required)",
    "nationalId": "String (Required, Unique)",
    "role": "PARENT" | "SUPERVISOR" (Required)",
    "homeAddress": "String (Optional)",
    "homeLatitude": "Number (Optional)",
    "homeLongitude": "Number (Optional)"
  }
  ```
- **Validation Rules**:
  - `name`: Must be a string, 3-100 characters, containing only letters and spaces.
  - `nationalId`: Must be a string, 8-12 characters.
  - `email`: Must be a valid email format.
  - `phone`: Must be a valid phone number format (8-15 digits, optional country code).
  - `role`: Must be either `SUPERVISOR` or `PARENT`.
- **Successful Response (201)**: Returns the created user object and their temporary credentials.
  ```json
  {
    "success": true,
    "data": {
      "user": { /* ...full user object... */ },
      "credentials": {
        "username": "generated_username",
        "password": "generated_password"
      }
    },
    "message": "User created successfully"
  }
  ```

#### **PATCH** `/admin/users/:id`
- **Description**: Updates an existing user's details.
- **Request Body**: Same fields as `POST /admin/users`, all optional.
- **Successful Response (200)**: Returns the updated user object.

#### **DELETE** `/admin/users/:id`
- **Description**: Deletes a user.
- **Successful Response (200)**: Returns a confirmation message.

---

#### **GET** `/admin/students`
- **Description**: Retrieves a list of all students with their parent and bus information.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "students": [
        {
          "id": "student_id",
          "name": "Student Name",
          "nationalId": "...",
          "grade": "...",
          "homeAddress": "...",
          "homeLatitude": ...,
          "homeLongitude": ...,
          "createdAt": "...",
          "updatedAt": "...",
          "parentId": "...",
          "busId": "...",
          "parent": {
            "id": "parent_profile_id",
            "userId": "parent_user_id",
            "user": {
              "id": "parent_user_id",
              "name": "Parent Name",
              "nationalId": "..."
            }
          },
          "bus": {
            "id": "bus_id",
            "busNumber": "...",
            "licensePlate": "..."
          }
        }
      ]
    }
  }
  ```

#### **POST** `/admin/students`
- **Description**: Creates a new student.
- **Request Body**:
  ```json
  {
    "name": "String (Required)",
    "nationalId": "String (Required, Unique)",
    "grade": "String (Required)",
    "parentId": "String (Required, user ID of a PARENT)",
    "busId": "String (Optional, ID of a Bus)",
    "homeAddress": "String (Optional)",
    "homeLatitude": "Number (Optional)",
    "homeLongitude": "Number (Optional)"
  }
  ```
- **Validation Rules**:
  - `name`: Must be a string, 3-100 characters, containing only letters and spaces.
  - `nationalId`: Must be a non-empty string.
  - `grade`: Must be a non-empty string.
  - `parentId`: Must be a valid UUID.
  - `busId`: Must be a valid UUID. Can be `null`.
  - `homeAddress`, `homeLatitude`, `homeLongitude`: Optional and can be `null`.
- **Successful Response (201)**: Returns the created student object.

#### **PATCH** `/admin/students/:id`
- **Description**: Updates a student.
- **Request Body**: Same as `POST`, all fields optional. To unassign a bus, send `busId: null`.
- **Successful Response (200)**: Returns the updated student object.

#### **DELETE** `/admin/students/:id`
- **Description**: Deletes a student.
- **Successful Response (200)**: Returns a confirmation message.

---

#### **GET** `/admin/buses`
- **Description**: Retrieves a list of all buses.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "buses": [
        {
          "id": "bus_id",
          "busNumber": "String",
          "licensePlate": "String",
          "capacity": "Int",
          "model": "String",
          "year": "Int",
          "driverName": "String",
          "driverPhone": "String",
          "driverLicenseNumber": "String",
          "status": "ACTIVE" | "INACTIVE" | "MAINTENANCE",
          "supervisorId": "user_id_of_supervisor",
          "supervisor": {
             "id": "supervisor_user_id",
             "name": "Supervisor Name"
          }
        }
      ]
    }
  }
  ```

#### **POST** `/admin/buses`
- **Description**: Creates a new bus.
- **Request Body**:
  ```json
  {
    "busNumber": "String (Required)",
    "licensePlate": "String (Required, Unique)",
    "capacity": "Int (Required)",
    "model": "String (Required)",
    "year": "Int (Required)",
    "driverName": "String (Required)",
    "driverPhone": "String (Required)",
    "driverLicenseNumber": "String (Required, Unique)",
    "status": "ACTIVE" | "INACTIVE" | "MAINTENANCE" (Required)",
    "supervisorId": "String (Optional, user ID of a SUPERVISOR)"
  }
  ```
- **Validation Rules**:
  - `busNumber`: Must be a non-empty string.
  - `capacity`: Must be a positive integer.
  - `year`: Must be a positive integer. Can be `null`.
  - `supervisorId`: Must be a valid UUID. Can be `null`.
  - All other string fields are optional and can be `null`.
- **Successful Response (201)**: Returns the created bus object.

#### **PATCH** `/admin/buses/:id`
- **Description**: Updates a bus.
- **Request Body**: Same as `POST`, all fields optional. To unassign a supervisor, send `supervisorId: null`.
- **Successful Response (200)**: Returns the updated bus object.

#### **DELETE** `/admin/buses/:id`
- **Description**: Deletes a bus.
- **Successful Response (200)**: Returns a confirmation message.

---

### 3.3. Parent (`/parent`)

All endpoints under `/parent` require `PARENT` role authorization.

#### **GET** `/parent/my-bus`
- **Description**: Retrieves the bus information for the logged-in parent's child.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "bus": { /* ...bus object... */ }
    },
    "message": "Bus information retrieved successfully"
  }
  ```
- **Error Response (404)**: If the parent's child is not assigned to a bus.

---

### 3.4. Bus (`/bus`)

#### **POST** `/bus/location`
- **Description**: Saves the current location of a bus. This is intended to be called by the supervisor's device.
- **Authorization**: `SUPERVISOR`.
- **Request Body**:
  ```json
  {
    "latitude": "Number (Required)",
    "longitude": "Number (Required)"
  }
  ```
- **Validation Rules**:
  - `latitude`: Must be a number between -90 and 90.
  - `longitude`: Must be a number between -180 and 180.
- **Successful Response (200)**:
  ```json
  {
    "success": true,
    "message": "Location saved successfully"
  }
  ```
- **Note**: A successful call also triggers a WebSocket broadcast.

---

## 4. WebSocket (Real-time Communication)

- **Connection URL**: `ws://localhost:3001`
- **Purpose**: To broadcast real-time bus location updates to subscribed clients (Admins and Parents).

### Subscription

To receive location updates, a client must send a `SUBSCRIBE` message immediately after establishing the WebSocket connection.

**Message from Client to Server:**

```json
{
  "type": "SUBSCRIBE",
  "payload": {
    "token": "your_jwt_token_string"
  }
}
```

The server will decode the JWT to identify the user's role and associated bus (if applicable).
- An **ADMIN** will be subscribed to location updates for *all* buses.
- A **PARENT** will be automatically subscribed to the specific bus their child is on.
- A **SUPERVISOR** does not need to subscribe; their role is to send location data via the HTTP endpoint.

### Location Update Broadcast

When a supervisor sends a location update via `POST /bus/location`, the server broadcasts the new location to all relevant subscribed clients.

**Message from Server to Client:**

```json
{
  "type": "LOCATION_UPDATE",
  "payload": {
    "busId": "the_id_of_the_bus_that_moved",
    "latitude": 12.3456,
    "longitude": 78.9101,
    "timestamp": "ISO_8601_timestamp"
  }
}
``` 