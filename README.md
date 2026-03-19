<p align="center">
  <img src="client/public/favicon.svg" width="120" alt="DSA Tracker Logo" />
</p>

<h1 align="center">DSA Tracker</h1>

<p align="center">
  <b>Master Data Structures & Algorithms with Precision.</b><br />
  A premium, high-performance web application designed for focused learning, smart revision scheduling, and comprehensive problem tracking.
</p>

---

## 🚀 Key Features

### 📅 Intelligent Revision Ecosystem
- **Weekend-Optimized Scheduling**: Automatically aligns your revision workload with Saturdays and Sundays, keeping your weekdays clear for new learning.
- **Persistent Overdue Tracking**: Tasks not finished on the weekend carry over to weekdays automatically until they are "solved", ensuring zero knowledge rot.
- **Smart Load Balancing**: Intelligently distributes tasks between Saturday and Sunday to maintain a perfectly balanced workload.
- **Auto-Skip Logic**: Completing a revision automatically moves the next session to a future weekend cycle, preventing same-weekend repeats.

### ⏱️ Advanced Problem Logging
- **Multi-Day Solve Tracking**: Record your struggle and progress accurately by logging the same problem across multiple days.
- **Cumulative Solve History**: View every attempt at a glance with precise timestamps and duration metrics.
- **Dynamic Status Updates**: Problems move from "Solved" to "Revised" seamlessly within your personalized schedule.

### 🔍 Discovery & Resource Integration
- **Cheatsheet Integration**: Native support for the **NeetCode 150** problem set with instant search and category filtering.
- **AI-Powered Concept Mapping**: Explore related problems using an intelligent concept map that understands the underlying algorithms.
- **Real-time Search**: Blaze through your repository with high-performance filtering by name, tag, or difficulty.

### 📊 Focused UX/UI
- **Live Performance Dashboard**: Instantly view your current streak, pending revisions, and daily focus tasks.
- **Premium Aesthetics**: A stunning glassmorphism interface featuring smooth animations, dark mode, and a responsive layout.
- **One-Click Revisions**: Mark tasks as done directly from the calendar modal without leaving your workflow.

---

## 🛠️ Tech Stack

- **Core**: React 18, Node.js (Express), Vite.
- **Styling**: Tailwind CSS, Lucide Icons.
- **Architecture**: Scalable PostgreSQL persistence layer hosted on Vercel/Neon.
- **Optimization**: Production-ready serverless functions and static file serving.

---

## 🏗️ Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. **Clone & Install**:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. **Launch Dev Environment**:
   ```bash
   # Terminal 1 (API)
   cd server && npm run dev
   
   # Terminal 2 (UI)
   cd client && npm run dev
   ```

---

## 🌍 Deployment

### **Critical Deployment Requirement**
This app is designed for **Vercel** with a **PostgreSQL** database (e.g., Vercel Postgres or Neon). You **MUST** run the `server/data/schema.sql` on your database before deploying to initialize the tables.

For a full walkthrough, see the [Deployment Guide](deployment_guide.md).

---

## 📄 License
MIT License - Developed with ❤️ for the DSA community.
