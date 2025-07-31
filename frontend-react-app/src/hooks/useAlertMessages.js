// src/hooks/useAlertMessages.js
import { useAlert } from '../contexts/AlertContext';
import * as alertMessages from '../utils/alertMessages';

/**
 * Custom hook that combines the alert context with predefined messages
 * This makes it easy to use standard messages across the application
 */
const useAlertMessages = () => {
  const alertContext = useAlert();
  
  // Authentication alerts
  const authAlerts = {
    loginSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.AUTH_MESSAGES.LOGIN_SUCCESS),
    loginError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.AUTH_MESSAGES.LOGIN_ERROR),
    logoutSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.AUTH_MESSAGES.LOGOUT_SUCCESS),
    registerSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.AUTH_MESSAGES.REGISTER_SUCCESS),
  };
  
  // Form alerts
  const formAlerts = {
    submitSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.FORM_MESSAGES.SUBMIT_SUCCESS),
    submitError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.FORM_MESSAGES.SUBMIT_ERROR),
    validationError: (customMsg) => 
      alertContext.warning(customMsg || alertMessages.FORM_MESSAGES.VALIDATION_ERROR),
    savedDraft: (customMsg) => 
      alertContext.info(customMsg || alertMessages.FORM_MESSAGES.SAVED_DRAFT),
  };
  
  // Data operation alerts
  const dataAlerts = {
    fetchSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.DATA_MESSAGES.FETCH_SUCCESS),
    fetchError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.DATA_MESSAGES.FETCH_ERROR),
    saveSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.DATA_MESSAGES.SAVE_SUCCESS),
    saveError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.DATA_MESSAGES.SAVE_ERROR),
    deleteSuccess: (customMsg) => 
      alertContext.success(customMsg || alertMessages.DATA_MESSAGES.DELETE_SUCCESS),
    deleteError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.DATA_MESSAGES.DELETE_ERROR),
  };
  
  // User action alerts
  const actionAlerts = {
    copied: (customMsg) => 
      alertContext.info(customMsg || alertMessages.USER_ACTION_MESSAGES.COPIED),
    shared: (customMsg) => 
      alertContext.success(customMsg || alertMessages.USER_ACTION_MESSAGES.SHARED),
    downloaded: (customMsg) => 
      alertContext.info(customMsg || alertMessages.USER_ACTION_MESSAGES.DOWNLOADED),
    uploaded: (customMsg) => 
      alertContext.success(customMsg || alertMessages.USER_ACTION_MESSAGES.UPLOADED),
  };
  
  // Error alerts
  const errorAlerts = {
    networkError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.ERROR_MESSAGES.NETWORK_ERROR),
    serverError: (customMsg) => 
      alertContext.error(customMsg || alertMessages.ERROR_MESSAGES.SERVER_ERROR),
    permissionDenied: (customMsg) => 
      alertContext.error(customMsg || alertMessages.ERROR_MESSAGES.PERMISSION_DENIED),
    notFound: (customMsg) => 
      alertContext.error(customMsg || alertMessages.ERROR_MESSAGES.NOT_FOUND),
  };
  
  // Return the original alert context along with our categorized alerts
  return {
    ...alertContext,
    auth: authAlerts,
    form: formAlerts,
    data: dataAlerts,
    action: actionAlerts,
    error: errorAlerts,
    // Helper to format messages
    formatMessage: alertMessages.formatMessage,
  };
};

export default useAlertMessages;
