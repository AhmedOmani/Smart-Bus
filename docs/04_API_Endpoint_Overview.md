# 5. API Endpoint Overview

This document provides a high-level overview of the API resources available in the backend. It is not a substitute for detailed API documentation (like Swagger) but serves as a quick reference map.

The base URL for all endpoints is `/api/v1`.

## 5.1. Authentication (`/auth`)
This resource handles all aspects of user authentication.
*   **`POST /auth/login`**: Authenticates a user with a username and password, returning a JWT.
*   **`POST /auth/logout`**: Invalidates the current user's JWT.
*   **`GET /auth/me`**: Retrieves the profile of the currently authenticated user.
*   **`POST /auth/change-password`**: Allows an authenticated user to change their own password.

## 5.2. Admin (`/admin`)
This resource is accessible only to users with the `ADMIN` role. It provides full control over the system's data.
*   **`GET /admin/dashboard`**: Retrieves aggregate statistics for the admin dashboard (e.g., total users, students, active buses).
*   **`GET /admin/users`**: Lists all users in the system, with support for filtering and searching.
*   **`POST /admin/users`**: Creates a new user (Parent or Supervisor).
*   **`PUT /admin/users/:id`**: Updates an existing user's information. _(Planned)_
*   **`DELETE /admin/users/:id`**: Deletes a user and their associated data. _(Planned)_
*   **`GET /admin/students`**: Lists all students. _(Planned)_
*   **`POST /admin/students`**: Creates a new student profile and assigns them to a parent and a bus. _(Planned)_
*   **`GET /admin/buses`**: Lists all buses. _(Planned)_
*   **`POST /admin/buses`**: Creates a new bus record. _(Planned)_
*   **`PUT /admin/buses/:id/supervisor`**: Assigns a supervisor to a bus. _(Planned)_

## 5.3. Supervisor (`/supervisor`)
This resource is accessible only to users with the `SUPERVISOR` role.
*   **`PUT /supervisor/bus/location`**: Allows a supervisor to update the real-time location of their assigned bus. _(Planned)_
*   **`POST /supervisor/attendance`**: Allows a supervisor to update a student's attendance status (e.g., boarded, alighted, absent). _(Planned)_

## 5.4. Parent (`/parent`)
This resource is accessible only to users with the `PARENT` role.
*   **`PUT /parent/home-location`**: Allows a parent to set or update their home location for proximity alerts. _(Planned)_ 