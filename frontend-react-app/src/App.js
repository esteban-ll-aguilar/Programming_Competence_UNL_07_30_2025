import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./contexts/AlertContext";
import { ThemeProvider } from "./hooks/useThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ServerError from "./pages/errors/ServerError";
import NotFound from "./pages/errors/NotFound";


function App() {
  return (
    <AlertProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
            <Navbar />
            <main className="bg-gray-50 dark:bg-gray-900 flex-grow pt-20 md:pt-24 min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/server-error" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </AlertProvider>
  );
}

export default App;
