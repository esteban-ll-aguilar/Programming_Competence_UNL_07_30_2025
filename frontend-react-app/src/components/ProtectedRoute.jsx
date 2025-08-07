// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - Estado de autenticación:", { 
    isLoading: loading, 
    isAuth: isAuthenticated(),
    hasUser: !!currentUser,
    path: location.pathname 
  });

  // Show loading state if auth is still initializing
  if (loading) {
    console.log("ProtectedRoute - Esperando a que se inicialice la autenticación...");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    console.log("ProtectedRoute - Usuario no autenticado, redirigiendo a login");
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are authenticated, show the protected component
  console.log("ProtectedRoute - Usuario autenticado, mostrando contenido protegido");
  return children;
};

export default ProtectedRoute;
