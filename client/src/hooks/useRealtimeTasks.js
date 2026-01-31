import { useEffect, useCallback } from 'react';
import { useSocket } from '../socket';
import { 
  emitTaskCreated, 
  emitTaskUpdated, 
  emitTaskMoved, 
  emitTaskDeleted,
  emitStartEditingTask,
  emitStopEditingTask,
} from '../socket';
import { useProjectStore } from '../stores';

/**
 * Hook for real-time task operations
 * Wraps task actions with socket emissions
 */
export function useRealtimeTasks(projectId) {
  const { joinProjectRoom, leaveProjectRoom, isTaskBeingEdited, getTaskEditors } = useSocket();
  const { 
    tasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    moveTask,
  } = useProjectStore();

  // Join project room on mount
  useEffect(() => {
    if (projectId) {
      joinProjectRoom(projectId);
      return () => leaveProjectRoom(projectId);
    }
  }, [projectId, joinProjectRoom, leaveProjectRoom]);

  // Create task with socket emission
  const createTaskRealtime = useCallback(async (taskData) => {
    const result = await createTask({ ...taskData, project: projectId });
    if (result.success && result.task) {
      emitTaskCreated(result.task);
    }
    return result;
  }, [projectId, createTask]);

  // Update task with socket emission
  const updateTaskRealtime = useCallback(async (taskId, updates) => {
    const result = await updateTask(taskId, updates);
    if (result.success && result.task) {
      emitTaskUpdated(result.task);
    }
    return result;
  }, [updateTask]);

  // Delete task with socket emission
  const deleteTaskRealtime = useCallback(async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      emitTaskDeleted(taskId, projectId);
    }
    return result;
  }, [projectId, deleteTask]);

  // Move task with socket emission
  const moveTaskRealtime = useCallback(async (taskId, column, order) => {
    const result = await moveTask(taskId, column, order);
    if (result.success) {
      emitTaskMoved(taskId, projectId, column, order);
    }
    return result;
  }, [projectId, moveTask]);

  // Start editing a task
  const startEditing = useCallback((taskId) => {
    emitStartEditingTask(taskId, projectId);
  }, [projectId]);

  // Stop editing a task
  const stopEditing = useCallback((taskId) => {
    emitStopEditingTask(taskId, projectId);
  }, [projectId]);

  return {
    tasks,
    createTask: createTaskRealtime,
    updateTask: updateTaskRealtime,
    deleteTask: deleteTaskRealtime,
    moveTask: moveTaskRealtime,
    startEditing,
    stopEditing,
    isTaskBeingEdited,
    getTaskEditors,
  };
}

export default useRealtimeTasks;
