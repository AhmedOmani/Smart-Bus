# Create User Transaction Flow

This sequence diagram details the backend process when an admin creates a new `PARENT` user. It shows the database transaction that ensures both the core `User` and the `Parent` profile are created together in a single, atomic operation.

```mermaid
sequenceDiagram
    participant Admin as Admin UI
    participant API as Backend API<br>(/admin/users)
    participant DB as Database Transaction

    Admin->>API: POST /admin/users<br>(role: PARENT, name: 'Ali')
    API->>DB: Begin Transaction
    DB->>DB: 1. Create User<br>INSERT INTO users (name, role) VALUES ('Ali', 'PARENT')
    DB-->>API: Return new user's ID
    API->>API: 2. Check Role<br>if (role === 'PARENT') -> true
    API->>DB: 3. Create Parent Profile<br>INSERT INTO parents (userId) VALUES (new_user_id)
    DB->>DB: 4. Create Credentials
    DB-->>API: All steps successful
    API->>DB: Commit Transaction
    API-->>Admin: Success! User 'Ali' created.
``` 