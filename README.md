# Vehicle Search Assist

Vehicle Search Assist is a full-stack MERN application designed to help users identify and contact vehicle owners in real-life situations using a vehicle registration number.

The platform allows users to register, securely log in, search for vehicles using a vehicle number, and communicate with the respective owner through an integrated messaging system. The system is built to address practical scenarios such as parking conflicts, accidental vehicle damage, or urgent contact requirements.

---

## Problem Statement

In everyday situations, individuals may need to contact a vehicle owner but lack a direct communication channel. Whether it is a blocked parking space or accidental damage, identifying and reaching the correct vehicle owner can be challenging.

Vehicle Search Assist provides a structured and secure solution where registered users can search for a vehicle using its registration number and initiate communication with the owner through the platform.

---

## Features

- User registration with secure password hashing
- OTP-based email verification (demo implementation)
- Secure login authentication
- Search vehicle owner using vehicle registration number
- Real-time messaging between users
- Inbox system with unread message tracking
- Full-stack MERN architecture

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Fetch API
- Environment-based API configuration

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt for password hashing
- CORS enabled for cross-origin communication

### Database
- MongoDB Atlas (Cloud Database)

### Deployment
- Frontend deployed on Vercel
- Backend deployed on Render

---

## Architecture Overview

The application follows a standard MERN architecture:

1. The React frontend sends API requests to the Express backend.
2. The backend processes authentication, validation, and business logic.
3. MongoDB stores user data, vehicle information, and messages.
4. Responses are returned as structured JSON.
5. The frontend dynamically updates UI based on API responses.

Environment variables are used to configure the backend API URL for production deployment.

---

## Project Structure

```
Vehicle Search Assist/
│
├── backend/              # Express server, models, routes
├── frontend/             # React client application
└── README.md
```

---

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/vehicle-search-assist.git
cd Vehicle-Search-Assist
```

---

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs on:

```
http://localhost:3000
```

Create a `.env` file inside the backend directory:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

---

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside frontend:

```
VITE_API_URL=http://localhost:3000
```

---

## Production Configuration

For deployment:

- Backend deployed on Render
- Frontend deployed on Vercel

On Vercel, set:

```
VITE_API_URL=https://your-render-backend-url.onrender.com
```

Redeploy after setting environment variables.

---

## Key Functional Flow

1. User registers with email and vehicle details.
2. Password is securely hashed using bcrypt.
3. User logs in and receives authenticated access.
4. Vehicle search is performed using vehicle number.
5. If vehicle exists, owner details are retrieved.
6. Messaging system allows secure communication between users.
7. Inbox displays conversation list with unread indicators.

---

## Future Improvements

- JWT-based authentication
- Real OTP email integration
- Rate limiting for search requests
- Admin moderation panel
- Real-time messaging with WebSockets
- Improved UI/UX enhancements
- Production-grade validation and error handling

---

## License

This project is developed for educational and demonstration purposes.
