from fastapi import APIRouter, Request, status, Depends, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from app.domain.controls.object_control import ObjectControl
from typing import Optional, List, Dict, Any
from app.lib.token_header import get_current_user
from app.interfaces.schemas import (
    ObjectCreate,
    ObjectUpdate,
    ObjectResponse,
    ObjectActionResponse
)

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=ObjectActionResponse)
async def create_object(
    object_data: ObjectCreate = Body(...),
    drawer_id: int = Query(..., description="ID del cajón donde se guardará el objeto"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crea un nuevo objeto en un cajón.
    
    Args:
        object_data: Datos del objeto a crear
        drawer_id: ID del cajón donde se guardará el objeto
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    object_control = ObjectControl()
    
    try:
        # Crear el objeto con el ID del usuario actual
        await object_control.create_object(
            user_id=current_user["dni"], 
            drawer_id=drawer_id, 
            object_data=object_data.dict()
        )
        
        return ObjectActionResponse(message="Object created successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/drawer/{drawer_id}", status_code=status.HTTP_200_OK, response_model=List[ObjectResponse])
async def get_drawer_objects(
    drawer_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    sort_by_name: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get all objects in a drawer with pagination and optional sorting.
    
    Args:
        drawer_id: The drawer ID
        skip: Number of objects to skip
        limit: Maximum number of objects to return
        sort_by_name: Whether to sort objects by name
    """
    object_control = ObjectControl()
    
    try:
        objects = await object_control.get_drawer_objects(
            user_id=current_user["dni"], 
            drawer_id=drawer_id, 
            skip=skip, 
            limit=limit, 
            sort_by_name=sort_by_name
        )
        
        # Serializamos manualmente cada objeto
        serialized_objects = []
        for obj in objects:
            serialized_objects.append(obj.serialize)
        
        return serialized_objects
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{object_id}", status_code=status.HTTP_200_OK, response_model=ObjectResponse)
async def get_object(object_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get an object by ID.
    
    Args:
        object_id: The object ID
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Datos serializados del objeto
    """
    object_control = ObjectControl()
    obj = await object_control.get_object(object_id=object_id)
    
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Object not found"
        )
    
    # Verificar que el objeto está en un cajón que pertenece al usuario
    try:
        await object_control.get_drawer_objects(
            user_id=current_user["dni"], 
            drawer_id=obj.drawer_id
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this object"
        )
    
    return obj.serialize

@router.put("/{object_id}", status_code=status.HTTP_200_OK, response_model=ObjectActionResponse)
async def update_object(
    object_id: int, 
    object_data: ObjectUpdate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update an object.
    
    Args:
        object_id: The object ID
        object_data: Datos actualizados del objeto
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    object_control = ObjectControl()
    
    try:
        # Actualizar el objeto
        updated_obj = await object_control.update_object(
            user_id=current_user["dni"], 
            object_id=object_id, 
            object_data=object_data.dict(exclude_unset=True)
        )
        
        if not updated_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        
        return ObjectActionResponse(message="Object updated successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{object_id}", status_code=status.HTTP_200_OK, response_model=ObjectActionResponse)
async def delete_object(
    object_id: int, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Delete an object.
    
    Args:
        object_id: The object ID
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    object_control = ObjectControl()
    
    try:
        # Eliminar el objeto
        deleted_obj = await object_control.delete_object(
            user_id=current_user["dni"], 
            object_id=object_id
        )
        
        if not deleted_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        
        return ObjectActionResponse(message="Object deleted successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/{object_id}/move/{drawer_id}", status_code=status.HTTP_200_OK, response_model=ObjectActionResponse)
async def move_object(
    object_id: int, 
    drawer_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Move an object to another drawer.
    
    Args:
        object_id: The object ID
        drawer_id: The new drawer ID
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    object_control = ObjectControl()
    
    try:
        # Mover el objeto
        moved_obj = await object_control.move_object(
            user_id=current_user["dni"], 
            object_id=object_id, 
            new_drawer_id=drawer_id
        )
        
        if not moved_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        
        return ObjectActionResponse(message="Object moved successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
