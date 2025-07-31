/**
 * User-related API functions
 * This module contains specific API calls for user management
 */

import api from '../api';

/**
 * Format date from API
 * @param {string} dateString - ISO date string from API
 * @returns {string} - Formatted date or 'N/A' if null
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'N/A';
  }
};

/**
 * Process user data to handle dates
 * @param {Object} userData - Raw user data from API
 * @returns {Object} - Processed user data with formatted dates
 */
const processUserData = (userData) => {
  if (!userData) return null;
  
  return {
    ...userData,
    created_at: formatDate(userData.created_at),
    updated_at: formatDate(userData.updated_at),
    // Store original dates for calculations if needed
    _rawCreatedAt: userData.created_at,
    _rawUpdatedAt: userData.updated_at
  };
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise} - Promise with the created user
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('v1/users/create', userData);
    return processUserData(response);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get a user by username
 * @param {string} username - Username to fetch
 * @returns {Promise} - Promise with the user data
 */
export const getUser = async (username) => {
  try {
    // Using POST for the get endpoint as specified in the API routes
    const response = await api.get(`v1/users/get/${username}`);
    return processUserData(response);
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error);
    throw error;
  }
};

export default {
  createUser,
  getUser
};
