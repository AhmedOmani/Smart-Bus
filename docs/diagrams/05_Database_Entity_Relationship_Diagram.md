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
        string password "Hashed Password"
        UserStatus status "ACTIVE or INACTIVE"
        datetime lastLoginAt "Last Login Timestamp"
        datetime lastLogoutAt "Last Logout Timestamp"
    }

    PARENT {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
        string homeAddress "Home Address"
        float homeLatitude "Home Latitude"
        float homeLongitude "Home Longitude"
        string fcmToken "Firebase Cloud Messaging Token"
    }

    SUPERVISOR {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
        string homeAddress "Home Address"
        float homeLatitude "Home Latitude"
        float homeLongitude "Home Longitude"
    }

    STUDENT {
        string id PK "Primary Key (UUID)"
        string nationalId UK "Unique National ID"
        string name "Full Name"
        string grade "e.g., Grade 5"
        string homeAddress "Home Address"
        float homeLatitude "Home Latitude"
        float homeLongitude "Home Longitude"
        string parentId FK "Foreign Key to Parent"
        string busId FK "Foreign Key to Bus (Nullable)"
        StudentStatus status "ACTIVE or INACTIVE"
    }

    BUS {
        string id PK "Primary Key (UUID)"
        string busNumber UK "Unique Bus Number"
        string licensePlate "License Plate"
        int capacity "Seat Capacity"
        string model "Bus Model"
        int year "Manufacturing Year"
        string driverName "Driver Name"
        string driverPhone "Driver Phone"
        string driverLicenseNumber "Driver License"
        BusStatus status "ACTIVE, INACTIVE, or MAINTENANCE"
        string supervisorId FK "Foreign Key to Supervisor (Nullable, UK)"
    }

    LOCATION_LOG {
        string id PK "Primary Key (UUID)"
        string busId FK "Foreign Key to Bus"
        float latitude "GPS Latitude"
        float longitude "GPS Longitude"
        datetime timestamp "Location Timestamp"
        string tripId FK "Foreign Key to Trip (Nullable)"
    }

    TRIP {
        string id PK "Primary Key (UUID)"
        string busId FK "Foreign Key to Bus"
        TripType type "MORNING or AFTERNOON"
        TripStatus status "SCHEDULED, IN_PROGRESS, COMPLETED, or CANCELLED"
        datetime startTime "Trip Start Time"
        datetime endTime "Trip End Time"
    }

    MESSAGE {
        string id PK "Primary Key (UUID)"
        string senderId FK "Foreign Key to User (Sender)"
        string receiverId FK "Foreign Key to User (Receiver)"
        string content "Message Content"
        MessageType type "TEXT, IMAGE, LOCATION, or SYSTEM"
        boolean isRead "Message Read Status"
        datetime createdAt "Message Creation Time"
    }

    ABSENCE {
        string id PK "Primary Key (UUID)"
        string studentId FK "Foreign Key to Student"
        datetime date "Absence Date"
        AbsenceType type "MORNING"
        string reason "Absence Reason"
    }

    PERMISSION {
        string id PK "Primary Key (UUID)"
        string studentId FK "Foreign Key to Student"
        PermissionType type "ARRIVAL or EXIT"
        datetime date "Permission Date"
        string reason "Permission Reason"
        PermissionStatus status "PENDING, APPROVED, or REJECTED"
    }

    CREDENTIAL {
        string id PK "Primary Key (UUID)"
        string userId FK "Foreign Key to User"
        string username "Plain-text username"
        string password "Plain-text password (initial)"
        boolean isActive "Credential Active Status"
    }
    
    BLACKLISTED_TOKEN {
        string id PK "Primary Key (UUID)"
        string token UK "JWT Token"
        datetime expiresAt "Token Expiry Time"
        datetime createdAt "Token Blacklist Time"
    }

    %% Core User Relationships
    USER ||--o| PARENT : "has a"
    USER ||--o| SUPERVISOR : "has a"
    USER ||--o{ CREDENTIAL : "has"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ MESSAGE : "receives"

    %% Student Relationships
    PARENT ||--o{ STUDENT : "is parent of"
    STUDENT ||--o{ ABSENCE : "has"
    STUDENT ||--o{ PERMISSION : "has"

    %% Bus Relationships
    SUPERVISOR |o--|| BUS : "manages"
    BUS }o--o{ STUDENT : "transports"
    BUS ||--o{ LOCATION_LOG : "tracks"
    BUS ||--o{ TRIP : "makes"

    %% Location & Trip Relationships
    TRIP ||--o{ LOCATION_LOG : "contains"

    %% Authentication
    BLACKLISTED_TOKEN }o--|| USER : "belongs to"
```

## Key Features Represented

### 🏠 **Home Location System**
- **Parent** and **Supervisor** models include `homeAddress`, `homeLatitude`, `homeLongitude`
- Enables proximity-based notifications and route optimization

### 📱 **Push Notifications**
- **Parent** model includes `fcmToken` for Firebase Cloud Messaging
- Enables real-time notifications for bus arrival/departure

### 📊 **Trip History**
- **Trip** model tracks complete bus journeys (morning pickup, afternoon return)
- **LocationLog** links to trips for historical analysis
- Supports trip status tracking (scheduled, in-progress, completed, cancelled)

### 💬 **Communication System**
- **Message** model enables in-app messaging between users
- Supports different message types (text, image, location, system)
- Tracks read status and message history

### 📋 **Student Management**
- **Absence** tracking for attendance management
- **Permission** system for parent pickup/drop-off requests
- Comprehensive student lifecycle management

### 🚌 **Real-Time Tracking**
- **LocationLog** stores real-time bus location data
- **Bus** model includes comprehensive vehicle information
- **Supervisor** assignment for bus management

## Database Design Principles

### 🔐 **Security**
- **User** table centralizes authentication
- **BlackListedToken** ensures secure logout
- **Credential** stores initial passwords (temporary)

### 📈 **Scalability**
- UUID primary keys for distributed systems
- Proper indexing on frequently queried fields
- Normalized design with clear relationships

### 🔄 **Data Integrity**
- Foreign key constraints maintain referential integrity
- Enum types ensure data consistency
- Timestamps for audit trails

### 🎯 **Business Logic**
- **Polymorphic User System**: Single User table with role-specific profiles
- **Role-Based Access**: Clear separation between Admin, Supervisor, and Parent
- **Real-Time Capabilities**: WebSocket-ready data structure 