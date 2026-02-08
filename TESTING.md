# Testing Guide

This guide explains how to run and write tests for the Intern Collaboration Hub application.

## Overview

The project uses different testing frameworks for client and server:

- **Client**: Vitest with React Testing Library
- **Server**: Jest with Supertest

## Installation

Testing dependencies are already included in `package.json`. To install them:

```bash
# Client
cd client
npm install

# Server
cd server
npm install
```

## Running Tests

### Client Tests

```bash
cd client

# Run tests once
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (add -- --watch to test script)
npm test -- --watch
```

### Server Tests

```bash
cd server

# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Client Tests (`client/src/__tests__/`)

```
client/src/__tests__/
├── setup.js                    # Test setup and global mocks
├── validation.test.js          # Utility function tests
├── authStore.test.js           # Auth store unit tests
├── toastStore.test.js          # Toast store unit tests
├── ErrorBoundary.test.jsx      # Error boundary component tests
├── LoadingStates.test.jsx      # Loading components tests
└── ThemeToggle.test.jsx        # Theme toggle component tests
```

### Server Tests (`server/src/__tests__/`)

```
server/src/__tests__/
├── setup.js                    # Test setup and configuration
└── routes/
    ├── auth.test.js           # Auth endpoint integration tests
    ├── projects.test.js       # Project endpoint integration tests
    └── tasks.test.js          # Task endpoint integration tests
```

## Writing Tests

### Client Component Tests

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Client Store Tests

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import useMyStore from '../stores/myStore';

describe('MyStore', () => {
  beforeEach(() => {
    useMyStore.setState({ /* reset state */ });
  });

  it('should update state', () => {
    useMyStore.getState().updateValue('new value');
    expect(useMyStore.getState().value).toBe('new value');
  });
});
```

### Server API Tests

```javascript
import request from 'supertest';
import app from '../../app';

describe('GET /api/endpoint', () => {
  it('should return data', async () => {
    const response = await request(app).get('/api/endpoint');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
```

## Test Coverage

Both client and server are configured to generate coverage reports:

- **Client**: Coverage reports are generated in `client/coverage/`
- **Server**: Coverage reports are generated in `server/coverage/`

Open `coverage/index.html` in your browser to view detailed coverage reports.

## Coverage Goals

- **Statements**: > 70%
- **Branches**: > 60%
- **Functions**: > 70%
- **Lines**: > 70%

## Mocking

### Client Mocking

```javascript
import { vi } from 'vitest';

// Mock a module
vi.mock('../services/api', () => ({
  fetchData: vi.fn(),
}));

// Mock a function
const mockFn = vi.fn();
```

### Server Mocking

```javascript
import { jest } from '@jest/globals';

// Mock a module
jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));
```

## Best Practices

1. **Test File Naming**: Use `*.test.js` or `*.test.jsx` for test files
2. **Describe Blocks**: Group related tests using `describe()`
3. **Test Isolation**: Reset state in `beforeEach()` hooks
4. **Assertions**: Use descriptive expect statements
5. **Coverage**: Aim for high coverage but prioritize meaningful tests
6. **Mocking**: Mock external dependencies to isolate unit tests
7. **Integration Tests**: Test API endpoints with realistic scenarios

## Debugging Tests

### Client

```bash
# Run specific test file
npm test -- validation.test.js

# Run tests matching pattern
npm test -- --grep "validation"

# Debug in VS Code
# Add breakpoint and use "JavaScript Debug Terminal"
```

### Server

```bash
# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="login"

# Run with verbose output
npm test -- --verbose
```

## Continuous Integration

Tests should pass before merging:

```bash
# Run all tests
cd client && npm test && cd ../server && npm test
```

## Troubleshooting

### Client Tests

**Issue**: `ReferenceError: window is not defined`
- **Solution**: Ensure `jsdom` environment is configured in `vitest.config.js`

**Issue**: Import errors with React components
- **Solution**: Check that `@vitejs/plugin-react` is installed and configured

### Server Tests

**Issue**: ES modules not working
- **Solution**: Ensure `NODE_OPTIONS=--experimental-vm-modules` is set in test scripts

**Issue**: Timeout errors
- **Solution**: Increase timeout in jest.config.js or use `jest.setTimeout()`

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
