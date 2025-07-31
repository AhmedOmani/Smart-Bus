# 03: Database Schema Overview

This document provides a high-level, human-readable overview of our database models. For the definitive schema, always refer to `db/prisma/schema.prisma`.

**[View the full Entity-Relationship Diagram](../diagrams/05_Database_Entity_Relationship_Diagram.md)**

## Core Models

| Model | Purpose | Key Fields |
| :--- | :--- | :--- |
| **User** | The central authentication model. Every person who logs in has a User record. | `id` (PK), `nationalId` (UK), `email` (UK), `role`, `password` |
| **Parent** | Stores parent-specific data. Links a `User` record to `Student` records. | `id` (PK), `userId` (FK to User) |
| **Supervisor**| Stores supervisor-specific data. Links a `User` record to a `Bus`. | `id` (PK), `userId` (FK to User), `homeAddress` |
| **Student** | Represents a student in the school. This is the core "asset" of the system. | `id` (PK), `nationalId` (UK), `name`, `grade`, `parentId` (FK) |
| **Bus** | Represents a school bus. | `id` (PK), `busNumber` (UK), `capacity`, `driverName` |

## Supporting Models

| Model | Purpose |
| :--- | :--- |
| **Credential** | Stores initial, plain-text credentials for the admin to deliver to new users. This is a known security trade-off for operational convenience. |
| **BlackListedToken** | Stores JWTs that have been invalidated (e.g., on logout) to ensure they cannot be reused before they expire. | 