# Polymorphic User Database Architecture

This diagram illustrates our database schema for handling different user roles. It shows how a central `User` table handles authentication, while separate `Parent` and `Supervisor` profile tables store role-specific data, linked by a foreign key.

```mermaid
graph TD
    subgraph "Authentication Core"
        User("User Table<br>id, email, password, role")
    end

    subgraph "Role-Specific Data"
        ParentProfile("ParentProfile Table<br>id, userId (FK)")
        SupervisorProfile("SupervisorProfile Table<br>id, userId (FK), license_number")
        Student("Student Table<br>id, name, grade, parentUserId (FK), homeLatitude, homeLongitude")
    end

    User -- "1-to-1 (optional)" --> ParentProfile
    User -- "1-to-1 (optional)" --> SupervisorProfile
    
    User -- "1-to-many" --> Student
``` 