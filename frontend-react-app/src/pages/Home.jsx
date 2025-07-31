import React, { useState } from 'react';
import AlertExamples from '../components/AlertExamples';
import { createUser, getUser } from '../backend/app/users';
import { useAlert } from '../contexts/AlertContext';

const Home = () => {
  const { success, error } = useAlert();
  
  // State for user form
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    fullName: '',
  });
  
  // State for user search
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [loading, setLoading] = useState({
    create: false,
    get: false
  });

  // Handle input changes for create user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, create: true }));
    
    try {
      const result = await createUser(userData);
      success(`User ${userData.username} created successfully!`);
      // Reset form
      setUserData({
        username: '',
        email: '',
        fullName: '',
      });
    } catch (err) {
      error(`Failed to create user: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Handle user search
  const handleGetUser = async (e) => {
    e.preventDefault();
    if (!searchUsername) {
      error('Please enter a username to search');
      return;
    }
    
    setLoading(prev => ({ ...prev, get: true }));
    setFoundUser(null);
    
    try {
      const result = await getUser(searchUsername);
      setFoundUser(result);
      success(`User ${searchUsername} found!`);
    } catch (err) {
      error(`Failed to find user: ${err.message}`);
      setFoundUser(null);
    } finally {
      setLoading(prev => ({ ...prev, get: false }));
    }
  };

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
        
        {/* User Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Create User Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Create New User
            </h3>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading.create}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading.create ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
          
          {/* Get User Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Find User
            </h3>
            <form onSubmit={handleGetUser} className="mb-4">
              <div className="mb-4">
                <label htmlFor="searchUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="searchUsername"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading.get}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
              >
                {loading.get ? 'Searching...' : 'Find User'}
              </button>
            </form>
            
            {/* Display found user */}
            {foundUser && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">User Information</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Username:</strong> {foundUser.username}</p>
                  <p><strong>Email:</strong> {foundUser.email}</p>
                  <p><strong>Full Name:</strong> {foundUser.fullName}</p>
                  <p><strong>Created At:</strong> {foundUser.created_at}</p>
                  <p><strong>Updated At:</strong> {foundUser.updated_at}</p>
                </div>
              </div>
            )}
          </div>
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
