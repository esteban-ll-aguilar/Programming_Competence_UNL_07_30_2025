/**
 * Generic API class for interacting with the backend
 * This class uses the environment variables from .env for configuration
 */

class Api {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/';
    this.apiKey = process.env.REACT_APP_API_KEY || '';
    
    // Remove trailing slash if present
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.slice(0, -1);
    }
  }

  /**
   * Get the headers for API requests
   * @param {boolean} includeContentType - Whether to include Content-Type header
   * @returns {Object} - Headers object
   */
  getHeaders(includeContentType = true) {
    const headers = {
      'X-Token': `${this.apiKey}`,
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  /**
   * Perform a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - URL parameters
   * @returns {Promise} - Response promise
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.apiUrl}/${endpoint}`);
    
    // Add URL parameters
    Object.keys(params).forEach(key => 
      url.searchParams.append(key, params[key])
    );

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  /**
   * Perform a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} - Response promise
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }

  /**
   * Perform a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} - Response promise
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  }

  /**
   * Perform a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response promise
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }

  /**
   * Upload a file
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with file
   * @returns {Promise} - Response promise
   */
  async uploadFile(endpoint, formData) {
    try {
      const response = await fetch(`${this.apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(false), // Don't include Content-Type for file uploads
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API file upload error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const api = new Api();
export default api;

// Also export the class for cases where a new instance is needed
export { Api };
