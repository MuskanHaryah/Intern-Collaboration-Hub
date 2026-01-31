import express from 'express';
import {
  getTask,
  updateTask,
  moveTask,
  deleteTask,
  addComment,
  toggleChecklistItem,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task CRUD
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Move task (drag & drop)
router.put('/:id/move', moveTask);

// Comments
router.post('/:id/comments', addComment);

// Checklist
router.put('/:id/checklist/:itemId', toggleChecklistItem);

export default router;
