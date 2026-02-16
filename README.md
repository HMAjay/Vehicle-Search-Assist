# Vehicle Search Assist

Vehicle Search Assist is a full-stack MERN application designed to help users identify and contact vehicle owners in real-life situations using a vehicle registration number.

The platform allows users to register, log in, search for vehicles using a vehicle number, and connect with the respective owner when necessary. It is designed to address real-world scenarios such as parking conflicts, minor accidents, or situations where contacting a vehicle owner becomes necessary.

---

## Problem Statement

In everyday situations, people may need to contact a vehicle owner but have no direct method of communication. Whether it is a blocked parking space or accidental damage, identifying the correct vehicle owner can be challenging.

Vehicle Search Assist provides a structured platform where registered users can search for a vehicle using its registration number and access the relevant owner details stored in the system.

---

## Features

- User registration system
- User login authentication
- Search vehicles using vehicle registration number
- View vehicle and owner details (as stored in database)
- Contact vehicle owner through the platform
- Full-stack implementation using MERN architecture

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## Architecture Overview

The application follows the MERN architecture:

1. The frontend sends search and authentication requests to the backend.
2. The backend processes the request and interacts with MongoDB.
3. Data is returned in JSON format.
4. The frontend renders search results dynamically.

This separation of concerns ensures clean code organization and scalability.

---

## Project Structure

```
Vehicle Search Assist/
│
├── backend/              # Express server, routes, controllers
├── frontend-react/       # React client application
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

The backend server will run on the configured port (for example: http://localhost:5000).

---

### Frontend Setup

Open a new terminal:

```bash
cd frontend-react
npm install
npm run dev
```

The frontend development server will start locally.

---

## Environment Variables

Create a `.env` file inside the backend directory and configure:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Make sure MongoDB is running locally or connected to a cloud database.

---

## Future Improvements

- Improved input validation
- Secure authentication enhancements
- Role-based access control
- Pagination for search results
- Production deployment setup
- Logging and monitoring

---

## License

This project is developed for educational and demonstration purposes.
