from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.domain.controls.object_type_control import ObjectTypeControl
from typing import Optional, List, Dict, Any
from app.lib.token_header import get_current_user

router = APIRouter()

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_object_type(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Create a new object type.
    """
    # Extraemos los datos del request
    type_data = await request.json()
    type_control = ObjectTypeControl()
    
    try:
        # Crear el tipo de objeto con el ID del usuario actual
        await type_control.create_object_type(user_id=current_user["dni"], type_data=type_data)
        
        return JSONResponse(
            content={"message": "Object type created successfully"},
            status_code=status.HTTP_201_CREATED
        )
    except ValueError as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )

@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_object_types(
    skip: int = 0, 
    limit: int = 100
):
    """
    Get all object types with pagination.
    
    Args:
        skip: Number of object types to skip
        limit: Maximum number of object types to return
    """
    type_control = ObjectTypeControl()
    object_types = await type_control.get_all_object_types(skip=skip, limit=limit)
    
    # Serializamos manualmente cada tipo de objeto
    serialized_types = []
    for type_obj in object_types:
        serialized_types.append(type_obj.serialize)
    
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
