# 🚌 Online Bus Pass Management System
**NIE Mysuru | Batch 18 | DevOps Project**
Team: Prajwal K (4NI23CS146) & Ramesh R (4NI23CS165)
Guide: Mr. Adnan, Asst. Professor

---

## ✅ Prerequisites
Install these before running:
1. [Node.js v18+](https://nodejs.org) — download and install
2. [MongoDB Community](https://www.mongodb.com/try/download/community) — install and start
3. [VS Code](https://code.visualstudio.com)

---

## 🚀 Run Without Docker (Recommended for Development)

### Step 1 — Open the project in VS Code
Open the `bus-pass-system` folder in VS Code.

### Step 2 — Open TWO terminals in VS Code (Terminal > New Terminal)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm start
```
Frontend opens at: http://localhost:3000

### Step 3 — Create Admin Account
Open a browser and go to:
```
http://localhost:5000/api/auth/seed-admin
```
Use POST (or just visit once with Postman / Thunder Client VS Code extension).

Or use this command in a third terminal:
```bash
curl -X POST http://localhost:5000/api/auth/seed-admin
```

### Step 4 — Login
- **Admin:** admin@buspass.com / admin123
- **Student:** Register at http://localhost:3000/register

---

## 🐳 Run With Docker (DevOps Demo)

### Prerequisites: Docker Desktop installed
```bash
docker-compose up --build
```
App runs at: http://localhost:3000

---

## 📁 Project Structure
```
bus-pass-system/
├── backend/
│   ├── src/
│   │   ├── models/       # User, BusPass schemas
│   │   ├── routes/       # auth, pass, admin, report APIs
│   │   ├── middleware/   # JWT auth middleware
│   │   └── server.js     # Entry point
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/        # Login, Register, Dashboard, ApplyPass, MyPasses, AdminPasses, Reports
│   │   ├── components/   # Navbar
│   │   ├── context/      # AuthContext (JWT)
│   │   └── App.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## 🔑 Modules Implemented
1. Student Registration Module ✅
2. Bus Pass Application Module ✅
3. Renewal and Tracking Module ✅
4. Admin Management Module ✅
5. Report Generation Module ✅

## ⚙️ Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- Containerization: Docker
- CI/CD: Jenkins
- Version Control: GitHub
