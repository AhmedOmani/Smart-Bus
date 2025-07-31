# 00: Project Vision, Personas & Requirements

## Mission Statement

To design, build, and deploy a best-in-class, real-time "Smart Bus Tracking System" PWA for a private school. The system will provide peace of mind to parents, powerful administrative tools for staff, and a reliable interface for supervisors. The measure of success is a system that is not only functional but also a source of pride.

## The Problem

Parents often feel anxious about their children's commute to and from school. They lack real-time information on the bus's location, leading to uncertainty about pickup/drop-off times and potential delays. School administrators lack an efficient, centralized system to manage users, students, buses, and their complex relationships.

## The Solution

A progressive web application (PWA) that provides three distinct interfaces for the three core user personas, delivering a seamless and intuitive experience on both mobile and desktop devices.

## Key User Personas

| Persona | Role | Core Needs |
| :--- | :--- | :--- |
| **Admin** | School administrative staff | - A centralized dashboard to manage all users (parents, supervisors), students, and buses. <br> - Full CRUD (Create, Read,
Update, Delete) capabilities. <br> - Secure, role-based access control. |
| **Supervisor** | The teacher on the bus | - An ultra-reliable, easy-to-use interface to broadcast their bus's location in real-time. <br> - The ability to manage
student attendance (boarded, alighted, absent). <br> - Clear, persistent UI that works even when the app is backgrounded. |
| **Parent** | The student's guardian | - A live map to view the bus's current location. <br> - Real-time notifications for student status changes and bus
proximity. <br> - A simple view to see their children's information. |

## Core Functional Requirements

- **Admin:** Full CRUD for Users (Parents, Supervisors, Admins), Students, and Buses. Ability to assign students and supervisors to buses.
- **Parent:** Can only view data for their own children. Receives real-time updates.
- **Supervisor:** Can broadcast location and manage attendance for their assigned bus only.
- **Authentication:** All users must be authenticated via JWT, with role-based access control strictly enforced on the backend.
- **Data Integrity:** `nationalId` must be unique for all Users and Students.

## Core Non-Functional Requirements

- **Performance:** The system must support ~200 concurrent parents viewing the map during peak hours.
- **Security:** Passwords must be hashed with bcrypt. API endpoints must be protected by authentication and authorization middleware.
- **Reliability:** The supervisor's PWA must be highly reliable. See the [PWA Reliability Pledge](06_PWA_Reliability_Pledge.md) for details.
- **Usability:** The frontend must provide a "wow" experience, with a clean, responsive, RTL-first (Arabic) design and detailed, field-level validation feedback. 