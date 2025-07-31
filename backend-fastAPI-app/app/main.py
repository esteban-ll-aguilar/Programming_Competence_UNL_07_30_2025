from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import _SETTINGS
from app.interfaces.api.v1 import v1_router
from app.interfaces.api.v2 import v2_router


def create_app() -> FastAPI:


    app = FastAPI(
        title = _SETTINGS.APP_NAME,
        description= _SETTINGS.DESCRIPTION,
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


