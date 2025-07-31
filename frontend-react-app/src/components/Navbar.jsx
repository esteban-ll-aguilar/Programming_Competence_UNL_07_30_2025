import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, Share2Icon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useThemeContext from '../hooks/useThemeContext';
import { LOGO192 } from '../lib/constants';
import { useAlert } from '../contexts/AlertContext';
import { NAV_LINKS, SERVICES } from '../constants/Navbar';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    services: false,
    knowMore: false
  });
  const [showSearch,] = useState(false);
  const { toggleTheme, isDark } = useThemeContext();
  const location = useLocation();
  
  const dropdownRefs = {
    services: useRef(null), 
    knowMore: useRef(null)
  };
  const searchInputRef = useRef(null);
  
  const { showAlert } = useAlert();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showAlert("¡Enlace copiado al portapapeles!", "success");
  };
  // Cierra los dropdowns al hacer clic fuera de ellos
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        activeDropdown === 'services' && 
        dropdownRefs.services.current && 
        !dropdownRefs.services.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
      
      if (
        activeDropdown === 'knowMore' && 
        dropdownRefs.knowMore.current && 
        !dropdownRefs.knowMore.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, dropdownRefs.knowMore, dropdownRefs.services]);
  
  // Enfoca el input de búsqueda cuando se muestra
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  
  // Toggle para el dropdown de escritorio
  const toggleDesktopDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };
  
  // Toggle para los dropdowns móviles
  const toggleMobileDropdown = (dropdownName) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  
  // Verifica si una ruta está activa (exacta o parcial)
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Renderiza el ítem del menú desplegable
  const renderDropdownItem = (item, onClickAction) => (
    <Link
      key={item.name}
      to={item.path}
      onClick={onClickAction}
      className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary transition-all duration-200 rounded-md group ${
        isActive(item.path) ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-medium' : ''
      }`}
    >
      <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
      <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
      {isActive(item.path) && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
      )}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold z-10">
          <Link to="/" className="text-primary flex items-center space-x-2 group">
            <img
              src={LOGO192}
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full dark:bg-transparent shadow-sm transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-primary text-sm sm:text-base md:text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Competence 2025
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 relative">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium hover:text-primary relative transition-colors duration-200 group flex items-center gap-2 ${
                  isActive(link.path) ? 'text-primary font-semibold' : ''
                }`}
              >
                <span className={`text-lg ${isActive(link.path) ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-opacity`}>{link.icon}</span>
                {link.name}
                <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}

          {/* Servicios Dropdown */}
          <div className="relative" ref={dropdownRefs.services}>
            <button
              onClick={() => toggleDesktopDropdown('services')}
              className={`flex items-center text-sm font-medium transition-colors duration-200 group ${
                activeDropdown === 'services' ? 'text-primary' : 'hover:text-primary'
              }`}
            >
              Servicios 
              <ChevronDown 
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'services' ? 'rotate-180' : ''
                }`} 
              />
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            
            {activeDropdown === 'services' && (
              <div 
                className="absolute right-0 mt-3 w-60 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl backdrop-blur-xl overflow-hidden z-50"
                style={{
                  animation: 'fadeInDown 0.3s ease-out forwards',
                  transformOrigin: 'top center',
                }}
              >
                <div className="py-2 max-h-[calc(100vh-150px)] overflow-y-auto">
                  {SERVICES.map(service => renderDropdownItem(service, () => setActiveDropdown(null)))}
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3 z-10">
          {/* Tema */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-[#17324d] transition-colors bg-[#218ffded] dark:bg-[#17324d] dark:hover:bg-[#218ffded] "
          >
            <span className="block relative w-6 h-6 ">
              <Sun 
                size={22} 
                className={`text-[#ffffff] hover:text-blue-400 absolute inset-0 transition-opacity ${isDark ? 'opacity-0' : 'opacity-100'}`} 
              />
              <Moon 
                size={22} 
                className={`text-blue-400 dark:hover:text-white  absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`} 
              />
            </span>
          </button>

          {/* boton para compartir la pagina */}
          <button 
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-[#17324d] transition-colors bg-[#218ffded] dark:bg-[#17324d] dark:hover:bg-[#218ffded] "
            aria-label="Share this page"
          >
            <Share2Icon size={18}/>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="block relative w-6 h-6">
              <Menu 
                className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} 
              />
              <X 
                className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Animación mejorada */}
      {isOpen && (
        <div 
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-lg"
          style={{
            animation: 'slideDown 0.3s ease-out forwards',
            transformOrigin: 'top center',
          }}
        >
          {/* Búsqueda móvil */}
          {/* <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el sitio..."
                className="w-full py-2 pl-4 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Search size={18} />
              </button>
            </form>
          </div> */}
          
          <nav className="flex flex-col px-4 py-2 max-h-[calc(100vh-130px)] overflow-y-auto">
            {/* Enlaces primarios */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 py-3 text-sm font-medium border-b border-gray-100 dark:border-gray-800 hover:text-primary transition-colors ${
                  isActive(link.path) ? 'text-primary' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
                {isActive(link.path) && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary"></span>
                )}
              </Link>
            ))}
            
            {/* Servicios desplegable móvil */}
            <div className="border-b border-gray-100 dark:border-gray-800">
              <button
                onClick={() => toggleMobileDropdown('services')}
                className={`flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors ${
                  SERVICES.some(s => isActive(s.path)) ? 'text-primary' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                  </span>
                  <span>Servicios</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    mobileDropdowns.services ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {mobileDropdowns.services && (
                <div 
                  className="pl-4 pb-2 space-y-1"
                  style={{
                    animation: 'slideInRight 0.3s ease-out forwards',
                  }}
                >
                  {SERVICES.map((service) => (
                    <Link
                      key={service.name}
                      to={service.path}
                      className={`flex items-center gap-2 py-2 pl-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        isActive(service.path) ? 'bg-gray-100 dark:bg-gray-800 text-primary' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-lg">{service.icon}</span>
                      <span>{service.name}</span>
                      {isActive(service.path) && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
          </nav>
        </div>
      )}
      
      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}
