import React from 'react';
import AlertExamples from '../components/AlertExamples';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome to Our Platform
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            About Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We are dedicated to providing the best user experience for our customers. 
            Our team is constantly working to improve our services and bring you the 
            latest innovations in the industry.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Founded in 2025, we've grown from a small startup to a leading provider in our field,
            serving thousands of satisfied customers worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Our Services
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Professional consulting</li>
              <li>Technical support</li>
              <li>Product development</li>
              <li>24/7 customer service</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Contact Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Email:</strong> info@example.com
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Address:</strong> 123 Main St, Anytown, ST 12345
            </p>
          </div>
        </div>
        
        {/* Error Pages Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Error Pages Demo
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Check out our custom error pages with amazing animations:
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/non-existent-page"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View 404 Page
            </a>
            <a
              href="/server-error"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              View 500 Page
            </a>
          </div>
        </div>
        
        {/* Alert System Examples */}
        <AlertExamples />
      </div>
    </div>
  );
};

export default Home;
