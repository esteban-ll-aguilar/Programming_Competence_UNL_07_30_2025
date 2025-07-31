from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import Dict, Any, Optional


class ObjectType(Base):
    """Object type model for database representation."""

    __tablename__ = "object_types"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    objects = relationship("Object", back_populates="object_type")



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
            "created_at": self.created_at if isinstance(self.created_at, str) else (self.created_at.isoformat() if self.created_at else None),
            "updated_at": self.updated_at if isinstance(self.updated_at, str) else (self.updated_at.isoformat() if self.updated_at else None)
        }
        
    @classmethod
    def deserialize(cls, data: Dict[str, Any]) -> 'ObjectType':
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
            if hasattr(cls, key) and key != 'created_at' and key != 'updated_at':
                valid_fields[key] = value
                
        return cls(**valid_fields)
