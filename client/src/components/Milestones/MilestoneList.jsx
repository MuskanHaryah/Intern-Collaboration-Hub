import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MilestoneCard from './MilestoneCard';
import AddMilestoneModal from './AddMilestoneModal';
import useThemeStore from '../../stores/themeStore';

/**
 * MilestoneList - Main milestone tracking component
 */
export default function MilestoneList({
  milestones = [],
  tasks = [],
  projectId,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onToggleMilestone,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const isDark = useThemeStore((s) => s.theme) === 'dark';

  // Calculate milestone stats
  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.completed).length;
    const active = total - completed;
    const overdue = milestones.filter(m => {
      if (m.completed) return false;
      return new Date(m.dueDate) < new Date();
    }).length;

    return { total, completed, active, overdue };
  }, [milestones]);

  // Filter milestones
  const filteredMilestones = useMemo(() => {
    let filtered = [...milestones];
    
    if (filter === 'active') {
      filtered = filtered.filter(m => !m.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(m => m.completed);
    }
    
    // Sort by due date, then by completion status
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Active first
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [milestones, filter]);

  // Get task progress for each milestone
  const getMilestoneProgress = (milestone) => {
    // For now, we'll calculate based on linked tasks or all tasks
    // You can modify this logic based on your task-milestone relationship
    const milestoneTasks = tasks.filter(t => t.milestone === (milestone._id || milestone.id));
    
    if (milestoneTasks.length === 0) {
      // If no tasks linked, use all done tasks as a rough estimate
      return {
        completed: 0,
        total: 0
      };
    }
    
    return {
      completed: milestoneTasks.filter(t => t.column === 'done').length,
      total: milestoneTasks.length
    };
  };

  // Overall progress
  const overallProgress = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const handleSubmit = async (data) => {
    if (editingMilestone) {
      await onUpdateMilestone?.(data._id, data);
    } else {
      await onAddMilestone?.(data);
    }
    setEditingMilestone(null);
  };

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingMilestone(null);
  };

  return (
    <div className={`backdrop-blur-sm rounded-2xl overflow-hidden ${isDark ? 'bg-[#12121a]/80 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
      {/* Header */}
      <div 
        className={`p-4 border-b cursor-pointer transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Milestones</h3>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Track major project goals & deadlines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Overall Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-xs text-gray-500">
                  {stats.completed} of {stats.total}
                  {stats.overdue > 0 && (
                    <span className="text-red-400 ml-1">• {stats.overdue} overdue</span>
                  )}
                </p>
              </div>
              <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
              <span className="text-sm font-medium text-purple-400">{overallProgress}%</span>
            </div>

            {/* Add Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Expand/Collapse */}
            <motion.div
              animate={{ rotate: isExpanded ? 0 : -90 }}
              className="text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Filters */}
            {milestones.length > 0 && (
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {f === 'all' && ` (${stats.total})`}
                    {f === 'active' && ` (${stats.active})`}
                    {f === 'completed' && ` (${stats.completed})`}
                  </button>
                ))}
              </div>
            )}

            {/* Milestone List */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {filteredMilestones.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">
                    {filter === 'all' 
                      ? 'No milestones yet' 
                      : `No ${filter} milestones`}
                  </p>
                  {filter === 'all' && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      + Add your first milestone
                    </button>
                  )}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredMilestones.map((milestone) => {
                    const progress = getMilestoneProgress(milestone);
                    return (
                      <MilestoneCard
                        key={milestone._id || milestone.id}
                        milestone={milestone}
                        tasksCompleted={progress.completed}
                        totalTasks={progress.total}
                        onToggleComplete={onToggleMilestone}
                        onEdit={handleEdit}
                        onDelete={onDeleteMilestone}
                      />
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AddMilestoneModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        milestone={editingMilestone}
        projectId={projectId}
      />
    </div>
  );
}
