# VahanConnect

VahanConnect is a full-stack MERN application that lets registered users find and contact vehicle owners by plate number. Built for real situations like blocked parking, accidental damage, or emergency contact — without ever exposing personal details like phone numbers.

Live app: [vehicle-kappa-eight.vercel.app](https://vehicle-kappa-eight.vercel.app)

---

## Problem Statement

In everyday situations, people need to contact a vehicle owner but have no direct channel. VahanConnect provides a structured and secure solution: search a registration number, find the owner, message them in-app. No phone numbers, no personal data leakage.

---

## Features

- OTP-based email verification on registration (real email delivery via Nodemailer + Gmail SMTP)
- Secure password hashing with bcrypt (10 salt rounds, pre-save Mongoose hook)
- JWT authentication (7-day expiry, Bearer token pattern)
- Rate limiting: 10 auth attempts per 15 min, 30 general requests per minute
- Vehicle search by registration number with regex validation (`/^[A-Z0-9]{4,15}$/`)
- Owner details returned without exposing email or password
- In-app messaging: send, receive, read receipts (`seen` flag)
- Inbox with per-conversation unread indicators
- Live unread badge on dashboard (polled every 6 seconds)
- Optimistic UI in chat (messages appear instantly before server confirmation)
- SPA routing with React Router v6, guarded with `PrivateRoute` / `PublicRoute`
- Fully responsive dark-themed UI with custom CSS design tokens

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 7, React Router v6 |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose 9 |
| Auth | JWT (jsonwebtoken), bcrypt 6 |
| Email | Nodemailer 8, Gmail SMTP (Vercel serverless) |
| Rate limiting | express-rate-limit 7 |
| Frontend deploy | Vercel |
| Backend deploy | Render |

---

## Architecture Overview

```
Browser (React + Vite)
  │  Fetch API + Bearer JWT
  ▼
Express 5 (Render)
  ├── /auth    → send-otp, verify-otp, register, login
  ├── /vehicles → count (public), /:vehicleNumber [protected]
  └── /messages → send, /chat/:o/:me, /inbox/:id, /unread-count/:id [protected]
        │
        │  Mongoose ODM
        ▼
  MongoDB Atlas
  ├── users      (email, name, vehicleName, vehicleNumber, passwordHash)
  ├── messages   (sender ref, receiver ref, text, seen, timestamps)
  └── otpStore   (in-memory Map, TTL 5 min — not persisted to DB)

Email delivery (separate channel):
  Render backend → fetch → Vercel serverless /api/send-email.js
                                → Nodemailer → Gmail SMTP → user inbox
```

---

## Project Structure

```
VahanConnect/
├── backend/
│   ├── index.js                   # Express app, CORS, routes, DB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # sendOtp, verifyOtp, register, login
│   │   ├── vehicle.controller.js  # getVehicleByNumber
│   │   └── message.controller.js  # sendMessage, getConversation, getInbox, getUnreadCount
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── vehicle.routes.js
│   │   └── message.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT protect guard
│   │   ├── rateLimit.middleware.js # authLimiter + searchLimiter
│   │   └── error.middleware.js     # Mongoose validation, duplicate key, CastError
│   ├── models/
│   │   ├── User.js                 # Schema + bcrypt pre-save + comparePassword + toPublic
│   │   ├── Message.js              # Schema with compound index on sender/receiver/createdAt
│   │   └── otpStore.js             # In-memory Map with TTL (swap for Redis in production)
│   └── utils/
│       └── mailer.js               # fetch → VERCEL_MAIL_URL serverless function
├── frontend/
│   ├── api/
│   │   └── send-email.js           # Vercel serverless: Nodemailer + Gmail SMTP
│   ├── src/
│   │   ├── App.jsx                 # Router + PrivateRoute + PublicRoute
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing page with animated hero
│   │   │   ├── Register.jsx        # OTP request + verify
│   │   │   ├── Details.jsx         # Name, vehicle, password after OTP
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx       # Search + unread poll + profile dropdown
│   │   │   ├── View.jsx            # Search result (reads from localStorage)
│   │   │   ├── Chat.jsx            # Conversation view, 4s poll, optimistic UI
│   │   │   ├── Inbox.jsx           # Conversation list, 5s poll
│   │   │   └── NotFound.jsx
│   │   ├── components/
│   │   │   ├── CarAnimation.jsx    # SVG animated car on dashboard
│   │   │   ├── ChatAnimation.jsx   # Animated chat preview on dashboard
│   │   │   └── CaseIcon.jsx        # Inline SVG icons for use-case cards
│   │   ├── utils/
│   │   │   ├── api.js              # Fetch wrapper: injects Bearer token, handles 401
│   │   │   └── auth.js             # localStorage helpers: getUser, setUser, getToken, clearUser
│   │   ├── data/
│   │   │   └── homeData.js         # USE_CASES, STEPS, STACK, ABOUT_POINTS, STATS
│   │   ├── index.css               # Full design system: tokens, components, animations
│   │   └── main.jsx
│   ├── vercel.json                 # SPA rewrite: all paths → /
│   └── vite.config.js
└── README.md
```

---

## Key Implementation Details

### OTP Email — Two-Deployment Pattern

The backend (Render) does not call Gmail directly. Instead, `mailer.js` fetches `process.env.VERCEL_MAIL_URL`, which points to the Vercel frontend deployment's serverless function at `/api/send-email.js`. This keeps Gmail credentials (`MAIL_USER`, `MAIL_PASS`) isolated to Vercel's environment, not Render's.

### Password Security

`User.js` uses a Mongoose `pre("save")` hook. Passwords are only hashed when `this.isModified("password")` is true, preventing re-hashing on unrelated updates. The `comparePassword` method uses `bcrypt.compare` and is called directly on the user document.

### Auth Middleware

`protect` reads `Authorization: Bearer <token>`, verifies with `jwt.verify()`, and attaches `req.userId` to the request. Expired tokens return a "Session expired" message. The frontend's `api.js` catches any 401 on a protected route, clears localStorage, and redirects to `/`.

### Vehicle Search — Data Flow

`Dashboard.jsx` calls `api.getVehicle(vnum)` and stores the response in `localStorage.setItem("vehicleData", ...)`. `View.jsx` reads this back without making another API call. The view checks `vehicle.ownerId === me._id` to prevent users from messaging themselves.

### Messaging — Inbox Algorithm

`getInbox` fetches all messages involving the user, sorted newest-first. It iterates once and uses the first occurrence of each conversation partner as the preview entry (always the most recent message). It also tracks `hasUnread` if any unseen message exists from that person — a single pass, no extra queries.

### Chat — Optimistic Updates

Before the `sendMessage` API call resolves, `Chat.jsx` appends a temporary message object `{ _id: "tmp-${Date.now()}", ... }` to the local state. The input is cleared and refocused via `requestAnimationFrame` to avoid mobile keyboard dismissal. The real message arrives on the next 4-second poll.

### Rate Limiting

`authLimiter`: 10 requests per 15 minutes per IP — applied to all `/auth` routes.  
`searchLimiter`: 30 requests per minute — applied to `/vehicles` and `/messages`.

### Message Index

`Message.js` defines a compound index `{ sender: 1, receiver: 1, createdAt: -1 }` for fast conversation queries.

---

## Installation and Setup

### Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (or local MongoDB)
- Gmail account with an [App Password](https://support.google.com/accounts/answer/185833)

### Clone

```bash
git clone https://github.com/HMAjay/Vehicle-Search-Assist.git
cd Vehicle-Search-Assist
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
ALLOWED_ORIGIN=http://localhost:5173
VERCEL_MAIL_URL=http://localhost:5173/api/send-email
```

```bash
npm start          # production
npm run dev        # nodemon watch mode
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

For OTP email in local dev, you also need in Vercel's environment (or a `.env.local` for testing):

```
MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_gmail_app_password
```

```bash
npm run dev
```

---

## Production Deployment

### Render (Backend)

Set these environment variables in Render's dashboard:

```
MONGO_URI=...
JWT_SECRET=...
PORT=3000
ALLOWED_ORIGIN=https://your-vercel-app.vercel.app
VERCEL_MAIL_URL=https://your-vercel-app.vercel.app/api/send-email
```

### Vercel (Frontend)

Set these in Vercel's project settings:

```
VITE_API_URL=https://your-render-backend.onrender.com
MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_gmail_app_password
```

The `vercel.json` SPA rewrite is already configured — all routes resolve to the React app.

---

## API Reference

### Auth (no token required)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/auth/send-otp` | `{ email }` | Generate and email a 6-digit OTP |
| POST | `/auth/verify-otp` | `{ email, otp }` | Verify OTP (consumed on success) |
| POST | `/auth/register` | `{ email, name, vehicleName, vehicleNumber, password }` | Create account |
| POST | `/auth/login` | `{ email, password }` | Returns `{ token, user }` |

### Vehicles

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/vehicles/count` | None | Total registered users count |
| GET | `/vehicles/:vehicleNumber` | Required | Owner details for plate number |

### Messages

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/messages/send` | Required | `{ senderId, receiverId, text }` |
| GET | `/messages/chat/:otherUserId/:myUserId` | Required | Full conversation, marks messages seen |
| GET | `/messages/inbox/:userId` | Required | Deduplicated conversation list with unread flags |
| GET | `/messages/unread-count/:userId` | Required | Count of unseen messages |

---

## Potential Improvements

- Swap `otpStore` in-memory Map for Redis to survive server restarts
- WebSocket-based real-time messaging (currently polling-based)
- Refresh token mechanism (current JWT has no refresh)
- Admin moderation panel
- Production-grade input validation (e.g., zod)
- Vehicle number uniqueness check before OTP flow (avoid wasted emails)
- Pagination on inbox and conversation history

---

## License

Built for educational and demonstration purposes by [Ajay](https://github.com/HMAjay).
