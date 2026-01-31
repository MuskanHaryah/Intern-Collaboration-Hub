import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

export default function KanbanBoard({ project, tasks, onTaskMove, onTaskUpdate, onTaskDelete }) {
  const [columns, setColumns] = useState(
    project?.taskColumns || [
      { id: 'todo', title: 'To Do', color: '#6b7280' },
      { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
      { id: 'review', title: 'Review', color: '#8b5cf6' },
      { id: 'done', title: 'Done', color: '#10b981' },
    ]
  );
  
  const [showAddTask, setShowAddTask] = useState(null); // column id
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Group tasks by column
  const getTasksByColumn = (columnId) => {
    return (tasks || [])
      .filter((task) => task.column === columnId)
      .sort((a, b) => a.order - b.order);
  };

  // Drag handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    // Add dragging class after a small delay for visual feedback
    setTimeout(() => {
      e.target.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedTask && draggedTask.column !== columnId) {
      const tasksInColumn = getTasksByColumn(columnId);
      const newOrder = tasksInColumn.length;
      
      onTaskMove?.(draggedTask.id, columnId, newOrder);
    }
    setDraggedTask(null);
  };

  const handleAddTask = (columnId, taskData) => {
    console.log('Add task to column:', columnId, taskData);
    // TODO: API call
    setShowAddTask(null);
  };

  return (
    <div className="h-full">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">
            {project?.name || 'Project Board'}
          </h2>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            {tasks?.length || 0} tasks
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-220px)]">
        {columns.map((column) => {
          const columnTasks = getTasksByColumn(column.id);
          const isOver = dragOverColumn === column.id;
          
          return (
            <div
              key={column.id}
              className={`flex-shrink-0 w-80 flex flex-col bg-[#12121a]/50 rounded-2xl border transition-all ${
                isOver
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10'
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="font-semibold text-white">{column.title}</h3>
                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddTask(column.id)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {columnTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={onTaskUpdate}
                      onDelete={onTaskDelete}
                    />
                  </motion.div>
                ))}

                {/* Empty State */}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tasks yet</p>
                    <button
                      onClick={() => setShowAddTask(column.id)}
                      className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                      + Add a task
                    </button>
                  </div>
                )}
              </div>

              {/* Add Task Button */}
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => setShowAddTask(column.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Column Button */}
        <div className="flex-shrink-0 w-80">
          <button className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-gray-400 hover:border-white/20 transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Column</span>
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          columnId={showAddTask}
          onClose={() => setShowAddTask(null)}
          onSubmit={handleAddTask}
        />
      )}
    </div>
  );
}
