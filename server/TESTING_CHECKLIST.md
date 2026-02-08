# API Testing Checklist

## Pre-Testing Setup
- [ ] MongoDB is running
- [ ] Server is running (`npm run dev`)
- [ ] `.env` file is properly configured
- [ ] All dependencies are installed (`npm install`)

---

## Authentication Endpoints

### Registration
- [ ] Register with valid data (201 Created)
- [ ] Register with duplicate email (400 Bad Request)
- [ ] Register with missing name (400 Bad Request)
- [ ] Register with missing email (400 Bad Request)
- [ ] Register with missing password (400 Bad Request)
- [ ] Register with invalid email format (400 Bad Request)
- [ ] Register with short password (<6 chars) (400 Bad Request)
- [ ] Verify token is returned in response
- [ ] Verify user object is returned in response

### Login
- [ ] Login with valid credentials (200 OK)
- [ ] Login with invalid email (401 Unauthorized)
- [ ] Login with wrong password (401 Unauthorized)
- [ ] Login with non-existent user (401 Unauthorized)
- [ ] Verify token is returned in response
- [ ] Verify user object is returned in response

### Get Current User
- [ ] Get user with valid token (200 OK)
- [ ] Get user without token (401 Unauthorized)
- [ ] Get user with invalid token (401 Unauthorized)
- [ ] Get user with expired token (401 Unauthorized)
- [ ] Verify user data is complete

### Update Profile
- [ ] Update name (200 OK)
- [ ] Update email (200 OK)
- [ ] Update with invalid email format (400 Bad Request)
- [ ] Update with duplicate email (400 Bad Request)
- [ ] Update without token (401 Unauthorized)
- [ ] Verify changes are persisted

### Change Password
- [ ] Change password with correct current password (200 OK)
- [ ] Change password with wrong current password (401 Unauthorized)
- [ ] Change password without token (401 Unauthorized)
- [ ] Change to short password (<6 chars) (400 Bad Request)
- [ ] Verify new password works for login

### Logout
- [ ] Logout with valid token (200 OK)
- [ ] Logout without token (401 Unauthorized)

---

## Project Endpoints

### Get All Projects
- [ ] Get projects with valid token (200 OK)
- [ ] Get projects without token (401 Unauthorized)
- [ ] Verify projects array is returned
- [ ] Verify count field is present
- [ ] Check empty array when no projects exist

### Create Project
- [ ] Create project with all required fields (201 Created)
- [ ] Create project without name (400 Bad Request)
- [ ] Create project without description (should work - optional field)
- [ ] Create project with very long name (test limits)
- [ ] Create project with special characters in name
- [ ] Create project without token (401 Unauthorized)
- [ ] Verify project ID is returned
- [ ] Verify owner is set to current user
- [ ] Verify timestamps (createdAt, updatedAt)

### Get Single Project
- [ ] Get existing project (200 OK)
- [ ] Get non-existent project (404 Not Found)
- [ ] Get project without token (401 Unauthorized)
- [ ] Get project with invalid ID format (400 Bad Request)
- [ ] Verify all project fields are returned
- [ ] Verify owner is populated
- [ ] Verify members are populated

### Update Project
- [ ] Update project name (200 OK)
- [ ] Update project description (200 OK)
- [ ] Update project deadline (200 OK)
- [ ] Update non-existent project (404 Not Found)
- [ ] Update project you don't own (403 Forbidden)
- [ ] Update without token (401 Unauthorized)
- [ ] Verify changes are persisted

### Delete Project
- [ ] Delete own project (200 OK)
- [ ] Delete non-existent project (404 Not Found)
- [ ] Delete project you don't own (403 Forbidden)
- [ ] Delete without token (401 Unauthorized)
- [ ] Verify project is actually deleted
- [ ] Verify tasks are also deleted (cascade)

### Add Member to Project
- [ ] Add valid user as member (200 OK)
- [ ] Add non-existent user (404 Not Found)
- [ ] Add member to non-existent project (404 Not Found)
- [ ] Add duplicate member (400 Bad Request)
- [ ] Add member without permission (403 Forbidden)
- [ ] Add member without token (401 Unauthorized)

### Remove Member from Project
- [ ] Remove existing member (200 OK)
- [ ] Remove non-existent member (404 Not Found)
- [ ] Remove from non-existent project (404 Not Found)
- [ ] Remove without permission (403 Forbidden)
- [ ] Remove without token (401 Unauthorized)

---

## Task Endpoints

### Get Tasks for Project
- [ ] Get tasks with valid project ID (200 OK)
- [ ] Get tasks for non-existent project (404 Not Found)
- [ ] Get tasks without token (401 Unauthorized)
- [ ] Verify tasks array is returned
- [ ] Check empty array when no tasks exist
- [ ] Verify tasks are sorted by order/column

### Create Task
- [ ] Create task with all required fields (201 Created)
- [ ] Create task without title (400 Bad Request)
- [ ] Create task without column (should default to 'todo')
- [ ] Create task with invalid priority (400 Bad Request)
- [ ] Create task with assignees (200 OK)
- [ ] Create task with tags (200 OK)
- [ ] Create task without token (401 Unauthorized)
- [ ] Verify task ID is returned
- [ ] Verify task is in correct column

### Get Single Task
- [ ] Get existing task (200 OK)
- [ ] Get non-existent task (404 Not Found)
- [ ] Get task without token (401 Unauthorized)
- [ ] Verify all task fields are returned
- [ ] Verify assignees are populated

### Update Task
- [ ] Update task title (200 OK)
- [ ] Update task description (200 OK)
- [ ] Update task priority (200 OK)
- [ ] Update task assignees (200 OK)
- [ ] Update task tags (200 OK)
- [ ] Update non-existent task (404 Not Found)
- [ ] Update without permission (403 Forbidden)
- [ ] Update without token (401 Unauthorized)

### Move Task
- [ ] Move task to 'todo' (200 OK)
- [ ] Move task to 'in-progress' (200 OK)
- [ ] Move task to 'done' (200 OK)
- [ ] Move task to invalid column (400 Bad Request)
- [ ] Move with updated order (200 OK)
- [ ] Move non-existent task (404 Not Found)
- [ ] Move without token (401 Unauthorized)

### Delete Task
- [ ] Delete own task (200 OK)
- [ ] Delete non-existent task (404 Not Found)
- [ ] Delete without permission (403 Forbidden)
- [ ] Delete without token (401 Unauthorized)
- [ ] Verify task is actually deleted
- [ ] Verify attachments are also deleted

### Add Comment
- [ ] Add comment with text (200 OK)
- [ ] Add comment without text (400 Bad Request)
- [ ] Add comment to non-existent task (404 Not Found)
- [ ] Add comment without token (401 Unauthorized)
- [ ] Verify comment is stored
- [ ] Verify user is associated with comment

### Toggle Checklist Item
- [ ] Toggle item to completed (200 OK)
- [ ] Toggle item to incomplete (200 OK)
- [ ] Toggle non-existent item (404 Not Found)
- [ ] Toggle without token (401 Unauthorized)

---

## File Attachment Endpoints

### Upload Attachment
- [ ] Upload PDF file (200 OK)
- [ ] Upload image file (200 OK)
- [ ] Upload Word document (200 OK)
- [ ] Upload text file (200 OK)
- [ ] Upload file larger than 10MB (400 Bad Request)
- [ ] Upload without file (400 Bad Request)
- [ ] Upload to non-existent task (404 Not Found)
- [ ] Upload without token (401 Unauthorized)
- [ ] Verify file is saved to disk
- [ ] Verify attachment record is created
- [ ] Verify file metadata is correct

### Download Attachment
- [ ] Download existing attachment (200 OK)
- [ ] Download non-existent attachment (404 Not Found)
- [ ] Download without token (401 Unauthorized)
- [ ] Verify correct file is downloaded
- [ ] Verify Content-Type header
- [ ] Verify Content-Disposition header

### Delete Attachment
- [ ] Delete own attachment (200 OK)
- [ ] Delete non-existent attachment (404 Not Found)
- [ ] Delete without permission (403 Forbidden)
- [ ] Delete without token (401 Unauthorized)
- [ ] Verify file is deleted from disk
- [ ] Verify attachment record is deleted

---

## Integration Tests

### Complete User Flow
- [ ] Register → Login → Create Project → Create Task → Complete
- [ ] Multiple users collaborating on same project
- [ ] User creates multiple projects
- [ ] Project with multiple tasks in different columns
- [ ] Move tasks through workflow (todo → in-progress → done)
- [ ] Add and remove team members
- [ ] Upload and manage attachments

### Edge Cases
- [ ] Very long task titles (test limits)
- [ ] Special characters in all text fields
- [ ] Unicode characters (emoji, etc.)
- [ ] Concurrent task updates
- [ ] Rapid task creation (stress test)
- [ ] Large number of tasks in one project
- [ ] Large number of comments on one task

### Performance Tests
- [ ] Response time for getting 100 tasks
- [ ] Response time for creating 50 tasks sequentially
- [ ] File upload speed for various file sizes
- [ ] Concurrent user requests
- [ ] Database query optimization

---

## Security Tests

### Authorization
- [ ] Access other user's private project (403 Forbidden)
- [ ] Modify other user's task (403 Forbidden)
- [ ] Delete other user's project (403 Forbidden)
- [ ] Token expiration handling
- [ ] Token refresh (if implemented)

### Input Validation
- [ ] SQL injection attempts in text fields
- [ ] XSS attempts in text fields
- [ ] Invalid MongoDB ObjectIDs
- [ ] Malformed JSON payloads
- [ ] Missing required headers

### File Upload Security
- [ ] Upload executable files (.exe, .sh)
- [ ] Upload files with malicious names
- [ ] Upload files with no extension
- [ ] Upload files with multiple extensions
- [ ] Upload extremely large files

---

## Error Handling

### HTTP Status Codes
- [ ] 400 for validation errors
- [ ] 401 for authentication errors
- [ ] 403 for authorization errors
- [ ] 404 for resource not found
- [ ] 500 for server errors (should be rare)

### Error Messages
- [ ] Clear error messages
- [ ] Consistent error format
- [ ] No sensitive data in error messages
- [ ] Proper error logging

---

## Documentation

- [ ] All endpoints are documented
- [ ] Request/response examples are accurate
- [ ] Authentication requirements are clear
- [ ] Error responses are documented
- [ ] File upload process is explained

---

## Notes

**Date Tested**: _______________
**Tested By**: _______________
**Environment**: Development / Staging / Production
**Server Version**: _______________
**Issues Found**: _______________
**Additional Comments**: _______________

---

## Summary

Total Tests: _____ / _____
Pass Rate: _____%
Critical Issues: _____
Minor Issues: _____
Status: ✅ Pass / ⚠️ Needs Review / ❌ Fail
