// src/pages/drawers/DrawerForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import api from "../../utils/api";
import { SizeConcept, SizeConceptLabels } from "../../utils/sizeEnums";

const DrawerForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { success, error } = useAlert();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: SizeConcept.MEDIUM,
    max_obj: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchingDrawer, setFetchingDrawer] = useState(isEditMode);

  // Fetch drawer data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchDrawerData();
    }
  }, [id]);

  const fetchDrawerData = async () => {
    try {
      setFetchingDrawer(true);
      const data = await api.drawers.getById(id);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        size: data.size || SizeConcept.MEDIUM,
        max_obj: data.max_obj || 10
      });
    } catch (err) {
      console.error("Error fetching drawer:", err);
      error("Error al cargar los datos del cajón");
      navigate("/drawers");
    } finally {
      setFetchingDrawer(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "max_obj" ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      error("El nombre del cajón es obligatorio");
      return;
    }
    
    if (formData.max_obj < 1) {
      error("La capacidad máxima debe ser al menos 1");
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        await api.drawers.update(id, formData);
        success("Cajón actualizado exitosamente");
      } else {
        await api.drawers.create(formData);
        success("Cajón creado exitosamente");
      }
      navigate("/drawers");
    } catch (err) {
      console.error("Error saving drawer:", err);
      error(isEditMode 
        ? "Error al actualizar el cajón. Por favor intente de nuevo." 
        : "Error al crear el cajón. Por favor intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDrawer) {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? "Editar Cajón" : "Crear Nuevo Cajón"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre del Cajón *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Nombre del cajón"
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
              placeholder="Descripción del cajón (opcional)"
              disabled={loading}
            />
          </div>
          
          <div>
            <label 
              htmlFor="size" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tamaño
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
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
          
          <div>
            <label 
              htmlFor="max_obj" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Capacidad Máxima
            </label>
            <input
              id="max_obj"
              name="max_obj"
              type="number"
              min="1"
              value={formData.max_obj}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Cantidad máxima de objetos"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Número máximo de objetos que puede contener este cajón
            </p>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/drawers")}
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
                isEditMode ? "Actualizar Cajón" : "Crear Cajón"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrawerForm;
