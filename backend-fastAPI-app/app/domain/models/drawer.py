from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import Dict, Any, Optional


class Drawer(Base):
    """Drawer model for database representation."""

    __tablename__ = "drawer"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)
    max_obj = Column(Integer, nullable=False)
    actual_obj = Column(Integer, nullable=False, default=0)
    user_id = Column(String(20), ForeignKey("users.dni"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    user = relationship("User", back_populates="drawers")
    objects = relationship("Object", back_populates="drawer", cascade="all, delete-orphan")



    def __repr__(self):
        return f"<User {self.name}>"

    @property
    def serialize(self) -> Dict[str, Any]:
        """
        Serialize the model instance to a dictionary.
        
        Returns:
            Dictionary representation of the user
        """
        return {
            "id": self.id,
            "name": self.name,
            "max_obj": self.max_obj,
            "actual_obj": self.actual_obj,
            "created_at": self.created_at if isinstance(self.created_at, str) else (self.created_at.isoformat() if self.created_at else None),
            "updated_at": self.updated_at if isinstance(self.updated_at, str) else (self.updated_at.isoformat() if self.updated_at else None)
        }
        
    @classmethod
    def deserialize(cls, data: Dict[str, Any]) -> 'Drawer':
        """
        Create a new Drawer instance from a dictionary.

        Args:
            data: Dictionary with user data
            
        Returns:
            A new User instance
        """
        # Filter out any keys that don't correspond to model columns
        valid_fields = {}
        for key, value in data.items():
            if hasattr(cls, key) and key != 'created_at' and key != 'updated_at':
                valid_fields[key] = value
                
        return cls(**valid_fields)
