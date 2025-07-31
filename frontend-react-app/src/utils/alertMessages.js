// src/utils/alertMessages.js
/**
 * Standard alert messages that can be used across the application
 * This helps maintain consistency in messaging
 */

// Authentication related messages
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "You have successfully logged in",
  LOGIN_ERROR: "Invalid username or password",
  LOGOUT_SUCCESS: "You have been logged out successfully",
  REGISTER_SUCCESS: "Account created successfully",
  PASSWORD_RESET: "Password reset email has been sent",
  ACCOUNT_LOCKED: "Your account has been temporarily locked. Please try again later",
};

// Form submission messages
export const FORM_MESSAGES = {
  SUBMIT_SUCCESS: "Form submitted successfully",
  SUBMIT_ERROR: "Error submitting form. Please try again",
  VALIDATION_ERROR: "Please check the form for errors",
  REQUIRED_FIELDS: "Please fill in all required fields",
  SAVED_DRAFT: "Draft saved successfully",
};

// Data operations messages
export const DATA_MESSAGES = {
  FETCH_SUCCESS: "Data loaded successfully",
  FETCH_ERROR: "Error loading data. Please refresh the page",
  SAVE_SUCCESS: "Changes saved successfully",
  SAVE_ERROR: "Error saving changes. Please try again",
  DELETE_SUCCESS: "Item deleted successfully",
  DELETE_ERROR: "Error deleting item. Please try again",
  UPDATE_SUCCESS: "Item updated successfully",
  UPDATE_ERROR: "Error updating item. Please try again",
};

// User action feedback
export const USER_ACTION_MESSAGES = {
  COPIED: "Copied to clipboard",
  SHARED: "Link shared successfully",
  DOWNLOADED: "Download started",
  UPLOADED: "File uploaded successfully",
  CANCELED: "Operation canceled",
  COMPLETED: "Operation completed successfully",
};

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  PERMISSION_DENIED: "You don't have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  TIMEOUT: "The operation timed out. Please try again",
  INVALID_REQUEST: "Invalid request. Please try again",
};

// Helper function to get a formatted message with custom text
export const formatMessage = (baseMessage, customText) => {
  if (!customText) return baseMessage;
  return `${baseMessage}: ${customText}`;
};
