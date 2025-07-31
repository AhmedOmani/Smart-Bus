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
| **Buses** | (Planned) | (Planned: CRUD for buses, assigning supervisors, etc.) |

## Parent (`/api/v1/parent`)

All parent routes are protected and require the `PARENT` role.

| Resource | Endpoints | Purpose |
| :--- | :--- | :--- |
| **Students** | `GET /students` | Fetches the list of students associated with the currently logged-in parent. |
| **Dashboard** | `GET /dashboard` | Fetches all data needed for the parent's main view (children, bus info, etc.). | 