from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from app.domain.controls.user_control import UserControl

router = APIRouter()

@router.get("/")
async def init():
    return [
        {"name": "Esteban Leon Aguilar",
         "message": "Usuarios Correctamente V1"}
    ]


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_user(request: Request):
    # Extraemos los datos del request
    user_data = await request.json()
    user = UserControl()
    
    # Asignamos valores a los atributos del modelo
    user.model.username = user_data.get("username")
    user.model.email = user_data.get("email")
    user.model.hashed_password = user_data.get("password", "123456")  # Default password for testing
    await user.create_user(user_data=user.model.serialize)

    return JSONResponse(
        content={"message": "User created successfully"},
        status_code=status.HTTP_201_CREATED
    )
    
@router.get("/get/{username}", status_code=status.HTTP_200_OK)
async def get_user(username: str):
    user = UserControl()
    found = await user.get_user_by_username(username=username)
    print(f"User found: {user.model.serialize if found else 'Not found'}")
    if found:
        return JSONResponse(
            content=user.model.serialize,
            status_code=status.HTTP_200_OK
        )
    
    else:
        return JSONResponse(
            content={"error": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )