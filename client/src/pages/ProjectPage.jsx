import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KanbanBoard } from '../components/Kanban';
import { MilestoneList } from '../components/Milestones';
import { useSocket } from '../socket';
import { OnlineUsers, LoadingStates, ErrorStates, ConfirmationModal } from '../components/UI';
import InviteMembersModal from '../components/UI/InviteMembersModal';
import { projectService, taskService } from '../services';
import useThemeStore from '../stores/themeStore';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState({ open: false, taskId: null });
  const [deleteMilestoneConfirm, setDeleteMilestoneConfirm] = useState({ open: false, milestoneId: null });
  const [viewMode, setViewMode] = useState('overview');
  const [showMilestones, setShowMilestones] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { joinProjectRoom, leaveProjectRoom, onlineUsers, isConnected } = useSocket();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (projectId && isConnected) joinProjectRoom(projectId);
    return () => { if (projectId) leaveProjectRoom(projectId); };
  }, [projectId, isConnected, joinProjectRoom, leaveProjectRoom]);

  useEffect(() => { fetchProjectData(); }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectResponse = await projectService.getById(projectId);
      const projectData = projectResponse.data;

      let tasksData = [];
      try {
        const tasksResponse = await taskService.getByProject(projectId);
        tasksData = tasksResponse.data || [];
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }

      const transformedProject = {
        id: projectData._id,
        name: projectData.name,
        description: projectData.description || '',
        color: projectData.color || '#b026ff',
        status: projectData.status || 'planning',
        priority: projectData.priority || 'medium',
        taskColumns: projectData.taskColumns || [
          { id: 'todo', name: 'To Do', color: '#3b82f6', order: 0 },
          { id: 'in-progress', name: 'In Progress', color: '#f59e0b', order: 1 },
          { id: 'review', name: 'Review', color: '#8b5cf6', order: 2 },
          { id: 'done', name: 'Done', color: '#10b981', order: 3 },
        ],
        members: [
          ...(projectData.owner ? [{
            id: projectData.owner._id || projectData.owner,
            name: projectData.owner.name || 'Owner',
            email: projectData.owner.email,
            role: 'owner',
            avatar: projectData.owner.avatar || null,
          }] : []),
          ...(projectData.members || []).map(m => ({
            id: m.user?._id || m.user,
            name: m.user?.name || 'Member',
            email: m.user?.email,
            role: m.role || 'member',
            avatar: m.user?.avatar || null,
          })),
        ],
        owner: projectData.owner,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
      };

      const transformedTasks = tasksData.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description || '',
        column: task.column || 'todo',
        order: task.order || 0,
        priority: task.priority || 'medium',
        labels: task.labels || [],
        assignees: (task.assignees || []).map(a => ({
          id: a._id || a,
          name: a.name || 'User',
          email: a.email,
          avatar: a.avatar,
        })),
        checklist: task.checklist || [],
        comments: task.comments || [],
        dueDate: task.dueDate || null,
        createdBy: task.createdBy,
      }));

      const transformedMilestones = (projectData.milestones || []).map(m => ({
        id: m._id,
        title: m.title,
        description: m.description || '',
        dueDate: m.dueDate,
        completed: m.isCompleted || m.completed || false,
        project: projectId,
      }));

      setProject(transformedProject);
      setTasks(transformedTasks);
      setMilestones(transformedMilestones);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError(err.message || 'Failed to load project');
      setLoading(false);
    }
  };

  // ─── Task Handlers ─────────────────────────────────────────────────
  const handleAddTask = async (taskData) => {
    try {
      const response = await taskService.create({ ...taskData, project: projectId });
      if (response.success && response.data) {
        const d = response.data;
        setTasks(prev => [...prev, {
          id: d._id, title: d.title, description: d.description || '',
          column: d.column || taskData.column, order: d.order || 0,
          priority: d.priority || 'medium', labels: d.labels || [],
          assignees: (d.assignees || []).map(a => ({ id: a._id || a, name: a.name || 'User', email: a.email, avatar: a.avatar })),
          checklist: d.checklist || [], comments: d.comments || [], dueDate: d.dueDate || null, createdBy: d.createdBy,
        }]);
      }
    } catch (err) { console.error('Error creating task:', err); }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskService.update(taskId, updates);
      if (response.success && response.data) {
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t, ...updates,
              assignees: response.data.assignees
                ? response.data.assignees.map(a => ({ id: a._id || a, name: a.name || 'User', email: a.email, avatar: a.avatar }))
                : t.assignees,
            };
          }
          return t;
        }));
      }
    } catch (err) { console.error('Error updating task:', err); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await taskService.delete(taskId);
      if (response.success) setTasks(prev => prev.filter(t => t.id !== taskId));
      setDeleteTaskConfirm({ open: false, taskId: null });
    } catch (err) { console.error('Error deleting task:', err); }
  };

  const handleMoveTask = async (taskId, newColumn, newOrder) => {
    const oldTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: newColumn, order: newOrder } : t));
    try { await taskService.move(taskId, { column: newColumn, order: newOrder }); }
    catch (err) { console.error('Error moving task:', err); setTasks(oldTasks); }
  };

  // ─── Milestone Handlers ────────────────────────────────────────────
  const handleAddMilestone = async (milestoneData) => {
    try {
      const response = await projectService.addMilestone(projectId, milestoneData);
      if (response.success && response.data) {
        setMilestones((response.data.milestones || []).map(m => ({
          id: m._id, title: m.title, description: m.description || '',
          dueDate: m.dueDate, completed: m.isCompleted || m.completed || false, project: projectId,
        })));
      }
    } catch (err) { console.error('Error adding milestone:', err); }
  };

  const handleUpdateMilestone = async (milestoneId, updates) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneId, updates);
      if (response.success && response.data) {
        setMilestones((response.data.milestones || []).map(m => ({
          id: m._id, title: m.title, description: m.description || '',
          dueDate: m.dueDate, completed: m.isCompleted || m.completed || false, project: projectId,
        })));
      }
    } catch (err) { console.error('Error updating milestone:', err); }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      const response = await projectService.deleteMilestone(projectId, milestoneId);
      if (response.success) setMilestones(prev => prev.filter(m => m.id !== milestoneId && m._id !== milestoneId));
      setDeleteMilestoneConfirm({ open: false, milestoneId: null });
    } catch (err) { console.error('Error deleting milestone:', err); }
  };

  const handleToggleMilestone = async (milestoneId, completed) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneId, { completed });
      if (response.success) {
        setMilestones(prev => prev.map(m => (m.id === milestoneId || m._id === milestoneId) ? { ...m, completed } : m));
      }
    } catch (err) { console.error('Error toggling milestone:', err); }
  };

  // ─── Loading / Error States ────────────────────────────────────────
  if (loading) return <LoadingStates.LoadingOverlay fullScreen message="Loading project..." />;
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
      <ErrorStates.ErrorMessage message={error} onRetry={fetchProjectData} />
    </div>
  );
  if (!project) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Project Not Found</h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>The project you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all">Back to Dashboard</Link>
      </div>
    </div>
  );

  // ─── Computed Stats ────────────────────────────────────────────────
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.column === 'done').length,
    inProgress: tasks.filter(t => t.column === 'in-progress').length,
    todo: tasks.filter(t => t.column === 'todo').length,
    review: tasks.filter(t => t.column === 'review').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.column !== 'done').length,
  };
  const progress = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  const memberStats = project.members.map(member => {
    const memberTasks = tasks.filter(t => t.assignees.some(a => a.id === member.id));
    const memberDone = memberTasks.filter(t => t.column === 'done').length;
    return { ...member, totalTasks: memberTasks.length, doneTasks: memberDone };
  });

  const getStatusColor = (status) => {
    const m = {
      planning: isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200',
      active: isDark ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-green-50 text-green-600 border-green-200',
      'on-hold': isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200',
      completed: isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
      archived: isDark ? 'bg-gray-500/15 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return m[status] || m.planning;
  };

  const getPriorityInfo = (p) => {
    const m = {
      low: { label: 'Low', color: 'text-gray-400', icon: '↓' },
      medium: { label: 'Medium', color: 'text-yellow-500', icon: '→' },
      high: { label: 'High', color: 'text-orange-500', icon: '↑' },
      urgent: { label: 'Urgent', color: 'text-red-500', icon: '⬆' },
    };
    return m[p] || m.medium;
  };

  const getInitials = (name) => name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  const priority = getPriorityInfo(project.priority);
  const avatarColors = ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-amber-500', 'from-rose-500 to-red-500', 'from-indigo-500 to-violet-500'];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0f]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/projects" className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <div className={`flex items-center gap-2 text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Link to="/projects" className="hover:text-purple-400 transition-all">Projects</Link>
                  <span>/</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{project.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <OnlineUsers users={onlineUsers} />
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{isConnected ? 'Live' : 'Offline'}</span>
              </div>

              {/* View Toggle */}
              <div className={`flex items-center rounded-lg p-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                {[
                  { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  { id: 'board', label: 'Board', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                      viewMode === view.id
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={view.icon} />
                    </svg>
                    {view.label}
                  </button>
                ))}
              </div>

              {/* Members */}
              <div className="flex -space-x-2">
                {project.members.slice(0, 4).map((member, idx) => (
                  <div key={member.id} className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} border-2 flex items-center justify-center text-white text-sm font-medium ${isDark ? 'border-[#0a0a0f]' : 'border-white'}`} title={member.name}>
                    {member.name.charAt(0)}
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${isDark ? 'bg-white/10 border-[#0a0a0f] text-gray-400' : 'bg-gray-200 border-white text-gray-500'}`}>+{project.members.length - 4}</div>
                )}
                <button onClick={() => setShowInviteModal(true)} title="Invite Members" className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center transition-all ml-2 ${isDark ? 'bg-white/5 border-white/20 text-gray-400 hover:text-white hover:border-white/40' : 'bg-gray-50 border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className={`flex items-center gap-6 mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2 text-sm">
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Tasks:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{taskStats.total}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Done:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{taskStats.completed}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>In Progress:</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{taskStats.inProgress}</span>
            </div>
            {taskStats.overdue > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-400">Overdue:</span>
                <span className="text-red-400 font-medium">{taskStats.overdue}</span>
              </div>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-32 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{progress}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      {viewMode === 'overview' ? (
        <OverviewTab
          project={project}
          tasks={tasks}
          taskStats={taskStats}
          progress={progress}
          memberStats={memberStats}
          milestones={milestones}
          isDark={isDark}
          priority={priority}
          getStatusColor={getStatusColor}
          getInitials={getInitials}
          avatarColors={avatarColors}
        />
      ) : (
        <main className="flex h-[calc(100vh-160px)]">
          <div className={`flex-1 overflow-hidden transition-all ${showMilestones ? 'pr-0' : ''}`}>
            <KanbanBoard
              columns={project.taskColumns}
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={(id) => setDeleteTaskConfirm({ open: true, taskId: id })}
              onMoveTask={handleMoveTask}
              projectMembers={project.members}
            />
          </div>
          {showMilestones && (
            <div className={`w-96 flex-shrink-0 p-4 border-l overflow-y-auto ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <MilestoneList
                milestones={milestones} tasks={tasks} projectId={projectId}
                onAddMilestone={handleAddMilestone} onUpdateMilestone={handleUpdateMilestone}
                onDeleteMilestone={(id) => setDeleteMilestoneConfirm({ open: true, milestoneId: id })}
                onToggleMilestone={handleToggleMilestone}
              />
            </div>
          )}
        </main>
      )}

      {/* Modals */}
      <ConfirmationModal isOpen={deleteTaskConfirm.open} onClose={() => setDeleteTaskConfirm({ open: false, taskId: null })} onConfirm={() => handleDeleteTask(deleteTaskConfirm.taskId)} title="Delete Task" message="Are you sure you want to delete this task?" confirmText="Delete Task" variant="danger" />
      <ConfirmationModal isOpen={deleteMilestoneConfirm.open} onClose={() => setDeleteMilestoneConfirm({ open: false, milestoneId: null })} onConfirm={() => handleDeleteMilestone(deleteMilestoneConfirm.milestoneId)} title="Delete Milestone" message="Are you sure you want to delete this milestone?" confirmText="Delete Milestone" variant="danger" />
      <InviteMembersModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} project={project} onMemberAdded={() => fetchProjectData()} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Overview Tab — project info, member contributions, task breakdown
   ════════════════════════════════════════════════════════════════════ */
function OverviewTab({ project, tasks, taskStats, progress, memberStats, milestones, isDark, priority, getStatusColor, getInitials, avatarColors }) {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set';

  const columnBreakdown = [
    { label: 'To Do', count: taskStats.todo, color: 'bg-blue-500' },
    { label: 'In Progress', count: taskStats.inProgress, color: 'bg-yellow-500' },
    { label: 'Review', count: taskStats.review, color: 'bg-purple-500' },
    { label: 'Done', count: taskStats.completed, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Project Info Card ────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-6 ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: project.color }}>
              {project.name.charAt(0)}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.name}</h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{project.description || 'No description provided'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Owner</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                {project.owner?.name?.charAt(0) || '?'}
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.owner?.name || 'Unknown'}</span>
            </div>
          </div>
          <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Priority</p>
            <span className={`text-sm font-medium ${priority.color}`}>{priority.icon} {priority.label}</span>
          </div>
          <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Created</p>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(project.createdAt)}</span>
          </div>
          <div className={`rounded-xl p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Members</p>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.members.length}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Progress & Task Breakdown ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`rounded-2xl border p-6 ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Progress</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#progressGrad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${progress * 3.14} ${314 - progress * 3.14}`} />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{progress}%</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {columnBreakdown.map(col => (
              <div key={col.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{col.label}</span>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{col.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Task Stats Cards ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`rounded-2xl border p-6 ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Task Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Tasks', value: taskStats.total, iconSvg: (<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>), bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
              { label: 'Completed', value: taskStats.completed, iconSvg: (<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
              { label: 'In Progress', value: taskStats.inProgress, iconSvg: (<svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>), bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
              { label: 'Overdue', value: taskStats.overdue, iconSvg: (<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), bg: isDark ? 'bg-red-500/10' : 'bg-red-50' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl p-4 ${stat.bg}`}>
                <div className="mb-1">{stat.iconSvg}</div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Member Contributions ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`rounded-2xl border p-6 ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Member Contributions</h3>
        {memberStats.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No members yet</p>
        ) : (
          <div className="space-y-4">
            {memberStats.map((member, idx) => (
              <div key={member.id} className={`flex items-center gap-4 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-sm font-medium`}>
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      member.role === 'owner'
                        ? isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600'
                        : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>{member.role}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{member.totalTasks} tasks</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                    <span className="text-xs text-green-400">{member.doneTasks} done</span>
                    {member.totalTasks > 0 && (
                      <>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{Math.round((member.doneTasks / member.totalTasks) * 100)}%</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-24">
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${member.totalTasks > 0 ? (member.doneTasks / member.totalTasks) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Recent Tasks ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={`rounded-2xl border p-6 ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No tasks yet. Switch to Board view to create tasks.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.slice(0, 20).map(task => {
              const colInfo = {
                todo: { label: 'To Do', bg: isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600' },
                'in-progress': { label: 'In Progress', bg: isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-600' },
                review: { label: 'Review', bg: isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600' },
                done: { label: 'Done', bg: isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-600' },
                backlog: { label: 'Backlog', bg: isDark ? 'bg-gray-500/15 text-gray-400' : 'bg-gray-50 text-gray-600' },
              }[task.column] || { label: task.column, bg: isDark ? 'bg-gray-500/15 text-gray-400' : 'bg-gray-50 text-gray-600' };

              return (
                <div key={task.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.column === 'done' ? 'bg-green-500' : task.column === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'} ${task.column === 'done' ? 'line-through opacity-60' : ''}`}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {task.assignees.length > 0 && (
                      <div className="flex -space-x-1">
                        {task.assignees.slice(0, 2).map((a, i) => (
                          <div key={a.id} className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[10px] font-medium border ${isDark ? 'border-[#12121a]' : 'border-white'}`}>{a.name.charAt(0)}</div>
                        ))}
                      </div>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colInfo.bg}`}>{colInfo.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
