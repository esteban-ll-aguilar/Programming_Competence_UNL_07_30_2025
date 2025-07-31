// src/components/Alert.jsx
import React, { useState, useEffect, useRef } from 'react';

const Alert = ({ type, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const progressTimerRef = useRef(null);
  
  // Define styles based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 border-l-4 border-l-green-500',
          icon: '✅',
          iconClass: 'text-green-500'
        };
      case 'error':
        return {
          container: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 border-l-4 border-l-red-500',
          icon: '❌',
          iconClass: 'text-red-500'
        };
      case 'warning':
        return {
          container: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-900 border-yellow-300 border-l-4 border-l-yellow-500',
          icon: '⚠️',
          iconClass: 'text-yellow-500'
        };
      case 'info':
      default:
        return {
          container: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 border-l-4 border-l-blue-500',
          icon: 'ℹ️',
          iconClass: 'text-blue-500'
        };
    }
  };

  const styles = getAlertStyles();
  
  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500); // Increase exit animation duration
  };
  
  // Set up progress bar animation - much slower now
  const [progress, setProgress] = useState(100);
  
  // Pause progress when hovering
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  useEffect(() => {
    // Only decrement if not paused
    if (!isPaused) {
      progressTimerRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          // Make progress EXTREMELY slow - 0.01 instead of 0.05
          if (prevProgress <= 0) {
            clearInterval(progressTimerRef.current);
            return 0;
          }
          return prevProgress - 0.01;
        });
      }, 30);
    } else if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPaused]);
  
  useEffect(() => {
    if (progress <= 0) {
      handleClose();
    }
  }, [progress]);

  return (
    <div 
      className={`
        relative px-6 py-4 rounded-lg shadow-lg border text-sm 
        flex items-center gap-3 ${styles.container}
        ${isExiting ? 'animate-slide-out-right' : 'animate-bounce-in'}
        transition-all duration-500
        max-w-md w-full
        backdrop-blur-sm
        ${isPaused ? `shadow-2xl ring-2 ring-offset-2 ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-400` : 'hover:shadow-xl'} 
        transform hover:-translate-y-1
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gray-400/30 dark:bg-gray-700/30 rounded-b-lg overflow-hidden"
        style={{ width: '100%' }}
      >
        <div 
          className={`h-full ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            'bg-blue-500'
          }`}
          style={{ width: `${progress}%`, transition: 'width 0.8s linear' }}
        ></div>
      </div>
      
      {/* Alert Icon */}
      <span className={`text-xl ${styles.iconClass} animate-pulse-once`}>{styles.icon}</span>
      
      {/* Alert Message */}
      <span className="flex-1 font-medium">{message}</span>
      
      {/* Paused Indicator */}
      {isPaused && (
        <span className="text-xs font-medium italic px-2 py-1 bg-black/10 rounded-full animate-pulse">
          Paused
        </span>
      )}
      
      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="ml-auto hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 
                  transition-all duration-200 text-xl font-medium transform hover:rotate-90"
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
};


export default Alert;

