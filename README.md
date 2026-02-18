# 🚀 Intern Collaboration Hub

> **Enterprise-grade real-time collaboration platform for modern teams**

A comprehensive project management and team collaboration system featuring advanced real-time synchronization, intuitive Kanban workflows, role-based access control, and intelligent task assignment. Built with the MERN stack and designed for scalability.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/MuskanHaryah/Intern-Collaboration-Hub)
[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Intern Collaboration Hub is a production-ready, real-time project management platform that streamlines team collaboration through intelligent task management, live updates, and comprehensive project tracking. The platform features owner-based access control, dynamic workflow customization, and milestone-driven development tracking.

**Perfect for:**
- Remote teams managing complex projects
- Internship programs coordinating multiple teams
- Agile development teams requiring real-time sync
- Educational institutions teaching project management

---

## ✨ Key Features

### 🎯 **Advanced Kanban Board**
- **Drag-and-drop interface** with React Beautiful DnD
- **Customizable columns** - Start with one, add as needed
- **Visual workflow stages** with color-coded indicators
- **Real-time task updates** across all connected clients
- **Task filtering & search** for efficient task discovery
- **Empty state guidance** for improved learnability

### ⚡ **Real-Time Synchronization**
- **Socket.IO integration** for instant updates
- **Live presence indicators** showing online team members
- **Collaborative editing** with user activity tracking
- **Automatic conflict resolution** for concurrent edits
- **Connection status monitoring** with reconnection logic

### 👥 **Team Management**
- **Role-based access control** (Owner, Editor, Viewer)
- **Smart invitation system** with email notifications
- **Member activity tracking** and contribution metrics
- **Team directory** with search and filtering
- **Owner-only permissions** for critical operations

### 📊 **Project Tracking**
- **Milestone management** with deadline tracking
- **Progress visualization** with dynamic charts
- **Task assignment system** with automatic notifications
- **Project overview dashboard** showing key metrics
- **Overdue task alerts** and priority management

### 🔒 **Security & Authentication**
- **JWT-based authentication** with secure token management
- **Bcrypt password encryption** (10 salt rounds)
- **Protected API routes** with middleware validation
- **Input sanitization** preventing injection attacks
- **Session management** with automatic token refresh

### 🎨 **Modern UI/UX**
- **Dark/Light theme toggle** with persistent preferences
- **Glassmorphism design** with smooth animations
- **Framer Motion transitions** for polished interactions
- **Responsive layouts** optimized for all devices
- **Intuitive onboarding** with contextual hints

---

## 🛠️ Tech Stack

### **Frontend Architecture**
```
React 18.2              → Modern hooks & concurrent features
Vite 5.x                → Lightning-fast dev server & HMR
Tailwind CSS 3.x        → Utility-first styling
Framer Motion 11.x      → Production-grade animations
Socket.IO Client 4.x    → Real-time bidirectional communication
Zustand 4.x             → Lightweight state management
React Beautiful DnD     → Accessible drag-and-drop
React Router 6.x        → Client-side routing
```

### **Backend Architecture**
```
Node.js 20+             → JavaScript runtime
Express.js 4.x          → Web application framework
MongoDB Atlas           → Cloud-hosted NoSQL database
Mongoose 8.x            → ODM with schema validation
Socket.IO 4.x           → WebSocket server
JWT (jsonwebtoken)      → Stateless authentication
Bcrypt                  → Password hashing
Cors                    → Cross-origin resource sharing
```

### **Development Tools**
```
ESLint                  → Code quality & consistency
Prettier                → Code formatting
Git                     → Version control
Postman                 → API testing
VS Code                 → IDE
```

---

## 🏗️ Architecture

### **System Design**
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  React Components → Zustand Store → Socket Client      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────┐
│                   API GATEWAY                           │
│  Express Router → Auth Middleware → Controllers        │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
┌───────▼────────┐      ┌─────────▼─────────┐
│  SOCKET.IO     │      │   REST API        │
│  Real-time     │      │   CRUD Ops        │
│  Events        │      │   JWT Auth        │
└───────┬────────┘      └─────────┬─────────┘
        │                         │
        └────────────┬────────────┘
                     │
           ┌─────────▼──────────┐
           │   MONGODB ATLAS    │
           │   Data Persistence │
           └────────────────────┘
```

### **Data Flow**
1. **User Action** → React Component
2. **State Update** → Zustand Store
3. **API Call** → Axios/Socket.IO
4. **Middleware** → JWT Validation
5. **Controller** → Business Logic
6. **Database** → MongoDB Query
7. **Response** → Client Update
8. **Real-time** → Socket Broadcast

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn
- MongoDB Atlas account (free tier works perfectly)
- Git for version control
- Modern browser (Chrome, Firefox, Edge, Safari)

### **Installation**

#### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/MuskanHaryah/Intern-Collaboration-Hub.git
cd Intern-Collaboration-Hub
```

#### 2️⃣ **Backend Setup**
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env with your credentials:
# MONGO_URI=mongodb+srv://your-connection-string
# JWT_SECRET=your-super-secure-secret-key
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Start development server
npm run dev
```

#### 3️⃣ **Frontend Setup**
```bash
# Open new terminal, navigate to client
cd client

# Install dependencies
npm install

# Create environment file (optional)
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

#### 4️⃣ **Access Application**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)
- Socket.IO: Automatically connects on load

---

## 📁 Project Structure

```
Intern-Collaboration-Hub/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── assets/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Kanban/              # Task board components
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── AddTaskModal.jsx
│   │   │   │   └── AddColumnModal.jsx
│   │   │   ├── Milestones/          # Milestone tracking
│   │   │   │   ├── MilestoneList.jsx
│   │   │   │   ├── MilestoneCard.jsx
│   │   │   │   └── AddMilestoneModal.jsx
│   │   │   ├── Layout/              # Layout wrappers
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── UI/                  # Reusable components
│   │   │       ├── LoadingStates.jsx
│   │   │       ├── ErrorStates.jsx
│   │   │       └── ConfirmationModal.jsx
│   │   ├── pages/                   # Route pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProjectPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── TeamPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/                # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   └── taskService.js
│   │   ├── stores/                  # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── themeStore.js
│   │   │   └── projectStore.js
│   │   ├── socket/                  # Socket.IO client
│   │   │   └── index.js
│   │   ├── utils/                   # Utilities
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── Notification.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── socket/                  # Socket.IO handlers
│   │   │   └── socketHandlers.js
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection
│   │   └── server.js                # Express server
│   └── package.json
│
├── docs/                            # Documentation
│   ├── PROJECT_ROADMAP.md
│   └── API_REFERENCE.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📚 API Documentation

### **Authentication Endpoints**
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             User login
GET    /api/auth/me                Get current user (Protected)
```

### **Project Endpoints**
```
GET    /api/projects               Get all projects (Protected)
POST   /api/projects               Create project (Protected)
GET    /api/projects/:id           Get project by ID (Protected)
PUT    /api/projects/:id           Update project (Protected, Owner only)
DELETE /api/projects/:id           Delete project (Protected, Owner only)
POST   /api/projects/:id/invite    Invite member (Protected, Owner only)
```

### **Task Endpoints**
```
GET    /api/tasks/my               Get tasks assigned to user (Protected)
GET    /api/tasks/project/:id      Get project tasks (Protected)
POST   /api/tasks                  Create task (Protected, Owner only)
PUT    /api/tasks/:id              Update task (Protected)
DELETE /api/tasks/:id              Delete task (Protected, Owner only)
PATCH  /api/tasks/:id/move         Move task column (Protected)
```

### **Socket.IO Events**
```javascript
// Client → Server
socket.emit('join-project', { projectId })
socket.emit('leave-project', { projectId })
socket.emit('task-update', { taskId, changes })

// Server → Client
socket.on('task-created', (task) => { ... })
socket.on('task-updated', (task) => { ... })
socket.on('user-joined', (user) => { ... })
socket.on('user-left', (userId) => { ... })
```

---

## 🔒 Security Features

### **Authentication Security**
- ✅ **JWT tokens** with expiration (24h default)
- ✅ **Bcrypt hashing** with 10 salt rounds
- ✅ **HTTP-only cookies** (optional configuration)
- ✅ **Token refresh mechanism** for persistent sessions

### **API Security**
- ✅ **CORS configuration** with whitelisted origins
- ✅ **Rate limiting** to prevent abuse
- ✅ **Input validation** with Mongoose schemas
- ✅ **SQL injection prevention** via ODM
- ✅ **XSS protection** with sanitization

### **Access Control**
- ✅ **Role-based permissions** (Owner, Editor, Viewer)
- ✅ **Route-level protection** with middleware
- ✅ **Owner-only operations** for critical actions
- ✅ **Project membership verification** for all operations

---

## 🎮 Usage Guide

### **Getting Started**
1. **Register/Login** → Create account or sign in
2. **Create Project** → Click "New Project" on dashboard
3. **Invite Team** → Add members via email (Owner only)
4. **Add Tasks** → Click "Add Task" in any column (Owner only)
5. **Drag & Drop** → Move tasks between workflow stages
6. **Track Progress** → Monitor via milestones and dashboard

### **Best Practices**
- Start with **1 column**, add more as needed (To Do → In Progress → Done)
- Use **milestones** for major deliverables and deadlines
- **Assign tasks** to team members for clear accountability
- **Color-code columns** by workflow stage for visual clarity
- Keep task titles **concise** and descriptions **detailed**

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### **Code Standards**
- Follow existing code style
- Write descriptive commit messages
- Add comments for complex logic
- Test thoroughly before PR
- Update documentation if needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Socket.IO** for real-time communication
- **MongoDB Atlas** for cloud database hosting
- **Tailwind CSS** for utility-first styling
- **React Beautiful DnD** for drag-and-drop
- **Framer Motion** for animation library
- **Lucide Icons** for beautiful iconography

---

## 📧 Contact

**Muskan Haryah**  
GitHub: [@MuskanHaryah](https://github.com/MuskanHaryah)  
Project Link: [Intern Collaboration Hub](https://github.com/MuskanHaryah/Intern-Collaboration-Hub)

---
