from typing import Optional
from pydantic import Field
from datetime import datetime
from .base import BaseSchema
from enum import Enum

"""
Schemas para los objetos.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class SizeConceptEnum(str, Enum):
    """Enum para tamaños conceptuales de objetos."""
    TINY = "TINY"
    SMALL = "SMALL"
    MEDIUM = "MEDIUM"
    LARGE = "LARGE"
    XLARGE = "XLARGE"

class ObjectBase(BaseSchema):
    """Schema base para objetos."""
    name: str = Field(..., description="Nombre del objeto")
    description: Optional[str] = Field(None, description="Descripción del objeto")
    object_type_id: int = Field(..., description="ID del tipo de objeto")
    size_concept: SizeConceptEnum = Field(..., description="Tamaño conceptual del objeto (TINY, SMALL, MEDIUM, LARGE, XLARGE)")

class ObjectCreate(ObjectBase):
    """Schema para crear un objeto."""
    pass

class ObjectUpdate(BaseSchema):
    """Schema para actualizar un objeto."""
    name: Optional[str] = Field(None, description="Nombre del objeto")
    description: Optional[str] = Field(None, description="Descripción del objeto")
    object_type_id: Optional[int] = Field(None, description="ID del tipo de objeto")
    size_concept: Optional[SizeConceptEnum] = Field(None, description="Tamaño conceptual del objeto (TINY, SMALL, MEDIUM, LARGE, XLARGE)")

class ObjectResponse(ObjectBase):
    """Schema para respuestas de objeto."""
    id: int = Field(..., description="ID único del objeto")
    drawer_id: int = Field(..., description="ID del cajón al que pertenece el objeto")
    created_at: Optional[datetime] = Field(None, description="Fecha de creación del objeto")
    updated_at: Optional[datetime] = Field(None, description="Fecha de actualización del objeto")
    # Añadimos campos adicionales que podrían ser útiles
    object_type_name: Optional[str] = Field(None, description="Nombre del tipo de objeto")

class ObjectActionResponse(BaseSchema):
    """Schema para respuestas de acciones sobre objetos."""
    message: str = Field(..., description="Mensaje de confirmación")
