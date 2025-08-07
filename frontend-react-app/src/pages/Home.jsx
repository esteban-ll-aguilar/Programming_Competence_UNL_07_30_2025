import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SparklesIcon, BoxIcon, HistoryIcon, ClipboardListIcon } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-900 rounded-xl shadow-xl overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Organice sus objetos de forma inteligente
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-lg">
                Una aplicación potenciada por IA para ayudarle a mantener sus cajones organizados de manera eficiente y encontrar rápidamente lo que necesita.
              </p>
              
              {isAuthenticated() ? (
                <Link
                  to="/drawers"
                  className="inline-flex items-center bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors mr-4"
                >
                  <BoxIcon size={20} className="mr-2" />
                  Ir a Mis Cajones
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center bg-transparent hover:bg-blue-500 text-white border-2 border-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/images/drawers-hero.svg" 
                alt="Ilustración de cajones organizados" 
                className="max-w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCBzYW5zLXNlcmlmIiBmaWxsPSIjNTU1Ij5Pcmdhbml6YWRvciBkZSBDYWpvbmVzPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Características Principales
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nuestra aplicación ofrece todo lo que necesita para mantener sus objetos organizados y fáciles de encontrar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <BoxIcon size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Gestión de Cajones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cree y organice cajones virtuales para almacenar sus objetos. Asigne nombres, descripciones y tamaños para mantener todo en orden.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <ClipboardListIcon size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Organización por Tipo y Tamaño
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clasifique sus objetos por tipo y tamaño para facilitar su búsqueda. Cree tipos personalizados para adaptarse a sus necesidades específicas.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <SparklesIcon size={28} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Recomendaciones Inteligentes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Reciba sugerencias generadas por IA para optimizar la organización de sus cajones, detectar duplicados y mejorar la eficiencia del espacio.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <HistoryIcon size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Historial de Acciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Mantenga un registro detallado de todas las acciones realizadas en sus cajones y objetos para un mejor seguimiento y control.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10H12V2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Visualización de Capacidad
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vea de un vistazo la capacidad utilizada de cada cajón con gráficos intuitivos y alertas cuando un cajón está casi lleno.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
                <path d="M12 21a9 9 0 0 1-9-9c0-3.9 2.5-7.2 6-8.5 2.1-.8 4.6-.4 6.4 1 1.9 1.4 2.6 3.9 1.8 6-1.3 3.4-5.7 4.8-8.9 2.2-.8-.7-1.4-1.6-1.7-2.6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Modo Oscuro
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Disfrute de una experiencia visual cómoda con nuestro elegante modo oscuro, ideal para uso nocturno o para reducir la fatiga ocular.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-8 text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ¿Listo para organizar sus cajones?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Comience hoy a disfrutar de una organización más inteligente y eficiente con nuestra aplicación.
        </p>
        
        {isAuthenticated() ? (
          <Link
            to="/drawers"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
          >
            <BoxIcon size={20} className="mr-2" />
            Ir a Mis Cajones
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Crear una Cuenta
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
