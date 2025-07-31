from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from typing import Dict, Any, Optional
from app.core.constants import SizeConcept


class Object(Base):
    """Object model for database representation."""

    __tablename__ = "objects"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)
    size_concept = Column(
        Enum(
            SizeConcept,
            name="size_concept",
            native_enum=False,
            index=True,
        )
    )
    drawer_id = Column(Integer, ForeignKey("drawer.id"), nullable=False)
    object_type_id = Column(Integer, ForeignKey("object_types.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    drawer = relationship("Drawer", back_populates="objects")
    object_type = relationship("ObjectType", back_populates="objects")



    def __repr__(self):
        return f"<User {self.name}>"
    
    def parse_size_concept(value: str) -> SizeConcept:
        try:
            return SizeConcept(value.lower())
        except ValueError:
            raise ValueError("Tamaño inválido. Debe ser: grande, mediano o pequeño.")


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
            "size_concept": self.size_concept.value if self.size_concept else None,
            "created_at": self.created_at if isinstance(self.created_at, str) else (self.created_at.isoformat() if self.created_at else None),
            "updated_at": self.updated_at if isinstance(self.updated_at, str) else (self.updated_at.isoformat() if self.updated_at else None)
        }
        
    @classmethod
    def deserialize(cls, data: Dict[str, Any]) -> 'Object':
        """
        Create a new Object instance from a dictionary.

        Args:
            data: Dictionary with object data

        Returns:
            A new User instance
        """
        # Filter out any keys that don't correspond to model columns
        valid_fields = {}
        for key, value in data.items():
            if hasattr(cls, key) and key != 'created_at' and key != 'updated_at':
                valid_fields[key] = value
                
        return cls(**valid_fields)
