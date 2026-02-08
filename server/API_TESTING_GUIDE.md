# API Testing Guide

This guide provides comprehensive instructions for testing all API endpoints in the Intern Collaboration Hub.

## Table of Contents
- [Setup](#setup)
- [Authentication Flow](#authentication-flow)
- [Testing Tools](#testing-tools)
- [API Endpoints](#api-endpoints)
- [Testing Checklist](#testing-checklist)

---

## Setup

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: Update with your production URL

### Required Environment Variables
Ensure these are set in `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## Authentication Flow

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. **Register a new user**:
   ```
   POST /api/auth/register
   ```

2. **Login**:
   ```
   POST /api/auth/login
   ```
   Returns: `{ token: "your_jwt_token", user: {...} }`

3. **Use the token** in all subsequent requests

---

## Testing Tools

### Option 1: REST Client (VS Code Extension)
- Install "REST Client" extension
- Open `api-tests.rest` file
- Click "Send Request" above each request

### Option 2: Thunder Client (VS Code Extension)
- Install "Thunder Client" extension
- Import the collection (if provided)

### Option 3: Postman
- Import the Postman collection (if provided)
- Set environment variables for `baseUrl` and `token`

### Option 4: Node.js Script
```bash
cd server
node test-api-endpoints.js
```

### Option 5: cURL Commands
See examples in the [API Endpoints](#api-endpoints) section below.

---

## API Endpoints

### 🔐 Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "intern"
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "intern"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"intern"}'
```

---

#### 2. Login User
**POST** `/api/auth/login`

**Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "intern"
  }
}
```

---

#### 3. Get Current User
**GET** `/api/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "user": {
    "_id": "60f...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "intern"
  }
}
```

---

#### 4. Update Profile
**PUT** `/api/auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

---

#### 5. Change Password
**PUT** `/api/auth/password`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

#### 6. Logout
**POST** `/api/auth/logout`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 📁 Project Endpoints

#### 1. Get All Projects
**GET** `/api/projects`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "60f...",
      "name": "Project Alpha",
      "description": "First project",
      "owner": "60f...",
      "members": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 2. Create Project
**POST** `/api/projects`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "name": "New Project",
  "description": "Project description",
  "deadline": "2024-12-31",
  "members": []
}
```

**Expected Response (201)**:
```json
{
  "success": true,
  "project": {
    "_id": "60f...",
    "name": "New Project",
    "description": "Project description",
    "owner": "60f...",
    "members": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 3. Get Single Project
**GET** `/api/projects/:id`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "project": {
    "_id": "60f...",
    "name": "Project Alpha",
    "description": "First project",
    "owner": {...},
    "members": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 4. Update Project
**PUT** `/api/projects/:id`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

---

#### 5. Delete Project
**DELETE** `/api/projects/:id`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

#### 6. Add Member to Project
**POST** `/api/projects/:id/members`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "userId": "60f...",
  "role": "member"
}
```

---

#### 7. Remove Member from Project
**DELETE** `/api/projects/:id/members/:userId`

**Headers**: `Authorization: Bearer <token>`

---

### ✅ Task Endpoints

#### 1. Get Tasks for Project
**GET** `/api/projects/:projectId/tasks`

**Headers**: `Authorization: Bearer <token>`

**Expected Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "tasks": [
    {
      "_id": "60f...",
      "title": "Task 1",
      "description": "Description",
      "column": "todo",
      "priority": "high",
      "assignees": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 2. Create Task
**POST** `/api/projects/:projectId/tasks`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "New Task",
  "description": "Task description",
  "column": "todo",
  "priority": "medium",
  "deadline": "2024-12-31",
  "assignees": [],
  "tags": ["feature", "urgent"]
}
```

---

#### 3. Get Single Task
**GET** `/api/tasks/:id`

**Headers**: `Authorization: Bearer <token>`

---

#### 4. Update Task
**PUT** `/api/tasks/:id`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "priority": "high",
  "assignees": ["60f..."]
}
```

---

#### 5. Move Task (Drag & Drop)
**PUT** `/api/tasks/:id/move`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "column": "in-progress",
  "order": 2
}
```

---

#### 6. Delete Task
**DELETE** `/api/tasks/:id`

**Headers**: `Authorization: Bearer <token>`

---

#### 7. Add Comment to Task
**POST** `/api/tasks/:id/comments`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "text": "This is a comment"
}
```

---

#### 8. Toggle Checklist Item
**PUT** `/api/tasks/:id/checklist/:itemId`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "completed": true
}
```

---

### 📎 File Attachment Endpoints

#### 1. Upload Attachment
**POST** `/api/tasks/:id/attachments`

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body** (FormData):
- `file`: File object (max 10MB)

**Expected Response (200)**:
```json
{
  "success": true,
  "attachment": {
    "_id": "60f...",
    "filename": "document.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "uploadedBy": "60f...",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/tasks/TASK_ID/attachments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

---

#### 2. Delete Attachment
**DELETE** `/api/tasks/:id/attachments/:attachmentId`

**Headers**: `Authorization: Bearer <token>`

---

#### 3. Download Attachment
**GET** `/api/tasks/:id/attachments/:attachmentId/download`

**Headers**: `Authorization: Bearer <token>`

**Returns**: File download

---

## Testing Checklist

### ✅ Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Get current user profile
- [ ] Update profile
- [ ] Change password
- [ ] Logout

### ✅ Projects
- [ ] Get all projects (empty list initially)
- [ ] Create new project
- [ ] Get single project
- [ ] Update project
- [ ] Add member to project
- [ ] Remove member from project
- [ ] Delete project

### ✅ Tasks
- [ ] Get tasks for project (empty initially)
- [ ] Create new task
- [ ] Get single task
- [ ] Update task
- [ ] Move task to different column
- [ ] Add comment to task
- [ ] Toggle checklist item
- [ ] Delete task

### ✅ File Attachments
- [ ] Upload file to task (PDF)
- [ ] Upload file to task (Image)
- [ ] Upload file to task (Document)
- [ ] Download attachment
- [ ] Delete attachment
- [ ] Verify file size limit (max 10MB)
- [ ] Test invalid file types

### ✅ Error Handling
- [ ] Access protected route without token (401)
- [ ] Access protected route with invalid token (401)
- [ ] Create resource with missing required fields (400)
- [ ] Update non-existent resource (404)
- [ ] Delete non-existent resource (404)
- [ ] Access resource without permission (403)

### ✅ Edge Cases
- [ ] Register with duplicate email (should fail)
- [ ] Upload file larger than 10MB (should fail)
- [ ] Create project with very long name
- [ ] Create task with special characters
- [ ] Test pagination (if implemented)
- [ ] Test search/filter (if implemented)

---

## Common Issues & Troubleshooting

### Issue: 401 Unauthorized
**Solution**: Ensure the Authorization header is set correctly:
```
Authorization: Bearer YOUR_ACTUAL_TOKEN
```

### Issue: CORS Error
**Solution**: Server must allow requests from your frontend origin. Check CORS configuration in `server/src/index.js`.

### Issue: MongoDB Connection Failed
**Solution**: Verify `MONGO_URI` in `.env` file is correct and MongoDB is running.

### Issue: File Upload Fails
**Solution**: 
- Check file size (max 10MB)
- Verify `uploads/` directory exists
- Ensure proper `Content-Type: multipart/form-data` header

### Issue: 404 Not Found
**Solution**: Verify the endpoint URL is correct and the server is running on the expected port.

---

## Testing Best Practices

1. **Test in Order**: Start with authentication, then projects, then tasks
2. **Save IDs**: Save project IDs and task IDs from responses to use in subsequent requests
3. **Clean Up**: Delete test data after testing
4. **Use Different Users**: Test with different user roles (intern, mentor, admin)
5. **Test Edge Cases**: Don't just test happy paths
6. **Document Results**: Keep track of what works and what doesn't
7. **Automate**: Use the provided scripts for automated testing

---

## Next Steps

After testing all endpoints:
1. Document any bugs or issues found
2. Verify all real-time Socket.IO events work correctly
3. Test the full user flow from registration to task completion
4. Perform load testing if needed
5. Test in production environment before deployment

---

**Last Updated**: February 8, 2026
