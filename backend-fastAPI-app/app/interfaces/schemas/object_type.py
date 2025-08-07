from typing import Optional
from pydantic import Field
from datetime import datetime
from .base import BaseSchema

"""
Schemas para los tipos de objetos.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class ObjectTypeBase(BaseSchema):
    """Schema base para tipos de objetos."""
    name: str = Field(..., description="Nombre del tipo de objeto")
    description: Optional[str] = Field(None, description="Descripción del tipo de objeto")

class ObjectTypeCreate(ObjectTypeBase):
    """Schema para crear un tipo de objeto."""
    pass

class ObjectTypeUpdate(BaseSchema):
    """Schema para actualizar un tipo de objeto."""
    name: Optional[str] = Field(None, description="Nombre del tipo de objeto")
    description: Optional[str] = Field(None, description="Descripción del tipo de objeto")

class ObjectTypeResponse(ObjectTypeBase):
    """Schema para respuestas de tipo de objeto."""
    id: int = Field(..., description="ID único del tipo de objeto")
    created_at: Optional[datetime] = Field(None, description="Fecha de creación del tipo de objeto")
    updated_at: Optional[datetime] = Field(None, description="Fecha de actualización del tipo de objeto")

class ObjectTypeActionResponse(BaseSchema):
    """Schema para respuestas de acciones sobre tipos de objetos."""
    message: str = Field(..., description="Mensaje de confirmación")
