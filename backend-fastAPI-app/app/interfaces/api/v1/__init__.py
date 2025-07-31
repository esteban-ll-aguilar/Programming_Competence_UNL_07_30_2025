from fastapi import APIRouter
from app.interfaces.api.v1.routes import users

v1_router = APIRouter(
    tags=["v1"]
)

@v1_router.get("/")
async def init():
    return [
        {"name": "Esteban Leon Aguilar",
         "message": "V1 correcta"}
    ]


v1_router.include_router(users.router, prefix="/users")


