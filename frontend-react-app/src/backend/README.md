# Backend API Integration

This document explains how to use the generic API class for interacting with the backend.

## Configuration

The API uses environment variables defined in the `.env` file:

```
REACT_APP_API_KEY=your-api-key
REACT_APP_API_URL=http://localhost:8080/
```

Make sure these variables are properly set in your `.env` file.

## Basic Usage

Import the API instance in your component or service:

```javascript
import api from '../backend/api';
```

### GET Request

```javascript
// Simple GET request
const data = await api.get('endpoint');

// GET request with parameters
const searchResults = await api.get('search', {
  query: 'search term',
  page: 1,
  limit: 10
});
```

### POST Request

```javascript
const newItem = {
  name: 'New Item',
  description: 'Description of the new item'
};

const createdItem = await api.post('items', newItem);
```

### PUT Request

```javascript
const updatedData = {
  name: 'Updated Name',
  description: 'Updated description'
};

const updatedItem = await api.put(`items/${id}`, updatedData);
```

### DELETE Request

```javascript
const result = await api.delete(`items/${id}`);
```

### File Upload

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('fileName', fileObject.name);

const uploadResult = await api.uploadFile('upload', formData);
```

## Error Handling

All API methods include error handling. You can implement your own error handling like this:

```javascript
try {
  const data = await api.get('endpoint');
  // Process data
} catch (error) {
  console.error('API error:', error);
  // Handle error (show notification, redirect, etc.)
}
```

## Advanced Usage

If you need a new instance of the API class (for example, for different base URLs):

```javascript
import { Api } from '../backend/api';

const customApi = new Api();
// Use customApi as needed
```
