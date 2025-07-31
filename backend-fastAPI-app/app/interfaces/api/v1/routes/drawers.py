from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.domain.controls.drawer_control import DrawerControl
from app.domain.controls.user_dao_control import UserDaoControl
from typing import Optional, List, Dict, Any
from app.lib.token_header import get_current_user

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_drawer(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    # Extraemos los datos del request
    drawer_data = await request.json()
    drawer = DrawerControl()
    
    try:
        # Crear el cajón con el ID del usuario actual
        await drawer.create_drawer(user_id=current_user["dni"], drawer_data=drawer_data)
        
        return JSONResponse(
            content={"message": "Drawer created successfully"},
            status_code=status.HTTP_201_CREATED
        )
    except ValueError as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

@router.get("/", status_code=status.HTTP_200_OK)
async def get_user_drawers(
    skip: int = 0, 
    limit: int = 100, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all drawers for the current user with pagination.
    
    Args:
        skip: Number of drawers to skip
        limit: Maximum number of drawers to return
    """
    drawer = DrawerControl()
    drawers = await drawer.get_user_drawers(user_id=current_user["dni"], skip=skip, limit=limit)
    
    # Serializamos manualmente cada cajón
    serialized_drawers = []
    for drawer_obj in drawers:
        serialized_drawers.append(drawer_obj.serialize)
    
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
