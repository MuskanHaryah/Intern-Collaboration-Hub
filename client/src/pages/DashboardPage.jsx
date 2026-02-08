import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/UI/ThemeToggle';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';
import { projectService, taskService } from '../services';
import { LoadingStates, ErrorStates } from '../components/UI';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
  });
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const user = useAuthStore((s) => s.user);

  // Fetch projects and calculate stats
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all projects
      const projectsResponse = await projectService.getAll();
      const fetchedProjects = projectsResponse.data || [];
      
      // Transform projects to include calculated fields
      const transformedProjects = await Promise.all(
        fetchedProjects.map(async (project) => {
          // Get tasks for each project to calculate taskCount and completedTasks
          let taskCount = 0;
          let completedTasks = 0;
          
          try {
            const tasksResponse = await taskService.getByProject(project._id);
            const tasks = tasksResponse.data || [];
            taskCount = tasks.length;
            completedTasks = tasks.filter(task => task.status === 'done' || task.column === 'done').length;
          } catch (err) {
            console.error(`Error fetching tasks for project ${project._id}:`, err);
          }
          
          return {
            id: project._id,
            name: project.name,
            description: project.description || '',
            status: project.status || 'planning',
            priority: project.priority || 'medium',
            color: project.color || '#b026ff',
            memberCount: (project.members?.length || 0) + 1, // +1 for owner
            taskCount,
            completedTasks,
            dueDate: project.dueDate,
          };
        })
      );
      
      setProjects(transformedProjects);
      
      // Calculate stats
      const totalProjects = transformedProjects.length;
      const activeTasks = transformedProjects.reduce((sum, p) => sum + (p.taskCount - p.completedTasks), 0);
      const completedTasks = transformedProjects.reduce((sum, p) => sum + p.completedTasks, 0);
      
      // Calculate unique team members across all projects
      const uniqueMembers = new Set();
      fetchedProjects.forEach(project => {
        if (project.owner?._id) uniqueMembers.add(project.owner._id);
        project.members?.forEach(member => {
          if (member.user?._id) uniqueMembers.add(member.user._id);
        });
      });
      
      setStats({
        totalProjects,
        activeTasks,
        completedTasks,
        teamMembers: uniqueMembers.size,
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setShowNewProjectModal(false);
    fetchDashboardData(); // Refresh data after creating project
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusBadge = (status) => {
    const styles = {
      planning: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      active: 'bg-green-500/20 text-green-400 border-green-500/50',
      'on-hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      completed: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    };
    return styles[status] || styles.planning;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#f0f2f5]'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 border-r p-4 z-40 transition-colors duration-500 ${
        isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              isDark 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-purple-50 text-purple-600 border border-purple-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Projects
          </Link>

          <Link
            to="/tasks"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            My Tasks
          </Link>

          <Link
            to="/team"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team
          </Link>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-500 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || 'User Name'}
              </p>
              <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <button className={`p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingStates.LoadingOverlay fullScreen message="Loading your dashboard..." />}

        {/* Error State */}
        {error && !loading && (
          <ErrorStates.ErrorMessage 
            message={error} 
            onRetry={fetchDashboardData}
          />
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Projects', value: stats.totalProjects, icon: '📁', color: 'purple' },
                { label: 'Active Tasks', value: stats.activeTasks, icon: '📋', color: 'pink' },
                { label: 'Completed', value: stats.completedTasks, icon: '✅', color: 'green' },
                { label: 'Team Members', value: stats.teamMembers, icon: '👥', color: 'blue' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-6 transition-all duration-500 border ${
                    isDark 
                      ? 'bg-[#12121a] border-white/10 hover:border-purple-500/50' 
                      : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                      <div className={`w-3 h-3 rounded-full bg-${stat.color}-500`}></div>
                    </div>
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Projects Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Projects</h2>
                <Link to="/projects" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  View all →
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className={`rounded-2xl p-12 text-center border transition-colors duration-500 ${
                  isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    No projects yet
                  </h3>
                  <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get started by creating your first project
                  </p>
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className={`block rounded-2xl p-6 transition-all group border ${
                    isDark 
                      ? 'bg-[#12121a] border-white/10 hover:border-purple-500/50' 
                      : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm'
                  }`}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: project.color + '30' }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      ></div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Project Info */}
                  <h3 className={`text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round((project.completedTasks / project.taskCount) * 100)}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(project.completedTasks / project.taskCount) * 100}%`,
                          backgroundColor: project.color,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}></div>
                      <span className={`text-sm capitalize ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{project.priority}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {project.memberCount}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
                </div>
              )}
            </div>

        {/* Recent Activity */}
        <div>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
          <div className={`rounded-2xl p-6 border transition-colors duration-500 ${
            isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="space-y-4">
              {[
                { user: 'John Doe', action: 'completed task', target: 'Setup database', time: '2 minutes ago', color: 'green' },
                { user: 'Jane Smith', action: 'added comment on', target: 'API Integration', time: '15 minutes ago', color: 'blue' },
                { user: 'Mike Johnson', action: 'moved task to', target: 'In Progress', time: '1 hour ago', color: 'yellow' },
                { user: 'Sarah Wilson', action: 'created task', target: 'User authentication', time: '2 hours ago', color: 'purple' },
              ].map((activity, index) => (
                <div key={index} className={`flex items-center gap-4 py-3 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className={`w-10 h-10 rounded-full bg-${activity.color}-500/20 flex items-center justify-center text-${activity.color}-400 font-semibold`}>
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{activity.action}</span>{' '}
                      <span className="text-purple-400">{activity.target}</span>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSuccess={handleProjectCreated} />
      )}
    </div>
  );
}

// New Project Modal Component
function NewProjectModal({ onClose, onSuccess }) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#b026ff',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await projectService.create(formData);
      onSuccess(); // Refresh dashboard data
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#b026ff', '#ff2d95', '#00d4ff', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 w-full max-w-md border transition-colors duration-500 ${
          isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:border-purple-500 ${
                isDark 
                  ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl transition-all resize-none focus:outline-none focus:border-purple-500 ${
                isDark 
                  ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Color
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#12121a]' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:border-purple-500 ${
                isDark 
                  ? 'bg-[#1a1a2e] border-white/10 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 border rounded-xl transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
