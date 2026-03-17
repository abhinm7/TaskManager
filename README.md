# Secure Task Management System

A production-ready Task Management application demonstrating clean architecture, bi-directional AES payload encryption, and secure JWT session management.

## Architecture Overview
This application utilizes a decoupled client-server architecture:
* **Frontend (Next.js App Router):** Manages UI state and leverages Edge Middleware for instantaneous, zero-flash protected routing. 
* **Backend (Node.js/Express):** Implements a strict Controller-Service-Middleware pattern.
* **Security Pipeline:** To fulfill advanced security requirements, an Axios Interceptor (Frontend) and an Express Middleware Pipeline (Backend) globally intercept all network traffic to encrypt/decrypt JSON payloads via `crypto-js` (AES-256) before they hit the controller/UI logic.
* **Authentication:** JWTs are issued via strict `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to mitigate XSS and CSRF vulnerabilities. Passwords are hashed via `bcrypt`.

## Live Links
* **Frontend URL:** `https://your-vercel-link.vercel.app`
* **Backend API Base:** `https://taskmanager-0m9q.onrender.com/api`

## Local Setup Instructions

### Prerequisites
* Node.js v18+
* MongoDB Atlas URI

### Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_connection_string
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret
   AES_SECRET=your_32_char_aes_secret


### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file:

Code snippet
```NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_AES_SECRET=your_32_char_aes_secret_matching_backend
```
4. `npm run dev`