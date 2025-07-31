// src/pages/NotFound.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';
import ErrorIllustration from '../components/errors/ErrorIllustration';

const NotFound = () => {
  const { warning } = useAlert();
  
  // Show a warning alert when the page loads
  useEffect(() => {
    warning("Page not found. Redirecting you to a safe place!");
  }, [warning]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16 text-center">
      {/* Animated 404 text */}
      <h1 className="relative text-[12rem] md:text-[16rem] font-extrabold leading-none">
        <span className="text-gray-900 dark:text-white animate-pulse-slow">4</span>
        <span className="absolute inline-block animate-spin-slow duration-10s text-blue-500">
          <svg 
            className="w-48 h-48 md:w-64 md:h-64" 
            viewBox="0 0 100 100" 
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="40" className="text-blue-500" />
            <path 
              d="M50 10 A40 40 0 1 0 90 50" 
              fill="none" 
              stroke="white" 
              strokeWidth="5" 
            />
            <path 
              d="M50 10 A40 40 0 1 1 10 50" 
              fill="none" 
              stroke="white" 
              strokeWidth="5" 
            />
          </svg>
        </span>
        <span className="text-gray-900 dark:text-white animate-pulse-slow">4</span>
      </h1>

      {/* Floating elements */}
      <div className="absolute opacity-20 pointer-events-none">
        <div className="animate-float-slow absolute -top-20 -left-20 w-16 h-16 rounded-full bg-blue-400"></div>
        <div className="animate-float-slower absolute top-10 left-32 w-8 h-8 rounded-full bg-red-400"></div>
        <div className="animate-float-slow absolute top-40 -right-10 w-12 h-12 rounded-full bg-green-400"></div>
        <div className="animate-float-slower absolute -bottom-10 right-40 w-10 h-10 rounded-full bg-yellow-400"></div>
      </div>

      {/* Animated Illustration */}
      <div className="mb-10 mt-4">
        <ErrorIllustration type="notFound" />
      </div>

      {/* Message */}
      <div className="max-w-md mx-auto mb-10 animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Whoops! Looks like you're lost in space
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          The page you're looking for has drifted into a black hole or never existed in the first place.
        </p>
        
        {/* Trail animation with dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{
                animation: `ping 1s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                      shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 
                      transition-all duration-300 animate-pulse-subtle"
          >
            Take Me Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white 
                      font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                      transform hover:-translate-y-1 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
      
      {/* Fun Easter Egg */}
      <div className="absolute bottom-6 animate-bounce-subtle">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Don't worry, our rescue team is on the way!
        </p>
      </div>
    </div>
  );
};

export default NotFound;
