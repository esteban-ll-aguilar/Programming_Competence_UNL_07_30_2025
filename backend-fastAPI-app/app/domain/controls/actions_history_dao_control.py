from typing import Dict, List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.dao_control import DaoControl
from app.domain.models.actions_historial import ActionHistory
from app.domain.models.user import User


class ActionHistoryControl:
    """
    User control class that utilizes GenericDAO for database operations.
    This class adds business logic specific to users while using the generic DAO for CRUD operations.
    """

    def __init__(self):
        self.model = ActionHistory()  # Instancia del modelo
        self.dao = DaoControl(ActionHistory)  # Clase del modelo para el DAO

    async def create_action_history(self, action_data: Dict[str, Any]) -> ActionHistory:
        """
        Create a new action history record.

        Args:
            action_data: Dictionary with the action data

        Returns:
            The created action history record
        """
        # Asignamos los datos al modelo
        for key, value in action_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
        
        # Verificamos que los campos obligatorios no sean None
        if self.model.username is None:
            raise ValueError("Username cannot be None")
        if self.model.email is None:
            raise ValueError("Email cannot be None")
        if self.model.hashed_password is None:
            raise ValueError("Password cannot be None")
        
        # Enviamos los datos serializados al DAO
        return await self.dao.create(self.model.serialize)

    async def get_user(self, user_id: int) -> Optional[User]:
        """
        Get a user by ID.
        
        Args:
            user_id: The user ID
            
        Returns:
            The user if found, None otherwise
        """
        return await self.dao.get(user_id)

    async def get_user_by_username(self, username: str) -> bool:
        """
        Get a user by username.
        
        Args:
            username: The username
            
        Returns:
            True if user was found, False otherwise
        """
        filters = {"username": username}
        users = await self.dao.filter_by(filters=filters, limit=1)
        
        if users:
            user_data = users[0]
            # Copiamos directamente las propiedades del objeto encontrado
            self.model.id = user_data.id
            self.model.username = user_data.username
            self.model.email = user_data.email
            self.model.hashed_password = user_data.hashed_password
            self.model.is_active = user_data.is_active
            self.model.is_superuser = user_data.is_superuser
            self.model.created_at = user_data.created_at
            self.model.updated_at = user_data.updated_at
            return True
        return False

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email.
        
        Args:
            db: Database session
            email: The email
            
        Returns:
            The user if found, None otherwise
        """
        filters = {"email": email}
        users = await self.dao.filter_by(filters=filters, limit=1)
        return users[0] if users else None

    async def get_users(
        self, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """
        Get multiple users with pagination.
        
        Args:
            db: Database session
            skip: Number of users to skip
            limit: Maximum number of users to return
            
        Returns:
            List of users
        """
        return await self.dao.get_multi(skip=skip, limit=limit)

    async def update_user(
        self, user_id: int, user_data: Dict[str, Any]
    ) -> Optional[User]:
        """
        Update a user.
        
        Args:
            db: Database session
            user_id: The user ID
            user_data: Dictionary with the user data to update
            
        Returns:
            The updated user
        """
        # Here you can add any pre-processing logic before updating the user
        if "password" in user_data:
            # In a real application, you would hash the password here
            user_data["hashed_password"] = user_data.pop("password")  # This is just a placeholder

        return await self.dao.update(id=user_id, obj_in=user_data)

    async def delete_user(self, user_id: int) -> Optional[User]:
        """
        Delete a user.
        
        Args:
            db: Database session
            user_id: The user ID
            
        Returns:
            The deleted user
        """
        return await self.dao.delete(id=user_id)

    async def get_active_users_count(self) -> int:
        """
        Count active users.
        """
        return await self.dao.count(filters={"is_active": True})
