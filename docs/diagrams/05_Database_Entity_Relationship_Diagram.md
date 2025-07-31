# Database Entity-Relationship Diagram (ERD)

This diagram provides a comprehensive overview of the entire database schema. It illustrates every table, its key columns, and the relationships (one-to-one, one-to-many) between them.

```mermaid
erDiagram
    USER {
        string id PK "Primary Key (UUID)"
        string nationalId UK "Unique National ID"
        string name "Full Name"
        string email UK "Unique Email"
        UserRole role "ADMIN, PARENT, or SUPERVISOR"
        string username UK "Unique Username"
    }

    PARENT {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
    }

    SUPERVISOR {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
        string homeAddress "Nullable Address"
    }

    STUDENT {
        string id PK "Primary Key (UUID)"
        string nationalId UK "Unique National ID"
        string name "Full Name"
        string grade "e.g., Grade 5"
        string parentId FK "Foreign Key to Parent"
        string busId FK "Foreign Key to Bus (Nullable)"
    }

    BUS {
        string id PK "Primary Key (UUID)"
        string busNumber UK "Unique Bus Number"
        int capacity "Seat Capacity"
        string driverName "Nullable Driver Name"
        string supervisorId FK "Foreign Key to Supervisor (Nullable, UK)"
    }

    CREDENTIAL {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
        string username "Plain-text username"
        string password "Plain-text password (initial)"
    }
    
    BLACKLISTED_TOKEN {
        string id PK "Primary Key (UUID)"
        string token UK "JWT Token"
        datetime expiresAt "Token Expiry Time"
    }

    USER ||--o| PARENT : "has a"
    USER ||--o| SUPERVISOR : "has a"
    USER ||--o{ CREDENTIAL : "has"
    PARENT ||--o{ STUDENT : "is parent of"
    SUPERVISOR |o--|| BUS : "manages"
    BUS }o--o{ STUDENT : "transports"
``` 