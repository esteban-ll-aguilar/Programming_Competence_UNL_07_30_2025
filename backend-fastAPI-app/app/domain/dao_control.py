from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import Base
from app.core.exceptions import DatabaseError
from app.core.database import db
# Define a type variable for the ORM model
ModelType = TypeVar("ModelType", bound=Base)


class DaoControl(Generic[ModelType]):
    """
    Generic DAO (Data Access Object) class that provides CRUD operations for SQLAlchemy models.
    This class can be used with any model that inherits from the Base class.
    """

    def __init__(self, model: Type[ModelType]):
        """
        Initialize the DAO with the model class.
        
        Args:
            model: The SQLAlchemy model class
        """
        self.model = model
        self.session_factory = db.get_db_session
        
        # Determine the primary key column name
        pk_columns = [col.name for col in model.__table__.primary_key.columns]
        self.pk_name = pk_columns[0] if pk_columns else "id"

    async def create(self, obj_in: Dict[str, Any]) -> ModelType:
        """
        Create a new record in the database.
        
        Args:
            obj_in: Dictionary with the data to create the record
            
        Returns:
            The created model instance
        """
        try:
            async with self.session_factory() as session:
                db_obj = self.model(**obj_in)
                session.add(db_obj)
                await session.commit()
                await session.refresh(db_obj)
                return db_obj
        except SQLAlchemyError as e:
            if 'session' in locals():
                await session.rollback()
            raise DatabaseError(f"Error creating record: {str(e)}")

    async def get(self, id: Any) -> Optional[ModelType]:
        """
        Get a record by ID.
        
        Args:
            id: The ID of the record to get
            
        Returns:
            The model instance if found, None otherwise
        """
        try:
            async with self.session_factory() as session:
                query = select(self.model).where(getattr(self.model, self.pk_name) == id)
                result = await session.execute(query)
                return result.scalars().first()
        except SQLAlchemyError as e:
            raise DatabaseError(f"Error retrieving record: {str(e)}")

    async def get_multi(
        self, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """
        Get multiple records with pagination.
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of model instances
        """
        try:
            async with self.session_factory() as session:
                query = select(self.model).offset(skip).limit(limit)
                result = await session.execute(query)
                return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseError(f"Error retrieving records: {str(e)}")

    async def update(
        self, *, id: Any, obj_in: Dict[str, Any]
    ) -> Optional[ModelType]:
        """
        Update a record.
        
        Args:
            id: The ID of the record to update
            obj_in: Dictionary with the data to update
            
        Returns:
            The updated model instance
        """
        try:
            async with self.session_factory() as session:
                stmt = (
                    update(self.model)
                    .where(getattr(self.model, self.pk_name) == id)
                    .values(**obj_in)
                    .returning(self.model)
                )
                result = await session.execute(stmt)
                await session.commit()
                return result.scalars().first()
        except SQLAlchemyError as e:
            if 'session' in locals():
                await session.rollback()
            raise DatabaseError(f"Error updating record: {str(e)}")

    async def delete(self, *, id: Any) -> Optional[ModelType]:
        """
        Delete a record.
        
        Args:
            id: The ID of the record to delete
            
        Returns:
            The deleted model instance
        """
        try:
            async with self.session_factory() as session:
                stmt = delete(self.model).where(getattr(self.model, self.pk_name) == id).returning(self.model)
                result = await session.execute(stmt)
                await session.commit()
                return result.scalars().first()
        except SQLAlchemyError as e:
            if 'session' in locals():
                await session.rollback()
            raise DatabaseError(f"Error deleting record: {str(e)}")

    async def filter_by(
        self, *, filters: Dict[str, Any], skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """
        Get records by filter conditions.
        
        Args:
            filters: Dictionary with filter conditions (field_name: value)
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of model instances matching the filters
        """
        try:
            async with self.session_factory() as session:
                query = select(self.model)
                for field, value in filters.items():
                    if hasattr(self.model, field):
                        query = query.where(getattr(self.model, field) == value)
                
                query = query.offset(skip).limit(limit)
                result = await session.execute(query)
                return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseError(f"Error filtering records: {str(e)}")

    async def count(self, *, filters: Optional[Dict[str, Any]] = None) -> int:
        """
        Count records, optionally with filters.
        
        Args:
            filters: Optional dictionary with filter conditions
            
        Returns:
            Count of records
        """
        try:
            from sqlalchemy.sql.functions import count
            
            async with self.session_factory() as session:
                query = select(count()).select_from(self.model)
                
                if filters:
                    for field, value in filters.items():
                        if hasattr(self.model, field):
                            query = query.where(getattr(self.model, field) == value)

                result = await session.execute(query)
                return result.scalar() or 0
        except SQLAlchemyError as e:
            raise DatabaseError(f"Error counting records: {str(e)}")
