// src/pages/objects/ObjectList.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { 
  PlusIcon, 
  ArrowLeftIcon, 
  ArrowDownUpIcon, 
  TrashIcon,
  PencilIcon,
  BoxIcon,
  LayersIcon
} from "lucide-react";
import { getSizeLabel } from "../../utils/sizeEnums";

const ObjectList = () => {
  const { drawerId } = useParams();
  const navigate = useNavigate();
  const { error, success } = useAlert();
  
  const [drawer, setDrawer] = useState(null);
  const [objects, setObjects] = useState([]);
  const [objectTypes, setObjectTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortByName, setSortByName] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [drawerId, sortByName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch drawer details
      const drawerData = await api.drawers.getById(drawerId);
      setDrawer(drawerData);
      
      // Fetch objects in the drawer
      const objectsData = await api.objects.getByDrawer(drawerId, 0, 100, sortByName);
      setObjects(objectsData || []);
      
      // Fetch object types
      const typesData = await api.objectTypes.getAll();
      // Convert to object with id as key for easy lookup
      const typesMap = {};
      typesData.forEach(type => {
        typesMap[type.id] = type;
      });
      setObjectTypes(typesMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      error("Error al cargar los datos");
      navigate("/drawers");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSort = () => {
    setSortByName(!sortByName);
  };

  const handleDeleteObject = async (objectId) => {
    if (!window.confirm("¿Está seguro que desea eliminar este objeto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await api.objects.delete(objectId);
      success("Objeto eliminado exitosamente");
      // Remove from state
      setObjects(prevObjects => prevObjects.filter(obj => obj.id !== objectId));
    } catch (err) {
      console.error("Error deleting object:", err);
      error("Error al eliminar el objeto. Por favor intente de nuevo.");
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
      <div className="flex items-center mb-6">
        <Link
          to={`/drawers/${drawerId}`}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon size={18} />
          <span>Volver al Detalle del Cajón</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Objetos en {drawer?.name || "el cajón"}
        </h1>
        {drawer?.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {drawer.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
              {objects.length} / {drawer?.max_obj || 0} objetos
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSort}
              className="flex items-center gap-1 py-1 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
            >
              <ArrowDownUpIcon size={16} />
              <span>{sortByName ? "Ordenado por nombre" : "Ordenar por nombre"}</span>
            </button>
            
            <Link
              to={`/drawers/${drawerId}/objects/new`}
              className="flex items-center gap-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
              disabled={objects.length >= (drawer?.max_obj || 0)}
            >
              <PlusIcon size={16} />
              <span>Agregar Objeto</span>
            </Link>
          </div>
        </div>
      </div>
      
      {objects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <BoxIcon size={64} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No hay objetos en este cajón
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comience agregando objetos a este cajón
          </p>
          <Link
            to={`/drawers/${drawerId}/objects/new`}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors inline-block"
          >
            Agregar Objeto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((object) => (
            <div 
              key={object.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {object.name}
                  </h2>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {getSizeLabel(object.size_concept)}
                  </span>
                </div>
                
                {object.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {object.description}
                  </p>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <LayersIcon size={16} />
                    <span className="text-sm">
                      {objectTypes[object.object_type_id]?.name || "Tipo desconocido"}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2 mt-4">
                  <Link
                    to={`/drawers/${drawerId}/objects/edit/${object.id}`}
                    className="flex-1 text-center bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <PencilIcon size={16} />
                      <span>Editar</span>
                    </span>
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteObject(object.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <TrashIcon size={16} />
                      <span>Eliminar</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjectList;
