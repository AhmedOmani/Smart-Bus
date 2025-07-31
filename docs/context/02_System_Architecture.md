# 02: System Architecture & Technical Decisions

This document outlines the high-level architecture and the key technical decisions made for the project.

## Core Architecture: PWA with a Monolithic Backend

The system is designed as a **Progressive Web App (PWA)**. This choice provides a native-app-like experience (installable, offline capabilities) without the complexities of app store submissions, making it ideal for rapid development and deployment across all devices.

The backend is a **monolithic Node.js application** that serves a RESTful API to the frontend.

## Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React (Vite), MUI, Axios | A modern, efficient, and component-based stack for building a beautiful and responsive UI. MUI provides a professional component library with excellent RTL support. |
| **Backend** | Node.js, Express.js | A mature and performant environment for building the API server. |
| **Database** | PostgreSQL | A powerful, open-source relational database known for its reliability and data integrity. |
| **ORM** | Prisma | A next-generation ORM that provides type-safety, auto-completion, and simplifies database interactions immensely. |
| **Validation** | Zod | A TypeScript-first schema declaration and validation library, used to ensure all API inputs are correct and secure. |
| **Real-Time**| WebSockets | Chosen for the core bus tracking feature to provide efficient, low-latency, bidirectional communication between the server and clients. |

## Key Architectural Decisions & Patterns

- **Polymorphic Users:** We explicitly chose *not* to use a single, wide `User` table. Instead, a core `User` table handles authentication, while separate `Parent` and `Supervisor` tables store role-specific data. This is a crucial decision for long-term maintainability and scalability.
- **Repository Pattern:** The backend data-access layer is abstracted into repositories (e.g., `user.repository.js`). This separates business logic in the controllers from the database interaction logic, making the code cleaner and easier to test.
- **Database Migrations:** All database schema changes are managed by `prisma migrate`. We have established a professional workflow for handling migrations in production, using a two-phase "Expand-and-Contract" strategy to add required columns without data loss.
- **Internal vs. Business IDs:** We use auto-generated UUIDs as the internal, immutable primary keys for all database relationships. Sensitive, real-world identifiers like `nationalId` are stored as separate, unique fields for business logic but are not used as primary keys.
- **Internationalization (i18n):** The system is designed to be bilingual (English/Arabic). Backend validation schemas have been explicitly updated to support Unicode characters for names. The frontend uses MUI's RTL capabilities.

## Diagrams

- **[Real-Time Tracking Architecture](../diagrams/01_Real_Time_Tracking_Architecture.md)**
- **[Database Architecture (ERD)](../diagrams/05_Database_Entity_Relationship_Diagram.md)**
- **[Create User Transaction Flow](../diagrams/04_Create_User_Transaction_Flow.md)** 