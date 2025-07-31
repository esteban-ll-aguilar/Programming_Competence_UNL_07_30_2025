from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import _SETTINGS
from app.lib.token_header import get_token_header
from app.interfaces.api.v1 import v1_router
from app.interfaces.api.v2 import v2_router
from app.core.database import db


def create_app() -> FastAPI:
    app = FastAPI(
        title = _SETTINGS.APP_NAME,
        description= _SETTINGS.DESCRIPTION,
        dependencies= [Depends(get_token_header)],
        openapi_tags=[
            {"name": "v1", "description": "API version 1"},
        ]
    )

    @app.get("/", tags=["Root"], status_code=200)
    async def root():
         return {"message": "Bienvenido a la API",
                 "routes" : {
                      "/redoc": "Documentacion",
                      "/docs": "Ver las rutas"
                 }}
    
    @app.on_event("startup")
    async def startup_db_client():
        """
        Test database connection on startup.
        This runs after the application is fully initialized with an event loop.
        """
        await db.test_connection()
        
        # Create tables if they don't exist
        async with db.engine.begin() as conn:
            # Import all models here to ensure they're registered with the metadata
            from app.domain.models.user import User
            # Create tables
            await conn.run_sync(db.Base.metadata.create_all)

    app.include_router(router=v1_router, prefix="/v1")
    app.include_router(router=v2_router, prefix="/v2")
    
    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


