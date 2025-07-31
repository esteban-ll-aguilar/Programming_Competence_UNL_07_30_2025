// src/contexts/AlertContext.jsx
import { createContext, useContext, useState } from "react";
import Alert from "../components/Alert";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  // Remove alert by id
  const removeAlert = (id) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  };

  // Generic alert function - Increased default duration to 10 seconds
  const showAlert = (message, type = "info", duration = 10000) => {
    // Simple ID generation based on timestamp and random number
    const id = Date.now() + Math.floor(Math.random() * 1000);
    
    // Add new alert to the alerts array
    setAlerts(currentAlerts => [...currentAlerts, { id, message, type }]);
    
    // Auto-dismiss after duration - if specified
    // Note: Progress bar in Alert component will handle normal dismissal
    if (duration) {
      setTimeout(() => removeAlert(id), duration);
    }
    
    return id; // Return id in case caller wants to remove it manually
  };

  // Helper functions for specific alert types with increased durations
  const success = (message, duration = 10000) => showAlert(message, "success", duration);
  const warning = (message, duration = 10000) => showAlert(message, "warning", duration);
  const info = (message, duration = 10000) => showAlert(message, "info", duration);
  const error = (message, duration = 10000) => showAlert(message, "error", duration);
  const fail = (message, duration = 10000) => showAlert(message, "error", duration); // Alias for error

  return (
    <AlertContext.Provider value={{ 
      showAlert, 
      success, 
      warning, 
      info, 
      error, 
      fail,
      removeAlert
    }}>
      {children}

      {/* Render the Alerts Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
        {alerts.map(alert => (
          <Alert 
            key={alert.id}
            type={alert.type} 
            message={alert.message}
            onClose={() => removeAlert(alert.id)} 
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
