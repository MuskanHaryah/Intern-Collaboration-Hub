import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import { useSocket } from '../../socket';
import useThemeStore from '../../stores/themeStore';

export default function KanbanBoard({ 
  columns: initialColumns, 
  tasks, 
  onAddTask,
  onUpdateTask, 
  onDeleteTask,
  onMoveTask,
  projectMembers = [],
  isOwner = false,
}) {
  const isDark = useThemeStore((s) => s.theme) === 'dark';
  const { editingUsers } = useSocket();
  const [columns, setColumns] = useState(
    initialColumns || [
      { id: 'backlog', name: 'Backlog', color: '#6b7280', order: 0 },
      { id: 'todo', name: 'To Do', color: '#3b82f6', order: 1 },
      { id: 'in-progress', name: 'In Progress', color: '#f59e0b', order: 2 },
      { id: 'review', name: 'Review', color: '#8b5cf6', order: 3 },
      { id: 'done', name: 'Done', color: '#10b981', order: 4 },
    ]
  );
  
  const [showAddTask, setShowAddTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Group and filter tasks by column
  const getTasksByColumn = useCallback((columnId) => {
    return (tasks || [])
      .filter((task) => {
        const matchesColumn = task.column === columnId;
        const matchesSearch = !searchQuery || 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesColumn && matchesSearch && matchesPriority;
      })
      .sort((a, b) => a.order - b.order);
  }, [tasks, searchQuery, filterPriority]);

  // Handle drag end - this is where react-beautiful-dnd shines
  const handleDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // No destination - dropped outside
    if (!destination) return;

    // Same position - no change
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Calculate new order
    const destTasks = getTasksByColumn(destination.droppableId);
    let newOrder;

    if (destTasks.length === 0) {
      newOrder = 0;
    } else if (destination.index === 0) {
      newOrder = destTasks[0].order - 1;
    } else if (destination.index >= destTasks.length) {
      newOrder = destTasks[destTasks.length - 1].order + 1;
    } else {
      const prevTask = destTasks[destination.index - 1];
      const nextTask = destTasks[destination.index];
      newOrder = (prevTask.order + nextTask.order) / 2;
    }

    // Call the move handler
    onMoveTask?.(draggableId, destination.droppableId, newOrder);
  }, [tasks, getTasksByColumn, onMoveTask]);

  const handleAddTask = (taskData) => {
    onAddTask?.(taskData);
    setShowAddTask(null);
  };

  const handleTaskView = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask) => {
    onUpdateTask?.(updatedTask._id || updatedTask.id, updatedTask);
    setSelectedTask(updatedTask);
  };

  const totalTasks = tasks?.length || 0;
  const filteredTasks = columns.reduce((sum, col) => sum + getTasksByColumn(col.id).length, 0);

  return (
    <div className="h-full flex flex-col px-6 py-4">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
            {filteredTasks} {filteredTasks !== totalTasks ? `of ${totalTasks}` : ''} tasks
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 px-2 py-1 bg-white/5 text-gray-400 rounded-lg text-sm hover:bg-white/10 transition-all"
            >
              <span>Clear search</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all ${
                filterPriority !== 'all'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {filterPriority !== 'all' && (
                <span className="ml-1 px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded">1</span>
              )}
            </button>
            
            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl z-50 overflow-hidden ${isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-200'}`}
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs text-gray-500 font-medium uppercase">Priority</p>
                    {['all', 'urgent', 'high', 'medium', 'low'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => {
                          setFilterPriority(priority);
                          setShowFilters(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          filterPriority === priority
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {priority === 'all' ? (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${
                            priority === 'urgent' ? 'bg-red-500' :
                            priority === 'high' ? 'bg-orange-500' :
                            priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`} />
                        )}
                        <span className="capitalize">{priority === 'all' ? 'All Priorities' : priority}</span>
                        {filterPriority === priority && (
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-purple-500 transition-all w-64 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>
      </div>

      {/* Kanban Board with react-beautiful-dnd */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          {columns.sort((a, b) => a.order - b.order).map((column) => {
            const columnTasks = getTasksByColumn(column.id);
            
            return (
              <div
                key={column.id}
                className={`flex-shrink-0 w-80 flex flex-col rounded-2xl border h-full ${isDark ? 'bg-[#12121a]/50 border-white/10' : 'bg-white/60 border-gray-200'}`}
              >
                {/* Column Header */}
                <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shadow-lg"
                        style={{ 
                          backgroundColor: column.color,
                          boxShadow: `0 0 10px ${column.color}50`
                        }}
                      />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{column.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        {columnTasks.length}
                      </span>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => setShowAddTask(column.id)}
                        className={`p-1.5 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-purple-500/10 border-purple-500/30' 
                          : ''
                      }`}
                      style={{ minHeight: '100px' }}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transform transition-transform ${
                                snapshot.isDragging 
                                  ? 'rotate-2 scale-105 shadow-2xl shadow-purple-500/20' 
                                  : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onUpdate={(updates) => onUpdateTask?.(task.id, updates)}
                                onDelete={() => onDeleteTask?.(task.id)}
                                onView={handleTaskView}
                                isDragging={snapshot.isDragging}
                                editingUsers={editingUsers[task.id] || []}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty State */}
                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-8 text-gray-500">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-sm mb-2">No tasks</p>
                          {isOwner && (
                            <button
                              onClick={() => setShowAddTask(column.id)}
                              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                            >
                              + Add first task
                            </button>
                          )}
                        </div>
                      )}

                      {/* Drop indicator when dragging over empty column */}
                      {columnTasks.length === 0 && snapshot.isDraggingOver && (
                        <div className="h-24 border-2 border-dashed border-purple-500/50 rounded-xl flex items-center justify-center">
                          <span className="text-purple-400 text-sm">Drop here</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Add Task Button */}
                {isOwner && (
                  <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <button
                      onClick={() => setShowAddTask(column.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all group ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                      <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Column Button */}
          <div className="flex-shrink-0 w-80">
            <button className={`w-full h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group ${isDark ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-purple-500/10 flex items-center justify-center transition-all">
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">Add Column</span>
            </button>
          </div>
        </div>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        projectMembers={projectMembers}
      />
      </DragDropContext>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={!!showAddTask}
        onClose={() => setShowAddTask(null)}
        onSubmit={handleAddTask}
        columnId={showAddTask}
        projectMembers={projectMembers}
      />
    </div>
  );
}
