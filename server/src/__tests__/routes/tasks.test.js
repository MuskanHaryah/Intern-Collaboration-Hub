import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import taskRoutes from '../../routes/tasks.js';
import Task from '../../models/Task.js';

// Mock Task model
jest.unstable_mockModule('../../models/Task.js', () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// Mock auth middleware
jest.unstable_mockModule('../../middleware/auth.js', () => ({
  protect: (req, res, next) => {
    req.user = { id: 'user-id', role: 'intern' };
    next();
  },
}));

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/tasks', taskRoutes);
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message,
    });
  });
  
  return app;
};

describe('Task Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const mockTasks = [
        {
          _id: 'task-1',
          title: 'Task 1',
          status: 'todo',
        },
        {
          _id: 'task-2',
          title: 'Task 2',
          status: 'in-progress',
        },
      ];

      Task.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockTasks),
        }),
      });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tasks).toHaveLength(2);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a single task by id', async () => {
      const mockTask = {
        _id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
      };

      Task.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTask),
      });

      const response = await request(app).get('/api/tasks/task-1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      Task.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).get('/api/tasks/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'medium',
        project: 'project-id',
      };

      const mockCreatedTask = {
        _id: 'new-task-id',
        ...newTask,
        createdBy: 'user-id',
      };

      Task.create.mockResolvedValue(mockCreatedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.title).toBe('New Task');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updates = {
        title: 'Updated Task',
        status: 'in-progress',
      };

      const mockUpdatedTask = {
        _id: 'task-1',
        ...updates,
      };

      Task.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

      const response = await request(app)
        .put('/api/tasks/task-1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.task.status).toBe('in-progress');
    });

    it('should return 404 when updating non-existent task', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/non-existent')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const mockDeletedTask = {
        _id: 'task-1',
        title: 'Deleted Task',
      };

      Task.findByIdAndDelete.mockResolvedValue(mockDeletedTask);

      const response = await request(app).delete('/api/tasks/task-1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should return 404 when deleting non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/api/tasks/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const mockTask = {
        _id: 'task-1',
        title: 'Test Task',
        status: 'in-progress',
        save: jest.fn().mockResolvedValue(this),
      };

      Task.findById.mockResolvedValue(mockTask);

      const response = await request(app)
        .patch('/api/tasks/task-1/status')
        .send({ status: 'done' });

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/tasks/:id/assign', () => {
    it('should assign task to user', async () => {
      const mockTask = {
        _id: 'task-1',
        title: 'Test Task',
        assignedTo: [],
        save: jest.fn().mockResolvedValue(this),
      };

      Task.findById.mockResolvedValue(mockTask);

      const response = await request(app)
        .put('/api/tasks/task-1/assign')
        .send({ userId: 'new-user-id' });

      expect(response.status).toBe(200);
    });
  });
});
