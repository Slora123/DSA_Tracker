# Setup Instructions - DSA Tracker Pro

## Prerequisites
- Node.js installed
- No external database required (uses local JSON storage)

## Steps

### 1. Project Organization
The project is split into `client/` and `server/`.

### 2. Backend Setup
1. Go to the `server/` directory.
2. The environment variables are already set in `.env`.
3. Seed the database with sample data:
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   node index.js
   ```
   (Server runs on port 5001)

### 3. Frontend Setup
1. Go to the `client/` directory.
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the application in your browser (usually `http://localhost:5173`).

## Key Features
- **Smart Revision**: Revisions are scheduled strictly on weekends with automatic load balancing.
- **LeetCode Integration**: Search problems directly from the "Explore" tab.
- **Excel Export**: Download your progress from the "Problems" tab.
- **Premium Design**: Dark mode, glassmorphism, and smooth animations.
