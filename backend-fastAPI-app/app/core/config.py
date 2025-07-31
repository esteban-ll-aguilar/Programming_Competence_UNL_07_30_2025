from pydantic import BaseModel
from functools import lru_cache
from typing import List, Optional, ClassVar
import os, json

class FastAPIConfig(BaseModel):
    APP_NAME: str = "Backend FastAPI From Competence"
    DESCRIPTION: str = "Desarrollo del backen para implementar en la solucion del problema planteado"

    __raw_tokens = os.getenv("VALID_TOKENS")
    if __raw_tokens is None:
        raise Exception("No hay tokens válidos para la API")

    _VALID_TOKENS = json.loads(__raw_tokens)

    

    # Database configuration
    _DB_USERNAME: str = os.getenv("DB_USERNAME", "postgres")
    _DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    _DB_HOST: str = os.getenv("DB_HOST", "localhost")
    
    # Convert DB_PORT to integer
    _DB_PORT: int = 5432  # Default port
    _port_str = os.getenv("DB_PORT")
    if _port_str:
        try:
            _DB_PORT = int(_port_str)
        except ValueError:
            print(f"Warning: Invalid DB_PORT value '{_port_str}', using default 5432")
    
    _DB_NAME: str = os.getenv("DB_NAME", "postgres")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings():
    return FastAPIConfig()


_SETTINGS = get_settings()

# Print configuration summary
print(f"Database Config: {_SETTINGS._DB_HOST}:{_SETTINGS._DB_PORT}/{_SETTINGS._DB_NAME}")
print(f"Valid Tokens: {len(_SETTINGS._VALID_TOKENS)} token(s) configured")