from typing import Optional
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from .base import BaseSchema

"""
Schemas para los usuarios.
Estos schemas serán utilizados para validar los datos de entrada y salida de la API.
"""

class UserBase(BaseSchema):
    """Schema base para usuarios."""
    dni: str = Field(..., description="Documento Nacional de Identidad del usuario")
    username: str = Field(..., description="Nombre de usuario único")
    email: str = Field(..., description="Correo electrónico del usuario")

class UserCreate(UserBase):
    """Schema para crear un usuario."""
    password: str = Field(..., description="Contraseña del usuario")

class UserLogin(BaseSchema):
    """Schema para iniciar sesión."""
    email: Optional[str] = Field(None, description="Correo electrónico del usuario")
    username: Optional[str] = Field(None, description="Nombre de usuario")
    password: str = Field(..., description="Contraseña del usuario")
    
    @validator('email', 'username')
    def validate_login_fields(cls, v, values):
        # Verifica que al menos uno de los campos (email o username) esté presente
        if not v and 'email' in values and not values.get('email') and 'username' in values and not values.get('username'):
            raise ValueError("Se requiere al menos un email o username para iniciar sesión")
        return v

class UserResponse(UserBase):
    """Schema para respuestas de usuario."""
    created_at: Optional[datetime] = Field(None, description="Fecha de creación del usuario")
    updated_at: Optional[datetime] = Field(None, description="Fecha de actualización del usuario")

class TokenResponse(BaseSchema):
    """Schema para respuestas de token."""
    access_token: str = Field(..., description="Token de acceso JWT")
    token_type: str = Field(..., description="Tipo de token")

class UserCreateResponse(BaseSchema):
    """Schema para respuestas de creación de usuario."""
    message: str = Field(..., description="Mensaje de confirmación")
    dni: str = Field(..., description="Documento Nacional de Identidad del usuario")
    access_token: str = Field(..., description="Token de acceso JWT")
    token_type: str = Field(..., description="Tipo de token")
