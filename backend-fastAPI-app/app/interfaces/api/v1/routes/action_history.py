from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.domain.controls.action_history_control import ActionHistoryControl
from app.lib.token_header import get_current_user

router = APIRouter()
action_control = ActionHistoryControl()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_user_actions(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get all action history entries for the current user.
    
    Args:
        current_user: The current authenticated user
        
    Returns:
        List of action history entries
    """
    try:
        return await action_control.get_user_actions(current_user["dni"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user actions: {str(e)}")

@router.get("/type/{action_type}", response_model=List[Dict[str, Any]])
async def get_actions_by_type(
    action_type: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get actions by type for the current user.
    
    Args:
        action_type: The type of actions to retrieve
        current_user: The current authenticated user
        
    Returns:
        List of action history entries of the specified type
    """
    try:
        # Get all actions of the specified type
        all_actions = await action_control.get_actions_by_type(action_type)
        
        # Filter actions by user_id to ensure users only see their own actions
        user_actions = [action for action in all_actions if action["user_id"] == current_user["dni"]]
        
        return user_actions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get actions by type: {str(e)}")

@router.get("/{action_id}", response_model=Dict[str, Any])
async def get_action_by_id(
    action_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a specific action history entry by ID.
    
    Args:
        action_id: The ID of the action history entry
        current_user: The current authenticated user
        
    Returns:
        The action history entry if found and belongs to the user
    """
    try:
        action = await action_control.get_action_by_id(action_id)
        
        if not action:
            raise HTTPException(status_code=404, detail="Action history entry not found")
        
        # Ensure the action belongs to the current user
        if action["user_id"] != current_user["dni"]:
            raise HTTPException(status_code=403, detail="Not authorized to access this action history entry")
        
        return action
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get action history entry: {str(e)}")

@router.delete("/{action_id}", response_model=Dict[str, str])
async def delete_action(
    action_id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Delete an action history entry.
    
    Args:
        action_id: The ID of the action history entry to delete
        current_user: The current authenticated user
        
    Returns:
        Confirmation message
    """
    try:
        # First check if the action exists and belongs to the user
        action = await action_control.get_action_by_id(action_id)
        
        if not action:
            raise HTTPException(status_code=404, detail="Action history entry not found")
        
        # Ensure the action belongs to the current user
        if action["user_id"] != current_user["dni"]:
            raise HTTPException(status_code=403, detail="Not authorized to delete this action history entry")
        
        # Now delete the action
        result = await action_control.delete_action(action_id)
        
        if not result:
            raise HTTPException(status_code=500, detail="Failed to delete action history entry")
        
        # Create a new action entry for the deletion
        await action_control.create_action({
            "user_id": current_user["dni"],
            "action_type": "DELETE_ACTION_HISTORY",
            "details": f"Deleted action history entry with ID {action_id}"
        })
        
        return {"message": "Action history entry deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete action history entry: {str(e)}")
