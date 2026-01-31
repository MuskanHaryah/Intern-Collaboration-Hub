import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { createTask, getTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Project CRUD
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Project members
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

// Tasks for a project
router.route('/:projectId/tasks')
  .get(getTasks)
  .post(createTask);

export default router;
