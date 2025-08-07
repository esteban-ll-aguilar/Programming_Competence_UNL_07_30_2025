from fastapi import APIRouter, Request, status, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from app.domain.controls.user_control import UserControl
from typing import Dict, Any
from app.lib.token_header import get_current_user, create_access_token
from datetime import timedelta
from app.interfaces.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    UserCreateResponse
)

router = APIRouter()

@router.get("/")
async def init():
    return [
        {"name": "Esteban Leon Aguilar",
         "message": "Usuarios Correctamente V1"}
    ]


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=UserCreateResponse)
async def create_user(user_data: UserCreate = Body(...)):
    """
    Crea un nuevo usuario y genera automáticamente un token JWT.
    
    Args:
        user_data: Datos del usuario a crear
        
    Returns:
        Mensaje de confirmación, DNI del usuario y token de acceso
    """
    user_control = UserControl()
    
    # Prepare user data
    user_control.model.dni = user_data.dni
    user_control.model.username = user_data.username
    user_control.model.email = user_data.email
    user_control.model.password = user_data.password  # This will hash the password
    
    try:
        # Create the user
        created_user = await user_control.create_user(user_control.model.serialize)
        
        # Generate JWT token for the new user
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user_data.dni},
            expires_delta=access_token_expires
        )
        
        # Store the token in the user record
        await user_control.update_user_token(user_data.dni, access_token)
        
        return UserCreateResponse(
            message="User created successfully",
            dni=user_data.dni,
            access_token=access_token,
            token_type="bearer"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )
    
@router.get("/get/{username}", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_user(username: str):
    """
    Obtiene información de un usuario por su nombre de usuario.
    
    Args:
        username: Nombre de usuario a buscar
        
    Returns:
        Datos del usuario
    """
    user_control = UserControl()
    found = await user_control.get_user_by_username(username=username)
    
    if found:
        return user_control.model.serialize
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@router.post("/login", status_code=status.HTTP_200_OK, response_model=TokenResponse)
async def login(login_data: UserLogin = Body(...)):
    """
    Autentica un usuario y genera un token JWT.
    
    Args:
        login_data: Datos de inicio de sesión (email/username y password)
        
    Returns:
        Token de acceso JWT
    """
    email = login_data.email
    username = login_data.username
    password = login_data.password
    
    # Permite inicio de sesión con email o username
    if not ((email or username) and password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/Username and password are required"
        )
    
    # Authenticate user
    user_control = UserControl()
    
    if email:
        # Autenticar por email si está disponible
        user = await user_control.authenticate_user_by_email(email, password)
    else:
        # Autenticar por username como fallback
        user = await user_control.authenticate_user(username, password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["dni"]},
        expires_delta=access_token_expires
    )
    
    # Store the token in the user record
    await user_control.update_user_token(user["dni"], access_token)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )

@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Obtiene información del usuario autenticado actualmente.
    
    Args:
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Datos del usuario actual
    """
    return {
        "dni": current_user["dni"],
        "username": current_user["username"],
        "email": current_user["email"]
    }