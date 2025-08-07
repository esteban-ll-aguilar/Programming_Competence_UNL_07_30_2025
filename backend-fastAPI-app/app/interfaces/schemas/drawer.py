from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from .base import BaseSchema
from enum import Enum

"""
Schemas para los cajones.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class SizeEnum(str, Enum):
    """Enum para tamaños de cajones."""
    SMALL = "SMALL"
    MEDIUM = "MEDIUM" 
    LARGE = "LARGE"
    XLARGE = "XLARGE"

class DrawerBase(BaseSchema):
    """Schema base para cajones."""
    name: str = Field(..., description="Nombre del cajón")
    description: Optional[str] = Field(None, description="Descripción del cajón")
    size: SizeEnum = Field(..., description="Tamaño del cajón (SMALL, MEDIUM, LARGE, XLARGE)")
    max_obj: int = Field(..., description="Número máximo de objetos que puede contener el cajón")

class DrawerCreate(DrawerBase):
    """Schema para crear un cajón."""
    pass

class DrawerUpdate(BaseSchema):
    """Schema para actualizar un cajón."""
    name: Optional[str] = Field(None, description="Nombre del cajón")
    description: Optional[str] = Field(None, description="Descripción del cajón")
    size: Optional[SizeEnum] = Field(None, description="Tamaño del cajón (SMALL, MEDIUM, LARGE, XLARGE)")
    max_obj: Optional[int] = Field(None, description="Número máximo de objetos que puede contener el cajón")

class DrawerResponse(DrawerBase):
    """Schema para respuestas de cajón."""
    id: int = Field(..., description="ID único del cajón")
    user_id: str = Field(..., description="DNI del usuario propietario del cajón")
    created_at: Optional[datetime] = Field(None, description="Fecha de creación del cajón")
    updated_at: Optional[datetime] = Field(None, description="Fecha de actualización del cajón")
    current_objects: int = Field(0, description="Número actual de objetos en el cajón")

class DrawerActionResponse(BaseSchema):
    """Schema para respuestas de acciones sobre cajones."""
    message: str = Field(..., description="Mensaje de confirmación")
