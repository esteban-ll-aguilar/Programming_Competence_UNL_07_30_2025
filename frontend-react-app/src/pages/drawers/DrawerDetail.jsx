// src/pages/drawers/DrawerDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { 
  BoxIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  ArrowLeftIcon,
  LayersIcon,
  SparklesIcon
} from "lucide-react";
import { getSizeLabel } from "../../utils/sizeEnums";

const DrawerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error } = useAlert();
  
  const [drawer, setDrawer] = useState(null);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [objectTypes, setObjectTypes] = useState({});
  
  useEffect(() => {
    fetchDrawerAndObjects();
    fetchObjectTypes();
  }, [id]);

  const fetchDrawerAndObjects = async () => {
    try {
      setLoading(true);
      // Fetch drawer details
      const drawerData = await api.drawers.getById(id);
      setDrawer(drawerData);
      
      // Fetch objects in the drawer
      const objectsData = await api.objects.getByDrawer(id);
      setObjects(objectsData || []);
    } catch (err) {
      console.error("Error fetching drawer data:", err);
      error("Error al cargar los datos del cajón");
      navigate("/drawers");
    } finally {
      setLoading(false);
    }
  };

  const fetchObjectTypes = async () => {
    try {
      const typesData = await api.objectTypes.getAll();
      // Convert to object with id as key for easy lookup
      const typesMap = {};
      typesData.forEach(type => {
        typesMap[type.id] = type;
      });
      setObjectTypes(typesMap);
    } catch (err) {
      console.error("Error fetching object types:", err);
    }
  };

  const handleDeleteObject = async (objectId) => {
    if (!window.confirm("¿Está seguro que desea eliminar este objeto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await api.objects.delete(objectId);
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

  if (!drawer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            El cajón no fue encontrado
          </h2>
          <Link
            to="/drawers"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors inline-block"
          >
            Volver a Mis Cajones
          </Link>
        </div>
      </div>
    );
  }

  // Calculate usage percentage
  const usagePercentage = drawer.max_obj > 0 
    ? Math.min(Math.round((objects.length / drawer.max_obj) * 100), 100) 
    : 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          to="/drawers"
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon size={18} />
          <span>Volver a Mis Cajones</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
            {drawer.name}
          </h1>
          
          <div className="flex gap-2">
            <Link
              to={`/drawers/${drawer.id}/recommendations`}
              className="flex items-center gap-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-md transition-colors"
            >
              <SparklesIcon size={16} />
              <span>Recomendaciones</span>
            </Link>
            
            <Link
              to={`/drawers/edit/${drawer.id}`}
              className="flex items-center gap-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              <PencilIcon size={16} />
              <span>Editar</span>
            </Link>
          </div>
        </div>
        
        {drawer.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {drawer.description}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tamaño</p>
            <p className="font-medium text-gray-900 dark:text-white">{getSizeLabel(drawer.size)}</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Capacidad Máxima</p>
            <p className="font-medium text-gray-900 dark:text-white">{drawer.max_obj} objetos</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <div className="flex justify-between mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Utilización</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{objects.length}/{drawer.max_obj}</p>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2.5 mb-1">
              <div 
                className={`h-2.5 rounded-full ${
                  usagePercentage >= 90 
                    ? 'bg-red-600 dark:bg-red-500' 
                    : usagePercentage >= 70
                    ? 'bg-amber-500 dark:bg-amber-400' 
                    : 'bg-green-600 dark:bg-green-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{usagePercentage}% lleno</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Objetos en el Cajón
          </h2>
          
          <Link
            to={`/drawers/${drawer.id}/objects/new`}
            className="flex items-center gap-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
            disabled={objects.length >= drawer.max_obj}
          >
            <PlusIcon size={16} />
            <span>Agregar Objeto</span>
          </Link>
        </div>
        
        {objects.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <BoxIcon size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Este cajón está vacío
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Agregue objetos para comenzar a organizar este cajón
            </p>
            <Link
              to={`/drawers/${drawer.id}/objects/new`}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors inline-block"
            >
              Agregar mi primer objeto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {objects.map((object) => (
                  <tr key={object.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{object.name}</div>
                      {object.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{object.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <LayersIcon size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {objectTypes[object.object_type_id]?.name || "Tipo desconocido"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {getSizeLabel(object.size_concept)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/drawers/${drawer.id}/objects/edit/${object.id}`}
                          className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-300"
                          title="Editar"
                        >
                          <PencilIcon size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteObject(object.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawerDetail;
