# User API Integration

This document explains how to use the User API functions in the application.

## API Endpoints

The user API has the following endpoints:

1. **Create User**
   - Endpoint: `POST /v1/users/create`
   - Creates a new user in the system

2. **Get User**
   - Endpoint: `POST /v1/users/get/{username}`
   - Retrieves user information by username

## Usage in Frontend

### Import User API Functions

```javascript
import { createUser, getUser } from '../backend/users';
```

### Create a New User

```javascript
// User data object
const userData = {
  username: 'johndoe',
  email: 'john@example.com',
  fullName: 'John Doe'
};

// Create user
try {
  const result = await createUser(userData);
  console.log('User created:', result);
  // Handle success (e.g., show notification, redirect)
} catch (error) {
  console.error('Error creating user:', error);
  // Handle error (e.g., show error message)
}
```

### Get User by Username

```javascript
// Get user by username
try {
  const username = 'johndoe';
  const user = await getUser(username);
  console.log('User found:', user);
  // Handle success (e.g., display user info)
} catch (error) {
  console.error('Error getting user:', error);
  // Handle error (e.g., show "user not found" message)
}
```

## Integration in Home Page

The Home page (`/src/pages/Home.jsx`) has been updated to include:

1. **Create User Form**:
   - Input fields for username, email, and full name
   - Form submission handling with loading state
   - Success/error notifications

2. **Get User Form**:
   - Input field for username search
   - Display of user information when found
   - Loading state and error handling

## Testing

A test module is available at `/src/backend/userTests.js` to verify the API integration:

```javascript
import { testCreateUser, testGetUser, runAllUserTests } from '../backend/userTests';

// Run a specific test
const createTestResult = await testCreateUser();
console.log(createTestResult);

// Run all tests
const allTestResults = await runAllUserTests();
console.log(allTestResults);
```

## Error Handling

All API functions include error handling to catch and properly display errors. The application uses the AlertContext to show user-friendly notifications for both successful operations and errors.
