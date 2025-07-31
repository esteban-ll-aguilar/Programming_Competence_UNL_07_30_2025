from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import Dict, Any, Optional


class ActionHistory(Base):
    """Action history model for database representation."""

    __tablename__ = "action_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("users.dni"), nullable=False)
    action_type = Column(String(50), nullable=False)
    details = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="actions")



    @property
    def serialize(self) -> Dict[str, Any]:
        """
        Serialize the model instance to a dictionary.
        
        Returns:
            Dictionary representation of the action history
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action_type": self.action_type,
            "details": self.details,
            "created_at": self.created_at if isinstance(self.created_at, str) else (self.created_at.isoformat() if self.created_at else None)
        }
        
    @classmethod
    def deserialize(cls, data: Dict[str, Any]) -> 'ActionHistory':
        """
        Create a new User instance from a dictionary.
        
        Args:
            data: Dictionary with user data
            
        Returns:
            A new User instance
        """
        # Filter out any keys that don't correspond to model columns
        valid_fields = {}
        for key, value in data.items():
            if hasattr(cls, key) and key != 'created_at':
                valid_fields[key] = value
                
        return cls(**valid_fields)
