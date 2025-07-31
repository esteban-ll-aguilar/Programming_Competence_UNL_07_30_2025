from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.domain.controls.user_control import UserControl
from typing import Dict, Any
from app.lib.token_header import get_current_user, create_access_token
from datetime import timedelta

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
    user_control = UserControl()
    
    # Validamos datos mínimos
    if not user_data.get("username"):
        return JSONResponse(
            content={"error": "Username is required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
        
    if not user_data.get("email"):
        return JSONResponse(
            content={"error": "Email is required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
        
    if not user_data.get("dni"):
        return JSONResponse(
            content={"error": "DNI is required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Prepare user data
    password = user_data.get("password", "123456")  # Default password for testing
    user_control.model.dni = user_data.get("dni")
    user_control.model.username = user_data.get("username")
    user_control.model.email = user_data.get("email")
    user_control.model.password = password  # This will hash the password
    
    try:
        # Create the user
        created_user = await user_control.create_user(user_control.model.serialize)
        
        # Generate JWT token for the new user
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user_data.get("dni")},
            expires_delta=access_token_expires
        )
        
        # Store the token in the user record
        await user_control.update_user_token(user_data.get("dni"), access_token)
        
        return JSONResponse(
            content={
                "message": "User created successfully", 
                "dni": user_data.get("dni"),
                "access_token": access_token,
                "token_type": "bearer"
            },
            status_code=status.HTTP_201_CREATED
        )
    except ValueError as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return JSONResponse(
            content={"error": f"Error creating user: {str(e)}"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@router.get("/get/{username}", status_code=status.HTTP_200_OK)
async def get_user(username: str):
    user_control = UserControl()
    found = await user_control.get_user_by_username(username=username)
    
    if found:
        return JSONResponse(
            content=user_control.model.serialize,
            status_code=status.HTTP_200_OK
        )
    else:
        return JSONResponse(
            content={"error": "User not found"},
            status_code=status.HTTP_404_NOT_FOUND
        )

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(request: Request):
    # Extract login data from request
    login_data = await request.json()
    username = login_data.get("username")
    password = login_data.get("password")
    
    if not username or not password:
        return JSONResponse(
            content={"error": "Username and password are required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user
    user_control = UserControl()
    user = await user_control.authenticate_user(username, password)
    
    if not user:
        return JSONResponse(
            content={"error": "Invalid username or password"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["dni"]},
        expires_delta=access_token_expires
    )
    
    # Store the token in the user record
    await user_control.update_user_token(user["dni"], access_token)
    
    return JSONResponse(
        content={"access_token": access_token, "token_type": "bearer"},
        status_code=status.HTTP_200_OK
    )

@router.get("/me", status_code=status.HTTP_200_OK)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get information about the current authenticated user"""
    return JSONResponse(
        content={
            "dni": current_user["dni"],
            "username": current_user["username"],
            "email": current_user["email"]
        },
        status_code=status.HTTP_200_OK
    )