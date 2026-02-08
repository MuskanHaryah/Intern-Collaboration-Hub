#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * 
 * This script tests all API endpoints programmatically
 * Run: node test-api-endpoints.js
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

// Test state
let authToken = '';
let testProjectId = '';
let testTaskId = '';
let testUserId = '';
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

// Utility Functions
function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = client.request(url, options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function assertStatus(actual, expected, testName) {
  testResults.total++;
  if (actual === expected) {
    log(`✓ ${testName}`, 'green');
    testResults.passed++;
    return true;
  } else {
    log(`✗ ${testName} - Expected ${expected}, got ${actual}`, 'red');
    testResults.failed++;
    return false;
  }
}

function assertExists(value, fieldName, testName) {
  testResults.total++;
  if (value) {
    log(`✓ ${testName}`, 'green');
    testResults.passed++;
    return true;
  } else {
    log(`✗ ${testName} - ${fieldName} is missing`, 'red');
    testResults.failed++;
    return false;
  }
}

// Test Functions
async function testAuthEndpoints() {
  log('\n📝 Testing Authentication Endpoints', 'cyan');
  log('━'.repeat(50), 'cyan');

  // Test 1: Register User
  try {
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'intern',
    };

    const registerRes = await makeRequest('POST', '/auth/register', registerData);
    assertStatus(registerRes.status, 201, 'Register new user');
    if (registerRes.data?.success) {
      authToken = registerRes.data.token;
      testUserId = registerRes.data.user._id;
      assertExists(authToken, 'token', 'Token received from registration');
    }
  } catch (error) {
    log(`✗ Register user failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 2: Login User
  try {
    const loginData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    };

    // First register, then login
    await makeRequest('POST', '/auth/register', {
      ...loginData,
      name: 'Login Test User',
      role: 'intern',
    });

    const loginRes = await makeRequest('POST', '/auth/login', loginData);
    assertStatus(loginRes.status, 200, 'Login with valid credentials');
    if (loginRes.data?.token) {
      authToken = loginRes.data.token;
    }
  } catch (error) {
    log(`✗ Login test failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 3: Get Current User
  try {
    const meRes = await makeRequest('GET', '/auth/me', null, authToken);
    assertStatus(meRes.status, 200, 'Get current user profile');
    assertExists(meRes.data?.user, 'user', 'User data in response');
  } catch (error) {
    log(`✗ Get current user failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 4: Access Protected Route Without Token
  try {
    const noTokenRes = await makeRequest('GET', '/auth/me');
    assertStatus(noTokenRes.status, 401, 'Protected route without token returns 401');
  } catch (error) {
    log(`✗ No token test failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }
}

async function testProjectEndpoints() {
  log('\n📁 Testing Project Endpoints', 'cyan');
  log('━'.repeat(50), 'cyan');

  // Test 1: Get All Projects
  try {
    const projectsRes = await makeRequest('GET', '/projects', null, authToken);
    assertStatus(projectsRes.status, 200, 'Get all projects');
    assertExists(projectsRes.data?.projects, 'projects', 'Projects array in response');
  } catch (error) {
    log(`✗ Get all projects failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 2: Create Project
  try {
    const projectData = {
      name: 'Test Project',
      description: 'This is a test project',
      deadline: '2024-12-31',
    };

    const createRes = await makeRequest('POST', '/projects', projectData, authToken);
    assertStatus(createRes.status, 201, 'Create new project');
    if (createRes.data?.project) {
      testProjectId = createRes.data.project._id;
      assertExists(testProjectId, 'project._id', 'Project ID in response');
    }
  } catch (error) {
    log(`✗ Create project failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 3: Get Single Project
  if (testProjectId) {
    try {
      const projectRes = await makeRequest('GET', `/projects/${testProjectId}`, null, authToken);
      assertStatus(projectRes.status, 200, 'Get single project');
      assertExists(projectRes.data?.project, 'project', 'Project data in response');
    } catch (error) {
      log(`✗ Get single project failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 4: Update Project
  if (testProjectId) {
    try {
      const updateData = {
        name: 'Updated Test Project',
        description: 'Updated description',
      };

      const updateRes = await makeRequest('PUT', `/projects/${testProjectId}`, updateData, authToken);
      assertStatus(updateRes.status, 200, 'Update project');
    } catch (error) {
      log(`✗ Update project failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 5: Get Non-Existent Project
  try {
    const notFoundRes = await makeRequest('GET', '/projects/000000000000000000000000', null, authToken);
    assertStatus(notFoundRes.status, 404, 'Get non-existent project returns 404');
  } catch (error) {
    log(`✗ Non-existent project test failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }
}

async function testTaskEndpoints() {
  log('\n✅ Testing Task Endpoints', 'cyan');
  log('━'.repeat(50), 'cyan');

  if (!testProjectId) {
    log('⚠ Skipping task tests - no project ID available', 'yellow');
    return;
  }

  // Test 1: Get All Tasks
  try {
    const tasksRes = await makeRequest('GET', `/projects/${testProjectId}/tasks`, null, authToken);
    assertStatus(tasksRes.status, 200, 'Get all tasks for project');
    assertExists(tasksRes.data?.tasks, 'tasks', 'Tasks array in response');
  } catch (error) {
    log(`✗ Get all tasks failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 2: Create Task
  try {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      column: 'todo',
      priority: 'high',
      assignees: [],
      tags: ['test'],
    };

    const createRes = await makeRequest('POST', `/projects/${testProjectId}/tasks`, taskData, authToken);
    assertStatus(createRes.status, 201, 'Create new task');
    if (createRes.data?.task) {
      testTaskId = createRes.data.task._id;
      assertExists(testTaskId, 'task._id', 'Task ID in response');
    }
  } catch (error) {
    log(`✗ Create task failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 3: Get Single Task
  if (testTaskId) {
    try {
      const taskRes = await makeRequest('GET', `/tasks/${testTaskId}`, null, authToken);
      assertStatus(taskRes.status, 200, 'Get single task');
    } catch (error) {
      log(`✗ Get single task failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 4: Update Task
  if (testTaskId) {
    try {
      const updateData = {
        title: 'Updated Test Task',
        priority: 'medium',
      };

      const updateRes = await makeRequest('PUT', `/tasks/${testTaskId}`, updateData, authToken);
      assertStatus(updateRes.status, 200, 'Update task');
    } catch (error) {
      log(`✗ Update task failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 5: Move Task
  if (testTaskId) {
    try {
      const moveData = {
        column: 'in-progress',
        order: 0,
      };

      const moveRes = await makeRequest('PUT', `/tasks/${testTaskId}/move`, moveData, authToken);
      assertStatus(moveRes.status, 200, 'Move task to different column');
    } catch (error) {
      log(`✗ Move task failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 6: Add Comment
  if (testTaskId) {
    try {
      const commentData = {
        text: 'This is a test comment',
      };

      const commentRes = await makeRequest('POST', `/tasks/${testTaskId}/comments`, commentData, authToken);
      assertStatus(commentRes.status, 200, 'Add comment to task');
    } catch (error) {
      log(`✗ Add comment failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }

  // Test 7: Delete Task
  if (testTaskId) {
    try {
      const deleteRes = await makeRequest('DELETE', `/tasks/${testTaskId}`, null, authToken);
      assertStatus(deleteRes.status, 200, 'Delete task');
    } catch (error) {
      log(`✗ Delete task failed: ${error.message}`, 'red');
      testResults.failed++;
      testResults.total++;
    }
  }
}

async function testErrorHandling() {
  log('\n🔍 Testing Error Handling', 'cyan');
  log('━'.repeat(50), 'cyan');

  // Test 1: Invalid Login
  try {
    const invalidLogin = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    };

    const loginRes = await makeRequest('POST', '/auth/login', invalidLogin);
    assertStatus(loginRes.status, 401, 'Invalid login credentials return 401');
  } catch (error) {
    log(`✗ Invalid login test failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }

  // Test 2: Create Project with Missing Fields
  try {
    const invalidProject = {
      description: 'Missing name field',
    };

    const createRes = await makeRequest('POST', '/projects', invalidProject, authToken);
    const isError = createRes.status === 400 || createRes.status === 422;
    assertStatus(createRes.status, isError ? createRes.status : 400, 'Missing required fields return 400/422');
  } catch (error) {
    log(`✗ Missing fields test failed: ${error.message}`, 'red');
    testResults.failed++;
    testResults.total++;
  }
}

async function cleanup() {
  log('\n🧹 Cleaning Up Test Data', 'cyan');
  log('━'.repeat(50), 'cyan');

  // Delete test project if it exists
  if (testProjectId) {
    try {
      const deleteRes = await makeRequest('DELETE', `/projects/${testProjectId}`, null, authToken);
      if (deleteRes.status === 200) {
        log('✓ Test project deleted', 'green');
      }
    } catch (error) {
      log(`⚠ Could not delete test project: ${error.message}`, 'yellow');
    }
  }
}

function printResults() {
  log('\n📊 Test Results', 'blue');
  log('━'.repeat(50), 'blue');
  log(`Total Tests: ${testResults.total}`, 'cyan');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`, 'cyan');
  log('━'.repeat(50), 'blue');

  if (testResults.failed === 0) {
    log('\n✨ All tests passed! ✨', 'green');
  } else {
    log('\n⚠ Some tests failed. Please review the output above.', 'yellow');
  }
}

// Main Test Runner
async function runTests() {
  log('\n🚀 Starting API Endpoint Tests', 'blue');
  log(`Base URL: ${BASE_URL}`, 'cyan');
  log('━'.repeat(50), 'blue');

  try {
    await testAuthEndpoints();
    await testProjectEndpoints();
    await testTaskEndpoints();
    await testErrorHandling();
    await cleanup();

    printResults();

    // Exit with appropriate code
    process.exit(testResults.failed === 0 ? 0 : 1);
  } catch (error) {
    log(`\n❌ Fatal error during test execution: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    log('Checking if server is running...', 'cyan');
    const response = await makeRequest('GET', '/auth/me');
    // Any response means server is up (even 401)
    log('✓ Server is running', 'green');
    return true;
  } catch (error) {
    log('✗ Server is not running or not accessible', 'red');
    log(`Please start the server first: cd server && npm run dev`, 'yellow');
    return false;
  }
}

// Entry point
(async () => {
  const serverIsUp = await checkServer();
  if (serverIsUp) {
    await runTests();
  } else {
    process.exit(1);
  }
})();
