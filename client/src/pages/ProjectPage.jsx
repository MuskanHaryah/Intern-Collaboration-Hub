import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { KanbanBoard } from '../components/Kanban';
import { MilestoneList, MilestoneProgress } from '../components/Milestones';
import { useSocket } from '../socket';
import { OnlineUsers, LoadingStates, ErrorStates } from '../components/UI';
import { projectService, taskService } from '../services';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // board, list, timeline
  const [showMilestones, setShowMilestones] = useState(true);
  const { joinProjectRoom, leaveProjectRoom, onlineUsers, isConnected } = useSocket();

  // Join project room on mount, leave on unmount
  useEffect(() => {
    if (projectId && isConnected) {
      joinProjectRoom(projectId);
    }
    
    return () => {
      if (projectId) {
        leaveProjectRoom(projectId);
      }
    };
  }, [projectId, isConnected, joinProjectRoom, leaveProjectRoom]);

  // Fetch project data from API
  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch project details
      const projectResponse = await projectService.getById(projectId);
      const projectData = projectResponse.data;
      
      // Fetch tasks for this project
      const tasksResponse = await taskService.getByProject(projectId);
      const tasksData = tasksResponse.data || [];
      
      // Transform project data to match component expectations
      const transformedProject = {
        id: projectData._id,
        name: projectData.name,
        description: projectData.description || '',
        color: projectData.color || '#b026ff',
        status: projectData.status || 'active',
        priority: projectData.priority || 'medium',
        taskColumns: projectData.taskColumns || [
          { id: 'backlog', name: 'Backlog', color: '#6b7280', order: 0 },
          { id: 'todo', name: 'To Do', color: '#3b82f6', order: 1 },
          { id: 'in-progress', name: 'In Progress', color: '#f59e0b', order: 2 },
          { id: 'review', name: 'Review', color: '#8b5cf6', order: 3 },
          { id: 'done', name: 'Done', color: '#10b981', order: 4 },
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
        createdAt: projectData.createdAt,
      };
      
      // Transform tasks
      const transformedTasks = tasksData.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description || '',
        column: task.column || 'backlog',
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
      }));
      
      // Extract milestones from project
      const transformedMilestones = (projectData.milestones || []).map(m => ({
        id: m._id,
        title: m.title,
        description: m.description || '',
        dueDate: m.dueDate,
        completed: m.completed || false,
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

  const handleAddTask = async (taskData) => {
    try {
      const response = await taskService.create({
        ...taskData,
        project: projectId,
      });
      
      if (response.success && response.data) {
        const newTask = {
          id: response.data._id,
          title: response.data.title,
          description: response.data.description || '',
          column: response.data.column || taskData.column,
          order: response.data.order || 0,
          priority: response.data.priority || 'medium',
          labels: response.data.labels || [],
          assignees: (response.data.assignees || []).map(a => ({
            id: a._id || a,
            name: a.name || 'User',
            email: a.email,
            avatar: a.avatar,
          })),
          checklist: response.data.checklist || [],
          comments: response.data.comments || [],
          dueDate: response.data.dueDate || null,
        };
        setTasks([...tasks, newTask]);
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskService.update(taskId, updates);
      
      if (response.success && response.data) {
        setTasks(tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              ...updates,
              assignees: response.data.assignees ? (response.data.assignees || []).map(a => ({
                id: a._id || a,
                name: a.name || 'User',
                email: a.email,
                avatar: a.avatar,
              })) : t.assignees,
            };
          }
          return t;
        }));
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await taskService.delete(taskId);
      
      if (response.success) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleMoveTask = async (taskId, newColumn, newOrder) => {
    // Optimistic update
    const oldTasks = [...tasks];
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, column: newColumn, order: newOrder } : t
      )
    );
    
    try {
      await taskService.move(taskId, { column: newColumn, order: newOrder });
    } catch (err) {
      console.error('Error moving task:', err);
      // Revert on error
      setTasks(oldTasks);
    }
  };

  // Milestone handlers
  const handleAddMilestone = async (milestoneData) => {
    try {
      const response = await projectService.addMilestone(projectId, milestoneData);
      
      if (response.success && response.data) {
        // Extract the new milestone from updated project
        const updatedMilestones = response.data.milestones || [];
        const transformedMilestones = updatedMilestones.map(m => ({
          id: m._id,
          title: m.title,
          description: m.description || '',
          dueDate: m.dueDate,
          completed: m.completed || false,
          project: projectId,
        }));
        setMilestones(transformedMilestones);
      }
    } catch (err) {
      console.error('Error adding milestone:', err);
    }
  };

  const handleUpdateMilestone = async (milestoneId, updates) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneId, updates);
      
      if (response.success && response.data) {
        const updatedMilestones = response.data.milestones || [];
        const transformedMilestones = updatedMilestones.map(m => ({
          id: m._id,
          title: m.title,
          description: m.description || '',
          dueDate: m.dueDate,
          completed: m.completed || false,
          project: projectId,
        }));
        setMilestones(transformedMilestones);
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      const response = await projectService.deleteMilestone(projectId, milestoneId);
      
      if (response.success) {
        setMilestones(milestones.filter((m) => m.id !== milestoneId && m._id !== milestoneId));
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  const handleToggleMilestone = async (milestoneId, completed) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneId, { completed });
      
      if (response.success) {
        setMilestones(
          milestones.map((m) => 
            (m.id === milestoneId || m._id === milestoneId) ? { ...m, completed } : m
          )
        );
      }
    } catch (err) {
      console.error('Error toggling milestone:', err);
    }
  };

  if (loading) {
    return <LoadingStates.LoadingOverlay fullScreen message="Loading project..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <ErrorStates.ErrorMessage
          message={error}
          onRetry={fetchProjectData}
        />
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
              {/* Online Users */}
              <OnlineUsers users={onlineUsers} />

              {/* Connection Status */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>

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

            {/* Milestones Toggle */}
            <button
              onClick={() => setShowMilestones(!showMilestones)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                showMilestones
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Milestones
              <span className="px-1.5 py-0.5 bg-white/10 rounded text-xs">
                {milestones.filter(m => m.completed).length}/{milestones.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-160px)]">
        {/* Kanban Board */}
        <div className={`flex-1 overflow-hidden transition-all ${showMilestones ? 'pr-0' : ''}`}>
          <KanbanBoard
            columns={project.taskColumns}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            projectMembers={project.members}
          />
        </div>

        {/* Milestones Sidebar */}
        {showMilestones && (
          <div className="w-96 flex-shrink-0 p-4 border-l border-white/5 overflow-y-auto">
            <MilestoneList
              milestones={milestones}
              tasks={tasks}
              projectId={projectId}
              onAddMilestone={handleAddMilestone}
              onUpdateMilestone={handleUpdateMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              onToggleMilestone={handleToggleMilestone}
            />
          </div>
        )}
      </main>
    </div>
  );
}
