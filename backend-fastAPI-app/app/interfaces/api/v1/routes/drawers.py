from fastapi import APIRouter, Request, status, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from app.domain.controls.drawer_control import DrawerControl
from app.domain.controls.user_dao_control import UserDaoControl
from typing import Optional, List, Dict, Any
from app.lib.token_header import get_current_user
from app.interfaces.schemas import (
    DrawerCreate,
    DrawerUpdate,
    DrawerResponse,
    DrawerActionResponse
)

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=DrawerActionResponse)
async def create_drawer(
    drawer_data: DrawerCreate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crea un nuevo cajón para el usuario autenticado.
    
    Args:
        drawer_data: Datos del cajón a crear
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    drawer = DrawerControl()
    
    try:
        # Crear el cajón con el ID del usuario actual
        await drawer.create_drawer(user_id=current_user["dni"], drawer_data=drawer_data.dict())
        
        return DrawerActionResponse(message="Drawer created successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[DrawerResponse])
async def get_user_drawers(
    skip: int = 0, 
    limit: int = 100, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtiene todos los cajones del usuario autenticado con paginación.
    
    Args:
        skip: Número de cajones a saltar
        limit: Número máximo de cajones a devolver
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Lista de cajones serializados
    """
    drawer = DrawerControl()
    drawers = await drawer.get_user_drawers(user_id=current_user["dni"], skip=skip, limit=limit)
    
    # Serializamos manualmente cada cajón
    serialized_drawers = []
    for drawer_obj in drawers:
        serialized_drawers.append(drawer_obj.serialize)
    
    return serialized_drawers
    
    return JSONResponse(
        content=serialized_drawers,
        status_code=status.HTTP_200_OK
    )

@router.get("/{drawer_id}", status_code=status.HTTP_200_OK)
async def get_drawer(drawer_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get a drawer by ID.
    
    Args:
        drawer_id: The drawer ID
    """
    drawer_control = DrawerControl()
    drawer_obj = await drawer_control.get_drawer(drawer_id=drawer_id)
    
    if not drawer_obj:
        return JSONResponse(
            content={"error": "Drawer not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
        
    # Verificar que el cajón pertenece al usuario actual
    if drawer_obj.user_id != current_user["dni"]:
        return JSONResponse(
            content={"error": "You don't have permission to access this drawer"},
            status_code=status.HTTP_403_FORBIDDEN
        )
    
    return JSONResponse(
        content=drawer_obj.serialize,
        status_code=status.HTTP_200_OK
    )

@router.put("/{drawer_id}", status_code=status.HTTP_200_OK)
async def update_drawer(drawer_id: int, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Update a drawer.
    
    Args:
        drawer_id: The drawer ID
    """
    # Extraemos los datos del request
    drawer_data = await request.json()
    drawer_control = DrawerControl()
    
    # Actualizar el cajón
    updated_drawer = await drawer_control.update_drawer(
        user_id=current_user["dni"], 
        drawer_id=drawer_id, 
        drawer_data=drawer_data
    )
    
    if not updated_drawer:
        return JSONResponse(
            content={"error": "Drawer not found or you don't have permission to update it"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    return JSONResponse(
        content={"message": "Drawer updated successfully"},
        status_code=status.HTTP_200_OK
    )

@router.delete("/{drawer_id}", status_code=status.HTTP_200_OK)
async def delete_drawer(drawer_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Delete a drawer.
    
    Args:
        drawer_id: The drawer ID
    """
    drawer_control = DrawerControl()
    
    # Eliminar el cajón
    deleted_drawer = await drawer_control.delete_drawer(
        user_id=current_user["dni"], 
        drawer_id=drawer_id
    )
    
    if not deleted_drawer:
        return JSONResponse(
            content={"error": "Drawer not found or you don't have permission to delete it"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    return JSONResponse(
        content={"message": "Drawer deleted successfully"},
        status_code=status.HTTP_200_OK
    )
