// src/utils/api.js
import { getStoredAuthToken } from './authStorage';

// Base URL for the API - Use environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// Use token from environment variables
const API_TOKEN = process.env.REACT_APP_API_TOKEN || 'api-cZzRx1H0vlmG9ad9mA1ryi9wT0PRH'; 

// Create default headers with auth token if available
const createHeaders = (includeAuth = true, contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
    'X-Token': API_TOKEN,
  };

  if (includeAuth) {
    const authToken = getStoredAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  return headers;
};

// Generic fetch function with error handling
const fetchWithErrorHandling = async (url, options) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to parse error response as JSON
      try {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.detail || `API Error: ${response.statusText}`,
          data: errorData
        };
      } catch (jsonError) {
        // If parsing as JSON fails, throw generic error
        throw {
          status: response.status,
          message: `API Error: ${response.statusText}`
        };
      }
    }
    
    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API client with methods for different endpoints
const api = {
  // AUTH ENDPOINTS
  auth: {
    login: async (credentials) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/users/login`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(credentials)
      });
    },
    
    register: async (userData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/users/create`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(userData)
      });
    },
    
    getCurrentUser: async () => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/users/me`, {
        headers: createHeaders()
      });
    }
  },
  
  // DRAWER ENDPOINTS
  drawers: {
    getAll: async (skip = 0, limit = 100) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/drawers/?skip=${skip}&limit=${limit}`, 
        { headers: createHeaders() }
      );
    },
    
    getById: async (drawerId) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/drawers/${drawerId}`, 
        { headers: createHeaders() }
      );
    },
    
    create: async (drawerData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/drawers/create`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(drawerData)
      });
    },
    
    update: async (drawerId, updateData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/drawers/${drawerId}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData)
      });
    },
    
    delete: async (drawerId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/drawers/${drawerId}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
    }
  },
  
  // OBJECT TYPE ENDPOINTS
  objectTypes: {
    getAll: async (skip = 0, limit = 100) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/object-types/?skip=${skip}&limit=${limit}`, 
        { headers: createHeaders() }
      );
    },
    
    getById: async (typeId) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/object-types/${typeId}`, 
        { headers: createHeaders() }
      );
    },
    
    create: async (typeData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/object-types/create`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(typeData)
      });
    },
    
    update: async (typeId, updateData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/object-types/${typeId}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData)
      });
    },
    
    delete: async (typeId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/object-types/${typeId}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
    }
  },
  
  // OBJECTS ENDPOINTS
  objects: {
    getByDrawer: async (drawerId, skip = 0, limit = 100, sortByName = false) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/objects/drawer/${drawerId}?skip=${skip}&limit=${limit}&sort_by_name=${sortByName}`, 
        { headers: createHeaders() }
      );
    },
    
    getById: async (objectId) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/objects/${objectId}`, 
        { headers: createHeaders() }
      );
    },
    
    create: async (drawerId, objectData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/objects/create?drawer_id=${drawerId}`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(objectData)
      });
    },
    
    update: async (objectId, updateData) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/objects/${objectId}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(updateData)
      });
    },
    
    delete: async (objectId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/objects/${objectId}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
    },
    
    moveToDrawer: async (objectId, drawerId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/objects/${objectId}/move/${drawerId}`, {
        method: 'POST',
        headers: createHeaders()
      });
    }
  },
  
  // ACTION HISTORY ENDPOINTS
  actionHistory: {
    getAll: async () => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/action-history/`, 
        { headers: createHeaders() }
      );
    },
    
    getByType: async (actionType) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/action-history/type/${actionType}`, 
        { headers: createHeaders() }
      );
    },
    
    getById: async (actionId) => {
      return fetchWithErrorHandling(
        `${API_BASE_URL}/v1/action-history/${actionId}`, 
        { headers: createHeaders() }
      );
    },
    
    delete: async (actionId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/action-history/${actionId}`, {
        method: 'DELETE',
        headers: createHeaders()
      });
    }
  },
  
  // AI RECOMMENDATIONS ENDPOINTS
  recommendations: {
    getForDrawer: async (drawerId) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/ai/drawer-recommendations`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ drawer_id: drawerId })
      });
    },
    
    applyRecommendations: async (drawerId, actions) => {
      return fetchWithErrorHandling(`${API_BASE_URL}/v1/ai/apply-recommendations`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ 
          drawer_id: drawerId,
          actions: actions
        })
      });
    }
  }
};

export default api;
