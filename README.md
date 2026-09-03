# Creddit

Hello from Claude Code!

hello world
hello from weilliptic
hello from weilliptic
hello from weilliptic


A Reddit clone built with the MERN stack.

## Product roadmap

See [Creddit Next Features](NEXT_FEATURES.md) for a discrete, one-feature-at-a-time roadmap.

## Architecture Overview

The following diagram illustrates the system architecture for Creddit, a MERN-based Reddit clone.

![Architecture Diagram](docs/assets/architecture.svg)

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

## Running tests

```bash
cd backend
npm test
```

Tests use Node's built-in `node:test` runner — no extra dependencies required. The test suite covers the similar-post matching algorithm (`backend/tests/similarity.test.js`).

## Environment variables

Create `backend/.env` based on `.env.example`:

| Variable    | Description                        |
|-------------|------------------------------------|
| `PORT`      | Port for the Express server (5000) |
| `MONGO_URI` | MongoDB connection string          |
| `JWT_SECRET`| Secret key for JWT signing         |
