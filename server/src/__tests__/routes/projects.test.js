import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import projectRoutes from '../../routes/projects.js';
import Project from '../../models/Project.js';

// Mock Project model
jest.unstable_mockModule('../../models/Project.js', () => ({
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
    req.user = { id: 'user-id', role: 'mentor' };
    next();
  },
}));

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/projects', projectRoutes);
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message,
    });
  });
  
  return app;
};

describe('Project Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should get all projects', async () => {
      const mockProjects = [
        {
          _id: 'project-1',
          name: 'Project 1',
          description: 'Description 1',
        },
        {
          _id: 'project-2',
          name: 'Project 2',
          description: 'Description 2',
        },
      ];

      Project.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProjects),
        }),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.projects).toHaveLength(2);
    });

    it('should handle errors when fetching projects', async () => {
      Project.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get a single project by id', async () => {
      const mockProject = {
        _id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
      };

      Project.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProject),
      });

      const response = await request(app).get('/api/projects/project-1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.project.name).toBe('Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      Project.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).get('/api/projects/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        name: 'New Project',
        description: 'New Description',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockCreatedProject = {
        _id: 'new-project-id',
        ...newProject,
        createdBy: 'user-id',
      };

      Project.create.mockResolvedValue(mockCreatedProject);

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.project.name).toBe('New Project');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project', async () => {
      const updates = {
        name: 'Updated Project',
        description: 'Updated Description',
      };

      const mockUpdatedProject = {
        _id: 'project-1',
        ...updates,
      };

      Project.findByIdAndUpdate.mockResolvedValue(mockUpdatedProject);

      const response = await request(app)
        .put('/api/projects/project-1')
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.project.name).toBe('Updated Project');
    });

    it('should return 404 when updating non-existent project', async () => {
      Project.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/projects/non-existent')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      const mockDeletedProject = {
        _id: 'project-1',
        name: 'Deleted Project',
      };

      Project.findByIdAndDelete.mockResolvedValue(mockDeletedProject);

      const response = await request(app).delete('/api/projects/project-1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should return 404 when deleting non-existent project', async () => {
      Project.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/api/projects/non-existent');

      expect(response.status).toBe(404);
    });
  });
});
