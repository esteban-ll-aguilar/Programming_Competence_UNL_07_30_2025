// src/pages/drawers/DrawerList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { PlusIcon, TrashIcon, PencilIcon, BoxesIcon, SparklesIcon } from "lucide-react";

const DrawerList = () => {
  const [drawers, setDrawers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useAlert();

  useEffect(() => {
    fetchDrawers();
  }, []);

  const fetchDrawers = async () => {
    try {
      setLoading(true);
      const data = await api.drawers.getAll();
      setDrawers(data || []);
    } catch (err) {
      console.error("Error fetching drawers:", err);
      error("Error al cargar los cajones. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrawer = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este cajón? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await api.drawers.delete(id);
      // Remove from state
      setDrawers(prevDrawers => prevDrawers.filter(drawer => drawer.id !== id));
    } catch (err) {
      console.error("Error deleting drawer:", err);
      error("Error al eliminar el cajón. Por favor intente de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mis Cajones
        </h1>
        <Link
          to="/drawers/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          <PlusIcon size={20} />
          <span>Nuevo Cajón</span>
        </Link>
      </div>

      {drawers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <BoxesIcon size={64} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No tiene cajones creados
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comience creando su primer cajón para organizar sus objetos
          </p>
          <Link
            to="/drawers/new"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors inline-block"
          >
            Crear mi primer cajón
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drawers.map((drawer) => (
            <div 
              key={drawer.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {drawer.name}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {drawer.description || "Sin descripción"}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tamaño</p>
                    <p className="font-medium text-gray-900 dark:text-white">{drawer.size}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Capacidad</p>
                    <p className="font-medium text-gray-900 dark:text-white">{drawer.max_obj} objetos</p>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2 mt-4">
                  <Link
                    to={`/drawers/${drawer.id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/drawers/${drawer.id}/recommendations`}
                      className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white p-2 rounded-md transition-colors"
                      title="Recomendaciones"
                    >
                      <SparklesIcon size={20} />
                    </Link>
                    
                    <Link
                      to={`/drawers/edit/${drawer.id}`}
                      className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                      title="Editar"
                    >
                      <PencilIcon size={20} />
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteDrawer(drawer.id)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrawerList;
