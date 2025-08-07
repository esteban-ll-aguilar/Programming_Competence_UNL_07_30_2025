from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
"""
Schemas base para todas las entidades de la aplicación.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class BaseSchema(BaseModel):
    """Schema base del que heredan todos los demás schemas."""
    
    class Config:
        """Configuración del schema."""
        orm_mode = True  # Permite convertir modelos ORM a schemas Pydantic
