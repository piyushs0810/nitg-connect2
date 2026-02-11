# NITG Connect

A full-stack application for NIT Goa students with separate frontend and backend.

## Project Structure

```
nitg_connect/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   └── routes/
│   └── package.json
└── package.json       # Root package.json for running both
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### ⚠️ Important: Install Dependencies First!

**Before running `npm run dev`, you MUST install dependencies in all directories:**

```bash
npm run install:all
```

This will install dependencies in:
- Root (concurrently for running both servers)
- Frontend (React, Vite, UI components, etc.)
- Backend (Express, Firebase Admin, etc.)

**If you skip this step, `npm run dev` will fail with "Cannot find module" errors!**

**Or install them separately:**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
FIREBASE_WEB_API_KEY=your_firebase_web_api_key
FIREBASE_SERVICE_ACCOUNT_KEY={your_service_account_json}
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=https://nitg-connect-backend.onrender.com/api
```

## Running the Application

### Development Mode

**After installing dependencies**, run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- **Backend**: https://nitg-connect-backend.onrender.com (Express API)
- **Frontend**: http://localhost:8080 (Vite dev server)

The frontend is automatically configured to proxy API requests to the backend.

**Or run them separately in different terminals:**

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Production Build

```bash
npm run build
```

This will build both frontend and backend.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Sign up new user
- `POST /api/auth/verify` - Verify authentication token

### Lost & Found
- `GET /api/lost-found` - Get all lost/found items
- `GET /api/lost-found/:id` - Get single item
- `POST /api/lost-found` - Create new item
- `PUT /api/lost-found/:id` - Update item
- `DELETE /api/lost-found/:id` - Delete item

### Notices
- `GET /api/notices` - Get all notices
- `GET /api/notices/:id` - Get single notice
- `POST /api/notices` - Create new notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Shadcn UI

### Backend
- Node.js
- Express.js
- TypeScript
- Firebase Admin SDK
- Firebase Firestore

## Notes

- The frontend now communicates with the backend API instead of directly accessing Firebase
- Authentication tokens are stored in localStorage
- The backend uses Firebase Admin SDK for server-side operations
- CORS is enabled for development (configure for production)
