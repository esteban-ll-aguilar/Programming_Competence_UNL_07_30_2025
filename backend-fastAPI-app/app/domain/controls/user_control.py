from typing import Dict, List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.dao_control import DaoControl
from app.domain.models.user import User
from app.domain.controls.action_history_control import ActionHistoryControl


class UserControl:
    """
    User control class that utilizes GenericDAO for database operations.
    This class adds business logic specific to users while using the generic DAO for CRUD operations.
    """

    def __init__(self):
        self.model = User()  # Instancia del modelo
        self.dao = DaoControl(User)  # Clase del modelo para el DAO
        self.action_history = ActionHistoryControl()
        

    async def create_user(self, user_data: Dict[str, Any]) -> User:
        """
        Create a new user.
        
        Args:
            user_data: Dictionary with the user data
            
        Returns:
            The created user
        """
        # Asignamos los datos al modelo
        for key, value in user_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
        
        # Verificamos que los campos obligatorios no sean None
        if self.model.dni is None:
            raise ValueError("DNI cannot be None")
        if self.model.username is None:
            raise ValueError("Username cannot be None")
        if self.model.email is None:
            raise ValueError("Email cannot be None")
        if self.model.hashed_password is None:
            raise ValueError("Password cannot be None")
        
        # Enviamos los datos serializados al DAO
        user = await self.dao.create(self.model.serialize)
        
        # Registrar la acción
        await self.action_history.create_action({
            "user_id": self.model.dni,
            "action_type": "CREATE_USER",
            "details": f"User {self.model.username} created"
        })
        
        return user

    async def get_user(self, user_id: int) -> Optional[User]:
        """
        Get a user by ID.
        
        Args:
            user_id: The user ID
            
        Returns:
            The user if found, None otherwise
        """
        return await self.dao.get(user_id)
        
    async def get_user_by_dni(self, dni: str) -> Optional[Dict[str, Any]]:
        """
        Get a user by DNI.
        
        Args:
            dni: The user's DNI
            
        Returns:
            The user data as dictionary if found, None otherwise
        """
        try:
            # Get user by DNI (primary key)
            user = await self.dao.get(dni)
            if user:
                # Convert to dictionary
                return {
                    "dni": user.dni,
                    "username": user.username,
                    "email": user.email,
                    "hashed_password": user.hashed_password,
                    "jwt_token": user.jwt_token
                }
            return None
        except Exception as e:
            print(f"Error getting user by DNI: {e}")
            return None

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
            self.model.dni = user_data.dni if hasattr(user_data, "dni") else None
            self.model.username = user_data.username
            self.model.email = user_data.email
            self.model.hashed_password = user_data.hashed_password
            self.model.jwt_token = user_data.jwt_token if hasattr(user_data, "jwt_token") else None
            return True
        return False

    async def get_user_by_email(self, email: str) -> bool:
        """
        Get a user by email.
        
        Args:
            email: The email
            
        Returns:
            True if user was found, False otherwise
        """
        filters = {"email": email}
        users = await self.dao.filter_by(filters=filters, limit=1)
        
        if users:
            user_data = users[0]
            # Copiamos directamente las propiedades del objeto encontrado
            self.model.dni = user_data.dni if hasattr(user_data, "dni") else None
            self.model.username = user_data.username
            self.model.email = user_data.email
            self.model.hashed_password = user_data.hashed_password
            self.model.jwt_token = user_data.jwt_token if hasattr(user_data, "jwt_token") else None
            return True
        return False

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
        self, dni: str, user_data: Dict[str, Any]
    ) -> Optional[User]:
        """
        Update a user.
        
        Args:
            dni: The user's DNI (primary key)
            user_data: Dictionary with the user data to update
            
        Returns:
            The updated user
        """
        # Here you can add any pre-processing logic before updating the user
        if "password" in user_data:
            # In a real application, you would hash the password here
            user_data["hashed_password"] = user_data.pop("password")  # This is just a placeholder

        user = await self.dao.update(id=dni, obj_in=user_data)
        
        if user:
            # Register the action
            await self.action_history.create_action({
                "user_id": user.dni,
                "action_type": "UPDATE_USER",
                "details": f"User {user.username} updated"
            })
            
        return user

    async def delete_user(self, dni: str) -> Optional[User]:
        """
        Delete a user.
        
        Args:
            dni: The user's DNI (primary key)
            
        Returns:
            The deleted user
        """
        user = await self.dao.get(dni)
        
        if user:
            # Register the action before deleting
            await self.action_history.create_action({
                "user_id": user.dni,
                "action_type": "DELETE_USER",
                "details": f"User {user.username} deleted"
            })
            
        return await self.dao.delete(id=dni)
        
    async def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate a user with username and password.
        
        Args:
            username: The username
            password: The password
            
        Returns:
            User data if authentication successful, None otherwise
        """
        # Get user by username
        if not await self.get_user_by_username(username):
            return None
            
        # Verify password
        if not self.model.verify_password(password):
            return None
            
        # Return user data
        return {
            "dni": self.model.dni,
            "username": self.model.username,
            "email": self.model.email
        }
        
    async def authenticate_user_by_email(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate a user with email and password.
        
        Args:
            email: The email
            password: The password
            
        Returns:
            User data if authentication successful, None otherwise
        """
        # Get user by email
        if not await self.get_user_by_email(email):
            return None
            
        # Verify password
        if not self.model.verify_password(password):
            return None
            
        # Return user data
        return {
            "dni": self.model.dni,
            "username": self.model.username,
            "email": self.model.email
        }
        
    async def update_user_token(self, dni: str, token: str) -> bool:
        """
        Update the JWT token for a user.
        
        Args:
            dni: The user's DNI
            token: The JWT token to store
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Update the user's token
            await self.dao.update(id=dni, obj_in={"jwt_token": token})
            return True
        except Exception as e:
            print(f"Error updating user token: {e}")
            return False
