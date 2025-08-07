from fastapi import APIRouter, Request, status, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from app.domain.controls.object_type_control import ObjectTypeControl
from typing import Optional, List, Dict, Any
from app.lib.token_header import get_current_user
from app.interfaces.schemas import (
    ObjectTypeCreate,
    ObjectTypeUpdate,
    ObjectTypeResponse,
    ObjectTypeActionResponse
)

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=ObjectTypeActionResponse)
async def create_object_type(
    type_data: ObjectTypeCreate = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crea un nuevo tipo de objeto.
    
    Args:
        type_data: Datos del tipo de objeto a crear
        current_user: Usuario autenticado (inyectado por la dependencia get_current_user)
        
    Returns:
        Mensaje de confirmación
    """
    type_control = ObjectTypeControl()
    
    try:
        # Crear el tipo de objeto con el ID del usuario actual
        await type_control.create_object_type(user_id=current_user["dni"], type_data=type_data.dict())
        
        return ObjectTypeActionResponse(message="Object type created successfully")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[ObjectTypeResponse])
async def get_all_object_types(
    skip: int = 0, 
    limit: int = 100
):
    """
    Obtiene todos los tipos de objetos con paginación.
    
    Args:
        skip: Número de tipos de objetos a saltar
        limit: Número máximo de tipos de objetos a devolver
        
    Returns:
        Lista de tipos de objetos serializados
    """
    type_control = ObjectTypeControl()
    object_types = await type_control.get_all_object_types(skip=skip, limit=limit)
    
    # Serializamos manualmente cada tipo de objeto
    serialized_types = []
    for type_obj in object_types:
        serialized_types.append(type_obj.serialize)
    
    return serialized_types
    
    return JSONResponse(
        content=serialized_types,
        status_code=status.HTTP_200_OK
    )

@router.get("/{type_id}", status_code=status.HTTP_200_OK)
async def get_object_type(type_id: int):
    """
    Get an object type by ID.
    
    Args:
        type_id: The object type ID
    """
    type_control = ObjectTypeControl()
    type_obj = await type_control.get_object_type(type_id=type_id)
    
    if not type_obj:
        return JSONResponse(
            content={"error": "Object type not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    return JSONResponse(
        content=type_obj.serialize,
        status_code=status.HTTP_200_OK
    )

@router.put("/{type_id}", status_code=status.HTTP_200_OK)
async def update_object_type(
    type_id: int, 
    request: Request, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update an object type.
    
    Args:
        type_id: The object type ID
    """
    # Extraemos los datos del request
    type_data = await request.json()
    type_control = ObjectTypeControl()
    
    try:
        # Actualizar el tipo de objeto
        updated_type = await type_control.update_object_type(
            user_id=current_user["dni"], 
            type_id=type_id, 
            type_data=type_data
        )
        
        if not updated_type:
            return JSONResponse(
                content={"error": "Object type not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        return JSONResponse(
            content={"message": "Object type updated successfully"},
            status_code=status.HTTP_200_OK
        )
    except ValueError as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

@router.delete("/{type_id}", status_code=status.HTTP_200_OK)
async def delete_object_type(
    type_id: int, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Delete an object type.
    
    Args:
        type_id: The object type ID
    """
    type_control = ObjectTypeControl()
    
    try:
        # Eliminar el tipo de objeto
        deleted_type = await type_control.delete_object_type(
            user_id=current_user["dni"], 
            type_id=type_id
        )
        
        if not deleted_type:
            return JSONResponse(
                content={"error": "Object type not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        return JSONResponse(
            content={"message": "Object type deleted successfully"},
            status_code=status.HTTP_200_OK
        )
    except ValueError as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
