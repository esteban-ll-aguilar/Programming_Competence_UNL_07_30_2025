// src/pages/recommendations/Recommendations.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  LightbulbIcon,
  CheckIcon,
  XIcon,
  LoaderIcon
} from "lucide-react";

const Recommendations = () => {
  const { id: drawerId } = useParams();
  const navigate = useNavigate();
  const { error, success } = useAlert();
  
  const [drawer, setDrawer] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingDrawer, setLoadingDrawer] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedActions, setSelectedActions] = useState({});
  
  useEffect(() => {
    fetchDrawer();
    fetchRecommendations();
  }, [drawerId]);

  const fetchDrawer = async () => {
    try {
      setLoadingDrawer(true);
      const data = await api.drawers.getById(drawerId);
      setDrawer(data);
    } catch (err) {
      console.error("Error fetching drawer:", err);
      error("Error al cargar los datos del cajón");
      navigate("/drawers");
    } finally {
      setLoadingDrawer(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const data = await api.recommendations.getForDrawer(drawerId);
      setRecommendations(data);
      
      // Initialize selected actions with the recommended defaults
      if (data && data.acciones) {
        setSelectedActions(data.acciones);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      error("Error al cargar las recomendaciones. Por favor intente de nuevo.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleToggleAction = (actionKey) => {
    setSelectedActions(prev => ({
      ...prev,
      [actionKey]: !prev[actionKey]
    }));
  };

  const handleApplyRecommendations = async () => {
    try {
      setApplying(true);
      const result = await api.recommendations.applyRecommendations(
        drawerId,
        selectedActions
      );
      
      success("Recomendaciones aplicadas exitosamente");
      
      // Show some details about what was done
      if (result.results) {
        const { duplicates_removed, sorted_by_type, sorted_by_size } = result.results;
        
        let message = "Resultados: ";
        if (duplicates_removed) {
          message += `${duplicates_removed} objetos duplicados eliminados. `;
        }
        if (sorted_by_type) {
          message += "Objetos ordenados por tipo. ";
        }
        if (sorted_by_size) {
          message += "Objetos ordenados por tamaño.";
        }
        
        success(message);
      }
      
      // Navigate back to drawer details
      navigate(`/drawers/${drawerId}`);
    } catch (err) {
      console.error("Error applying recommendations:", err);
      error("Error al aplicar las recomendaciones. Por favor intente de nuevo.");
    } finally {
      setApplying(false);
    }
  };

  const isLoading = loadingDrawer || loadingRecommendations;

  if (isLoading) {
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
          <span>Volver al Cajón</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon size={24} className="text-purple-600 dark:text-purple-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recomendaciones Inteligentes
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Analizamos su cajón "{drawer.name}" y generamos las siguientes recomendaciones para optimizar su organización:
        </p>
        
        {!recommendations ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <LightbulbIcon size={64} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No hay recomendaciones disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No encontramos recomendaciones para este cajón en este momento. Intente agregar más objetos para obtener recomendaciones útiles.
            </p>
          </div>
        ) : (
          <>
            {recommendations.recomendaciones && recommendations.recomendaciones.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Recomendaciones
                </h2>
                <ul className="space-y-2">
                  {recommendations.recomendaciones.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-1 rounded-full mt-0.5">
                        <LightbulbIcon size={16} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendations.mensajes && recommendations.mensajes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Observaciones
                </h2>
                <ul className="space-y-2">
                  {recommendations.mensajes.map((msg, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendations.acciones && Object.keys(recommendations.acciones).length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Acciones Recomendadas
                </h2>
                <div className="space-y-3">
                  {Object.entries(recommendations.acciones).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${
                          selectedActions[key] 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {selectedActions[key] ? <CheckIcon size={18} /> : <XIcon size={18} />}
                        </div>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {key === 'eliminar_duplicados' && 'Eliminar objetos duplicados'}
                          {key === 'ordenar_por_tipo' && 'Ordenar objetos por tipo'}
                          {key === 'ordenar_por_tamanio' && 'Ordenar objetos por tamaño'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleAction(key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedActions[key]
                            ? 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200'
                            : 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200'
                        }`}
                      >
                        {selectedActions[key] ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-8">
              <button
                onClick={handleApplyRecommendations}
                disabled={applying || Object.values(selectedActions).every(value => !value)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 dark:bg-purple-500 dark:hover:bg-purple-600 dark:disabled:bg-purple-700 text-white py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-opacity-75"
              >
                {applying ? (
                  <>
                    <LoaderIcon size={20} className="animate-spin" />
                    <span>Aplicando recomendaciones...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon size={20} />
                    <span>Aplicar Recomendaciones Seleccionadas</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
