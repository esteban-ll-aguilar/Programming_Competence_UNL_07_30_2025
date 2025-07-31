from fastapi import APIRouter, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any, List
from app.lib.token_header import get_current_user
from app.domain.controls.drawer_control import DrawerControl
from app.domain.controls.object_control import ObjectControl
from app.utils.openai import OpenAIClient
import json

router = APIRouter()

@router.get("/")
async def init():
    return [
        {"name": "AI Recommendations API",
         "message": "AI Recommendations API V1"}
    ]

@router.post("/drawer-recommendations", status_code=status.HTTP_200_OK)
async def get_drawer_recommendations(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get AI-powered recommendations for organizing a drawer.
    
    This endpoint analyzes a drawer's contents and provides recommendations 
    for better organization using OpenAI.
    """
    try:
        # Extract request data
        data = await request.json()
        drawer_id = data.get("drawer_id")
        
        if not drawer_id:
            return JSONResponse(
                content={"error": "Drawer ID is required"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Get drawer data
        drawer_control = DrawerControl()
        drawer = await drawer_control.get_drawer(drawer_id)
        
        if not drawer:
            return JSONResponse(
                content={"error": "Drawer not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
            
        # Check if user owns this drawer
        if drawer.user_id != current_user["dni"]:
            return JSONResponse(
                content={"error": "You don't have permission to access this drawer"},
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        # Get all objects in the drawer
        object_control = ObjectControl()
        objects = await object_control.get_objects_by_drawer(drawer_id)
        
        # Format the data for OpenAI
        drawer_data = {
            "drawer": {
                "id": drawer.id,
                "name": drawer.name,
                "description": drawer.description,
                "size": drawer.size
            },
            "objects": [
                {
                    "id": obj.id,
                    "name": obj.name,
                    "type": obj.type_id,
                    "size": obj.size,
                    "description": obj.description
                } for obj in objects
            ]
        }
        
        # Call OpenAI for recommendations
        openai_client = OpenAIClient()
        response = await openai_client.generate_recomendations(
            message=f"Analiza los siguientes objetos en el cajón y proporciona recomendaciones para organizarlos mejor: {json.dumps(drawer_data)}"
        )
        
        # Process the response
        recommendations = json.loads(response.choices[0].message.content)
        
        # Register the AI recommendation action
        await drawer_control.register_action(
            drawer_id, 
            current_user["dni"], 
            "AI_RECOMMENDATION", 
            f"Generated AI recommendations for drawer: {drawer.name}"
        )
        
        return JSONResponse(
            content=recommendations,
            status_code=status.HTTP_200_OK
        )
        
    except json.JSONDecodeError:
        return JSONResponse(
            content={"error": "Error parsing OpenAI response"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return JSONResponse(
            content={"error": f"Error generating recommendations: {str(e)}"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@router.post("/apply-recommendations", status_code=status.HTTP_200_OK)
async def apply_recommendations(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Apply the AI-recommended actions to a drawer.
    
    This endpoint applies the recommended actions like removing duplicates
    or reorganizing objects based on previous AI recommendations.
    """
    try:
        # Extract request data
        data = await request.json()
        drawer_id = data.get("drawer_id")
        actions = data.get("actions", {})
        
        if not drawer_id:
            return JSONResponse(
                content={"error": "Drawer ID is required"},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Get drawer data
        drawer_control = DrawerControl()
        drawer = await drawer_control.get_drawer(drawer_id)
        
        if not drawer:
            return JSONResponse(
                content={"error": "Drawer not found"},
                status_code=status.HTTP_404_NOT_FOUND
            )
            
        # Check if user owns this drawer
        if drawer.user_id != current_user["dni"]:
            return JSONResponse(
                content={"error": "You don't have permission to access this drawer"},
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        # Get all objects in the drawer
        object_control = ObjectControl()
        
        # Apply actions
        results = {}
        
        # Remove duplicates if requested
        if actions.get("eliminar_duplicados"):
            duplicates = await object_control.find_duplicate_objects(drawer_id)
            for dup in duplicates:
                # Keep the first item and remove others
                to_remove = dup[1:]
                for obj_id in to_remove:
                    await object_control.delete_object(obj_id)
            
            results["duplicates_removed"] = len(duplicates)
            
        # Order by type if requested
        if actions.get("ordenar_por_tipo"):
            await object_control.sort_objects_by_type(drawer_id)
            results["sorted_by_type"] = True
            
        # Order by size if requested
        if actions.get("ordenar_por_tamanio"):
            await object_control.sort_objects_by_size(drawer_id)
            results["sorted_by_size"] = True
        
        # Register the action
        await drawer_control.register_action(
            drawer_id, 
            current_user["dni"], 
            "APPLY_AI_RECOMMENDATION", 
            f"Applied AI recommendations to drawer: {drawer.name}"
        )
        
        return JSONResponse(
            content={
                "message": "Recommendations applied successfully",
                "results": results
            },
            status_code=status.HTTP_200_OK
        )
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Error applying recommendations: {str(e)}"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
