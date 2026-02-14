import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/Layout/DashboardLayout';
import useThemeStore from '../stores/themeStore';
import { projectService, taskService } from '../services';
import { LoadingStates, ErrorStates } from '../components/UI';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only tasks assigned to the current user
      const [myTasksRes, projectsRes] = await Promise.all([
        taskService.getMyTasks(),
        projectService.getAll(),
      ]);

      const fetchedProjects = projectsRes.data || [];
      setProjects(fetchedProjects);

      const myTasks = (myTasksRes.data || []).map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description || '',
        column: t.column || 'backlog',
        priority: t.priority || 'medium',
        dueDate: t.dueDate,
        assignees: t.assignees || [],
        projectId: t.project?._id || t.project,
        projectName: t.project?.name || 'Unknown Project',
        projectColor: t.project?.color || '#b026ff',
      }));

      setTasks(myTasks);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getColumnInfo = (column) => {
    const map = {
      backlog: { label: 'Backlog', color: 'text-gray-400', bg: isDark ? 'bg-gray-500/15' : 'bg-gray-100', border: 'border-gray-500/30' },
      todo: { label: 'To Do', color: 'text-blue-400', bg: isDark ? 'bg-blue-500/15' : 'bg-blue-50', border: 'border-blue-500/30' },
      'in-progress': { label: 'In Progress', color: 'text-amber-400', bg: isDark ? 'bg-amber-500/15' : 'bg-amber-50', border: 'border-amber-500/30' },
      review: { label: 'Review', color: 'text-purple-400', bg: isDark ? 'bg-purple-500/15' : 'bg-purple-50', border: 'border-purple-500/30' },
      done: { label: 'Done', color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/15' : 'bg-emerald-50', border: 'border-emerald-500/30' },
    };
    return map[column] || map.backlog;
  };

  const getPriorityInfo = (priority) => {
    const map = {
      low: { label: 'Low', color: 'text-gray-400', icon: '↓' },
      medium: { label: 'Medium', color: 'text-yellow-500', icon: '→' },
      high: { label: 'High', color: 'text-orange-500', icon: '↑' },
      urgent: { label: 'Urgent', color: 'text-red-500', icon: '⬆' },
    };
    return map[priority] || map.medium;
  };

  const filteredTasks = tasks
    .filter((t) => filterStatus === 'all' || t.column === filterStatus)
    .filter((t) => filterPriority === 'all' || t.priority === filterPriority)
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.column === 'todo').length,
    inProgress: tasks.filter((t) => t.column === 'in-progress').length,
    done: tasks.filter((t) => t.column === 'done').length,
  };

  return (
    <DashboardLayout title="My Tasks" subtitle={`${tasks.length} tasks assigned to you`}>
      {loading && <LoadingStates.LoadingOverlay fullScreen message="Loading tasks..." />}
      {error && !loading && <ErrorStates.ErrorMessage message={error} onRetry={fetchAllTasks} />}

      {!loading && !error && (
        <>
          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: taskStats.total, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              ), color: isDark ? 'text-gray-300' : 'text-gray-700', bg: isDark ? 'bg-gray-500/10' : 'bg-gray-50' },
              { label: 'To Do', value: taskStats.todo, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), color: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
              { label: 'In Progress', value: taskStats.inProgress, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              ), color: 'text-amber-500', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
              { label: 'Done', value: taskStats.done, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), color: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-4 border transition-all ${
                  isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                  isDark ? 'bg-[#12121a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 pr-10 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] ${
                isDark ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
            >
              <option value="all">All Status</option>
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`px-4 py-3 pr-10 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-no-repeat bg-[length:16px_16px] bg-[position:right_12px_center] ${
                isDark ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                {tasks.length === 0 ? 'Create a project and add tasks to get started' : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              {filteredTasks.map((task, index) => {
                const colInfo = getColumnInfo(task.column);
                const priInfo = getPriorityInfo(task.priority);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={`/projects/${task.projectId}`}
                      className={`flex items-center gap-4 px-6 py-4 border-b last:border-0 transition-colors ${
                        isDark
                          ? 'border-white/5 hover:bg-white/5'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {/* Status Icon */}
                      <div className={`w-8 h-8 rounded-lg ${colInfo.bg} border ${colInfo.border} flex items-center justify-center flex-shrink-0`}>
                        {task.column === 'done' ? (
                          <svg className={`w-4 h-4 ${colInfo.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${
                            task.column === 'in-progress' ? 'bg-amber-400' :
                            task.column === 'review' ? 'bg-purple-400' :
                            task.column === 'todo' ? 'bg-blue-400' : 'bg-gray-400'
                          }`} />
                        )}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${task.column === 'done' ? 'line-through opacity-60' : ''} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.projectColor }} />
                          <span className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{task.projectName}</span>
                        </div>
                      </div>

                      {/* Priority */}
                      <span className={`text-sm font-medium ${priInfo.color} flex-shrink-0`}>
                        {priInfo.icon} {priInfo.label}
                      </span>

                      {/* Status Badge */}
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${colInfo.bg} ${colInfo.color} ${colInfo.border} flex-shrink-0`}>
                        {colInfo.label}
                      </span>

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}

                      <svg className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
