// src/components/AlertExamples.jsx
import React from 'react';
import { useAlert } from '../contexts/AlertContext';
import useAlertMessages from '../hooks/useAlertMessages';

const AlertExamples = () => {
  const { 
    success, 
    warning, 
    info, 
    error, 
    fail, 
    showAlert 
  } = useAlert();
  
  // Use our custom hook with predefined messages
  const alertMessages = useAlertMessages();

  // Example functions to trigger different types of alerts
  const showSuccessAlert = () => success("Operation completed successfully!");
  const showWarningAlert = () => warning("Warning: This action cannot be undone!");
  const showInfoAlert = () => info("Did you know? You can customize these alerts.");
  const showErrorAlert = () => error("Error: Something went wrong!");
  const showFailAlert = () => fail("Failed to save data. Please try again.");
  const showCustomAlert = () => showAlert("Custom alert with longer duration", "info", 6000);
  
  // Examples using the predefined messages
  const showLoginSuccess = () => alertMessages.auth.loginSuccess();
  const showFormError = () => alertMessages.form.validationError();
  const showCustomFormSuccess = () => alertMessages.form.submitSuccess("Your profile was updated!");
  const showNetworkError = () => alertMessages.error.networkError();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Alert System Examples
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Click the buttons below to see different types of alerts in action:
      </p>
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 mb-6">
        <button 
          onClick={showSuccessAlert}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Success Alert
        </button>
        
        <button 
          onClick={showWarningAlert}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Warning Alert
        </button>
        
        <button 
          onClick={showInfoAlert}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Info Alert
        </button>
        
        <button 
          onClick={showErrorAlert}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Error Alert
        </button>
        
        <button 
          onClick={showFailAlert}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Fail Alert (Alias)
        </button>
        
        <button 
          onClick={showCustomAlert}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Custom Duration
        </button>
      </div>
      
      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
        Predefined Alert Messages
      </h4>
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
        <button 
          onClick={showLoginSuccess}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Login Success
        </button>
        
        <button 
          onClick={showFormError}
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
        >
          Form Validation Error
        </button>
        
        <button 
          onClick={showCustomFormSuccess}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
        >
          Custom Form Success
        </button>
        
        <button 
          onClick={showNetworkError}
          className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
        >
          Network Error
        </button>
      </div>
      
      <div className="mt-8 border-t pt-4 border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200">
          New Alert Features
        </h4>
        
        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
          <li>Alerts now stay visible for <strong>10 seconds</strong> by default (instead of 3)</li>
          <li>Hover over an alert to <strong>pause the timer</strong> - notice the "Paused" indicator</li>
          <li>When paused, the alert will stay visible until you move your mouse away</li>
          <li>Progress bar moves much more slowly for better readability</li>
          <li>Visual indicator shows which alerts are currently paused</li>
          <li>Multiple alerts stack neatly in the top-right corner</li>
        </ul>
        
        <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-200 mt-4">
          How to Use Alerts
        </h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-md font-medium mb-1 text-gray-700 dark:text-gray-300">Basic Usage:</h5>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
              {`// Import the hook
import { useAlert } from '../contexts/AlertContext';

// Inside your component
const { success, error, warning, info } = useAlert();

// Show different types of alerts
success("Operation successful!");
error("Something went wrong!");
warning("Be careful!");
info("Here's some information.");

// With custom duration (in milliseconds)
success("This will show for 5 seconds", 5000);`}
            </pre>
          </div>
          
          <div>
            <h5 className="text-md font-medium mb-1 text-gray-700 dark:text-gray-300">Using Predefined Messages:</h5>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
              {`// Import the hook
import useAlertMessages from '../hooks/useAlertMessages';

// Inside your component
const alertMsg = useAlertMessages();

// Use predefined messages
alertMsg.auth.loginSuccess();
alertMsg.form.submitSuccess();
alertMsg.data.saveError();
alertMsg.error.networkError();

// Use with custom message
alertMsg.form.submitSuccess("Your profile was updated!");`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertExamples;
