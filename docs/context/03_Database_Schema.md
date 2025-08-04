# 03: Database Schema Overview

This document provides a high-level, human-readable overview of our database models. For the definitive schema, always refer to `db/prisma/schema.prisma`.

**[View the full Entity-Relationship Diagram](../diagrams/05_Database_Entity_Relationship_Diagram.md)**

## Core Models

| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **User** | The central authentication model. Every person who logs in has a User record. | `id` (PK), `nationalId` (UK), `email` (UK), `role`, `password` |
| **Parent** | Stores parent-specific data. Links a `User` record to `Student` records. | `id` (PK), `userId` (FK to User), `homeAddress`, `homeLatitude`, `homeLongitude`, `fcmToken` |
| **Supervisor**| Stores supervisor-specific data. Links a `User` record to a `Bus`. | `id` (PK), `userId` (FK to User), `homeAddress`, `homeLatitude`, `homeLongitude` |
| **Student** | Represents a student in the school. This is the core "asset" of the system. | `id` (PK), `nationalId` (UK), `name`, `grade`, `parentId` (FK), `busId` (FK) |
| **Bus** | Represents a school bus. | `id` (PK), `busNumber` (UK), `capacity`, `driverName`, `supervisorId` (FK) |

## Supporting Models

| Model | Purpose |
| :--- | :--- |
| **Credential** | Stores initial, plain-text credentials for the admin to deliver to new users. This is a known security trade-off for operational convenience. |
| **BlackListedToken** | Stores JWTs that have been invalidated (e.g., on logout) to ensure they cannot be reused before they expire. |

## New Features (Enhanced Smart Bus System)

### Location & Tracking
| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **LocationLog** | Stores real-time bus location data for tracking and history. | `id` (PK), `busId` (FK), `latitude`, `longitude`, `timestamp`, `tripId` (FK) |
| **Trip** | Represents a bus journey (morning pickup or afternoon return). | `id` (PK), `busId` (FK), `type` (MORNING/AFTERNOON), `status`, `startTime`, `endTime` |

### Communication & Notifications
| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **Message** | Enables in-app messaging between users (parents, supervisors, admin). | `id` (PK), `senderId` (FK), `receiverId` (FK), `content`, `type`, `isRead` |
| **ParentLocation** | Stores parent's home location for proximity-based notifications. | `id` (PK), `parentId` (FK), `latitude`, `longitude`, `address` |

### Student Management
| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **Absence** | Tracks student attendance and absence patterns. | `id` (PK), `studentId` (FK), `date`, `type` (MORNING), `reason` |
| **Permission** | Manages parent permissions for student pickup/drop-off. | `id` (PK), `studentId` (FK), `type` (ARRIVAL/EXIT), `status`, `date` |

## Key Relationships

### User Polymorphism
- **User** → **Parent** (1:1) - Every parent has a User record
- **User** → **Supervisor** (1:1) - Every supervisor has a User record
- **User** → **Message** (1:many) - Users can send/receive messages

### Student Relationships
- **Parent** → **Student** (1:many) - A parent can have multiple students
- **Student** → **Bus** (many:1) - Students are assigned to buses
- **Student** → **Absence** (1:many) - Track attendance history
- **Student** → **Permission** (1:many) - Track permission requests

### Bus Tracking
- **Bus** → **Supervisor** (1:1) - Each bus has one supervisor
- **Bus** → **LocationLog** (1:many) - Track bus location history
- **Bus** → **Trip** (1:many) - Track bus journeys
- **Trip** → **LocationLog** (1:many) - Track locations during trips

## Enhanced Features

### 🏠 Home Location System
- **Parent** and **Supervisor** models now include `homeAddress`, `homeLatitude`, `homeLongitude`
- Enables proximity-based notifications and route optimization

### 📱 Push Notifications
- **Parent** model includes `fcmToken` for Firebase Cloud Messaging
- Enables real-time notifications for bus arrival/departure

### 📊 Trip History
- **Trip** model tracks complete bus journeys
- **LocationLog** links to trips for historical analysis
- Supports morning pickup and afternoon return trips

### 💬 Communication System
- **Message** model enables in-app messaging
- Supports text, image, location, and system messages
- Tracks read status and message history

### 📋 Student Management
- **Absence** tracking for attendance management
- **Permission** system for parent pickup/drop-off requests
- Comprehensive student lifecycle management 