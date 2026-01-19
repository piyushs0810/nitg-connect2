# Setup Instructions

## Initial Setup

### 1. Install All Dependencies

First, install dependencies for root, frontend, and backend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root dependencies (concurrently)
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

### 2. Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
FIREBASE_WEB_API_KEY=your_firebase_web_api_key_here
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

Or use a file path:

```env
PORT=3000
FIREBASE_WEB_API_KEY=your_firebase_web_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account.json
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run the Development Servers

Once dependencies are installed, run both frontend and backend:

```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:8080

The frontend is configured to proxy API requests to the backend automatically.

### Running Separately

If you prefer to run them in separate terminals:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## Troubleshooting

### "Cannot find module" errors

Make sure you've run `npm run install:all` or installed dependencies in each directory.

### Backend won't start

1. Check that you have a `.env` file in the `backend/` directory
2. Verify your Firebase service account configuration
3. Check that port 3000 is not already in use

### Frontend won't connect to backend

1. Make sure the backend is running on port 3000
2. Check the `VITE_API_URL` in `frontend/.env`
3. Verify the proxy configuration in `frontend/vite.config.ts`

### Port already in use

If port 3000 (backend) or 8080 (frontend) is already in use, you can change them:

**Backend:** Update `PORT` in `backend/.env`
**Frontend:** Update `port` in `frontend/vite.config.ts`
