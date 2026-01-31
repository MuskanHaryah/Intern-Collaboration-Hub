import { RobotScene } from '../components/Robot3D';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-dark-primary overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-neon flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-white font-semibold text-xl">CollabHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Features</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="outline-button hidden sm:block">Login</button>
          <button className="neon-button">Get Started</button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-100px)]">
        <div className="w-full md:w-1/2 px-8 md:px-16">
          {/* Subtitle */}
          <p className="text-neon-purple tracking-[0.3em] text-sm font-medium mb-4 uppercase">
            Real-Time Collaboration
          </p>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display">
            <span className="block">COLLABORATE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-neon">
              IN REAL-TIME
            </span>
          </h1>

          {/* Description */}
          <p className="text-text-secondary text-lg mb-8 max-w-lg leading-relaxed">
            Enable interns to collaborate on real-time projects efficiently. 
            Our Kanban-style board keeps everyone in sync with live updates 
            and seamless task management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="neon-button flex items-center gap-2">
              Start Collaborating
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="outline-button flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-text-muted text-sm">Active Interns</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1.2K</p>
              <p className="text-text-muted text-sm">Projects Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">99%</p>
              <p className="text-text-muted text-sm">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Robot Scene */}
      <RobotScene />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-8 h-12 border-2 border-neon-purple/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-neon-purple rounded-full animate-bounce" />
        </div>
      </div>

      {/* Side decoration */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-3 pr-8">
          <div className="w-2 h-2 rounded-full bg-neon-purple" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
