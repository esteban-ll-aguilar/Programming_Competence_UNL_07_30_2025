from typing import Optional, List, Dict, Any
from pydantic import Field
from .base import BaseSchema

"""
Schemas para las recomendaciones de IA.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class DrawerRecommendationRequest(BaseSchema):
    """Schema para solicitar recomendaciones para un cajón."""
    drawer_id: int = Field(..., description="ID del cajón para el que se solicitan recomendaciones")

class DrawerRecommendationResponse(BaseSchema):
    """Schema para respuestas de recomendaciones."""
    recomendaciones: List[str] = Field(..., description="Lista de recomendaciones generadas por la IA")
    mensajes: List[str] = Field(..., description="Mensajes explicativos de las recomendaciones")
    acciones: Dict[str, bool] = Field(..., description="Acciones posibles a realizar (eliminar_duplicados, ordenar_por_tipo, ordenar_por_tamanio)")

class ApplyRecommendationRequest(BaseSchema):
    """Schema para aplicar recomendaciones."""
    drawer_id: int = Field(..., description="ID del cajón al que se aplicarán las recomendaciones")
    actions: Dict[str, bool] = Field(..., description="Acciones a aplicar (eliminar_duplicados, ordenar_por_tipo, ordenar_por_tamanio)")

class ApplyRecommendationResponse(BaseSchema):
    """Schema para respuestas de aplicación de recomendaciones."""
    message: str = Field(..., description="Mensaje de confirmación")
    results: Dict[str, Any] = Field(..., description="Resultados de la aplicación de recomendaciones")
