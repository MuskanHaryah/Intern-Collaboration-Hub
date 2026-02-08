# API Testing Quick Reference

## Quick Start

### Option 1: VS Code REST Client (Recommended)
1. Install "REST Client" extension in VS Code
2. Open `api-tests.rest`
3. Update the `@token` variable with your JWT token
4. Click "Send Request" above any request

### Option 2: Automated Node.js Script
```bash
cd server
node test-api-endpoints.js
```

### Option 3: Manual cURL Tests
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123","role":"intern"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get Projects (replace TOKEN)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer TOKEN"
```

## API Endpoint Summary

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user  
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /password` - Change password (protected)
- `POST /logout` - Logout (protected)

### Projects (`/api/projects`)
- `GET /` - Get all projects (protected)
- `POST /` - Create project (protected)
- `GET /:id` - Get single project (protected)
- `PUT /:id` - Update project (protected)
- `DELETE /:id` - Delete project (protected)
- `POST /:id/members` - Add member (protected)
- `DELETE /:id/members/:userId` - Remove member (protected)

### Tasks (`/api/projects/:projectId/tasks` & `/api/tasks`)
- `GET /projects/:projectId/tasks` - Get tasks for project (protected)
- `POST /projects/:projectId/tasks` - Create task (protected)
- `GET /tasks/:id` - Get single task (protected)
- `PUT /tasks/:id` - Update task (protected)
- `PUT /tasks/:id/move` - Move task column (protected)
- `DELETE /tasks/:id` - Delete task (protected)
- `POST /tasks/:id/comments` - Add comment (protected)
- `PUT /tasks/:id/checklist/:itemId` - Toggle checklist (protected)

### File Attachments (`/api/tasks/:id/attachments`)
- `POST /:id/attachments` - Upload file (protected, multipart/form-data)
- `GET /:id/attachments/:attachmentId/download` - Download file (protected)
- `DELETE /:id/attachments/:attachmentId` - Delete file (protected)

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

## Testing Workflow

1. **Register** a new user → Save token
2. **Create** a project → Save project ID
3. **Create** tasks in project → Save task IDs
4. **Update/Move** tasks
5. **Upload** attachments to tasks
6. **Delete** tasks/projects
7. **Logout**

## Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intern-hub
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start server:
```bash
cd server
npm install
npm run dev
```

## Resources

- **Full Documentation**: `API_TESTING_GUIDE.md`
- **REST Client File**: `api-tests.rest`
- **Automated Tests**: `test-api-endpoints.js`
