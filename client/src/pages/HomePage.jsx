import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/UI/ThemeToggle';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';

console.log('📄 [HomePage.jsx] HomePage component loaded');

export default function HomePage() {
  console.log('🏠 [HomePage.jsx] HomePage rendering...');
  const theme = useThemeStore((s) => s.theme);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  console.log('🎨 [HomePage.jsx] Current theme:', theme);
  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-[#f8f9fc]'
    }`}>
      {/* Background gradient effects */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20' 
          : 'bg-gradient-to-br from-purple-100/60 via-transparent to-pink-100/60'
      }`} />
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-500 ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-colors duration-500 ${
        isDark ? 'bg-pink-500/10' : 'bg-pink-300/20'
      }`} />
      <div className={`absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-500 ${
        isDark ? 'bg-cyan-500/5' : 'bg-cyan-300/15'
      }`} />

      {/* Animated grid background */}
      {isDark && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(176, 38, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(176, 38, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className={`font-semibold text-xl transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className={`font-medium border-b-2 border-purple-500 pb-1 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Home</a>
          <a href="#features" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Features</a>
          <a href="#about" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>About</a>
          <a href="#contact" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={`px-5 py-2 rounded-full transition-all hidden sm:block ${
                isDark 
                  ? 'text-white border border-white/20 hover:bg-white/10' 
                  : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}>
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Get Started
              </Link>
            </>
          )}
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
            className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
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
            className={`text-lg mb-8 max-w-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
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
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium transition-all flex items-center gap-2 overflow-visible"
            >
              {/* Glow effect behind button */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-80 group-hover:blur-2xl transition-all duration-500 -z-10 scale-110" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/60 to-pink-600/60 blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 -z-20 scale-150" />
              {isAuthenticated ? 'Go to Dashboard' : 'Start Collaborating'}
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-8 mt-12"
          >
            <div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>500+</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Active Interns</p>
            </div>
            <div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1.2K</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Projects Created</p>
            </div>
            <div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>99%</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Satisfaction</p>
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
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl transition-colors duration-500 ${
                isDark 
                  ? 'bg-[#12121a]/80 border border-white/10' 
                  : 'bg-white/80 border border-gray-200 shadow-xl shadow-purple-500/5'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className={`flex-1 rounded-lg p-3 ${isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                    <div className="h-2 w-16 bg-purple-500/50 rounded mb-2" />
                    <div className={`h-2 w-full rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  </div>
                  <div className={`flex-1 rounded-lg p-3 ${isDark ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-cyan-50 border border-cyan-200'}`}>
                    <div className="h-2 w-12 bg-cyan-500/50 rounded mb-2" />
                    <div className={`h-2 w-full rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className={`flex-1 rounded-lg p-3 ${isDark ? 'bg-pink-500/20 border border-pink-500/30' : 'bg-pink-50 border border-pink-200'}`}>
                    <div className="h-2 w-14 bg-pink-500/50 rounded mb-2" />
                    <div className={`h-2 w-3/4 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  </div>
                  <div className={`flex-1 rounded-lg p-3 ${isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                    <div className="h-2 w-10 bg-green-500/50 rounded mb-2" />
                    <div className={`h-2 w-full rounded ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 ${isDark ? 'border-[#12121a]' : 'border-white'}`} />
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 ${isDark ? 'border-[#12121a]' : 'border-white'}`} />
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 ${isDark ? 'border-[#12121a]' : 'border-white'}`} />
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Live • 3 online</span>
              </div>
            </motion.div>

            {/* Floating Task Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`absolute top-16 right-8 w-48 rounded-xl p-4 shadow-lg animate-float transition-colors duration-500 ${
                isDark 
                  ? 'bg-[#1a1a2e] border border-purple-500/30 shadow-purple-500/10' 
                  : 'bg-white border border-purple-200 shadow-purple-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs text-purple-400">In Progress</span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Design System</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>3 subtasks</p>
            </motion.div>

            {/* Floating Task Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`absolute bottom-20 left-8 w-52 rounded-xl p-4 shadow-lg animate-float-delayed transition-colors duration-500 ${
                isDark 
                  ? 'bg-[#1a1a2e] border border-green-500/30 shadow-green-500/10' 
                  : 'bg-white border border-green-200 shadow-green-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-green-400">Completed</span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>API Integration</p>
              <div className={`mt-2 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
            </motion.div>

            {/* Notification Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute top-32 left-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-pink-500/30 animate-pulse"
            >
              +5 Updates
            </motion.div>

            {/* Floating Orbs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className={`absolute top-8 left-1/3 w-20 h-20 rounded-full blur-xl animate-float ${
                isDark ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : 'bg-gradient-to-r from-purple-300/30 to-pink-300/30'
              }`}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className={`absolute bottom-8 right-1/4 w-16 h-16 rounded-full blur-xl animate-float-delayed ${
                isDark ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30' : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/30'
              }`}
            />

            {/* Connection Lines with Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.6" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ec4899" />
                </marker>
              </defs>
              {/* Curved arrow from +5 Updates badge to API Integration card */}
              <motion.path
                d="M 280 150 Q 200 260 100 360"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.9 }}
              />
              {/* Secondary decorative curved line */}
              <motion.path
                d="M 310 160 Q 370 210 400 290"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4,4"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.1 }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ======================== FEATURES SECTION ======================== */}
      <section id="features" className="relative z-10 py-24 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 tracking-[0.2em] text-sm font-medium mb-3 uppercase">What We Offer</p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Features</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything your team needs to collaborate effectively and ship faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              ),
              title: 'Kanban Boards',
              desc: 'Drag-and-drop task management with customizable columns to fit your workflow.',
              gradient: 'from-purple-500 to-violet-500',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Real-Time Sync',
              desc: 'Instant updates across all users. See changes as they happen with WebSocket integration.',
              gradient: 'from-pink-500 to-rose-500',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Team Collaboration',
              desc: 'Invite members, assign roles, and work together with real-time presence indicators.',
              gradient: 'from-cyan-500 to-blue-500',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              ),
              title: 'Task Tracking',
              desc: 'Checklists, priorities, due dates, and time tracking to keep your projects on schedule.',
              gradient: 'from-green-500 to-emerald-500',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              ),
              title: 'Comments & Activity',
              desc: 'Discuss tasks inline with threaded comments and a full activity history log.',
              gradient: 'from-orange-500 to-amber-500',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: 'Secure & Private',
              desc: 'Role-based access control with JWT authentication keeps your data protected.',
              gradient: 'from-red-500 to-pink-500',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-[#12121a]/60 border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5'
                  : 'bg-white/70 border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================== ABOUT SECTION ======================== */}
      <section id="about" className="relative z-10 py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left — illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className={`relative rounded-2xl p-8 border overflow-hidden ${
              isDark ? 'bg-[#12121a]/60 border-white/10' : 'bg-white/70 border-gray-200'
            }`}>
              {/* Decorative gradient */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">C</div>
                  <div>
                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Built for interns, by interns</p>
                  </div>
                </div>
                <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { n: '50+', l: 'Universities' },
                    { n: '200+', l: 'Teams' },
                    { n: '98%', l: 'Retention' },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.n}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  {['React', 'Node.js', 'MongoDB', 'Socket.IO'].map((t) => (
                    <span key={t} className={`px-3 py-1 text-xs rounded-full ${
                      isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                    }`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <p className="text-purple-400 tracking-[0.2em] text-sm font-medium mb-3 uppercase">About Us</p>
            <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">CollabHub?</span>
            </h2>
            <div className={`space-y-4 text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                CollabHub was born from a simple frustration — interns juggling spreadsheets, 
                chat threads, and email chains just to stay aligned. We built a single platform 
                where teams can manage tasks, communicate, and track progress in real time.
              </p>
              <p>
                Our Kanban-style boards, powered by WebSocket technology, ensure every team 
                member sees changes instantly. No page refreshes, no delays — just seamless 
                collaboration.
              </p>
              <p>
                Whether you're a small team of 2 or a cohort of 50 interns, CollabHub scales 
                with you, featuring role-based access, milestone tracking, and a beautiful UI 
                that makes project management enjoyable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================== CONTACT SECTION ======================== */}
      <section id="contact" className="relative z-10 py-24 px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 tracking-[0.2em] text-sm font-medium mb-3 uppercase">Get In Touch</p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Us</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`max-w-2xl mx-auto rounded-2xl p-8 md:p-10 border ${
            isDark ? 'bg-[#12121a]/60 border-white/10' : 'bg-white/70 border-gray-200 shadow-xl shadow-purple-500/5'
          }`}
        >
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                    isDark
                      ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Message</label>
              <textarea
                rows={5}
                placeholder="Your message..."
                className={`w-full px-4 py-3 rounded-xl border transition-all resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className={`relative z-10 border-t py-12 px-8 md:px-16 ${
        isDark ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} CollabHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#features" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Features</a>
            <a href="#about" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>About</a>
            <a href="#contact" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
