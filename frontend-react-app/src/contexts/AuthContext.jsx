// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getStoredAuthToken, saveAuthToken, clearAuthToken } from "../utils/authStorage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedToken = getStoredAuthToken();
    if (storedToken) {
      setToken(storedToken);
      // Fetch user data with the token
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data from the backend
  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch('http://localhost:8080/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Token': 'api-cZzRx1H0vlmG9ad9mA1ryi9wT0PRH', // Using a token from the valid tokens list
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        // If the token is invalid, log the user out
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': 'api-cZzRx1H0vlmG9ad9mA1ryi9wT0PRH',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const authToken = data.access_token;
        
        // Save token and set state
        saveAuthToken(authToken);
        setToken(authToken);
        
        // Fetch user data
        await fetchUserData(authToken);
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          message: errorData.detail || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: 'Network error. Please try again later.' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/v1/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': 'api-cZzRx1H0vlmG9ad9mA1ryi9wT0PRH',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const data = await response.json();
        const authToken = data.access_token;
        
        // Save token and set state
        saveAuthToken(authToken);
        setToken(authToken);
        
        // Set user data
        setCurrentUser({
          dni: data.dni,
          username: userData.username,
          email: userData.email
        });
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          message: errorData.detail || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: 'Network error. Please try again later.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    clearAuthToken();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
