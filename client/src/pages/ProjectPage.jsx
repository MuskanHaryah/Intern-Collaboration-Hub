import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KanbanBoard, AddTaskModal } from '../components/Kanban';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // board, list, timeline

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    // Simulate loading
    const mockProject = {
      id: projectId,
      name: 'Project Alpha',
      description: 'A collaborative project for the intern team to build amazing features.',
      color: '#b026ff',
      status: 'active',
      priority: 'high',
      taskColumns: [
        { id: 'backlog', name: 'Backlog', color: '#6b7280', order: 0 },
        { id: 'todo', name: 'To Do', color: '#3b82f6', order: 1 },
        { id: 'in-progress', name: 'In Progress', color: '#f59e0b', order: 2 },
        { id: 'review', name: 'Review', color: '#8b5cf6', order: 3 },
        { id: 'done', name: 'Done', color: '#10b981', order: 4 },
      ],
      members: [
        { id: '1', name: 'John Doe', role: 'owner', avatar: null },
        { id: '2', name: 'Jane Smith', role: 'member', avatar: null },
        { id: '3', name: 'Bob Wilson', role: 'member', avatar: null },
      ],
      milestones: [
        { id: '1', title: 'Phase 1 Complete', dueDate: '2024-02-01', status: 'completed' },
        { id: '2', title: 'Beta Release', dueDate: '2024-03-15', status: 'in-progress' },
      ],
      createdAt: '2024-01-15',
    };

    const mockTasks = [
      {
        id: '1',
        title: 'Design system setup',
        description: 'Create the foundational design tokens and component library',
        column: 'done',
        order: 0,
        priority: 'high',
        labels: [{ name: 'Design', color: '#ff2d95' }],
        assignees: [{ id: '1', name: 'John Doe' }],
        checklist: [
          { text: 'Color tokens', isCompleted: true },
          { text: 'Typography scale', isCompleted: true },
          { text: 'Spacing system', isCompleted: true },
        ],
        comments: [{ id: '1', text: 'Looks great!' }],
        dueDate: '2024-01-20',
      },
      {
        id: '2',
        title: 'User authentication flow',
        description: 'Implement login, register, and password reset functionality',
        column: 'in-progress',
        order: 0,
        priority: 'urgent',
        labels: [{ name: 'Backend', color: '#00d4ff' }, { name: 'Security', color: '#ff5555' }],
        assignees: [{ id: '2', name: 'Jane Smith' }, { id: '3', name: 'Bob Wilson' }],
        checklist: [
          { text: 'Login endpoint', isCompleted: true },
          { text: 'Register endpoint', isCompleted: true },
          { text: 'JWT tokens', isCompleted: false },
          { text: 'Password reset', isCompleted: false },
        ],
        comments: [],
        dueDate: '2024-01-25',
      },
      {
        id: '3',
        title: 'Dashboard UI',
        description: 'Build the main dashboard interface with stats and recent activity',
        column: 'review',
        order: 0,
        priority: 'medium',
        labels: [{ name: 'Frontend', color: '#b026ff' }],
        assignees: [{ id: '1', name: 'John Doe' }],
        checklist: [],
        comments: [{ id: '1', text: 'Ready for review' }],
        dueDate: '2024-01-28',
      },
      {
        id: '4',
        title: 'API documentation',
        description: 'Document all API endpoints with examples',
        column: 'todo',
        order: 0,
        priority: 'low',
        labels: [{ name: 'Documentation', color: '#00ff88' }],
        assignees: [],
        checklist: [],
        comments: [],
        dueDate: null,
      },
      {
        id: '5',
        title: 'Real-time notifications',
        description: 'Implement Socket.IO for live updates and notifications',
        column: 'backlog',
        order: 0,
        priority: 'medium',
        labels: [{ name: 'Backend', color: '#00d4ff' }, { name: 'Feature', color: '#ffaa00' }],
        assignees: [],
        checklist: [],
        comments: [],
        dueDate: '2024-02-15',
      },
      {
        id: '6',
        title: 'Mobile responsive design',
        description: 'Ensure all pages work well on mobile devices',
        column: 'backlog',
        order: 1,
        priority: 'high',
        labels: [{ name: 'Frontend', color: '#b026ff' }, { name: 'Design', color: '#ff2d95' }],
        assignees: [],
        checklist: [],
        comments: [],
        dueDate: null,
      },
    ];

    setTimeout(() => {
      setProject(mockProject);
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, [projectId]);

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      order: tasks.filter((t) => t.column === taskData.column).length,
      comments: [],
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleMoveTask = (taskId, newColumn, newOrder) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, column: newColumn, order: newOrder } : t
      )
    );
  };

  const openAddTaskModal = (columnId) => {
    setActiveColumn(columnId);
    setShowAddTask(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.column === 'done').length,
    inProgress: tasks.filter((t) => t.column === 'in-progress').length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.column !== 'done').length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb & Title */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Link to="/dashboard" className="hover:text-purple-400 transition-all">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span className="text-gray-400">{project.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-white/5 rounded-lg p-1">
                {[
                  { id: 'board', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
                  { id: 'list', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                ].map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setViewMode(view.id)}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === view.id
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={view.icon} />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Members */}
              <div className="flex -space-x-2">
                {project.members.slice(0, 4).map((member, index) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0a0a0f] flex items-center justify-center text-white text-sm font-medium"
                    title={member.name}
                  >
                    {member.name.charAt(0)}
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0a0f] flex items-center justify-center text-gray-400 text-sm">
                    +{project.members.length - 4}
                  </div>
                )}
                <button className="w-8 h-8 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Tasks:</span>
              <span className="text-white font-medium">{taskStats.total}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-500">Completed:</span>
              <span className="text-white font-medium">{taskStats.completed}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-gray-500">In Progress:</span>
              <span className="text-white font-medium">{taskStats.inProgress}</span>
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
              <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                />
              </div>
              <span className="text-gray-400">
                {Math.round((taskStats.completed / taskStats.total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-160px)]">
        <KanbanBoard
          columns={project.taskColumns}
          tasks={tasks}
          onAddTask={openAddTaskModal}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => {
          setShowAddTask(false);
          setActiveColumn(null);
        }}
        onSubmit={handleAddTask}
        columnId={activeColumn}
        projectMembers={project.members}
      />
    </div>
  );
}
