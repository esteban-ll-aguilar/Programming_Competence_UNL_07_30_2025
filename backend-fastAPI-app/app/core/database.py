# app/db/database.py

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import _SETTINGS


class Database:
    def __init__(self):
        self.database_url = (
            f"postgresql+asyncpg://{_SETTINGS._DB_USERNAME}:{_SETTINGS._DB_PASSWORD}"
            f"@{_SETTINGS._DB_HOST}:{_SETTINGS._DB_PORT}/{_SETTINGS._DB_NAME}"
        )
        self.engine = create_async_engine(self.database_url, echo=True)
        self.SessionLocal = sessionmaker(bind=self.engine, class_=AsyncSession, expire_on_commit=False)
        self.Base = declarative_base()
        # Print initial connection message
        print("Database configuration initialized")
        print(f"Configured database: {_SETTINGS._DB_HOST}:{_SETTINGS._DB_PORT}/{_SETTINGS._DB_NAME}")
        # Connection will be tested when first database operation is performed

    async def test_connection(self):
        """Test the database connection and print the result."""
        try:
            async with self.engine.connect() as conn:
                # Use SQLAlchemy text construct for proper SQL execution
                from sqlalchemy import text
                await conn.execute(text("SELECT 1"))
                
            print("\033[92m✓ Database connection successful!\033[0m")
            print(f"Connected to: {_SETTINGS._DB_HOST}:{_SETTINGS._DB_PORT}/{_SETTINGS._DB_NAME}")
        except SQLAlchemyError as e:
            print("\033[91m✗ Database connection failed!\033[0m")
            print(f"Error: {str(e)}")
            print(f"Connection string: postgresql+asyncpg://{_SETTINGS._DB_USERNAME}:***@{_SETTINGS._DB_HOST}:{_SETTINGS._DB_PORT}/{_SETTINGS._DB_NAME}")
            # Uncomment the next line if you want the application to exit on database connection failure
            # sys.exit(1)

    async def get_db(self):
        """
        Dependency for getting a database session.
        Will also test the connection on first use.
        """
        # Create a connection test event
        connection_tested = getattr(self, "_connection_tested", False)
        if not connection_tested:
            await self.test_connection()
            self._connection_tested = True
            
        async with self.SessionLocal() as session:
            yield session

    @asynccontextmanager
    async def get_db_session(self):
        """
        Get a database session as an async context manager.
        This method should be used with an async with statement.
        
        Yields:
            AsyncSession: A database session
        """
        db_gen = self.get_db()
        try:
            db = await anext(db_gen)
            yield db
        finally:
            try:
                await db_gen.aclose()
            except Exception:
                pass

db = Database()
get_db = db.get_db
engine = db.engine
Base = db.Base
