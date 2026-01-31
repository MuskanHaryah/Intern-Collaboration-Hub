# Intern Collaboration Hub 🚀

A real-time collaborative project space for interns featuring a Kanban-style task board, live updates with Socket.IO, and an interactive 3D robot that follows your cursor!

![Project Preview](https://img.shields.io/badge/Status-In%20Development-purple)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black)

## ✨ Features

- 🎯 **Kanban Board** - Drag-and-drop task management
- ⚡ **Real-time Updates** - Live sync using Socket.IO
- 🤖 **Interactive 3D Robot** - Follows your cursor with smooth animations
- 🎨 **Neon Cyberpunk Theme** - Dark mode with beautiful gradients
- 👥 **Team Collaboration** - Work together on shared projects
- 📊 **Milestone Tracking** - Monitor project progress

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- React Three Fiber (3D graphics)
- Tailwind CSS
- Framer Motion
- Socket.IO Client
- Zustand (state management)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuskanHaryah/Intern-Collaboration-Hub.git
   cd Intern-Collaboration-Hub
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Add 3D Robot Model**
   - Download a robot model from [Sketchfab](https://sketchfab.com/search?q=robot&type=models)
   - Place it in `client/public/models/robot.glb`

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📁 Project Structure

```
Intern-Collaboration-Hub/
├── client/                 # React frontend
│   ├── public/
│   │   └── models/        # 3D models
│   ├── src/
│   │   ├── components/
│   │   │   ├── Kanban/    # Kanban board components
│   │   │   ├── Robot3D/   # 3D robot components
│   │   │   ├── Layout/    # Layout components
│   │   │   └── UI/        # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand store
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── socket/        # Socket.IO handlers
│   │   └── config/        # Configuration
│   └── package.json
├── PROJECT_ROADMAP.md      # Detailed development roadmap
├── ROBOT_3D_GUIDE.md       # 3D robot implementation guide
└── README.md
```

## 🎮 Usage

1. **Create an account** or login
2. **Create a project** and invite team members
3. **Add tasks** to the Kanban board
4. **Drag and drop** tasks between columns
5. **Watch updates** appear in real-time for all team members
6. **Track milestones** to monitor progress

## 🎨 Theme Customization

The app uses a neon cyberpunk theme. Colors can be customized in:
- `client/tailwind.config.js` - Tailwind theme colors
- `client/src/index.css` - Custom CSS variables

## 📖 Documentation

- [Project Roadmap](./PROJECT_ROADMAP.md) - Complete development guide
- [3D Robot Guide](./ROBOT_3D_GUIDE.md) - How to implement the interactive robot

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- 3D models from [Sketchfab](https://sketchfab.com)
- Icons from [Lucide](https://lucide.dev)
- Inspiration from modern web design trends

---

Made with ❤️ for the Intern Collaboration Hub Assignment