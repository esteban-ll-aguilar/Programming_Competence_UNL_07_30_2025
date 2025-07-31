from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
from typing import Dict, Any, Optional


class User(Base):
    """User model for database representation."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())



    def __repr__(self):
        return f"<User {self.username}>"
        
    @property
    def serialize(self) -> Dict[str, Any]:
        """
        Serialize the model instance to a dictionary.
        
        Returns:
            Dictionary representation of the user
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "created_at": self.created_at if isinstance(self.created_at, str) else (self.created_at.isoformat() if self.created_at else None),
            "updated_at": self.updated_at if isinstance(self.updated_at, str) else (self.updated_at.isoformat() if self.updated_at else None)
        }
        
    @classmethod
    def deserialize(cls, data: Dict[str, Any]) -> 'User':
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
