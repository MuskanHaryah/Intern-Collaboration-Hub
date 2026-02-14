import express from 'express';
import {
  getTask,
  updateTask,
  moveTask,
  deleteTask,
  addComment,
  toggleChecklistItem,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
  getMyTasks,
} from '../controllers/taskController.js';
import { createTask, getTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get tasks assigned to the current user across all projects
router.get('/my', getMyTasks);

// Get tasks for a specific project (matches client's taskService.getByProject)
router.get('/project/:projectId', getTasks);

// Create task (project ID in request body)
router.post('/', async (req, res, next) => {
  // The createTask controller reads projectId from req.params.projectId
  // but this route gets it from req.body.project
  req.params.projectId = req.body.project;
  next();
}, createTask);

// Task CRUD
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Move task (drag & drop) — support both PUT and PATCH
router.put('/:id/move', moveTask);
router.patch('/:id/move', moveTask);

// Comments
router.post('/:id/comments', addComment);

// Checklist
router.put('/:id/checklist/:itemId', toggleChecklistItem);

// File Attachments
router.post('/:id/attachments', uploadSingle, handleMulterError, uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);
router.get('/:id/attachments/:attachmentId/download', downloadAttachment);

export default router;
