import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/Layout/DashboardLayout';
import useThemeStore from '../stores/themeStore';
import { projectService, taskService } from '../services';
import { LoadingStates, ErrorStates } from '../components/UI';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getAll();
      const fetched = response.data || [];

      const transformed = await Promise.all(
        fetched.map(async (project) => {
          let taskCount = 0;
          let completedTasks = 0;
          try {
            const tasksRes = await taskService.getByProject(project._id);
            const tasks = tasksRes.data || [];
            taskCount = tasks.length;
            completedTasks = tasks.filter(t => t.status === 'done' || t.column === 'done').length;
          } catch { /* ignore */ }

          return {
            id: project._id,
            name: project.name,
            description: project.description || '',
            status: project.status || 'planning',
            priority: project.priority || 'medium',
            color: project.color || '#b026ff',
            memberCount: (project.members?.length || 0) + 1,
            taskCount,
            completedTasks,
            dueDate: project.dueDate,
            createdAt: project.createdAt,
          };
        })
      );

      setProjects(transformed);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.delete(projectId);
      fetchProjects();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      planning: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
      active: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
      'on-hold': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      completed: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
    };
    const s = map[status] || map.planning;
    return `${s.bg} ${s.text} ${s.border}`;
  };

  const getPriorityIcon = (priority) => {
    const colors = { low: 'text-gray-400', medium: 'text-yellow-500', high: 'text-orange-500', urgent: 'text-red-500' };
    return (
      <svg className={`w-4 h-4 ${colors[priority] || colors.medium}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    );
  };

  const filteredProjects = projects
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout
      title="Projects"
      subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace`}
      headerActions={
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
      }
    >
      {loading && <LoadingStates.LoadingOverlay fullScreen message="Loading projects..." />}

      {error && !loading && <ErrorStates.ErrorMessage message={error} onRetry={fetchProjects} />}

      {!loading && !error && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                  isDark
                    ? 'bg-[#12121a] border-white/10 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 pr-10 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] ${
                  isDark
                    ? 'bg-[#12121a] border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On-Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {searchQuery || filterStatus !== 'all' ? 'No matching projects' : 'No projects yet'}
              </h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`rounded-2xl overflow-hidden transition-all group border relative ${
                    isDark
                      ? 'bg-[#12121a] border-white/10 hover:border-purple-500/30'
                      : 'bg-white border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md'
                  }`}>
                    {/* Color strip */}
                    <div className="h-1" style={{ backgroundColor: project.color }} />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 mt-1 px-6 pt-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: project.color + '20' }}
                      >
                        <svg className="w-5 h-5" style={{ color: project.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(project.status)}`}>
                          {project.status}
                        </span>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                            isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Project Info */}
                    <Link to={`/projects/${project.id}`} className="block px-6">
                      <h3 className={`text-lg font-semibold mb-1.5 group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {project.name}
                      </h3>
                      <p className={`text-sm mb-4 line-clamp-2 min-h-[40px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {project.description || 'No description'}
                      </p>
                    </Link>

                    {/* Progress */}
                    <div className="mb-4 px-6">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {project.taskCount > 0 ? Math.round((project.completedTasks / project.taskCount) * 100) : 0}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div
                          className="h-full rounded-full transition-all bg-blue-400"
                          style={{
                            width: `${project.taskCount > 0 ? (project.completedTasks / project.taskCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          {getPriorityIcon(project.priority)}
                          <span className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{project.priority}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {project.taskCount}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {project.memberCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {showNewProjectModal && (
        <NewProjectModal
          isDark={isDark}
          onClose={() => setShowNewProjectModal(false)}
          onSuccess={() => { setShowNewProjectModal(false); fetchProjects(); }}
        />
      )}
    </DashboardLayout>
  );
}

function NewProjectModal({ isDark, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', description: '', color: '#b026ff', priority: 'medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await projectService.create(formData);
      onSuccess();
    } catch (err) {
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
        className={`rounded-2xl p-6 w-full max-w-md border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Project</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Project Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${isDark ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} placeholder="Enter project name" />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${isDark ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} placeholder="Describe your project" />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Color</label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button key={color} type="button" onClick={() => setFormData({ ...formData, color })} className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? `ring-2 ring-offset-2 ${isDark ? 'ring-white ring-offset-[#12121a]' : 'ring-gray-800 ring-offset-white'}` : ''}`} style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 ${isDark ? 'bg-[#1a1a2e] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className={`flex-1 px-4 py-3 border rounded-xl transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50">{loading ? 'Creating...' : 'Create Project'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
