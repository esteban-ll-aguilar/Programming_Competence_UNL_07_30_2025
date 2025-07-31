/**
 * Examples of how to use the API class
 * This file provides examples for common API operations
 */

import api from './api';

/**
 * Example of fetching data from the API
 * @returns {Promise} - Promise with the data
 */
export const fetchExampleData = async () => {
  try {
    // Simple GET request
    const data = await api.get('example-endpoint');
    return data;
  } catch (error) {
    console.error('Error fetching example data:', error);
    throw error;
  }
};

/**
 * Example of fetching data with parameters
 * @param {string} searchTerm - Search term parameter
 * @param {number} page - Page number for pagination
 * @returns {Promise} - Promise with the search results
 */
export const searchExampleData = async (searchTerm, page = 1) => {
  try {
    // GET request with query parameters
    const results = await api.get('search', {
      query: searchTerm,
      page: page,
      limit: 10
    });
    return results;
  } catch (error) {
    console.error('Error searching data:', error);
    throw error;
  }
};

/**
 * Example of creating a new resource
 * @param {Object} newItem - New item data
 * @returns {Promise} - Promise with the created item
 */
export const createExampleItem = async (newItem) => {
  try {
    // POST request with data
    const createdItem = await api.post('items', newItem);
    return createdItem;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Example of updating an existing resource
 * @param {string} id - Item ID to update
 * @param {Object} updatedData - Updated item data
 * @returns {Promise} - Promise with the updated item
 */
export const updateExampleItem = async (id, updatedData) => {
  try {
    // PUT request with data
    const updatedItem = await api.put(`items/${id}`, updatedData);
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

/**
 * Example of deleting a resource
 * @param {string} id - Item ID to delete
 * @returns {Promise} - Promise with the operation result
 */
export const deleteExampleItem = async (id) => {
  try {
    // DELETE request
    const result = await api.delete(`items/${id}`);
    return result;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

/**
 * Example of uploading a file
 * @param {File} file - File to upload
 * @returns {Promise} - Promise with the upload result
 */
export const uploadExampleFile = async (file) => {
  try {
    // Create form data with file
    const formData = new FormData();
    formData.append('file', file);
    
    // Additional form data if needed
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    
    // Upload file
    const result = await api.uploadFile('upload', formData);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
