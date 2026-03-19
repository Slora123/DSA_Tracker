# Setup Instructions - DSA Tracker Pro

## Prerequisites
- Node.js installed
- PostgreSQL database (Neon DB URL in `.env`)

## Steps

### 1. Project Organization
The project is split into `client/` and `api/`.

### 2. Backend Setup
1. Stay in the root directory.
2. The environment variables are already set in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the database schema (creates `users` and `problems` tables):
   ```bash
   node api/init-db.js
   ```
5. Seed the database (optional, clears existing problems):
   ```bash
   node api/seed.js
   ```
6. Start the server (using nodemon for development):
   ```bash
   npm run dev
   ```
   (Server runs on port 5001)

### 3. Frontend Setup
1. Go to the `client/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Key Features
- **Smart Revision**: Revisions are scheduled strictly on weekends with automatic load balancing.
- **LeetCode Integration**: Search problems directly from the "Explore" tab.
- **Excel Export**: Download your progress from the "Problems" tab.
- **Premium Design**: Dark mode, glassmorphism, and smooth animations.
