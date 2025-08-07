"""
Módulo de esquemas para validación de datos en la API.
"""

# User schemas
from .user import (
    UserBase,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    UserCreateResponse,
)

# Drawer schemas
from .drawer import (
    SizeEnum,
    DrawerBase,
    DrawerCreate,
    DrawerUpdate,
    DrawerResponse,
    DrawerActionResponse,
)

# Object Type schemas
from .object_type import (
    ObjectTypeBase,
    ObjectTypeCreate,
    ObjectTypeUpdate,
    ObjectTypeResponse,
    ObjectTypeActionResponse,
)

# Object schemas
from .object import (
    SizeConceptEnum,
    ObjectBase,
    ObjectCreate,
    ObjectUpdate,
    ObjectResponse,
    ObjectActionResponse,
)

# Action History schemas
from .action_history import (
    ActionTypeEnum,
    ActionHistoryBase,
    ActionHistoryCreate,
    ActionHistoryResponse,
    ActionHistoryActionResponse,
)

# AI Recommendation schemas
from .ai_recommendation import (
    DrawerRecommendationRequest,
    DrawerRecommendationResponse,
    ApplyRecommendationRequest,
    ApplyRecommendationResponse,
)
