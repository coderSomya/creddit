# Creddit

Hello from Claude Code!

A Reddit clone built with the MERN stack.

## Prerequisites

- Node.js
- MongoDB (local or Atlas)

## Running the app

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Environment variables

Create `backend/.env` based on `.env.example`:

| Variable    | Description                        |
|-------------|------------------------------------|
| `PORT`      | Port for the Express server (5000) |
| `MONGO_URI` | MongoDB connection string          |
| `JWT_SECRET`| Secret key for JWT signing         |
