# 6. Feature Backlog & User Stories

This document serves as the master feature backlog for the project, written in a JIRA-style format.

---

##  epic: 👨‍💼 Admin User Management
**As an Administrator, I want to manage all user accounts so that I have full control over who can access the system.**

### US-001: Create Parent Account
*   **As an:** Administrator
*   **I want to:** Create parent accounts with auto-generated credentials
*   **So that:** Parents can access the system to track their children.
*   **Acceptance Criteria:**
    *   Admin can enter parent information (name, email, phone).
    *   System auto-generates a unique username and a temporary password.
    *   Admin can retrieve the credentials to send to the parent.
*   **Status:** ✅ **Implemented**

### US-002: Create Supervisor Account
*   **As an:** Administrator
*   **I want to:** Create supervisor accounts with auto-generated credentials
*   **So that:** Supervisors can be assigned to buses and manage their routes.
*   **Acceptance Criteria:**
    *   Admin can enter supervisor information (name, email, phone).
    *   System auto-generates a unique username and a temporary password.
    *   Admin can retrieve the credentials to send to the supervisor.
*   **Status:** ✅ **Implemented**

### US-003: View All Users
*   **As an:** Administrator
*   **I want to:** View, search, and filter all user accounts
*   **So that:** I can effectively manage the system.
*   **Acceptance Criteria:**
    *   Admin can see a list of all users (Parents and Supervisors).
    *   Admin can search for users by name, email, or username.
    *   Admin can filter the list by user role (`PARENT`, `SUPERVISOR`).
*   **Status:** ✅ **Implemented**

### US-004: Update User Account
*   **As an:** Administrator
*   **I want to:** Update a user's information (e.g., name, email, phone)
*   **So that:** I can correct errors or reflect changes in user details.
*   **Status:** 📝 **Planned**

### US-005: Delete User Account
*   **As an:** Administrator
*   **I want to:** Permanently delete a user account
*   **So that:** I can remove users who are no longer part of the school community.
*   **Acceptance Criteria:**
    *   Admin can select a user to delete.
    *   A confirmation dialog is shown to prevent accidental deletion.
    *   Upon confirmation, the user record and all associated data are deleted.
    *   The deletion action is recorded in a private audit log.
*   **Status:** 📝 **Planned**

---

## epic: 🚌 Bus & Student Management
**As an Administrator, I want to manage buses and students so that the system's data is accurate and up-to-date.**

### US-006: Create Student Record
*   **As an:** Administrator
*   **I want to:** Create a new student profile
*   **So that:** I can add new students to the system.
*   **Acceptance Criteria:**
    *   Admin can enter the student's full name.
    *   Admin must assign the student to an existing Parent account.
    *   Admin must assign the student to an existing Bus.
    *   The system validates that the parent's other children are on the same bus.
    *   The system validates that the bus is not over capacity.
*   **Status:** 📝 **Planned**

### US-007: Create Bus Record
*   **As an:** Administrator
*   **I want to:** Create a new bus record
*   **So that:** I can add new buses to the school's fleet.
*   **Acceptance Criteria:**
    *   Admin can enter the bus name/number.
    *   Admin can set the bus's student capacity.
    *   Admin can optionally assign an existing Supervisor to the bus.
*   **Status:** 📝 **Planned**

### US-008: Manage Assignments
*   **As an:** Administrator
*   **I want to:** Change a student's bus or a bus's supervisor
*   **So that:** I can handle logistical changes.
*   **Status:** 📝 **Planned**

---

## epic: 📍 Real-Time Tracking & Attendance
**As a Supervisor and a Parent, I want to use real-time features to ensure student safety and provide peace of mind.**

### US-009: Supervisor Broadcasts Location
*   **As a:** Supervisor
*   **I want to:** Broadcast my phone's GPS location in real-time
*   **So that:** Parents of the students on my bus can see our location on a map.
*   **Acceptance Criteria:**
    *   The app sends location updates every 30-40 seconds.
    *   If the internet connection is lost, location data is queued and sent when reconnected.
*   **Status:** 📝 **Planned**

### US-010: Supervisor Manages Attendance
*   **As a:** Supervisor
*   **I want to:** Mark students as boarded, alighted, or absent
*   **So that:** Parents are notified of their child's status.
*   **Acceptance Criteria:**
    *   Supervisor can see a list of students assigned to their bus.
    *   Supervisor can update a student's status (`ON_BUS`, `AT_SCHOOL`, `ABSENT`, etc.).
    *   A status change triggers an immediate push notification to the parent.
*   **Status:** 📝 **Planned**

### US-011: Parent Views Map
*   **As a:** Parent
*   **I want to:** See my child's bus moving on a real-time map
*   **So that:** I know exactly where they are and when to expect them.
*   **Status:** 📝 **Planned**

### US-012: Parent Receives Proximity Alert
*   **As a:** Parent
*   **I want to:** Receive a notification when the bus is near my house
*   **So that:** I can be ready for pickup/drop-off without constantly checking the map.
*   **Acceptance Criteria:**
    *   Parent can set their home location on a map.
    *   System sends a push notification when the bus enters a predefined radius of that location.
*   **Status:** 📝 **Planned** 