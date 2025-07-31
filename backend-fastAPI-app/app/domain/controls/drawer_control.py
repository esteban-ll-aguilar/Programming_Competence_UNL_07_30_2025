from typing import Dict, List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.dao_control import DaoControl
from app.domain.models.drawer import Drawer
from app.domain.controls.action_history_control import ActionHistoryControl


class DrawerControl:
    """
    Drawer control class that utilizes GenericDAO for database operations.
    This class adds business logic specific to drawers while using the generic DAO for CRUD operations.
    """

    def __init__(self):
        self.model = Drawer()
        self.dao = DaoControl(Drawer)
        self.action_history = ActionHistoryControl()
        

    async def create_drawer(self, user_id: str, drawer_data: Dict[str, Any]) -> Drawer:
        """
        Create a new drawer.
        
        Args:
            user_id: User ID who is creating the drawer
            drawer_data: Dictionary with the drawer data
            
        Returns:
            The created drawer
        """
        # Asignamos los datos al modelo
        for key, value in drawer_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
                
        # Asignar el usuario al cajón
        self.model.user_id = user_id
        
        # Verificamos que los campos obligatorios no sean None
        if self.model.name is None:
            raise ValueError("Name cannot be None")
        if self.model.max_obj is None:
            raise ValueError("Maximum objects cannot be None")
            
        # Asegurar que actual_obj empiece en 0 si no se proporciona
        if self.model.actual_obj is None:
            self.model.actual_obj = 0
        
        # Crear el cajón
        drawer = await self.dao.create(self.model.serialize)
        
        # Registrar la acción en el historial
        await self.action_history.create_action({
            "user_id": user_id,
            "action_type": "CREATE_DRAWER",
            "details": f"Creación de cajón: {self.model.name}"
        })
        
        return drawer

    async def get_drawer(self, drawer_id: int) -> Optional[Drawer]:
        """
        Get a drawer by ID.
        
        Args:
            drawer_id: The drawer ID
            
        Returns:
            The drawer if found, None otherwise
        """
        return await self.dao.get(drawer_id)

    async def get_drawer_by_name(self, name: str) -> bool:
        """
        Get a drawer by name.
        
        Args:
            name: The drawer name
            
        Returns:
            True if drawer was found, False otherwise
        """
        filters = {"name": name}
        drawers = await self.dao.filter_by(filters=filters, limit=1)
        
        if drawers:
            drawer_data = drawers[0]
            # Copiamos directamente las propiedades del objeto encontrado
            self.model.id = drawer_data.id
            self.model.name = drawer_data.name
            self.model.max_obj = drawer_data.max_obj
            self.model.actual_obj = drawer_data.actual_obj
            self.model.user_id = drawer_data.user_id
            self.model.created_at = drawer_data.created_at
            self.model.updated_at = drawer_data.updated_at
            return True
        return False

    async def get_user_drawers(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Drawer]:
        """
        Get drawers for a specific user with pagination.
        
        Args:
            user_id: The user ID
            skip: Number of drawers to skip
            limit: Maximum number of drawers to return
            
        Returns:
            List of drawers
        """
        filters = {"user_id": user_id}
        return await self.dao.filter_by(filters=filters, skip=skip, limit=limit)

    async def update_drawer(self, user_id: str, drawer_id: int, drawer_data: Dict[str, Any]) -> Optional[Drawer]:
        """
        Update a drawer.
        
        Args:
            user_id: User ID who is updating the drawer
            drawer_id: The drawer ID
            drawer_data: Dictionary with the drawer data to update
            
        Returns:
            The updated drawer
        """
        # Verificar que el cajón existe y pertenece al usuario
        drawer = await self.dao.get(drawer_id)
        if not drawer or drawer.user_id != user_id:
            return None
            
        # Actualizar el cajón
        updated_drawer = await self.dao.update(id=drawer_id, obj_in=drawer_data)
        
        if updated_drawer:
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "UPDATE_DRAWER",
                "details": f"Actualización de cajón ID: {drawer_id}"
            })
        
        return updated_drawer
        
    async def register_action(self, drawer_id: int, user_id: str, action_type: str, details: str) -> None:
        """
        Register an action for a drawer in the action history.
        
        Args:
            drawer_id: The drawer ID
            user_id: The user ID
            action_type: The type of action
            details: The action details
            
        Returns:
            None
        """
        await self.action_history.create_action({
            "user_id": user_id,
            "action_type": action_type,
            "details": details,
            "resource_id": str(drawer_id),
            "resource_type": "DRAWER"
        })

    async def delete_drawer(self, user_id: str, drawer_id: int) -> Optional[Drawer]:
        """
        Delete a drawer.
        
        Args:
            user_id: User ID who is deleting the drawer
            drawer_id: The drawer ID
            
        Returns:
            The deleted drawer
        """
        # Verificar que el cajón existe y pertenece al usuario
        drawer = await self.dao.get(drawer_id)
        if not drawer or drawer.user_id != user_id:
            return None
            
        # Eliminar el cajón
        deleted_drawer = await self.dao.delete(id=drawer_id)
        
        if deleted_drawer:
            # Registrar la acción en el historial
            await self.action_history.create_action({
                "user_id": user_id,
                "action_type": "DELETE_DRAWER",
                "details": f"Eliminación de cajón ID: {drawer_id}, Nombre: {deleted_drawer.name}"
            })
        
        return deleted_drawer
