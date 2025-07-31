from typing import Dict, List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.dao_control import DaoControl
from app.domain.models.object_type import ObjectType
from app.domain.controls.action_history_control import ActionHistoryControl


class ObjectTypeControl:
    """
    ObjectType control class that utilizes GenericDAO for database operations.
    This class adds business logic specific to object types while using the generic DAO for CRUD operations.
    """

    def __init__(self):
        self.model = ObjectType()
        self.dao = DaoControl(ObjectType)
        self.action_history = ActionHistoryControl()
        

    async def create_object_type(self, user_id: str, type_data: Dict[str, Any]) -> ObjectType:
        """
        Create a new object type.
        
        Args:
            user_id: User ID who is creating the object type
            type_data: Dictionary with the object type data
            
        Returns:
            The created object type
        """
        # Asignamos los datos al modelo
        for key, value in type_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
                
        # Verificamos que los campos obligatorios no sean None
        if self.model.name is None:
            raise ValueError("Name cannot be None")
        
        # Crear el tipo de objeto
        object_type = await self.dao.create(self.model.serialize)
        
        # Registrar la acción en el historial
        await self.action_history.create_action({
            "user_id": user_id,
            "action_type": "CREATE_OBJECT_TYPE",
            "details": f"Creación de tipo de objeto: {self.model.name}"
        })
        
        return object_type

    async def get_object_type(self, type_id: int) -> Optional[ObjectType]:
        """
        Get an object type by ID.
        
        Args:
            type_id: The object type ID
            
        Returns:
            The object type if found, None otherwise
        """
        return await self.dao.get(type_id)

    async def get_object_type_by_name(self, name: str) -> bool:
        """
        Get an object type by name.
        
        Args:
            name: The object type name
            
        Returns:
            True if object type was found, False otherwise
        """
        filters = {"name": name}
        types = await self.dao.filter_by(filters=filters, limit=1)
        
        if types:
            type_data = types[0]
            # Copiamos directamente las propiedades del objeto encontrado
            self.model.id = type_data.id
            self.model.name = type_data.name
            self.model.created_at = type_data.created_at
            self.model.updated_at = type_data.updated_at
            return True
        return False

    async def get_all_object_types(self, skip: int = 0, limit: int = 100) -> List[ObjectType]:
        """
        Get all object types with pagination.
        
        Args:
            skip: Number of object types to skip
            limit: Maximum number of object types to return
            
        Returns:
            List of object types
        """
        return await self.dao.get_multi(skip=skip, limit=limit)

    async def update_object_type(self, user_id: str, type_id: int, type_data: Dict[str, Any]) -> Optional[ObjectType]:
        """
        Update an object type.
        
        Args:
            user_id: User ID who is updating the object type
            type_id: The object type ID
            type_data: Dictionary with the object type data to update
            
        Returns:
            The updated object type
        """
        # Verificar que el tipo de objeto existe
        object_type = await self.dao.get(type_id)
        if not object_type:
            return None
            
        # Actualizar el tipo de objeto
        updated_type = await self.dao.update(id=type_id, obj_in=type_data)
        
        if updated_type:
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "UPDATE_OBJECT_TYPE",
                "details": f"Actualización de tipo de objeto ID: {type_id}"
            })
        
        return updated_type

    async def delete_object_type(self, user_id: str, type_id: int) -> Optional[ObjectType]:
        """
        Delete an object type.
        
        Args:
            user_id: User ID who is deleting the object type
            type_id: The object type ID
            
        Returns:
            The deleted object type
        """
        # Verificar que el tipo de objeto existe
        object_type = await self.dao.get(type_id)
        if not object_type:
            return None
            
        # Eliminar el tipo de objeto
        deleted_type = await self.dao.delete(id=type_id)
        
        if deleted_type:
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "DELETE_OBJECT_TYPE",
                "details": f"Eliminación de tipo de objeto ID: {type_id}, Nombre: {deleted_type.name}"
            })
        
        return deleted_type
