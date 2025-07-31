from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import Dict, Any, Optional
import bcrypt


class User(Base):
    """User model for database representation."""
    
    __tablename__ = "users"
    
    dni = Column(String(20), primary_key=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    jwt_token = Column(Text, nullable=True)  # Column to store JWT token
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    actions = relationship("ActionHistory", back_populates="user", cascade="all, delete-orphan")
    drawers = relationship("Drawer", back_populates="user", cascade="all, delete-orphan")


    @property
    def password(self):
        raise AttributeError("Password no puede ser leída directamente.")

    @password.setter
    def password(self, raw_password: str):
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(raw_password.encode("utf-8"), salt)
        self.hashed_password = hashed.decode("utf-8")

    def verify_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode("utf-8"), self.hashed_password.encode("utf-8"))

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
            "dni": self.dni,
            "username": self.username,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "jwt_token": self.jwt_token,
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
