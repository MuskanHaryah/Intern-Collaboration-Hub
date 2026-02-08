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
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle, handleMulterError } from '../middleware/upload.js';

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

// File Attachments
router.post('/:id/attachments', uploadSingle, handleMulterError, uploadAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);
router.get('/:id/attachments/:attachmentId/download', downloadAttachment);

export default router;
