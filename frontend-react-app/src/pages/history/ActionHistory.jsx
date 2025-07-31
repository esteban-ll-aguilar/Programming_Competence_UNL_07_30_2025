// src/pages/history/ActionHistory.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  TrashIcon,
  FilterIcon,
  CheckIcon,
  XIcon
} from "lucide-react";

const ActionHistory = () => {
  const { error } = useAlert();
  
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [actionTypes, setActionTypes] = useState([]);
  
  useEffect(() => {
    fetchActionHistory();
  }, []);

  const fetchActionHistory = async () => {
    try {
      setLoading(true);
      
      const data = await api.actionHistory.getAll();
      setActions(data || []);
      
      // Extract unique action types
      const types = data.reduce((acc, action) => {
        if (!acc.includes(action.action_type)) {
          acc.push(action.action_type);
        }
        return acc;
      }, []);
      
      setActionTypes(types);
    } catch (err) {
      console.error("Error fetching action history:", err);
      error("Error al cargar el historial de acciones. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (actionId) => {
    if (!window.confirm("¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await api.actionHistory.delete(actionId);
      // Remove from state
      setActions(prevActions => prevActions.filter(action => action.id !== actionId));
    } catch (err) {
      console.error("Error deleting action:", err);
      error("Error al eliminar el registro. Por favor intente de nuevo.");
    }
  };

  const handleFilterChange = (type) => {
    setSelectedType(type);
  };

  // Filter actions by selected type
  const filteredActions = selectedType === 'all'
    ? actions
    : actions.filter(action => action.action_type === selectedType);

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
          to="/drawers"
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon size={18} />
          <span>Volver a Mis Cajones</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Historial de Acciones
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Registro de todas las acciones realizadas en la aplicación
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <FilterIcon size={16} />
                <span className="text-sm font-medium">Filtrar por tipo:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
                
                {actionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {filteredActions.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <ClockIcon size={64} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No hay acciones registradas
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedType === 'all'
                ? "Aún no se han registrado acciones en el sistema"
                : `No hay acciones de tipo "${selectedType}" registradas`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{formatDate(action.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {action.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{action.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {action.success ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <CheckIcon size={16} className="mr-1" />
                          Exitoso
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 dark:text-red-400">
                          <XIcon size={16} className="mr-1" />
                          Fallido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteAction(action.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-300"
                        title="Eliminar"
                      >
                        <TrashIcon size={18} />
                      </button>
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

export default ActionHistory;
