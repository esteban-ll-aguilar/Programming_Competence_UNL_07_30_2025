// src/utils/authStorage.js

const AUTH_TOKEN_KEY = 'auth_token';

// Get the stored authentication token
export const getStoredAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Save the authentication token
export const saveAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Clear the authentication token
export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
