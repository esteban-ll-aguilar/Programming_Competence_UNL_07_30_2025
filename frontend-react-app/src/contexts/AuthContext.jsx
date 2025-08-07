import { createContext, useContext, useState, useEffect } from "react";
import { getStoredAuthToken, saveAuthToken, clearAuthToken } from "../utils/authStorage";
import api from "../utils/api";

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
      console.log("Fetching user data with token...", authToken ? authToken.substring(0, 10) + '...' : 'No token');
      
      // Esperar un momento para asegurar que el token esté guardado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userData = await api.auth.getCurrentUser();
      console.log("User data received:", userData);
      
      if (!userData) {
        console.error("No se recibieron datos de usuario válidos");
        throw new Error("No user data received");
      }
      
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Si hay un error 401, es porque el token no es válido
      if (error.status === 401) {
        console.log("Token inválido, cerrando sesión");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Intentando iniciar sesión con:", { email });
      
      // Enviar el objeto correcto para el login
      // El backend espera un objeto con email/username y password
      const response = await api.auth.login({ 
        email: email,  // Usamos email como primera opción
        username: null, // No enviamos username
        password: password 
      });
      
      console.log("Respuesta completa de login:", response);
      
      // Verifica la estructura de la respuesta
      let authToken = null;
      
      // Comprueba diferentes formatos posibles de respuesta según el backend
      if (response && typeof response === 'object') {
        if (response.access_token) {
          authToken = response.access_token;
        } else if (response.token) {
          authToken = response.token;
        } else if (response.data && response.data.access_token) {
          authToken = response.data.access_token;
        } else if (response.data && response.data.token) {
          authToken = response.data.token;
        }
      }
      
      if (!authToken) {
        console.error("No se pudo encontrar el token en la respuesta:", response);
        return { 
          success: false, 
          message: 'Error en la respuesta del servidor. Por favor intente nuevamente.'
        };
      }
      
      console.log("Token de autenticación obtenido:", authToken.substring(0, 10) + '...');
      
      // Save token and set state
      saveAuthToken(authToken);
      setToken(authToken);
      
      // Fetch user data
      await fetchUserData(authToken);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      // Mensaje personalizado según el código de error
      let errorMessage = 'Error al iniciar sesión. Por favor intente nuevamente.';
      
      if (error.status === 401) {
        errorMessage = 'Credenciales incorrectas. Por favor verifique su usuario y contraseña.';
      } else if (error.status === 404) {
        errorMessage = 'Servicio de autenticación no disponible. Por favor intente más tarde.';
      }
      
      return { 
        success: false, 
        message: error.message || errorMessage
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log("Intentando registrar usuario:", userData.username);
      const data = await api.auth.register(userData);
      console.log("Respuesta de registro:", data);
      
      const authToken = data.access_token;
      
      if (!authToken) {
        console.error("No se recibió token de acceso en la respuesta");
        return { 
          success: false, 
          message: 'Error en la respuesta del servidor. Por favor intente nuevamente.'
        };
      }
      
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
    } catch (error) {
      console.error("Registration error:", error);
      
      // Mensaje personalizado según el código de error
      let errorMessage = 'Error al registrarse. Por favor intente nuevamente.';
      
      if (error.status === 400) {
        if (error.data && error.data.detail) {
          // El backend puede enviar detalles específicos del error
          errorMessage = error.data.detail;
        } else {
          errorMessage = 'Datos de registro inválidos. Por favor revise la información ingresada.';
        }
      } else if (error.status === 409) {
        errorMessage = 'El usuario ya existe. Por favor intente con otro nombre de usuario.';
      } else if (error.status === 404) {
        errorMessage = 'Servicio de registro no disponible. Por favor intente más tarde.';
      }
      
      return { 
        success: false, 
        message: error.message || errorMessage
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log("Cerrando sesión...");
    setCurrentUser(null);
    setToken(null);
    clearAuthToken();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const hasToken = !!token;
    const hasUser = !!currentUser;
    console.log("Verificando autenticación:", { hasToken, hasUser });
    return hasToken && hasUser;
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
