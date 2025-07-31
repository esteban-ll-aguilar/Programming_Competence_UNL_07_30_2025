import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./hooks/useThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DrawerList from "./pages/drawers/DrawerList";
import DrawerDetail from "./pages/drawers/DrawerDetail";
import DrawerForm from "./pages/drawers/DrawerForm";
import ObjectList from "./pages/objects/ObjectList";
import ObjectForm from "./pages/objects/ObjectForm";
import ActionHistory from "./pages/history/ActionHistory";
import Recommendations from "./pages/recommendations/Recommendations";
import ServerError from "./pages/errors/ServerError";
import NotFound from "./pages/errors/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
              <Navbar />
              <main className="bg-gray-50 dark:bg-gray-900 flex-grow pt-20 md:pt-24 min-h-screen">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/logout" element={<Navigate to="/" replace />} />
                  <Route path="/server-error" element={<ServerError />} />
                  
                  {/* Protected routes */}
                  <Route path="/drawers" element={
                    <ProtectedRoute>
                      <DrawerList />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/:id" element={
                    <ProtectedRoute>
                      <DrawerDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/new" element={
                    <ProtectedRoute>
                      <DrawerForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/edit/:id" element={
                    <ProtectedRoute>
                      <DrawerForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/:drawerId/objects" element={
                    <ProtectedRoute>
                      <ObjectList />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/:drawerId/objects/new" element={
                    <ProtectedRoute>
                      <ObjectForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/:drawerId/objects/edit/:objectId" element={
                    <ProtectedRoute>
                      <ObjectForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <ActionHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/recommendations" element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } />
                  <Route path="/drawers/:id/recommendations" element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {/* <Footer /> */}
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
