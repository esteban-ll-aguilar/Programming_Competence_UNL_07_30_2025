from fastapi import APIRouter
from app.interfaces.api.v1.routes import users, drawers, object_types, objects, action_history, ai_recommendations

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
v1_router.include_router(drawers.router, prefix="/drawers")
v1_router.include_router(object_types.router, prefix="/object-types")
v1_router.include_router(objects.router, prefix="/objects")
v1_router.include_router(action_history.router, prefix="/action-history")
v1_router.include_router(ai_recommendations.router, prefix="/ai")


