from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def init():
    return [
        {"name": "Esteban Leon Aguilar",
         "message": "Usuarios Correctamente V1"}
    ]