from fastapi import APIRouter
from app.interfaces.api.v2.routes import users

v2_router = APIRouter(
    tags=["v2"]
)

@v2_router.get("/")
async def init():
    return [
        {"name": "Esteban Leon Aguilar",
         "message": "V2 correcta"}
    ]


v2_router.include_router(users.router, prefix="/users")


