from typing import Dict, Any, List, Optional
from app.domain.models.actions_historial import ActionHistory
from app.domain.dao_control import DaoControl


class ActionHistoryControl:
    """
    Control class for action history.
    """

    def __init__(self):
        """Initialize the action history control."""
        self.model = ActionHistory()
        self.dao = DaoControl(ActionHistory)

    async def create_action(self, action_data: Dict[str, Any]) -> ActionHistory:
        """
        Create a new action history entry.
        
        Args:
            action_data: Dictionary with the action data
            
        Returns:
            The created action history entry
        """
        # Assign data to the model
        for key, value in action_data.items():
            if hasattr(self.model, key):
                setattr(self.model, key, value)
        
        # Verify required fields are not None
        if self.model.user_id is None:
            raise ValueError("User ID cannot be None")
        if self.model.action_type is None:
            raise ValueError("Action type cannot be None")
        
        # Send serialized data to DAO
        return await self.dao.create(self.model.serialize)

    async def get_user_actions(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all actions for a specific user.
        
        Args:
            user_id: The user ID to get actions for
            
        Returns:
            List of action history entries for the user
        """
        return await self.dao.read_by_field("user_id", user_id)

    async def get_action_by_id(self, action_id: int) -> Optional[Dict[str, Any]]:
        """
        Get an action history entry by ID.
        
        Args:
            action_id: The ID of the action history entry
            
        Returns:
            The action history entry if found, None otherwise
        """
        return await self.dao.read_by_id(action_id)

    async def get_actions_by_type(self, action_type: str) -> List[Dict[str, Any]]:
        """
        Get all actions of a specific type.
        
        Args:
            action_type: The type of actions to retrieve
            
        Returns:
            List of action history entries of the specified type
        """
        return await self.dao.read_by_field("action_type", action_type)

    async def delete_action(self, action_id: int) -> bool:
        """
        Delete an action history entry.
        
        Args:
            action_id: The ID of the action to delete
            
        Returns:
            True if deleted successfully, False otherwise
        """
        return await self.dao.delete(action_id)
