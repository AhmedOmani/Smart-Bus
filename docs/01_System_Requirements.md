# 2. System Requirements

This document outlines the confirmed functional and non-functional requirements for the Smart Bus Tracking System.

## 2.1. Functional Requirements

### 2.1.1. User & Access Management
*   **Admins:** The system will support 3-5 administrator accounts with equal permissions.
*   **Parents:** The system will support ~800 parent accounts. One account is shared per family.
*   **Supervisors:** The system will support a variable number of supervisor accounts.
*   **User Deletion:** When a student leaves the school, their associated parent and student records will be **permanently deleted**. An audit log will be maintained to track these deletions.

### 2.1.2. Business Logic & Rules
*   **Sibling-Bus Rule:** All children associated with a single parent account **must** be assigned to the same bus. The system will enforce this rule.
*   **Bus Capacity:** The system will strictly enforce bus capacity. A bus with a capacity of 20 can hold 1 supervisor and 19 students. An admin will be prevented from assigning more students than the capacity allows.
*   **GPS Data Source:** The bus's location is provided by the phone of the assigned **Supervisor**, not the driver.

### 2.1.3. Core System Features
*   **Student Status:** A student can have one of the following statuses, which a Supervisor sets:
    *   `AT_HOME`
    *   `ON_BUS`
    *   `AT_SCHOOL`
    *   `ABSENT`
*   **Real-time Notifications:** Parents will receive immediate push notifications whenever their child's status changes.
*   **Geofenced "Near Home" Alerts:** Parents will receive a push notification when their child's bus enters a predefined radius of their set home location.
*   **Parent-Supervisor Communication:** The parent-facing app will feature a "Click to Chat" button that opens a WhatsApp conversation with the bus supervisor.
*   **End-of-Day Failsafe:** The system will run an automated check at a predefined time (e.g., 6:00 PM). If any student is still marked as `ON_BUS`, a high-priority alert will be sent to all administrators and the specific parent(s).

## 2.2. Non-Functional Requirements

### 2.2.1. Performance & Scalability
*   **Concurrent Users:** The system must be architected to handle **100-200 concurrent parents** actively viewing the real-time map during peak hours.
*   **Geofencing Interval:** The check for the "Near Home" alert can run at a relaxed interval of **30-40 seconds** to conserve server resources.

### 2.2.2. Security
*   **Authentication:** The system uses JWT for secure, stateless session management.
*   **Initial Credential Handling:** For the initial release, a `Credential` table will be used to store generated passwords for admin retrieval, as per the original project specification. A future enhancement will be to replace this with a one-time-use secure link.
*   **Audit Trail:** A private audit log will be maintained for critical actions, specifically the permanent deletion of user accounts.

### 2.2.3. User Experience & Reliability
*   **Platform:** The primary frontend will be a **Progressive Web App (PWA)** to ensure cross-platform compatibility and avoid app store complexities.
*   **Offline Support (Supervisor):** The supervisor's PWA must support offline functionality. When an internet connection is lost, the device will continue to gather GPS coordinates. Upon reconnection, it will send the entire batch of offline location points to the backend to provide a complete travel history. 