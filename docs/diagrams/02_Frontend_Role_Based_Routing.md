# Frontend Role-Based Routing

This diagram shows the logic flow in the main `App.jsx` component. It details how the application checks for a logged-in user and their role in `localStorage` to correctly route them to the appropriate dashboard (Admin, Supervisor, or Parent).

```mermaid
graph TD
    A[User Opens App] --> B{User data in localStorage?};
    B -- No --> C[Show LoginPage];
    B -- Yes --> D{Read user role};
    D --> E{role === 'ADMIN' ?};
    E -- Yes --> F[Show AdminDashboard];
    E -- No --> G{role === 'SUPERVISOR' ?};
    G -- Yes --> H[Show SupervisorDashboard];
    G -- No --> I[Show ParentDashboard];
    C -- Login Success --> J[Store token & user data];
    J --> D;
``` 