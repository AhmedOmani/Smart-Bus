# 4. Database Schema

This document provides an overview of the data models used in the Smart Bus system. The definitive source of truth is the `db/prisma/schema.prisma` file.

## 4.1. Overview

The database is designed around four primary entities: **Users**, **Students**, **Buses**, and **Credentials**. A fifth model, **BlacklistedToken**, supports the authentication system.

## 4.2. Core Data Models

### a) `User`
This is the central model for any person who can log in to the system.
*   **Purpose:** Stores account information for Admins, Parents, and Supervisors.
*   **Key Fields:**
    *   `name`: The user's full name.
    *   `email`: The unique email address used for login.
    *   `role`: Defines the user's access level (`ADMIN`, `PARENT`, `SUPERVISOR`).
    *   `username`: A unique, system-generated username.
    *   `password`: The user's encrypted password.
*   **Relationships:**
    *   A `PARENT` user can have many `Student` records.
    *   A `SUPERVISOR` user can be assigned to many `Bus` records.

### b) `Student`
This model represents a child who rides the bus.
*   **Purpose:** To store student information and link them to their parent and their assigned bus.
*   **Key Fields:**
    *   `name`: The student's full name.
    *   `parentId`: A foreign key linking to the parent's `User` record.
    *   `busId`: A foreign key linking to the student's assigned `Bus`.
*   **Relationships:**
    *   Each student belongs to exactly one `User` (their parent).
    *   Each student is assigned to exactly one `Bus`.

### c) `Bus`
This model represents one of the school buses in the fleet.
*   **Purpose:** To store bus information, including its assigned supervisor and student riders.
*   **Key Fields:**
    *   `name`: A unique name or number for the bus (e.g., "Bus 7").
    *   `supervisorId`: A foreign key linking to the assigned supervisor's `User` record.
    *   `capacity`: The maximum number of students the bus can hold.
*   **Relationships:**
    *   Each bus can have one `User` (a supervisor) assigned to it.
    *   Each bus can have many `Student` records associated with it.

### d) `Credential`
This model is a temporary holding place for the initial login details of newly created users.
*   **Purpose:** To allow an administrator to retrieve the system-generated username and password to send to a new user.
*   **Key Fields:**
    *   `userId`: A foreign key linking to the `User` this credential belongs to.
    *   `username`: The plain-text generated username.
    *   `password`: The plain-text generated password.
*   **Security Note:** This table stores sensitive information and is a temporary solution for the initial project phase.

## 4.3. Supporting Models

### e) `BlacklistedToken`
*   **Purpose:** To support the logout functionality. When a user logs out, their JWT is added to this table. The authentication middleware checks against this table to ensure that a token cannot be reused after logout.
*   **Key Fields:**
    *   `token`: The JWT string that has been invalidated.
    *   `expiresAt`: A timestamp to know when it's safe to clean this record from the database. 