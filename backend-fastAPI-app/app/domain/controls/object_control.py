from typing import Dict, List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.dao_control import DaoControl
from app.domain.models.object import Object
from app.domain.models.drawer import Drawer
from app.domain.models.object_type import ObjectType
from app.domain.controls.action_history_control import ActionHistoryControl
from app.core.constants import SizeConcept


class ObjectControl:
    """
    Object control class that utilizes GenericDAO for database operations.
    This class adds business logic specific to objects while using the generic DAO for CRUD operations.
    """

    def __init__(self):
        self.model = Object()
        self.dao = DaoControl(Object)
        self.drawer_dao = DaoControl(Drawer)
        self.type_dao = DaoControl(ObjectType)
        self.action_history = ActionHistoryControl()
        

    async def create_object(self, user_id: str, drawer_id: int, object_data: Dict[str, Any]) -> Object:
        """
        Create a new object in a drawer.
        
        Args:
            user_id: User ID who is creating the object
            drawer_id: The drawer ID where the object will be stored
            object_data: Dictionary with the object data
            
        Returns:
            The created object
        """
        # Verificar que el cajón existe y pertenece al usuario
        drawer = await self.drawer_dao.get(drawer_id)
        if not drawer:
            raise ValueError(f"Drawer with ID {drawer_id} not found")
        if drawer.user_id != user_id:
            raise ValueError(f"Drawer with ID {drawer_id} does not belong to this user")
            
        # Verificar que el cajón tiene espacio disponible
        if drawer.actual_obj >= drawer.max_obj:
            raise ValueError(f"Drawer with ID {drawer_id} is full")
            
        # Verificar que el tipo de objeto existe
        if "object_type_id" not in object_data:
            raise ValueError("Object type ID is required")
        object_type = await self.type_dao.get(object_data["object_type_id"])
        if not object_type:
            raise ValueError(f"Object type with ID {object_data['object_type_id']} not found")
            
        # Asignamos los datos al modelo
        for key, value in object_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
                
        # Asignar el cajón al objeto
        self.model.drawer_id = drawer_id
        
        # Verificamos que los campos obligatorios no sean None
        if self.model.name is None:
            raise ValueError("Name cannot be None")
        if self.model.size_concept is None:
            raise ValueError("Size concept cannot be None")
            
        # Crear el objeto
        obj = await self.dao.create(self.model.serialize)
        
        # Actualizar la cantidad de objetos en el cajón
        drawer.actual_obj += 1
        await self.drawer_dao.update(id=drawer_id, obj_in={"actual_obj": drawer.actual_obj})
        
        # Registrar la acción en el historial
        await self.action_history.create_action({
            "user_id": user_id,
            "action_type": "CREATE_OBJECT",
            "details": f"Creación de objeto: {self.model.name} en cajón ID: {drawer_id}"
        })
        
        return obj

    async def get_object(self, object_id: int) -> Optional[Object]:
        """
        Get an object by ID.
        
        Args:
            object_id: The object ID
            
        Returns:
            The object if found, None otherwise
        """
        return await self.dao.get(object_id)

    async def get_drawer_objects(self, user_id: str, drawer_id: int, skip: int = 0, limit: int = 100, sort_by_name: bool = False) -> List[Object]:
        """
        Get all objects in a drawer with pagination and optional sorting.
        
        Args:
            user_id: User ID who is requesting the objects
            drawer_id: The drawer ID
            skip: Number of objects to skip
            limit: Maximum number of objects to return
            sort_by_name: Whether to sort objects by name
            
        Returns:
            List of objects
        """
        # Verificar que el cajón existe y pertenece al usuario
        drawer = await self.drawer_dao.get(drawer_id)
        if not drawer:
            raise ValueError(f"Drawer with ID {drawer_id} not found")
        if drawer.user_id != user_id:
            raise ValueError(f"Drawer with ID {drawer_id} does not belong to this user")
            
        # Obtener los objetos
        filters = {"drawer_id": drawer_id}
        order_by = ["name"] if sort_by_name else None
        return await self.dao.filter_by(filters=filters, skip=skip, limit=limit, order_by=order_by)

    async def update_object(self, user_id: str, object_id: int, object_data: Dict[str, Any]) -> Optional[Object]:
        """
        Update an object.
        
        Args:
            user_id: User ID who is updating the object
            object_id: The object ID
            object_data: Dictionary with the object data to update
            
        Returns:
            The updated object
        """
        # Verificar que el objeto existe
        obj = await self.dao.get(object_id)
        if not obj:
            return None
            
        # Verificar que el cajón pertenece al usuario
        drawer = await self.drawer_dao.get(obj.drawer_id)
        if drawer.user_id != user_id:
            raise ValueError(f"Object with ID {object_id} is in a drawer that does not belong to this user")
            
        # Si se va a cambiar el tipo de objeto, verificar que existe
        if "object_type_id" in object_data:
            object_type = await self.type_dao.get(object_data["object_type_id"])
            if not object_type:
                raise ValueError(f"Object type with ID {object_data['object_type_id']} not found")
                
        # Si se va a cambiar el tamaño, validar que sea un valor válido
        if "size_concept" in object_data and not isinstance(object_data["size_concept"], SizeConcept):
            try:
                object_data["size_concept"] = Object.parse_size_concept(object_data["size_concept"])
            except ValueError as e:
                raise ValueError(str(e))
        
        # Actualizar el objeto
        updated_obj = await self.dao.update(id=object_id, obj_in=object_data)
        
        if updated_obj:
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "UPDATE_OBJECT",
                "details": f"Actualización de objeto ID: {object_id}"
            })
        
        return updated_obj

    async def delete_object(self, user_id: str, object_id: int) -> Optional[Object]:
        """
        Delete an object.
        
        Args:
            user_id: User ID who is deleting the object
            object_id: The object ID
            
        Returns:
            The deleted object
        """
        # Verificar que el objeto existe
        obj = await self.dao.get(object_id)
        if not obj:
            return None
            
        # Verificar que el cajón pertenece al usuario
        drawer = await self.drawer_dao.get(obj.drawer_id)
        if not drawer or drawer.user_id != user_id:
            raise ValueError(f"Object with ID {object_id} is in a drawer that does not belong to this user")
            
        # Eliminar el objeto
        deleted_obj = await self.dao.delete(id=object_id)
        
        if deleted_obj:
            # Actualizar la cantidad de objetos en el cajón
            drawer.actual_obj -= 1
            await self.drawer_dao.update(id=obj.drawer_id, obj_in={"actual_obj": drawer.actual_obj})
            
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "DELETE_OBJECT",
                "details": f"Eliminación de objeto ID: {object_id}, Nombre: {deleted_obj.name}"
            })
        
        return deleted_obj

    async def move_object(self, user_id: str, object_id: int, new_drawer_id: int) -> Optional[Object]:
        """
        Move an object to another drawer.
        
        Args:
            user_id: User ID who is moving the object
            object_id: The object ID
            new_drawer_id: The new drawer ID
            
        Returns:
            The updated object
        """
        # Verificar que el objeto existe
        obj = await self.dao.get(object_id)
        if not obj:
            return None
            
        # Verificar que el cajón actual pertenece al usuario
        current_drawer = await self.drawer_dao.get(obj.drawer_id)
        if not current_drawer or current_drawer.user_id != user_id:
            raise ValueError(f"Object with ID {object_id} is in a drawer that does not belong to this user")
            
        # Verificar que el nuevo cajón existe y pertenece al usuario
        new_drawer = await self.drawer_dao.get(new_drawer_id)
        if not new_drawer:
            raise ValueError(f"Drawer with ID {new_drawer_id} not found")
        if new_drawer.user_id != user_id:
            raise ValueError(f"Drawer with ID {new_drawer_id} does not belong to this user")
            
        # Verificar que el nuevo cajón tiene espacio disponible
        if new_drawer.actual_obj >= new_drawer.max_obj:
            raise ValueError(f"Drawer with ID {new_drawer_id} is full")
            
        # Mover el objeto
        updated_obj = await self.dao.update(id=object_id, obj_in={"drawer_id": new_drawer_id})
        
        if updated_obj:
            # Actualizar la cantidad de objetos en ambos cajones
            current_drawer.actual_obj -= 1
            new_drawer.actual_obj += 1
            await self.drawer_dao.update(id=current_drawer.id, obj_in={"actual_obj": current_drawer.actual_obj})
            await self.drawer_dao.update(id=new_drawer_id, obj_in={"actual_obj": new_drawer.actual_obj})
            
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "MOVE_OBJECT",
                "details": f"Mover objeto ID: {object_id} del cajón {current_drawer.id} al cajón {new_drawer_id}"
            })
        
        return updated_obj

    # Nuevos métodos para la integración con IA
    
    async def get_objects_by_drawer(self, drawer_id: int) -> List[Object]:
        """
        Get all objects in a drawer.
        
        Args:
            drawer_id: The drawer ID to get objects from
            
        Returns:
            List of objects
        """
        filters = {"drawer_id": drawer_id}
        return await self.dao.filter_by(filters=filters)
        
    async def find_duplicate_objects(self, drawer_id: int) -> List[List[int]]:
        """
        Find duplicate objects in a drawer based on name, type, and size.
        
        Args:
            drawer_id: The drawer ID to search for duplicates
            
        Returns:
            List of lists where each inner list contains IDs of duplicate objects
        """
        # Get all objects in the drawer
        objects = await self.get_objects_by_drawer(drawer_id)
        
        # Group objects by name, type, and size
        groups = {}
        for obj in objects:
            key = (obj.name, obj.type_id, obj.size_concept)
            if key not in groups:
                groups[key] = []
            groups[key].append(obj.id)
        
        # Return only groups with duplicates
        duplicates = [ids for ids in groups.values() if len(ids) > 1]
        return duplicates
    
    async def sort_objects_by_type(self, drawer_id: int) -> bool:
        """
        Sort objects in a drawer by type.
        This is a placeholder for a future implementation.
        
        Args:
            drawer_id: The drawer ID to sort objects in
            
        Returns:
            True if successful, False otherwise
        """
        # This would be implemented based on your sorting requirements
        # For now, we'll just return True to indicate "success"
        return True
    
    async def sort_objects_by_size(self, drawer_id: int) -> bool:
        """
        Sort objects in a drawer by size.
        This is a placeholder for a future implementation.
        
        Args:
            drawer_id: The drawer ID to sort objects in
            
        Returns:
            True if successful, False otherwise
        """
        # This would be implemented based on your sorting requirements
        # For now, we'll just return True to indicate "success"
        return True
