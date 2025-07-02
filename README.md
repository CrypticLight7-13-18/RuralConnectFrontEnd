
# RuralConnect Frontend

## Deployed App :https://pharmaproject.netlify.app/

RuralConnect is a telemedicine platform connecting rural patients with healthcare professionals and services. This is the frontend (React) application.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Page Overview](#page-overview)
- [Services and Modules](#services-and-modules)
- [Error Handling](#error-handling)

---

## Overview
RuralConnect's frontend is a single-page application (SPA) built with React and Vite. It provides:
- Secure authentication for patients and doctors
- Real-time chat between patients and doctors
- Appointment management
- Medicine store and order history

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, Socket.io-client
- **State Management:** React hooks
- **Routing:** React Router

## Architecture
The frontend communicates with a Node.js/Express backend via REST APIs and Socket.io for real-time features. Authentication uses HttpOnly JWT cookies.

```
User <-> React Frontend <-> Node.js/Express Backend <-> MongoDB Atlas
```

## Getting Started
Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd RuralConnectFrontEnd
npm install
```

## Environment Variables
Create a `.env` file in the root:

```
VITE_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
VITE_BACKEND_URL=<your-backend-url>
```

## Running Locally

```bash
npm run dev
```
The app will be available at `http://localhost:5173` by default.

## Project Structure

```
src/
  components/
    Chat/
    doctor/
    Store/
    ui/
  pages/
    Auth.jsx
    Chat.jsx
    MyAppointments.jsx
    doctor/
    store/
  services/
    api.js
    auth.js
    chat.js
    appointments.js
    medicine.js
    order.js
  App.jsx
  main.jsx
```

## Authentication Flow
1. User logs in or signs up (role: patient/doctor)
2. Credentials sent to backend `/api/users/login` or `/signup`
3. Backend issues JWT as HttpOnly cookie
4. Frontend uses cookie for authentication (no token in localStorage)
5. Protected routes are enforced by backend

## Page Overview
- **Auth:** Login/Signup, role selection
- **Chat:** Real-time chat, message history, new chat creation (patients)
- **Appointments:**
  - Patients: Set/view appointments
  - Doctors: View assigned appointments only
- **Store:** Browse/order medicines (patients only)
- **Order History:** View past orders (patients only)
- **Navbar:** Dynamic links based on user role

## Services and Modules
- `services/auth.js`: Login, signup, logout, profile fetch
- `services/chat.js`: Chat creation, summaries, messages
- `services/appointments.js`: Appointment CRUD
- `services/medicine.js`: Medicine and order APIs
- `components/Chat/`: Chat UI components
- `pages/`: Page-level components for routing

## Error Handling
- All API errors return a standard format:
  ```json
  {
    "success": false,
    "message": "Error message",
    "error": "Stack or details"
  }
  ```
- Frontend displays error messages via alerts or UI banners

---

For backend API details, database schemas, and deployment, see the backend documentation.
