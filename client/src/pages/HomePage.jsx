import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(176, 38, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(176, 38, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-white font-semibold text-xl">CollabHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white font-medium border-b-2 border-purple-500 pb-1">Home</a>
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 transition-all hidden sm:block">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-100px)]">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-8 md:px-16">
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-purple-400 tracking-[0.3em] text-sm font-medium mb-4 uppercase"
          >
            Real-Time Collaboration
          </motion.p>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            <span className="block">COLLABORATE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              IN REAL-TIME
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed"
          >
            Enable interns to collaborate on real-time projects efficiently. 
            Our Kanban-style board keeps everyone in sync with live updates 
            and seamless task management.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/register"
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium transition-all flex items-center gap-2 overflow-visible"
            >
              {/* Glow effect behind button */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-80 group-hover:blur-2xl transition-all duration-500 -z-10 scale-110" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/60 to-pink-600/60 blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 -z-20 scale-150" />
              Start Collaborating
              <motion.svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={false}
                whileHover={{ x: 0 }}
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </motion.svg>
            </Link>
            <button className="group relative px-6 py-3 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-all flex items-center gap-2">
              {/* Subtle glow on hover */}
              <span className="absolute inset-0 rounded-full bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 scale-110" />
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-8 mt-12"
          >
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-gray-500 text-sm">Active Interns</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1.2K</p>
              <p className="text-gray-500 text-sm">Projects Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">99%</p>
              <p className="text-gray-500 text-sm">Satisfaction</p>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Abstract Visual */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative">
          {/* Floating Cards */}
          <div className="relative w-full h-[600px]">
            {/* Main Kanban Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-[#12121a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
                    <div className="h-2 w-16 bg-purple-500/50 rounded mb-2" />
                    <div className="h-2 w-full bg-white/10 rounded" />
                  </div>
                  <div className="flex-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3">
                    <div className="h-2 w-12 bg-cyan-500/50 rounded mb-2" />
                    <div className="h-2 w-full bg-white/10 rounded" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-pink-500/20 border border-pink-500/30 rounded-lg p-3">
                    <div className="h-2 w-14 bg-pink-500/50 rounded mb-2" />
                    <div className="h-2 w-3/4 bg-white/10 rounded" />
                  </div>
                  <div className="flex-1 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <div className="h-2 w-10 bg-green-500/50 rounded mb-2" />
                    <div className="h-2 w-full bg-white/10 rounded" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-[#12121a]" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-[#12121a]" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-[#12121a]" />
                </div>
                <span className="text-xs text-gray-500">Live • 3 online</span>
              </div>
            </motion.div>

            {/* Floating Task Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-16 right-8 w-48 bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/10 animate-float"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-purple-400">In Progress</span>
              </div>
              <p className="text-white text-sm font-medium">Design System</p>
              <p className="text-gray-500 text-xs mt-1">3 subtasks</p>
            </motion.div>

            {/* Floating Task Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-20 left-8 w-52 bg-[#1a1a2e] border border-green-500/30 rounded-xl p-4 shadow-lg shadow-green-500/10 animate-float-delayed"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-400">Completed</span>
              </div>
              <p className="text-white text-sm font-medium">API Integration</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full">
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
            </motion.div>

            {/* Notification Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute top-32 left-16 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-pink-500/30 animate-pulse"
            >
              +5 Updates
            </motion.div>

            {/* Floating Orb 1 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute top-8 left-1/3 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-float"
            />

            {/* Floating Orb 2 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="absolute bottom-8 right-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-xl animate-float-delayed"
            />

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b026ff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ff2d95" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 100 150 Q 200 100 300 200"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M 250 400 Q 350 350 400 450"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.2 }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-8 h-12 border-2 border-purple-500/50 rounded-full flex items-start justify-center p-2">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-purple-500 rounded-full" 
          />
        </div>
      </motion.div>

      {/* Side decoration */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-3 pr-8">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
