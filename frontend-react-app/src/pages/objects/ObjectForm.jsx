// src/pages/objects/ObjectForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { SizeConcept, SizeConceptLabels } from "../../utils/sizeEnums";
import { ArrowLeftIcon } from "lucide-react";

const ObjectForm = () => {
  const { drawerId, objectId } = useParams();
  const isEditMode = !!objectId;
  const navigate = useNavigate();
  const { success, error } = useAlert();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    object_type_id: "",
    size_concept: SizeConcept.MEDIUM
  });
  
  const [objectTypes, setObjectTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetchingData(true);
        
        // Fetch object types
        const types = await api.objectTypes.getAll();
        setObjectTypes(types || []);
        
        // If editing, fetch object data
        if (isEditMode) {
          const objectData = await api.objects.getById(objectId);
          setFormData({
            name: objectData.name || "",
            description: objectData.description || "",
            object_type_id: objectData.object_type_id || "",
            size_concept: objectData.size_concept || SizeConcept.MEDIUM
          });
        } else if (types && types.length > 0) {
          // Set default object type to first in list for new objects
          setFormData(prev => ({
            ...prev,
            object_type_id: types[0].id
          }));
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        error("Error al cargar los datos iniciales");
        navigate(`/drawers/${drawerId}`);
      } finally {
        setFetchingData(false);
      }
    };

    fetchInitialData();
  }, [drawerId, objectId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "object_type_id" ? parseInt(value, 10) : value
    }));
  };

  const handleCreateObjectType = async () => {
    const typeName = window.prompt("Ingrese el nombre del nuevo tipo de objeto:");
    if (!typeName) return;
    
    try {
      setLoading(true);
      const newType = await api.objectTypes.create({
        name: typeName,
        description: ""
      });
      
      // Refresh object types list
      const types = await api.objectTypes.getAll();
      setObjectTypes(types || []);
      
      // Set the new type as selected
      setFormData(prev => ({
        ...prev,
        object_type_id: newType.id
      }));
      
      success(`Tipo de objeto "${typeName}" creado exitosamente`);
    } catch (err) {
      console.error("Error creating object type:", err);
      error("Error al crear el tipo de objeto");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.object_type_id) {
      error("Por favor complete todos los campos obligatorios");
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        await api.objects.update(objectId, formData);
        success("Objeto actualizado exitosamente");
      } else {
        await api.objects.create(drawerId, formData);
        success("Objeto creado exitosamente");
      }
      navigate(`/drawers/${drawerId}`);
    } catch (err) {
      console.error("Error saving object:", err);
      error(isEditMode 
        ? "Error al actualizar el objeto. Por favor intente de nuevo." 
        : "Error al crear el objeto. Por favor intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/drawers/${drawerId}`)}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon size={18} />
          <span>Volver al Cajón</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? "Editar Objeto" : "Agregar Nuevo Objeto"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre del Objeto *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Nombre del objeto"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Descripción del objeto (opcional)"
              disabled={loading}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label 
                htmlFor="object_type_id" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tipo de Objeto *
              </label>
              <button
                type="button"
                onClick={handleCreateObjectType}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={loading}
              >
                + Crear nuevo tipo
              </button>
            </div>
            <select
              id="object_type_id"
              name="object_type_id"
              value={formData.object_type_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              disabled={loading}
              required
            >
              {objectTypes.length === 0 ? (
                <option value="">No hay tipos disponibles</option>
              ) : (
                objectTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div>
            <label 
              htmlFor="size_concept" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tamaño
            </label>
            <select
              id="size_concept"
              name="size_concept"
              value={formData.size_concept}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              disabled={loading}
            >
              {Object.entries(SizeConcept).map(([key, value]) => (
                <option key={key} value={value}>
                  {SizeConceptLabels[value]}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/drawers/${drawerId}`)}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? "Actualizando..." : "Creando..."}
                </span>
              ) : (
                isEditMode ? "Actualizar Objeto" : "Crear Objeto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectForm;
