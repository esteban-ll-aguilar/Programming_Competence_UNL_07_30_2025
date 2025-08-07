from typing import Optional
from pydantic import Field
from datetime import datetime
from .base import BaseSchema
from enum import Enum

"""
Schemas para el historial de acciones.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class ActionTypeEnum(str, Enum):
    """Enum para tipos de acciones."""
    CREATE_USER = "CREATE_USER"
    UPDATE_USER = "UPDATE_USER"
    DELETE_USER = "DELETE_USER"
    CREATE_DRAWER = "CREATE_DRAWER"
    UPDATE_DRAWER = "UPDATE_DRAWER"
    DELETE_DRAWER = "DELETE_DRAWER"
    CREATE_OBJECT = "CREATE_OBJECT"
    UPDATE_OBJECT = "UPDATE_OBJECT"
    DELETE_OBJECT = "DELETE_OBJECT"
    MOVE_OBJECT = "MOVE_OBJECT"
    CREATE_OBJECT_TYPE = "CREATE_OBJECT_TYPE"
    UPDATE_OBJECT_TYPE = "UPDATE_OBJECT_TYPE"
    DELETE_OBJECT_TYPE = "DELETE_OBJECT_TYPE"
    APPLY_RECOMMENDATIONS = "APPLY_RECOMMENDATIONS"

class ActionHistoryBase(BaseSchema):
    """Schema base para historial de acciones."""
    user_id: str = Field(..., description="DNI del usuario que realizó la acción")
    action_type: ActionTypeEnum = Field(..., description="Tipo de acción realizada")
    details: str = Field(..., description="Detalles de la acción")

class ActionHistoryCreate(ActionHistoryBase):
    """Schema para crear un registro de historial."""
    pass

class ActionHistoryResponse(ActionHistoryBase):
    """Schema para respuestas de historial."""
    id: int = Field(..., description="ID único del registro de historial")
    timestamp: datetime = Field(..., description="Fecha y hora de la acción")

class ActionHistoryActionResponse(BaseSchema):
    """Schema para respuestas de acciones sobre historial."""
    message: str = Field(..., description="Mensaje de confirmación")
